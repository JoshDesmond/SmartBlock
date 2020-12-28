import gc

import numpy
from modelmaker import convert_text_to_numpy_array, numpy_utils, load_db_to_tuples
from timeit import default_timer as timer
from datetime import timedelta
from pathlib import Path
from typing import List, Tuple
import random

timer_start_time = timer()


def print_with_time(message: str):
    delta = timedelta(seconds=timer() - timer_start_time)
    print(f"{message} ({delta})")


def main(dims=100):
    """
    main() is the standard script of logic that trains a model and saves it to disk. See the bottom of the file
    for main()'s invocation.
    """
    test_split = 0.01
    validation_split = 0.20

    # Load tuples from disk
    list_of_tuples = load_db_to_tuples.load_tuples()  # TODO
    num_total_tuples = len(list_of_tuples)
    print_with_time(f"{num_total_tuples} tuples loaded")

    # Split the tuples according to test_split
    random.shuffle(list_of_tuples)
    list_of_duples = get_duples_of_tuples(list_of_tuples)
    print_with_time(f"Filtered tuples down to {len(list_of_duples)} duples")
    split_index = int(test_split * num_total_tuples)
    test_tuples = list_of_duples[0: split_index]
    list_of_duples = list_of_duples[split_index: num_total_tuples]
    training_data = convert_tuple_list_to_matrices(list_of_duples)
    testing_data = convert_tuple_list_to_matrices(test_tuples)

    # Get NeuralNetworkMaker ready, and then train the model.
    neural = neural_network.NeuralNetworkMaker(validation_split=validation_split, word_dimensions=dims)
    neural.converter = converter
    neural.fit_model_to_data(training_data[0], training_data[1], epochs=20)
    neural.graph_history_loss()  # Create those graphs of loss/accuracy

    # Save the model to disk
    neural.write_model_to_disk(data_path("temp_model"))

    # Test the model using the testing_data.
    eval_loss = neural.model.evaluate(testing_data[0], testing_data[1], use_multiprocessing=True)
    print_with_time(f"{neural.model.metrics_names[0]}: {eval_loss[0]}")
    print_with_time(f"{neural.model.metrics_names[1]}: {eval_loss[1]}")


def get_duples_of_tuples(list_of_tuples: List[Tuple]):
    """
    Converts the list of text, vote, title, username, etc. tuple to just the data tuple
    Returns: list of two-dimensional tuples
    """
    duple_list = []
    for tup in list_of_tuples:
        if tup[2] == "programming":  # TODO temp
            duple_list.append((tup[0], tup[1]))
    return duple_list


def convert_tuple_list_to_matrices(list_of_duples: List[Tuple[str, float]]) -> \
        Tuple[numpy.ndarray, numpy.ndarray]:
    list_of_labels = []  # This is the label input into the neural network
    list_of_matrices = []
    i = 0
    label_len = len(list_of_duples)
    gc.disable()
    for vote in list_of_duples:
        if i % 100 == 1:
            print_with_time(f"Processed {i} of {label_len} articles/labels")

        matrix = converter.convert_text_to_matrix(vote[0])
        list_of_matrices.append(matrix)
        list_of_labels.append(vote[1])
        i += 1

    gc.enable()
    matrix_of_matrices = numpy.stack(list_of_matrices, axis=0)
    vector_of_labels = numpy.asarray(list_of_labels)
    return matrix_of_matrices, vector_of_labels



def data_path(filename: str) -> str:
    """
    Retrieves the absolute file path of a file in the SmartBlock/data/ folder

    Args:
        filename (str): The filename, such as "jsondata.txt"

    Returns:
        str: The absolute filepath of the file, such as "C:/code/SmartBlock/data/jsondata.txt", or the unix equivalent
    """
    return Path(f"../data/{filename}").resolve()


if __name__ == '__main__':
    # TextToNumpyConverter() takes ~15 seconds to initialize, and is done once here.
    dims = 100
    converter = convert_text_to_numpy_array.TextToNumpyConverter(sort_by_frequency=False,
                                                                 embedding_dimensions=dims)
    print_with_time("Converter Enabled")
    # The following two lines are for reading a model to disk
    # neural = neural_network.NeuralNetworkMaker(validation_split=0.2, word_dimensions=50)
    # neural.converter = converter
    # neural.load_model_from_disk(data_path("temp_model"))
    # Uncomment below if you want to update the test_wiki_articles.
    # read_and_store_test_wiki_articles()
    main(dims)