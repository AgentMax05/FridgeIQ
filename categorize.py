from nltk.corpus import wordnet 

def is_food_item(word):
    for sub_word in word.split(" "):
        synsets = wordnet.synsets(sub_word)
        for synset in synsets:
            for word in ["food", "edible", "grocery"]:
                if word in synset.definition() or word in synset.lexname():
                    return True
    return False

# test if running as main
if __name__ == "__main__":
    while True:
        print(is_food_item(input("Test Prompt: ")))
    