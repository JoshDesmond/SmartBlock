import {Model} from './model.js';
import express from 'express';
import cors from 'cors';


// Configure Express
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Create Model object
const model = new Model();


// Configure endpoints
app.get('/labels', (request, response) => {
	response.json({
		status: "successsss"
	})
});


/**
 * Posts a new website/snapshot/label to the database
 */
app.post('/labels', (request, response) => {
    console.log(`Post received with webpage.url === ${JSON.stringify(request.body.webpage.url)}`)
    console.log("response");
    console.log(response);
    model.postSnapshotLabel(request.body, response);
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

model.clearDatabase();

// model.printDatabase();

