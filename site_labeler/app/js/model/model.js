import { ModelState } from "./modelState.js";
import { TextScraper } from "./textScraper.js";
import { TextState } from "./textState.js";

/** The program logic for static text analysis & labeling */
class Model {


    constructor() {
        /** @type {String}  now, a constant username for submission to the backend */
        this.username = "DeveloperDesmond";
        this.getUserIdOfUsername(this.username); // sets this.userId
        /** @type {Boolean} True if the vote has been submitted to the Backend. */
        this.voteAlreadySubmitted = false;
        this.modelState = new ModelState();
        this.url = window.location.href;
        this.domain = new URL(this.url).hostname;
        /** @type {TextScraper} An instance of TextScraper to parse and analysis the text of a page */
        this.textScraper = new TextScraper(document.body);
        /** @type {TextState} Contains parsed text. */
        this.textState = new TextState();
        this._submittedLabel = null;
    }

    /**
     * Determines what voting actions are available based on the webpage, its content, and the
     * users settings.
     */
    getStandardVotingActions() {
        return ["Very Unproductive", "Unproductive", "Productive", "Very Productive"];
    }

    /**
     * Retrieve the entire HTML of the current webpage
     * @returns {String} The entire HTML of the webpage
     */
    extractFullHTML() {
        return document.getElementsByTagName('html')[0].innerHTML;
    }

    /**
     * Extracts the title of the current webpage
     * @returns {string}
     */
    extractTitle() {
        console.log(document.head.getElementsByTagName("title"));
        let titleTags = document.head.getElementsByTagName("title");
        if (titleTags[0] === undefined) {
            titleTags = document.body.getElementsByTagName("title");
        }
        console.log("title: " + titleTags[0].text);
        return this.textScraper.cleanString(titleTags[0].text);
    }

    /** Returns the last/cached result of extractText() */
    getLatestTextContent() {
        return this.textState.words;
    }

    /**
     * Compiles all the necessary data into a json object that will be submitted to the labeling
     * backend API.
     */
    assembleLabelForSubmission() {
        console.log("userId: " + this.userId);
        return {
            webpage: {
                url: this.url,
                domain: this.domain
            },
            snapshot: {
                dateTime: Math.round((new Date()).getTime() / 1000),
                title: this.extractTitle(),
                contentRaw: this.getLatestTextContent()
            },
            label: {
                primaryVote: this.modelState.primaryVote,
                secondaryVote: this.modelState.secondaryVote,
                isObvious: this.modelState.isObviousState,
                isAmbiguous: this.modelState.isAmbiguousState,
                topic: null,
                userId: this.userId
            },
            flags: {
                isDynamicContent: this.modelState.flags[0],
                isReviewable: this.modelState.flags[1],
                isNotTextual: this.modelState.flags[2],
                isCounterIntuitive: this.modelState.flags[3]
            }

        }
    }

    /**
     * Validates the current modelState and submits the vote to the backend.
     * @param {Function} callback Returns success/error message.
     */
    submit(callback) {
        if (this.modelState.isValidForSubmission() === false) {
            callback("Invalid modelState configuration, no vote submitted", false);
            return;
        } else if (this.voteAlreadySubmitted) {
            callback("A vote has already been submitted. To update your vote, undo with" +
                " backspace/delete and resubmit again");
            return;
        } else if (this.userId === undefined) {
            callback("UserId is not set - cancelling submission. Perhaps the backend is not" +
                " running?", false);
            return;
        }
        console.log("Submitting Vote!");
        this._submittedLabel = this.assembleLabelForSubmission();
        this.voteAlreadySubmitted = true;
        fetch('http://localhost:3000/labels', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(this._submittedLabel),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                callback("Submission Successful!", true);
            })
            .catch(error => {
                console.error('Error: ', error);
                callback("Submission Error, see console", false);
                this.voteAlreadySubmitted = false;
                this._submittedLabel = null;
            })
    }

    /**
     * Sends a request to the backend to undo the last vote and updates model accordingly
     * @param {Function} callback Returns a message to be displayed.
     */
    undoLastVote(callback) {
        if (this._submittedLabel === null || this.voteAlreadySubmitted !== true) {
            callback("A vote does not appear to have been submitted, ignoring undo input");
            return;
        }

        fetch('http://localhost:3000/undo', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(this._submittedLabel),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                this._submittedLabel = null;
                this.voteAlreadySubmitted = false;
                callback("Vote successfully undone");
            })
            .catch(error => {
                console.error(error);
                callback("Error: Undo unsuccessful. See console for details", true);
            })
    }

    /**
     * Retrieves the userid of the given username from the database/backend, and (currently)
     * sets the model to store that userId in this.userId
     * @param {String} username
     */
    getUserIdOfUsername(username) {
        if (!username) {
            throw new TypeError("No username provided");
        }
        fetch('http://localhost:3000/username', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ username: username }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                this.userId = data.userId;
                console.log(this.userId);
            })
            .catch(error => {
                console.error("Unable to retrieve userId from username: " + username);
                console.error('Error: ', error);
                // callback("Submission Error, see console", false);
                this.voteAlreadySubmitted = false;
                this._submittedLabel = null;
            })
    }
}

export { Model };