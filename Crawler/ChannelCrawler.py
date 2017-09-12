# -*- coding: utf-8 -*-

#!/usr/bin/env/python3

from FileManagement import load_json, get_channel, save_json, CHANNEL_FOLDER
import sys
import os
from apiclient.discovery import build


#list of channels subscripted by the user
#note: id and url refer to the same dataset returned by:
#response = SERVICE.channels().list(id=CHANNEL_ID, part = "brandingSettings").execute()
SUB_ID = dict()
SUB_ID["Wintergatan"] = "UCcXhhVwCT6_WqjkEniejRJQ"
SUB_ID["Vsauce"] = "UC6nSFpj9HTCZ5t-N3Rm3-HA"
SUB_ID["Tomzalat"] = "UCSTSJT-X8obSxoJ7ySioGXQ" # youtube.com/user/Tomzalat == Lets Game Dev
SUB_ID["ApplewarPictures"] = "UCaaI3IzmeL3cl1OSZe9E1sA"
SUB_ID["Mathologer"] = "UC1_uAIS3r8Vu6JjXWvastJg"
SUB_ID["OpenMind3000"] = "UCEtYtMoD26j2BJBJ4w_hM6w"
SUB_ID["EEVBlog"] = "UC2DjFE7Xf11URZqWBigcVOQ"
SUB_ID["HandOfBlood"] = "UC9YTp5M6yYgSd6t0SeL2GQw"

#Mapping of URL -> Title
# URL == ChannelID  (Identifier in YoutubeAPI)
# Title             (Name of channel)
SAVED_CHANNELS = dict()     #channels that have been crawled before and are known to the system
CRAWLED_CHANNELS = dict()   #channels that were crawled in this session

#STATISTICS
NEW_CHANNELS = 0

#youtube dependent stuff
DEVELOPER_KEY = load_json("key.json")["key"]
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
YOUTUBE = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)

def get_channel_id(USERNAME):
    response = YOUTUBE.channels().list(forUsername=USERNAME, part = "id").execute()
    return response["items"][0]['id']

def get_featured_channels(CHANNEL_ID):
    response = YOUTUBE.channels().list(id=CHANNEL_ID, part = "brandingSettings").execute()

    if "featuredChannelsUrls" in response["items"][0]['brandingSettings']["channel"].keys():
        return response["items"][0]['brandingSettings']['channel']['featuredChannelsUrls']
    else:
        return None

def get_channel_data(CHANNEL_ID):
    response = YOUTUBE.channels().list(id = CHANNEL_ID, part = "id,snippet,statistics,brandingSettings").execute()

    if len(response["items"]) > 0:
        try:
            channel_id = response["items"][0]["id"]
            snippet = response["items"][0]["snippet"]
            statistics = response["items"][0]["statistics"]
            brandingSettings = response["items"][0]["brandingSettings"]
            featuredChannelsUrls = []
            if "featuredChannelsUrls" in brandingSettings["channel"].keys():
                featuredChannelsUrls = brandingSettings["channel"]["featuredChannelsUrls"]
            title = brandingSettings["channel"]["title"]
            keywords = ""
            if "keywords" in brandingSettings["channel"].keys():
                keywords = brandingSettings["channel"]["keywords"]

            data = dict()
            data["title"] = title
            data["channel_id"] = channel_id #channel_id == CHANNEL_ID
            data["featuredChannelsUrls"] = featuredChannelsUrls
            data["keywords"] = keywords

            return data
        except Exception as e:
            print("Exception::get_channel_data(",CHANNEL_ID,")")
            print(str(e))
    else:
        return None


def crawl(SEED = None, DEPTH = 1):
    global NEW_CHANNELS

    if SEED == None: #guard
        return False

    current_depth = 0
    depth = DEPTH

    current_urls = SEED #urls to crawl in this iteration

    next_urls = []
    while(current_depth <= depth):
        print("----------------------------")
        print("Current depth: " + str(depth))
        print("----------------------------")

        for url in current_urls:
            print("Crawling for url " + str(url))
            #!!!check for loops c1 -> c2 -> c1. There is no need to crawl c1 again
            if url in CRAWLED_CHANNELS.keys(): 
                print("     Channel already crawled "+ str(CRAWLED_CHANNELS[url].encode("ascii", "ignore")))
            else:
                #relevant data fetched from channel
                data = None

                #filename the channel is saved to
                filename = CHANNEL_FOLDER + url + ".json" 

                if url in SAVED_CHANNELS.keys():
                    # case 1: channel has been crawled before

                    data = get_channel(url)

                    CRAWLED_CHANNELS[url] = data["title"]

                    print("     Channel known " + str(data["title"].encode("ascii", "ignore")))
                else: 
                    # case 2: channel is unknown to the system

                    data = get_channel_data(CHANNEL_ID = url)

                    if data != None:
                        save_json(data, filename)
                        SAVED_CHANNELS[url] = data["title"]
                        NEW_CHANNELS += 1
                        print("     Channel unknown " + str(data["title"].encode("ascii", "ignore")))
                    else:
                        print("     Channel is None")

                if data != None:
                    next_urls.extend(data["featuredChannelsUrls"])
                    CRAWLED_CHANNELS[url] = data["title"]


        current_depth += 1

        current_urls = next_urls
        next_urls = []

def main():
    print("Starting...")

    if len(sys.argv) != 2:
        print("Usage: " + sys.argv[0] + " request_path.json")
        exit()

    filepath = str(sys.argv[1])


    if True: #maybe you want to update everything
        for filename in os.listdir(CHANNEL_FOLDER):
            if filename.endswith(".json"):
                j = load_json(CHANNEL_FOLDER+filename)
                channel_id = j["channel_id"]
                channel_name = filename.replace(".json", "")
                SAVED_CHANNELS[channel_id] = channel_name


        print("Loaded " + str(len(SAVED_CHANNELS.keys())) + " saved channels")
        #for url in SAVED_CHANNELS:
        #    print(SAVED_CHANNELS[url], "->", url)


    #read in request
    request = load_json(filepath)
    request_id = str(request["request_id"])
    depth = int(request["depth"])
    seed = []
    seed.append(str(request["seed"]))

    print("Processing request", request_id)

    print("Starting crawl with seed", seed, " and depth", depth)
    crawl(SEED = seed, DEPTH = depth)

    print("Crawled", len(CRAWLED_CHANNELS.keys()), "with", NEW_CHANNELS,"new channels!")
    for url in CRAWLED_CHANNELS:
        print(str(CRAWLED_CHANNELS[url].encode("ascii", "ignore")) + " -> " + url)

    print("Done!")

if __name__ == '__main__':
    main()