from google.cloud import vision
from PIL import Image, ImageDraw
import os

import categorize

def draw_boxes(image_path, objects):
    """
    Draws bounding boxes with labels on the image.
    
    Args:
        image_path: The path to the original image file.
        objects: The localized object annotations from the Google Vision API.
    """
    # Open the image
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)

    for obj in objects:
        # Extract bounding box vertices
        vertices = obj.bounding_poly.normalized_vertices
        if len(vertices) < 4:
            continue
        
        # Get image dimensions to scale normalized coordinates
        width, height = image.size
        box = [(v.x * width, v.y * height) for v in vertices]

        # Draw the bounding box
        draw.polygon(box, outline="red", width=2)

        # Draw the label
        label = obj.name
        x, y = box[0]
        draw.text((x, y - 10), label, fill="red")

    # Save or show the image
    labeled_image_path = os.path.splitext(image_path)[0] + "_labeled.png"
    image.save(labeled_image_path)
    print(f"Labeled image saved as {labeled_image_path}")

def run_quickstart():
    client = vision.ImageAnnotatorClient()

    # Get the image file path
    file_path = os.path.abspath(input("Enter filename:\n"))

    # Read the image content
    with open(file_path, "rb") as imageFile:
        contents = imageFile.read()

    image = vision.Image(content=contents)

    # Get localized object annotations
    response = client.object_localization(image=image)
    objects = response.localized_object_annotations

    filtered_objects = []

    print("Objects detected:")
    for obj in objects:
        print(f"{obj.name} - Confidence: {obj.score:.2f}")
        if categorize.is_food_item(obj.name):
            filtered_objects.append(obj)


    # Draw boxes and labels on the image
    draw_boxes(file_path, filtered_objects)

if __name__ == "__main__":
    run_quickstart()
