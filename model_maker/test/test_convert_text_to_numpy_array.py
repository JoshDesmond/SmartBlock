import unittest

from convert_text_to_numpy_array import TextToNumpyConverter


class TestTextToNumpyConverter(unittest.TestCase):
    def setUp(self):
        self.converter = TextToNumpyConverter()

    def test_get_vector_of_word(self):
        self.assertTrue(self.converter.get_vector_of_word("factory") is not None)

        # Test that the word is a vector with at least ten numbers between -1 and 1
        word_vector = self.converter.get_vector_of_word("hello")
        first_component = word_vector[0]
        second_component = word_vector[9]
        self.assertTrue(first_component < 1.0)
        self.assertTrue(first_component > -1.0)
        self.assertTrue(second_component < 1.0)
        self.assertTrue(second_component > -1.0)


if __name__ == '__main__':
    unittest.main()
