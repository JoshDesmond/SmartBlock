import flask
from flask import jsonify
from flask_cors import cross_origin
from flask import request
import convert_text_to_numpy_array

app = flask.Flask(__name__)


@app.route('/text', methods=['POST'])
@cross_origin()
def text():
    # Get request.body.text
    text = request.get_json().get('text')
    return jsonify(converter.convert_text_to_matrix(text).tolist())


if __name__ == '__main__':
    converter = convert_text_to_numpy_array.TextToNumpyConverter()
    app.run(host="localhost", port=3000, debug=True)
