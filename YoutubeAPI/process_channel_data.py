# -*- coding: utf-8 -*-

#!/usr/bin/env/python3

import json
import sys
import os

CHANNEL_FOLDER = "channels/"

def save_json(DICT, FILENAME = "no_filename.json"):
    with open(FILENAME, 'w') as fp:
        json.dump(DICT, fp)

def load_json(FILENAME):
    if FILENAME == None: #guard, or rather use try-catch?
        return None

    with open(FILENAME) as data_file:    
        return json.load(data_file)

def main():
    print("Starting...")

    for filename in os.listdir(CHANNEL_FOLDER):
        if filename.endswith(".json"):
            print("Loading file", filename)
            j = load_json(CHANNEL_FOLDER+filename)
            channel_id = j["channel_id"]
            title = j["title"]
            new_filename = CHANNEL_FOLDER + filename.replace(title, channel_id)
            save_json(j, new_filename)
            print("Saved file", new_filename)

    print("Done!")


if __name__ == '__main__':
    main()