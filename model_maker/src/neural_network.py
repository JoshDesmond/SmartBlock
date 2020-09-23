import keras.initializers
import numpy
import numpy as np
from keras import Sequential, Model, Input
from keras.layers import Dense, Flatten, Conv1D, MaxPooling1D, Dropout, LSTM
from keras.models import load_model

from modelmaker import convert_text_to_numpy_array


class NeuralNetworkMaker:
    def __init__(self, validation_split=.05, max_words=500, word_dimensions=100):
        self.validation_split = validation_split
        self.converter = None
        self.model = self.initialize_simple(max_words, word_dimensions)

    def fit_model_to_data(self, input_matrix: np.ndarray, label_matrix: np.ndarray, epochs=10) -> None:
        self.model.compile(loss='mse', optimizer='sgd', metrics=['accuracy'])
        self.history = self.model.fit(input_matrix, label_matrix, epochs=epochs, batch_size=80,
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

    def initialize_CMpDNNDo(self, max_words):
        """
        Initialize Model with a CNN w/ max pooling, and a DNN w/ .2 dropout layers
        :return:
        """
        self.model = Sequential()
        self.model.add(Conv1D(200, kernel_size=20, strides=2, input_shape=(max_words, 300)))
        self.model.add(MaxPooling1D(pool_size=3))
        self.model.add(Conv1D(150, kernel_size=5, strides=1))
        self.model.add(MaxPooling1D(pool_size=2))
        self.model.add(Conv1D(100, kernel_size=3, strides=1))
        self.model.add(MaxPooling1D(pool_size=2))

        self.model.add(Flatten())
        self.model.add(Dense(1000, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(100, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(1, activation='tanh'))

    def initialize_LSTM(self, max_words):
        """
        Get LSTM Model
        :return: Initialized LSTM Model
        """
        self.model = Sequential()

        self.model.add(LSTM(150, input_shape=(max_words, 300), activation="relu", dropout=.2, ))

        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(100, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(1, activation='tanh'))

    def initialize_convolutional_LSTM(self, max_words):
        """
        Get LSTM Model
        :return: Initialized LSTM Model
        """
        self.model = Sequential()
        self.model.add(Conv1D(200, kernel_size=20, strides=2, input_shape=(max_words, 300)))
        self.model.add(MaxPooling1D(pool_size=3))
        self.model.add(Conv1D(150, kernel_size=5, strides=1))
        self.model.add(MaxPooling1D(pool_size=2))

        self.model.add(LSTM(150, activation="relu", dropout=.2))

        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(500, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(100, activation='relu'))
        self.model.add(Dropout(0.2))
        self.model.add(Dense(1, activation='tanh'))

    def initialize_context_based(self, max_words):
        """
        Initialize Model with a CNN w/ max pooling, and a DNN w/ .2 dropout layers,
        which merges the context word vector with the flattened output of the CN
        :return:
        """
        encoder_model = Sequential()
        encoder_model.add(Conv1D(125, kernel_size=25, strides=4, input_shape=(max_words, 300)))
        encoder_model.add(Conv1D(125, kernel_size=25, strides=4))
        encoder_model.add(MaxPooling1D(pool_size=2))
        encoder_model.add(Conv1D(75, kernel_size=4, strides=2))
        encoder_model.add(Conv1D(75, kernel_size=4, strides=2))
        encoder_model.add(MaxPooling1D(pool_size=2))
        encoder_model.add(Conv1D(30, kernel_size=3, strides=2))
        encoder_model.add(Conv1D(30, kernel_size=3, strides=2))
        encoder_model.add(MaxPooling1D(pool_size=2))
        encoder_model.add(Flatten())

        text_input = Input(shape=(max_words, 300))
        encoded_text = encoder_model(text_input)

        context_input = Input(shape=(300,))

        merged = keras.layers.concatenate([context_input, encoded_text])

        model_combined = Sequential()
        model_combined.add(Dense(1000, activation='relu'))
        model_combined.add(Dropout(0.2))
        model_combined.add(Dense(500, activation='relu'))
        model_combined.add(Dropout(0.2))
        model_combined.add(Dense(500, activation='relu'))
        model_combined.add(Dropout(0.2))
        model_combined.add(Dense(100, activation='relu'))
        model_combined.add(Dropout(0.2))
        model_combined.add(Dense(1, activation='tanh'))

        output = model_combined(merged)

        self.model = Model(inputs=[text_input, context_input], outputs=output)



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
