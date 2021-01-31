import keras.initializers
import numpy
import numpy as np
from modelmaker import convert_text_to_numpy_array
from keras import Sequential, Model, Input
from keras.layers import Dense, Flatten, Conv1D, MaxPooling1D, Dropout
from keras.models import load_model
import tensorflow_probability as tfp


class NeuralNetworkMaker:
    def __init__(self, validation_split=.05, max_words=500, word_dimensions=100):
        self.validation_split = validation_split
        self.converter = None
        self.model = self.initialize_convolution(max_words, word_dimensions)

    def fit_model_to_data(self, input_matrix: np.ndarray, label_matrix: np.ndarray, epochs=10) -> None:
        self.model.compile(loss='mse', optimizer='sgd', metrics=['accuracy'])
        self.history = self.model.fit(input_matrix, label_matrix, epochs=epochs, batch_size=50,
                                      use_multiprocessing=True,
                                      validation_split=self.validation_split)
        self.model.summary()

    @staticmethod
    def initialize_simple(max_words, word_dimensions):
        simple = Sequential()
        shape = (max_words, word_dimensions)
        simple.add(Flatten(input_shape=shape))
        simple.add(Dense(500, activation='relu', kernel_initializer='he_uniform'))
        simple.add(Dropout(0.2))
        simple.add(Dense(500, activation='relu', kernel_initializer='he_uniform'))
        simple.add(Dropout(0.2))
        simple.add(Dense(500, activation='relu', kernel_initializer='he_uniform'))
        simple.add(Dropout(0.2))
        simple.add(Dense(1, activation='tanh'))
        return simple

    def initialize_convolution(self, max_words, word_dimensions):
        """
        Initialize Model with 1D convolutions applied to individual words
        :return:
        """
        encoder_model = Sequential()
        shape = (max_words, word_dimensions)
        encoder_model.add(Conv1D(max_words*5, kernel_size=word_dimensions, strides=word_dimensions, input_shape=shape))
        encoder_model.add(Flatten())
        encoder_model.add(Dense(500, activation='relu', kernel_initializer='he_uniform'))
        encoder_model.add(Dropout(0.2))
        encoder_model.add(Dense(500, activation='relu', kernel_initializer='he_uniform'))
        encoder_model.add(Dropout(0.2))
        encoder_model.add(Dense(1, activation='tanh'))

        return encoder_model

    def write_model_to_disk(self, filepath: str):
        """
        Writes the trained model to disk using model.save(). The file names will be filepath.hdf5

        Args:
            filepath (str): The base name of the file to write to
        """
        self.model.save(f"{filepath}.hdf5")

    def load_model_from_disk(self, filepath: str):
        self.model = load_model(f"{filepath}.hdf5")

    def classify_text(self, text: str) -> float:
        if self.converter is None:
            self.converter = convert_text_to_numpy_array.TextToNumpyConverter()
        matrix = self.converter.convert_text_to_matrix(text)
        matrix = numpy.expand_dims(matrix, axis=0)
        return self.model.predict(matrix)

    def graph_history_loss(self):
        import matplotlib.pyplot as plt
        plt.style.use('ggplot')

        acc = self.history.history['accuracy']
        val_acc = self.history.history['val_accuracy']
        loss = self.history.history['loss']
        val_loss = self.history.history['val_loss']
        x = range(1, len(acc) + 1)

        plt.figure(figsize=(12, 5))
        plt.subplot(1, 2, 1)
        plt.plot(x, acc, 'b', label='Training acc')
        plt.plot(x, val_acc, 'r', label='Validation acc')
        plt.title('Training and validation accuracy')
        plt.legend()
        plt.subplot(1, 2, 2)
        plt.plot(x, loss, 'b', label='Training loss')
        plt.plot(x, val_loss, 'r', label='Validation loss')
        plt.title('Training and validation loss')
        plt.legend()
        plt.show()


# from keras.utils import plot_model
# plot_model(model, to_file='model.png', show_shapes=True, expand_nested=True)
