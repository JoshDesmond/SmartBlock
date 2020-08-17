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
    console.log(`Creating new label with: ${JSON.stringify(request.body)}`);
    const url = model.createWebpage(request.body.webpage);
    const snapshotId = model.createSnapshot(request.body.snapshot, url);
    const labelId = model.createLabel(request.body.label, snapshotId);
    const flagsId = model.createFlags();
    response.json({
		status: "success",
        url: url,
        snapshotId: snapshotId,
        labelId: labelId,
        flagsId: flagsId
	});
});

// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

// model.printDatabase();

