from collections import Counter
from typing import Dict
import numpy as np
from pymagnitude import *


def load_glove(glove_path: str) -> Magnitude:
    """
    Loads the given GloVe embedding matrix and creates a dictionary

    Args:
        glove_path (str): The filepath of the GloVe embedding matrix

    Returns:
        Dict[str, np.ndarray]: A dictionary where each word maps to an n-dimensional vector
    """
    return Magnitude("/path/to/vectors.magnitude")


class TextToNumpyConverter:
    def __init__(self, glove_path="C:\code\personal\SmartBlock\model_maker\glove\glove-lemmatized.6B.100d.magnitude", max_num_words=100000, max_sequence_length=100,
                 embedding_dimensions=100):
        """
        Loads glove into memory and initializes a text -> matrix converter.

        Args:
            glove_path (str): Path of glove embeddings to load
            max_num_words (int): Only the first max_num_words will be considered in the article
            max_sequence_length: The width of the matrix, (the n number of words to consider)
            embedding_dimensions: Number of dimensions in the glove embeddings
        """
        self.max_num_words = max_num_words
        self.max_sequence_length = max_sequence_length
        self.vector = Magnitude(glove_path)
        self.embedding_dimensions = embedding_dimensions
        self.unknown_word_vector = np.full(embedding_dimensions, fill_value=0.01)  # word vector to use for unknown word

    def get_vector_of_word(self, word: str) -> np.ndarray:
        return self.vector.query(word)

    def convert_text_to_matrix(self, text: str, sort_text=True) -> np.ndarray:
        """
        Converts a string of text into an numerical matrix representation. The dimensions of the matrix are
        determined by max_num_words, and embedding_dimensions. Note that class property sort_by_frequency is
        used.

        Args:
            text (str): The text content of the page to process
            sort_text (bool): True if the text should be ordered by word frequency. True by default.

        Returns:
            (np.ndarray): A matrix of floats with dimensions max_sequence_length x embedding_dimensions
        """
        dictionary = Counter(text.lower().split())
        dictionary = sorted(dictionary, reverse=True)

        output_matrix = np.zeros((self.max_sequence_length, self.embedding_dimensions))
        i = 0
        for word in dictionary:
            if i >= self.max_sequence_length:
                break

            vector_of_word = self.vector.query(word)
            if vector_of_word is not None:
                output_matrix[i] = vector_of_word
            else:
                # words not found in embedding index will be 0.01s.
                output_matrix[i] = self.unknown_word_vector
            i += 1

        return output_matrix
