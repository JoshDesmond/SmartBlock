import {Model} from './model.js';
import express from 'express';
import cors from 'cors';


// Configure Express
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json({limit: '1mb'}));

// Create Model object
const model = new Model();


// Configure endpoints
app.get('/labels', (request, response) => {
    response.json({
        status: "successsss"
    })
});

app.post('/username', (request, response) => {
    model.getUserIdOfUsername(request.body.username, (userId) => {
        if (userId === undefined) {
            // If getting the UserId failed, create a new user and return that instead
            model.createUser(request.body.username, (userId) => {
                response.json({
                    userId: userId
                });
            });
        } else {
            response.json({
                userId: userId
            });
        }
    });
});

// TODO create a get endpoint for extracting relevant information to a url


/**
 * Posts a new website/snapshot/label to the database
 */
app.post('/labels', (request, response) => {
    // TODO separate out the labels endpoint from the snapshot/webpage endpoint
    // TODO also create an endpoint for flags
    console.log(`Post received with webpage.url === ${JSON.stringify(request.body.webpage.url)}`)
    model.postSnapshotLabel(request.body, response);
});

/**
 * Endpoint for posting an undo request. Data submitted must be a label that was already submitted.
 */
app.post('/undo', (request, response) => {
    console.log(`Post for undo received with webpage.url === ${JSON.stringify(request.body.webpage.url)}`);
    model.undoLabel(request.body, response);
});


// Launch Server
app.listen(port, () => {
    console.log(`Launching server on port ${port}`);
});

// model.clearDatabase();

// model.printDatabase();

