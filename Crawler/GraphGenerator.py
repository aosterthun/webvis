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

C_P_INFO = True
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

        y_count = 0
        for current_id in current_channel_ids:
            if current_id in linked_channels.keys():

                vertex = dict()
                vertex["id"] = current_id
                vertex["coords"] = dict()
                vertex["coords"]["x"] = current_depth
                vertex["coords"]["y"] = y_count
                vertex["channel_data"] = get_channel(current_id)
                vertex["color"] = "white"
                graph["vertices"].append(vertex)

                if C_P_INFO: print("Created vertex for channel " + vertex["channel_data"]["title"])

                for linked_id in linked_channels[current_id]:
                    if linked_id not in traversed_channels_ids:

                        if get_channel(linked_id) != None:

                            edge_out_of_max_depth = False
                            if current_depth != DEPTH:
                                if linked_id not in next_ids and linked_id not in current_channel_ids:
                                    next_ids.append(linked_id)
                            else:
                                if linked_id not in current_channel_ids:
                                    edge_out_of_max_depth = True

                            if not edge_out_of_max_depth:
                                #this could be enhanced by only searching
                                #in the current column edges
                                redundant_edge = False
                                for edge in graph["edges"]:
                                    source_id = edge["source_vertex_id"]
                                    dest_id = edge["dest_vertex_id"]

                                    if source_id == current_id and dest_id == linked_id:
                                        redundant_edge = True
                                    elif source_id == linked_id and dest_id == current_id:
                                        redundant_edge = True

                                if not redundant_edge:
                                    edge = dict()
                                    edge["id"] = len(graph["edges"]) + 1
                                    edge["source_vertex_id"] = current_id
                                    edge["dest_vertex_id"] = linked_id
                                    edge["color"] = "white"
                                    graph["edges"].append(edge)
                                else:
                                    pass
                                    #print("Redundant edge")
                                    #print(current_id)
                                    #print(linked_id)
                                    
                                    if C_P_INFO: print("Created edge: " + vertex["channel_data"]["title"] + " -> " + get_channel(linked_id)["title"])
                        else:
                            print("No data for id " + linked_id)
                    #end of linked_id loop

            y_count += 1
            #end of current_id loop

        graph["vertex_count_at_depth"].append(y_count)
        traversed_channels_ids.extend(current_channel_ids)

        current_channel_ids = next_ids
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

def analyze_graph(GRAPH):

    edges = GRAPH["edges"]
    depth = GRAPH["depth"]

    analytics = dict()
    analytics["vertex_count_at_depth"] = []
    analytics["vertex_analytics"] = []

    vertices_in_depth = []
    for current_depth in range(0,depth + 1):

        vertices_ids = [v["id"] for v in GRAPH["vertices"] if v["coords"]["x"] == current_depth]

        analytics["vertex_count_at_depth"].append(len(vertices_ids))

        vertices_in_depth.append(vertices_ids)

    for vertices in vertices_in_depth:
        print("new depth")
        for id1 in vertices:
            data = dict()
            data["id"] = id1
            data["edges_in_same_depth"] = 0
            
            for id2 in vertices:
                for edge in edges:
                    flag = False
                    if id1 == edge["source_vertex_id"] and id2 == edge["dest_vertex_id"]:
                        flag = True
                    if id2 == edge["source_vertex_id"] and id1 == edge["dest_vertex_id"]:
                        flag = True

                    if flag:
                        data["edges_in_same_depth"] += 1
            print(id1 + " has " + str(data["edges_in_same_depth"]) + " edges in the same depth")
            analytics["vertex_analytics"].append(data)
    
    return analytics

def main():
    print("Starting")


    if len(sys.argv) != 2:
        print("Usage: " + sys.argv[0] + " request_path.json")
        exit()

    filepath = str(sys.argv[1])

    request = load_json(filepath)
    request_id = str(request["request_id"])
    depth = int(request["depth"])
    seed = []
    seed.append(str(request["seed"]))

    print("Generating graph")
    graph = generate_graph(POLICY = "cluster_policy", SEED = seed, DEPTH = depth)

    print("Analyzing graph")
    analytics = analyze_graph(graph)

    file = dict()
    file["request"] = request
    file["graph"] = graph
    file["analytics"] = analytics

    print("Saving graph")
    save_json(file, "response_" + request_id + ".json")

    print("Statistics")
    print("vertices", len(graph["vertices"]))
    print("edges", len(graph["edges"]))

if __name__ == '__main__':
    main()