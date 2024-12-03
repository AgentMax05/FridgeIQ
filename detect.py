from google.cloud import vision

import categorize
import os
import pathlib

client = vision.ImageAnnotatorClient()

def detect_foods(frame):
    # file_path = os.path.abspath(filename)

    # with open (file_path, "rb") as imageFile:
    #     contents = imageFile.read()

    image = vision.Image(content=frame)

    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    food_objects = {}

    print("Objects:")

    for obj in objects:
        print(obj.name)
        if categorize.is_food_item(obj.name):
            if obj.name in food_objects.keys():
                food_objects[obj.name] += 1
            else:
                food_objects[obj.name] = 1

    print()

    return food_objects
