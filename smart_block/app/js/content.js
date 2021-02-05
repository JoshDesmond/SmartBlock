const max_words = 100;
const dims = 100;

class content {

    constructor() {
        this.loadModel().then((model) => {
            this.model = model;
            console.log(model.summary());
            this.getMatrixOfText("Hello hi what is up");
        });
    }

    /**
     * Loads the model from disk
     * @returns {Promise<tf.GraphModel>}
     */
    async loadModel() {
        return await tf.loadGraphModel("../model/model.json");
    }

    /**
     * Sends a request to the Python backend to convert text to a matrix
     *
     * @param {String} text The text of the article to evaluate
     */
    getMatrixOfText(text) {
        fetch(`http://localhost:3000/text`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({text: text}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                predictMatrix(data);
            })
            .catch(error => {
                console.error('Error: ', error);
            })
    }

    /**
     * Predicts the output of the given data using the model.
     * @param {Array.<float[]>} data
     */
    predictMatrix(data) {
        // First, convert the data from javascript arrays to a tf.tensor
        const matrix = tf.tensor(data, [max_words, dims]).expandDims(0);
        // Then predict its value
        const value = this.model.predict(matrix, {batch_size: 1});

        displayValue(value);
    }

    displayValue(predictionValue) {
        const footerDiv = document.createElement('div');
        document.body.appendChild(footerDiv);

        // Style the elements, footerDiv
        footerDiv.id = 'LabelingFooter';
        footerDiv.style.position = 'fixed';
        footerDiv.style.width = '100%';
        footerDiv.style.bottom = '0';
        footerDiv.style.backgroundColor = 'black';
        footerDiv.style.color = 'white';
        footerDiv.style.opacity = '0.95';
        footerDiv.style.textAlign = 'center';
        footerDiv.style.zIndex = '1000'; // Arbitrarily big number

        const predictionText = document.createElement('p');
        predictionText.innerText = `SmartBlock thinks this article is ${predictionValue * 100}% productive`;
        footerDiv.appendChild(predictionText);
    }

}

const c = new content();
