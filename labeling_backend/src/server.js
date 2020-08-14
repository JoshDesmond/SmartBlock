import {Model} from './model.js';
import express from 'express';
import bodyParser from 'body-parser';

// Configure Express
const app = express();
const port = 3000;
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json());

// Create Model object
const model = new Model();

// Configure endpoints
app.post('labels', (request, response) => {
    console.log(`Creating new label with: ${request.body}`);
    response.json({
		status: "success"
	});
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

/** Instructs the model to print the database **/
function printDatabase() {
    model.printDatabase();
}

// printDatabase();
