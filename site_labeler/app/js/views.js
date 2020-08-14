/** The GUI overlay shown when labeling sites */
class Views {

    /** */
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
            this.wordCountText.style.color = '#dcdcdc'
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

export {Views};