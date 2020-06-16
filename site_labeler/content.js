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
    }

    /**
     * Handles a voting action either by button or keypress
     * @param voteNumber Very Unproductive -> 1, Productive -> 2, Very Prod -> 3
     */
    handleVote(voteNumber) {
        // TODO
    }
}

/** The GUI overlay shown when labeling sites */
class Views {

    firstWordCount = true;

    /**
     * Creates a new View and appends the GUI to the tab associated with this script
     * @param {!Model} model The model object in use by the plugin.
     */
    constructor(model) {
        this._model = model;
        this.footerDiv = document.createElement('div');
        document.body.appendChild(this.footerDiv);

        // Extra styling TODO validate CSS here?
        this.footerDiv.id = 'labeling-footer-div';
        this.footerDiv.style.backgroundColor = 'black';

        this.displayWordCount(this._model.countWords());
        this.addVotingButtons();

        this.addTextualAnalysisButton();
    }

    /**
     * Updates the footer to display the page's current word count.
     */
    displayWordCount(wordCount) {
        if (this.firstWordCount) {
            this.wordCountText = document.createElement('p');
            this.wordCountText.style.zIndex = '10001' // Arbitrarily larger number
            this.wordCountText.style.color ='#dcdcdc'
            this.wordCountText.innerText = "This page has " + wordCount.toString() + " words";
            this.footerDiv.appendChild(this.wordCountText);
            this.firstWordCount = false;
        }

        this.wordCountText.innerText = "This page has " + wordCount.toString() + " words";
    }


    /**
     * Adds the voting buttons on the bottom of the page.
     */
    addVotingButtons() {
        const votes = this._model.getStandardVotingActions();
        for (let action of votes) {

            const button = document.createElement('button');
            button.setAttribute("data-action", action);
            button.innerHTML = action;
            button.style.width = "10em";
            this.footerDiv.appendChild(button);
            if (action.toString() === "Productive") {
                button.style.marginLeft = '2em';
            } else if (action.toString() === "Productive") {
                button.style.marginRight = '2em';
            }
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
 * Controller for the textual analysis action
 */
class AnalysisController {

    /**
     * Instantializes the controller for a given model/view
     *
     * @param {!Model} model The model of the web page for analysis
     * @param {!Views} views The view to modify on re-analysis
     */
    constructor(model, views) {
        this._model = model;
        this._views = views;
    }

    onClick() {
        console.log(this._model.extractTitle());
        console.log(this._model.extractText());
    }

    analyze() {
        const wordCount = this._model.countWords();
        this._views.displayWordCount(wordCount);
    }
}


class FlagsController {
    /**
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
const ac = new AnalysisController(model, views);
views.footerDiv.onclick = (() => ac.onClick());

const flagsController = new FlagsController(model, views);

// Add hotkeys
document.onkeyup = function (e) {
    switch (e.key) {
        case 'd':
            // TODO not sure how this will refactor out in later iterations :/
            model.handleVote(1);
            break;
        case 'f':
            model.handleVote(2);
            break;
        case 'j':
            model.handleVote(3);
            break;
        case 'k':
            model.handleVote(4);
            break;
        case "Backspace":
        case "Delete":
            model.undoLastVote();
            break;
        case " ":
            flagsController.toggle();
            break;
    }
};

// Code below from: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

let analyzedFlag = false;

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    if (analyzedFlag) { // This check prevents an infinite analysis loop
        analyzedFlag = false;
        return;
    }
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            analyzedFlag = true;
            ac.analyze(); // Refresh word count
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
