import {ModelState} from "./modelState.js";

/** The program logic for static text analysis & labeling */
class Model {

    constructor() {
        this.flags = false;
        this.voteAlreadySubmitted = false;
        this.modelState = new ModelState();
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
        const text = document.body.innerText;
        return text;
    }

    /**
     * TODO how to reference "document" as a link in JavaScriptDocs?
     * Counts how many words there are in the readable text of document
     * @return {Number} The word count of document
     */
    countWords() {
        const text = this.extractText();
        // const words = text.split(" "); // TODO temp
        const words = text.split(/\s+/g);
        return words.length;
    }

    /** Toggles the status of whether flags are enabled or not **/
    toggleFlags() {
        this.modelState.toggleFlags();
    }

    undoLastVote() {
        // TODO
        console.log("undo!");
    }

    /** Validates the current modelState and submits the vote to the backend. */
    submit() {
        if (this.modelState.isValidForSubmission()) {
            console.log("Submitting Vote!");
            const data = {url: "Hello.com"};
            fetch('http://localhost:3000/labels', {
                method: 'POST',
                mode: 'cors',
                body: JSON.stringify(data),
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

    resetState() {
        this.modelState.resetState();
    }

    /**
     * Handles a voting action either by button or keypress
     * @param voteNumber Very Unproductive -> 1, Productive -> 2, Very Prod -> 3
     */
    handleVote(voteNumber) {
        this.modelState.handleVote(voteNumber);
    }
}

export {Model};