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
        this._model.modelState.registerObserver(this);
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

    repaintModel() {
        this.repaintFlagState();
        this.repaintSelectedVote();
        this.repaintCertaintyToggle();
    }

    /**
     * Updates the display of the footer to reflect the current status of whether or not flags
     * are selected.
     * */
    repaintFlagState() {
        // TODO
        if (this._model.modelState.flagState) {
            this.footerDiv.style.backgroundColor = 'red';
        } else {
            this.footerDiv.style.backgroundColor = 'black';
        }
    }

    /**
     * Updates the display of the footer to reflect the currently selected vote
     */
    repaintSelectedVote() {
        // TODO
    }

    /**
     * Updates the display of the footer to reflect whether isObvious or isAmbiguous is toggled.
     */
    repaintCertaintyToggle() {
        // TODO
        if (this._model.modelState.isAmbiguousState) {

        } else if (this._model.modelState.isObviousState) {

        }

    }

    /**
     * Adds an action to the to the footer for navigating to the textual
     * analysis view
     */
    addTextualAnalysisButton() {

    }

    /**
     * Called by the model any time there is an observable state change.
     */
    notify() {
        this.repaintModel();
    }


}

export {Views};