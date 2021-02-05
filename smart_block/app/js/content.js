const port = 3000;


/**
 * Sends a request to the Python backend to convert text to a matrix
 *
 * @param {String} text The text of the article to evaluate
 */
function getMatrixOfText(text) {
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
        })
        .catch(error => {
            console.error('Error: ', error);
        })
}

getMatrixOfText("Hello hi what is up");