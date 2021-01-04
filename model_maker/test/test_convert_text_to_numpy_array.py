import unittest

from convert_text_to_numpy_array import TextToNumpyConverter


class TestStringMethods(unittest.TestCase):
    def setUp(self):
        self.converter = TextToNumpyConverter()

    def test_get_vector_of_word(self):
        # TODO this is in progress
        print(self.converter.get_vector_of_word("hello"))
        self.assertTrue(self.converter.get_vector_of_word("hello") is not None)
        self.assertEqual('foo'.upper(), 'FOO')

if __name__ == '__main__':
    unittest.main()
