import {Toast} from "./toast.js";

/** The GUI overlay shown when labeling sites */
class Views {

    /** @type {HTMLButtonElement[]} Access to the four likert scale voting buttons */
    //votingButtons;
    /** @type {HTMLButtonElement[]} Buttons for isAmbiguous, isObvious, and flags */
    //otherButtons;

    /**
     * Creates a new View and appends the GUI to the tab associated with this script
     * @param {!Model} model The model object in use by the plugin.
     */
    constructor(model) {
        this._model = model;
        this._model.modelState.registerObserver(this);
        this.footerDiv = document.createElement('div'); // TODO refactor to html
        document.body.appendChild(this.footerDiv);


        // Extra styling TODO validate CSS here?
        this.footerDiv.id = 'labeling-footer-div';
        this.footerDiv.style.backgroundColor = 'black';

        // this.displayWordCount(this._model.countWords());
        this.votingButtons = [];
        this.otherButtons = [];
        this.addVotingButtons();
        this.addCertaintyButtons();
        this.votingButtons.forEach((button) => {
            button.setAttribute('class', "footerButton SmartBlockPluginElement");
        });
        this.otherButtons.forEach((button) => {
            button.setAttribute('class', "footerButton SmartBlockPluginElement");
        });
        this.addTextualAnalysisButton();
    }


    /**
     * Creates a toast notification with the given text. Use createNeutralToast() and
     * createErrorToast() for other stylings.
     * @param {String} text Message of the toast to display
     */
    createSuccessToast(text) {
        document.body.appendChild(new Toast(text, false, true).get());
    }

    /**
     * Creates a toast notification with the given text. Use createSuccessfulToast() and
     * createErrorToast() for other stylings.
     * @param {String} text Message of the toast to display
     */
    createNeutralToast(text) {
        document.body.appendChild(new Toast(text, false, false).get());
    }

    /**
     * Creates a toast notification with the given text. Use createNeutralToast() and
     * createErrorToast() for other stylings.
     * @param {String} text Message of the toast to display
     */
    createErrorToast(text) {
        document.body.appendChild(new Toast(text, true, false).get());
    }

    /**
     * Adds the voting buttons on the bottom of the page.
     */
    addVotingButtons() {
        const votes = this._model.getStandardVotingActions();
        for (let action of votes) {

            const button = document.createElement('button');
            this.votingButtons.push(button);
            // TODO delete this?
            // button.setAttribute("data-action", action);
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

    /** Adds the isObvious and isAmbiguous buttons to the UI */
    addCertaintyButtons() {
        // TODO how to refactor this into a separate .html file and reference it?
        this.isAmbiguousButton = document.createElement('button');
        this.isAmbiguousButton.innerHTML = "Ambiguous";
        this.isAmbiguousButton.style.width = "fit-content";
        this.isAmbiguousButton.style.position = "absolute";
        this.isAmbiguousButton.style.left = "0px";
        this.isAmbiguousButton.style.height = "100%";
        this.isAmbiguousButton.setAttribute("data-action", 'isAmbiguous');
        this.footerDiv.insertBefore(this.isAmbiguousButton, this.votingButtons[0]);
        this.isObviousButton = document.createElement('button');
        this.isObviousButton.innerHTML = "Obvious";
        this.isObviousButton.style.width = "fit-content";
        this.isObviousButton.style.position = "absolute";
        this.isObviousButton.style.right = "0px";
        this.isObviousButton.style.height = "100%";
        this.isObviousButton.setAttribute("data-action", 'isObvious');
        this.footerDiv.appendChild(this.isObviousButton);

        this.otherButtons.push(this.isAmbiguousButton);
        this.otherButtons.push(this.isObviousButton);
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
        if (this._model.modelState.flagState) {
            this.footerDiv.style.backgroundColor = 'red';
        } else {
            this.footerDiv.style.backgroundColor = 'black';
        }
    }

    /** Resets a button element to its default color */
    _resetButton(button) {
        button.style.backgroundColor = 'whitesmoke';
    };

    /** Colors the given button element to indicate that it's selected */
    _enableButton(button) {
        button.style.backgroundColor = 'green';
    };

    /**
     * Updates the display of the footer to reflect the currently selected vote
     */
    repaintSelectedVote() {
        for (let b of this.votingButtons) {
            this._resetButton(b);
        }

        /**
         * TODO redo this such that the secondary vote causes a range of buttons to be highlighted.
         * The primary vote will be the brightest green, but the secondary one will be a faded
         * green.
         * If primary vote is 4, and secondary is 2, then button 4 will be bright green, and
         * buttons 2 and 3 will be faded green, so as to indicate that you think it could be
         * anywhere from 2 to 4.
         */
        if (this._model.modelState.flagState) {
            // Paint Secondary Vote
            const secondaryVote = this._model.modelState.secondaryVote;
            if (secondaryVote === null) {
                return;
            }
            this._enableButton(this.votingButtons[secondaryVote - 1]);
        } else {
            // Paint Primary Vote
            const primaryVote = this._model.modelState.primaryVote;
            if (primaryVote === null) {
                return;
            }
            this._enableButton(this.votingButtons[primaryVote - 1]);
        }
    }

    /**
     * Updates the display of the footer to reflect whether isObvious or isAmbiguous is toggled.
     */
    repaintCertaintyToggle() {
        this._resetButton(this.isObviousButton);
        this._resetButton(this.isAmbiguousButton);
        if (this._model.modelState.isAmbiguousState) {
            this._enableButton(this.isAmbiguousButton);
        } else if (this._model.modelState.isObviousState) {
            this._enableButton(this.isObviousButton);
        }
    }

    /**
     * Adds an action to the to the footer for navigating to the textual
     * analysis view
     */
    addTextualAnalysisButton() {
        // TODO
    }

    /**
     * Called by the model any time there is an observable state change.
     */
    notify() {
        this.repaintModel();
    }
}

export {Views};