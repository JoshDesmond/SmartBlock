import {Model} from './model.js';
import express from 'express';
import bodyParser from 'body-parser';

// Configure Express
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));

// Create Model object
const model = new Model();

// Configure endpoints
app.post('labels', (request, response) => {
    console.log(`Creating new label with url: ${request.body.url}`);
    console.log(request.body);
    model.doSomething(request.body);
    response.json(request.body);
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

/** Instructs the model to print the database **/
function printDatabase() {
    model.printDatabase();
}

printDatabase();
