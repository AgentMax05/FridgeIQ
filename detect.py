from google.cloud import vision

import categorize
import os
import pathlib

client = vision.ImageAnnotatorClient()

def detect_foods(filename):
    file_path = os.path.abspath(filename)

    with open (file_path, "rb") as imageFile:
        contents = imageFile.read()

    image = vision.Image(content=contents)

    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    food_objects = {}

    for obj in objects:
        if categorize.is_food_item(obj.name):
            if obj.name in food_objects.keys():
                food_objects[obj.name] += 1
            else:
                food_objects[obj.name] = 1
    
    return food_objects
