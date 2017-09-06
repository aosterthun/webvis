# -*- coding: utf-8 -*-

#!/usr/bin/env/python3

import json
import os

CHANNEL_FOLDER = "channels/"

def save_json(DICT, FILENAME = "no_filename.json"):
    with open(FILENAME, 'w') as fp:
        json.dump(DICT, fp)

def load_json(FILENAME):
    if FILENAME == None: #guard, or rather use try-catch?
        return None
    try:
        with open(FILENAME) as data_file:    
            return json.load(data_file)
    except Exception as e:
        print("Exception")
        print(str(e))
        return None

def get_channel(CHANNEL_ID):
    filename = CHANNEL_ID + ".json"
    filenpath = CHANNEL_FOLDER + filename

    channel_data = None

    if filename in os.listdir(CHANNEL_FOLDER):
        channel_data = load_json(filenpath)

    if channel_data == None:
        return None
    else:
        return channel_data