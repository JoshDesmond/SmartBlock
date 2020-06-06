/** The program logic for static text analysis & labeling */
class Model {

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


    /**
     * Determines the appropriate voting actions that can be made
     * @returns {undefined}
     */
    getVotingActions() {
        return undefined;
    }


    /**
     * Adds an action to the to the footer for navigating to the textual
     * analysis view
     */
    addTextualAnalysisButton() {
        const ac = new AnalysisController(this._model);
        this.footerDiv.onclick = (() => ac.onClick());
    }

}


/**
 * Controller for the textualAnalysisButton
 */
class AnalysisController {

    _model;

    /**
     * Instantializes the controller for a given model/view
     *
     * @param {!Model} model The model of the web page for analysis
     */
    constructor(model) {
        console.log(model);
        this._model = model;
        console.log(this._model);
    }

    onClick() {
        console.log(this);
        console.log(this._model);
        console.log(this._model.extractTitle());
        console.log(this._model.extractText());
    }
}


const model = new Model();
const views = new Views(model);
