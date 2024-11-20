from google.cloud import vision

import categorize
import os
import pathlib

def run_quickstart():
    client = vision.ImageAnnotatorClient()

    file_path = os.path.abspath(input("Enter filename:\n"))

    with open (file_path, "rb") as imageFile:
        contents = imageFile.read()

    image = vision.Image(content=contents)

    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    print("Objects")
    for obj in objects:
        # if categorize.is_food_item(obj.name):
        print(obj.name)

run_quickstart()