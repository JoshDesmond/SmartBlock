# SmartBlock
SmartBlock is an intelligent content-aware web filter designed for personal use to enable productive autonomy in a distraction filled internet. The project is currently a work in progress, and does not yet have a stable release.

The project is divided into five sub-projects, each described below:

site_labeler: The Site Labeler is a chrome extension that allows for quickly labeling website data. It extracts the text from a webpage and provides an in-browser user interface for labeling the productivity/relevancy of a website.

labeling_backend: This is the backend application for the site_labeler. It uses Express.js for its endpoints, and stores data in an SQLite database. It's currently set up to run locally on the same device as the labeler, but is intended for an eventual migration to a cloud platform like Azure.

model_maker: The model maker is a python project for training neural networks using the labeled sqlite data. It uses Keras/Tensorflow to build and export models.

smart_block: Smart Block is the final product. It is the plugin that will, using the text displayed on whatever website you visit and a pre-trained neural network, attempt to co-operatively steer users away from black-holes of internet distraction.

website: https://joshdesmond.github.io/SmartBlock/website/index.html
