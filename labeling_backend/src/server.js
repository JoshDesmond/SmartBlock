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

app.post('/labels', (request, response) => {
	/**
	 * At the minimum each label requires the following information:
	 * -- Url, Domain,
	 * -- DateTime, Title, ContentRaw
	 * -- PrimaryVote
	 */
    console.log(`Creating new label with: ${JSON.stringify(request.body)}`);
    model.doSomething(request.body);
    response.json({
		status: "success"
	});
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

// model.printDatabase();
