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
     * Parse the textual content of the current webpage.
     * @returns {String} The extracted text of the webpage.
     */
    extractText() {
        const text = document.body.innerText;
        return text;
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
     * TODO how to reference "document" as a link in JavaScriptDocs?
     * Counts how many words there are in the readable text of document
     * @return {Number} The word count of document
     */
    countWords() {
        const text = this.extractText();
        const words = text.split(" ");
        return words.length;
    }

    /** Toggles the status of whether flags are enabled or not **/
    toggleFlags() {
        this.flags = !this.flags;
    }
}

/** The GUI overlay shown when labeling sites */
class Views {

    /**
     * Creates a new View and appends the GUI to the tab associated with this script
     * @param {!Model} model The model object in use by the plugin.
     */
    constructor(model) {
        this._model = model;
        this.footerDiv = document.createElement('div');
        document.body.appendChild(this.footerDiv);

        this.footerDiv.id = 'LabelingFooter';
        this.footerDiv.style.position = 'fixed';
        this.footerDiv.style.width = '100%';
        this.footerDiv.style.bottom = '0';
        this.footerDiv.style.backgroundColor = 'black';
        this.footerDiv.style.opacity = '0.95';
        this.footerDiv.style.textAlign = 'center';
        this.footerDiv.style.zIndex = '10000' // Arbitrarily large number

        this.displayWordCount();
        this.addVotingButtons();
        // TODO consider checking if the url has been labeled already, and indicating if so
        this.addTextualAnalysisButton();
    }

    /**
     * Updates the footer to display the page's current word count.
     */
    displayWordCount() {
        const wordCount = this._model.countWords();
        const wordCountText = document.createElement('p');
        wordCountText.style.zIndex = '10001' // Arbitrarily larger number
        wordCountText.style.color ='#dcdcdc'
        wordCountText.innerText = "This page has " + wordCount.toString() + " words";
        this.footerDiv.appendChild(wordCountText);
    }


    /**
     * Adds the voting buttons on the bottom of the page.
     */
    addVotingButtons() {
        const votes = this._model.getStandardVotingActions();
        for (let action of votes) {
            console.log(action.toString()); // TEMP

            const button = document.createElement('button');
            button.setAttribute("data-action", action);
            button.innerHTML = action;
            this.footerDiv.appendChild(button);
        }
    }


    /** Updates the display of the footer to reflect the state of the model */
    repaintFlags() {
        if (this._model.flags === true) {
            this.footerDiv.style.backgroundColor = 'red';
        } else {
            this.footerDiv.style.backgroundColor = 'black';
        }
    }


    /**
     * Adds an action to the to the footer for navigating to the textual
     * analysis view
     */
    addTextualAnalysisButton() {

    }

}


/**
 * Controller for the textualAnalysisButton
 */
class AnalysisController {

    /**
     * Instantializes the controller for a given model/view
     *
     * @param {!Model} model The model of the web page for analysis
     */
    constructor(model) {
        this._model = model;
    }

    onClick() {
        console.log(this._model.extractTitle());
        console.log(this._model.extractText());
    }
}

class FlagsController {
    /**
     *
     * @param {!Model} model The model of associated webpage being labeled
     * @param {!Views} views The view object to update the display of
     */
    constructor(model, views) {
        this._model = model;
        this._views = views;
    }

    toggle() {
        this._model.toggleFlags();
        this._views.repaintFlags();
    }
}


const model = new Model();
const views = new Views(model);

// Add controllers
const ac = new AnalysisController(model);
views.footerDiv.onclick = (() => ac.onClick());

const fc = new FlagsController(model, views);

// Add hotkeys
document.onkeyup = function (e) {
    // TODO switch to case statement?
    if (e.key === "d") {
        model.handleVote(window.location.href, model.question, "Not Relevant", false);
    } else if (e.key === "j") {
        model.handleVote(window.location.href, model.question, "Slightly Relevant", false);
    } else if (e.key === "k") {
        model.handleVote(window.location.href, model.question, "Very Relevant", false);
    } else if (e.key === "Backspace" || e.key === "Delete") {
        model.undoLastVote();
    } else if (e.key === " ") {
        fc.toggle();
    }
};
