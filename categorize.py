from nltk.corpus import wordnet 

def is_food_item(word):
    # Get all synsets of the word
    synsets = wordnet.synsets(word)
    for synset in synsets:
        # Check if 'food', 'edible', or similar terms appear in the definition or lemma names
        if 'food' in synset.lexname() or 'food' in synset.definition() or 'edible' in synset.definition():
            return True
    return False
