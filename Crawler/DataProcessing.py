# -*- coding: utf-8 -*-

#!/usr/bin/env/python3

from FileManagement import load_json, save_json, CHANNEL_FOLDER
import sys
import os

def gather_keywords():
    keywords = dict()

    for filename in os.listdir(CHANNEL_FOLDER):
        if filename.endswith(".json"):
            #print("Loading file " +  filename)
            j = load_json(CHANNEL_FOLDER+filename)

            keywords[j["channel_id"]] = j["keywords"]
    return keywords

def double_linked_channels():

    file = dict()

    for filename in os.listdir(CHANNEL_FOLDER):
        if filename.endswith(".json"):
            data = load_json(CHANNEL_FOLDER+filename)
            channel_id = data["channel_id"]
            file[channel_id] = []
            featured_channels_ids = None
            if "featuredChannelsUrls" in data.keys():
                featured_channels_ids = data["featuredChannelsUrls"]

                for id in featured_channels_ids:

                    filepath = CHANNEL_FOLDER + id + ".json"

                    data2 = load_json(filepath) #!!! get_channel(id)

                    if data2 != None:
                        featured_channels_ids2 = None
                        if "featuredChannelsUrls" in data2.keys():
                            featured_channels_ids2 = data2["featuredChannelsUrls"]

                            if channel_id in featured_channels_ids2:
                                file[channel_id].append(data2["channel_id"])
                    else:
                        file[channel_id].append(id)
    return file
    save_json(file, "/analytics/double_linked_channels.json")

def main():
    print("Starting...")

    if False:
        file = gather_keywords()
        save_json(file, "analytics/keywords.json")
    else:
        file = double_linked_channels()
        save_json(file, "analytics/double_linked_channels.json")

    print("Done!")


if __name__ == '__main__':
    main()