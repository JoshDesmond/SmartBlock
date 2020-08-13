/** The program logic for static text analysis & labeling */
class Model {

    flags = false;
    voteAlreadySubmitted = false;

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
        for (const w of words) {
            console.log(w);
        }
        return words.length;
    }

    /** Toggles the status of whether flags are enabled or not **/
    toggleFlags() {
        this.flags = !this.flags;
    }

    undoLastVote() {
        // TODO
        console.log("undo!");
    }

    /**
     * Handles a voting action either by button or keypress
     * @param voteNumber Very Unproductive -> 1, Productive -> 2, Very Prod -> 3
     */
    handleVote(voteNumber) {
        console.log("voting: " + voteNumber);
        // TODO
    }
}

export {Model};