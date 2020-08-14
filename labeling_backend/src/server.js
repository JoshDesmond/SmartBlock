import {Model} from './model.js';
import express from 'express';

// Configure Express
const app = express();
const port = 3000;
app.use(express.json({ limit: '1mb' }));

// Create Model object
const model = new Model();


// Configure endpoints
app.get('/labels', (request, response) => {
	response.json({
		status: "successsss"
	})
});

app.post('/labels', (request, response) => {
    console.log(`Creating new label with: ${JSON.stringify(request.body)}`);
    response.json({
		status: "success"
	});
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

// model.printDatabase();

