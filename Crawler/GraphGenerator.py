# -*- coding: utf-8 -*-

#!/usr/bin/env/python3

from FileManagement import load_json, get_channel, save_json
import sys
import os

CHANNEL_FOLDER = "channels/"

def crawl_policy(SEED, DEPTH):
    global CHANNEL_FOLDER

    graph = dict()
    graph["vertices"] = []
    graph["edges"] = []
    graph["depth"] = DEPTH
    graph["vertex_count_at_depth"] = []

    current_urls = []
    current_urls.extend(SEED)
    next_urls = []
    traversed_urls = []

    current_depth = 0
    while current_depth <= DEPTH:
        y_count = 0

        for url in current_urls:
            if url not in traversed_urls:

                filename = CHANNEL_FOLDER + url + ".json"
                
                channel_data = None

                if url +".json" in os.listdir(CHANNEL_FOLDER):
                    channel_data = load_json(filename)

                if channel_data != None:
                    vertex = dict()
                    vertex["id"] = url
                    vertex["coords"] = dict()
                    vertex["coords"]["x"] = current_depth
                    vertex["coords"]["y"] = y_count
                    vertex["channel_data"] = channel_data
                    vertex["color"] = "white"

                    graph["vertices"].append(vertex)
                    if current_depth != DEPTH:

                        featuredChannelsUrls = channel_data["featuredChannelsUrls"]

                        for featured_url in featuredChannelsUrls:
                            if featured_url + ".json" in os.listdir(CHANNEL_FOLDER):
                                if featured_url not in traversed_urls:
                                    next_urls.append(featured_url)

                                    edge = dict()
                                    edge["id"] = len(graph["edges"]) + 1
                                    edge["source_vertex_id"] = url
                                    edge["dest_vertex_id"] = featured_url
                                    edge["color"] = "white"

                                    graph["edges"].append(edge)
                else:
                    print("Error while loading file " +  str(filename))

                traversed_urls.append(url)
                y_count += 1


        graph["vertex_count_at_depth"].append(y_count)


        current_urls = next_urls
        next_urls = []
        current_depth += 1

    return graph

def cluster_policy(SEED, DEPTH):
    #[get_channel(id) for id in data[current_id]]

    graph = dict()
    graph["vertices"] = []
    graph["edges"] = []
    graph["depth"] = DEPTH
    graph["vertex_count_at_depth"] = []

    seed = SEED[0]
    linked_channels = load_json("analytics/double_linked_channels.json")

    traversed_channels_ids = []
    current_channel_ids = []
    current_channel_ids.append(seed)

    current_depth = 0

    while current_depth <= DEPTH:
        print("current_depth " + str(current_depth))
        next_ids = []
        current_edges = []
        current_vertices = []

        y_count = 0
        for current_id in current_channel_ids:

            if current_id in linked_channels.keys():

                #create vertex

                vertex = dict()
                vertex["id"] = current_id
                vertex["coords"] = dict()
                vertex["coords"]["x"] = current_depth
                vertex["coords"]["y"] = y_count
                vertex["channel_data"] = get_channel(current_id)
                vertex["color"] = "white"
                current_vertices.append(vertex)

                print("Created vertex for channel " + vertex["channel_data"]["title"])

                if current_depth != DEPTH:
                    for link_id in linked_channels[current_id]:
                        if link_id not in traversed_channels_ids:

                            if get_channel(link_id) != None:

                                if link_id not in next_ids and link_id not in current_channel_ids:
                                    next_ids.append(link_id)


                                #this could be enhanced by only searching
                                #in the current column edges
                                redundant_edge = False
                                for edge in current_edges:
                                    source_id = edge["source_vertex_id"]
                                    dest_id = edge["dest_vertex_id"]

                                    if source_id == current_id and dest_id == link_id:
                                        redundant_edge = True
                                    elif source_id == link_id and dest_id == current_id:
                                        redundant_edge = True

                                if not redundant_edge:
                                    edge = dict()
                                    edge["id"] = len(graph["edges"]) + 1
                                    edge["source_vertex_id"] = current_id
                                    edge["dest_vertex_id"] = link_id
                                    edge["color"] = "white"
                                    current_edges.append(edge)

                                    print("Created edge: " + vertex["channel_data"]["title"] + " -> " + get_channel(link_id)["title"])
                            else:
                                print("No data for id " + link_id)

            y_count += 1

        graph["vertex_count_at_depth"].append(y_count)
        graph["edges"].extend(current_edges)
        graph["vertices"].extend(current_vertices)
        traversed_channels_ids.extend(current_channel_ids)

        current_channel_ids = next_ids
        current_depth += 1

    return graph

def cluster_policyOLD(SEED, DEPTH):
    global CHANNEL_FOLDER

    graph = dict()
    graph["vertices"] = []
    graph["edges"] = []
    graph["depth"] = DEPTH
    graph["vertex_count_at_depth"] = []

    double_linked = dict()
    single_linked = dict()

    current_depth = 0
    current_ids = []
    current_ids.extend(SEED)
    checked_ids = []
    next_ids = []

    while current_depth <= DEPTH:
        print("current_depth = " + str(current_depth))
        y_count = 0

        for current_id in current_ids:
            if current_id not in checked_ids:
                current_channel_data = get_channel(current_id)

                if current_channel_data != None:
             

                    if current_depth != DEPTH:

                        for featured_id in current_channel_data["featuredChannelsUrls"]:

                            featured_channel_data = get_channel(featured_id)

                            if featured_channel_data != None:
                                linked_channels_ids = featured_channel_data["featuredChannelsUrls"]

                                for channel_id in linked_channels_ids:
                                    if channel_id == current_id:
                                        in_cluster = False

                                        if channel_id in double_linked.keys():
                                            if current_id in double_linked[channel_id]:
                                                in_cluster = True

                                        if not in_cluster:
                                            print(current_channel_data["title"] + " <-> " + featured_channel_data["title"])
                                            next_ids.append(featured_id)

                                            y_count += 1 #or len(next_ids) + 1
                                            if current_id not in double_linked.keys():
                                                double_linked[current_id] = []

                                            double_linked[current_id].append(featured_id)

                                           

                                            checked_ids.extend(current_id)

                                    else:
                                        if current_id not in single_linked.keys():
                                            single_linked[current_id] = []

                                        single_linked[current_id].append(featured_id)

                            else: # end of featured_channel_data != None
                                print("Error while loading file " +  str(featured_id))

                else: # end of current_channel_data != None:
                    print("Error while loading file " +  str(current_id))

        graph["vertex_count_at_depth"].append(y_count)

        current_ids = next_ids
        next_ids = []

        current_depth += 1

    return graph


def generate_graph(POLICY, SEED, DEPTH):

    policies = dict()
    policies["crawl_policy"] = crawl_policy
    policies["cluster_policy"] = cluster_policy

    data = None
    if POLICY in policies.keys():
        data = policies[POLICY](SEED, DEPTH)

    return data

def main():
    print("Starting")

    #read in request
    request = load_json("../request.json")
    request_id = str(request["request_id"])
    depth = int(request["depth"])
    seed = []
    seed.append(str(request["seed"]))

    print("Generating response")
    graph = generate_graph(POLICY = "cluster_policy", SEED = seed, DEPTH = depth)

    file = dict()
    #file["request"] = request
    file["graph"] = graph

    save_json(file, "response_" + request_id + ".json")

    print("Statistics")
    print("vertices", len(graph["vertices"]))
    print("edges", len(graph["edges"]))

if __name__ == '__main__':
    main()