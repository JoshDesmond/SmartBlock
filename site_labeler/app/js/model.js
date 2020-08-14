import {ModelState, FLAG_NAMES} from "./modelState.js";

/** The program logic for static text analysis & labeling */
class Model {

    constructor() {
        this.voteAlreadySubmitted = false;
        this.modelState = new ModelState();
        this.url = window.location.href;
        this.domain = new URL(this.url).hostname;
        // TODO TEMP
        if (this.url === null) {
            console.error("URL is null");
        }
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
        const html = document.getElementsByTagName('html')[0].innerHTML;
        return html;
    }

    /**
     * Extracts the title of the current webpage
     * @returns {string}
     */
    extractTitle() {
        const titleTags = document.head.getElementsByTagName("title");
        return titleTags[0].text;
    }

    /**
     * Parse the textual content of the current webpage.
     * @returns {String} The extracted text of the webpage.
     */
    extractText() {
        // TODO FIXME the .innerText doesn't add any textual separation between elements.
        this.text = document.body.innerText;
        return this.text;
    }

    /**
     * Counts how many words there are in the readable text of document
     * @return {Number} The word count of document
     */
    countWords() {
        const text = this.extractText();
        this.words = text.split(/\s+/g);
        return this.words.length;
    }

    /** Returns the last/cached result of countWords() */
    getLatestWordCount() {
        return this.words.length;
    }

    /** Returns the last/cached result of extractText() */
    getLatestTextContent() {
        return this.text;
    }

    /** Toggles the status of whether flags are enabled or not **/
    toggleFlags() {
        this.modelState.toggleFlags();
    }

    undoLastVote() {
        // TODO
        console.log("undo!");
    }

    /**
     * Compiles all the necessary data into a json object that will be submitted to the labeling
     * backend API.
     */
    assembleLabelForSubmission() {
        const label = {
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
                topic: null
            },
            flags: {
                isVeryAmbiguous: this.modelState.flags[0],
                isReviewable: this.modelState.flags[1],
                isNotTextual: this.modelState.flags[2],
                isInteresting: this.modelState.flags[3]
            }
        }

        return label;
    }

    /** Validates the current modelState and submits the vote to the backend. */
    submit() {
        if (this.modelState.isValidForSubmission()) {
            console.log("Submitting Vote!");
            fetch('http://localhost:3000/labels', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(this.assembleLabelForSubmission()),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
                .then(data => console.log(data))
                .catch(error => {
                    console.error('Error: ', error);
                })
        } else {
            console.log("Invalid modelState configuration, no vote submitted");
        }
    }
}

export {Model, FLAG_NAMES};