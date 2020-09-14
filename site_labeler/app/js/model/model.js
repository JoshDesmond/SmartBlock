import {ModelState, FLAG_NAMES} from "./modelState.js";
import {TextScraper} from "./textScraper.js";
import {TextState} from "./textState.js";

/** The program logic for static text analysis & labeling */
class Model {

    /** @type {Number} The maximum number of words that will be analyzed on a given page */
    MAX_WORDS = 2000;
    /** @type {Boolean} True if the vote has been submitted to the Backend. */
    voteAlreadySubmitted = false;
    /** An instance of the label that was submitted, (null if no valid submission performed). */
    _submittedLabel;
    /** @type {TextScraper} An instance of TextScraper to parse and analysis the text of a page */
    textScraper;
    /** @type {String} For now, a constant username for submission to the backend */
    username = "DeveloperDesmond";
    /** @type {TextState} Contains parsed text. */
    textState;

    constructor() {
        this.voteAlreadySubmitted = false;
        this.modelState = new ModelState();
        this.url = window.location.href;
        this.domain = new URL(this.url).hostname;
        this.textScraper = new TextScraper(document.body);
        this.textState = new TextState();
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
        const titleTags = document.head.getElementsByTagName("title");
        return this.textScraper.cleanString(titleTags[0].text);
    }

    /**
     * Returns the currently parsed textual content of the current webpage.
     * @returns {String} The extracted text of the webpage.
     */
    extractText() {
        return this.textState.words;
    }

    /**
     * Counts how many words there are in the readable text of document
     * @return {Number} The word count of document
     */
    countWords() {
        return this.textState.wordCount;

    }

    /** Returns the last/cached result of countWords() */
    getLatestWordCount() {
        return this.words.length;
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
                username: this.username
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
}

export {Model, FLAG_NAMES};