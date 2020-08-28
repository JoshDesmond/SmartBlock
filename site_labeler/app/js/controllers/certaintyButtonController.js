import {Model} from '../model';

/**
 * Controller for the isAmbiguous and isObvious labeling buttons
 * @implements {EventListenerObject}
 */
export class CertaintyButtonController {

    /** @type {Model} */
    _model;

    /**
     * Creates a controller for a given button
     * @param model {Model} model object to control
     */
    constructor(model) {
        this._model = model;
    }


    /**
     * Handles on click events for the certainty and flag buttons
     * @param {Event} e
     */
    handleEvent(e) {
        // this.isObviousButton.setAttribute("data-action", 'isObvious');
        /** @type {HTMLButtonElement} */
        const button = e.target;
        switch (button.getAttribute('data-action')) {
            case 'isObvious':
                this._model.modelState.handleObvious();
                break;
            case 'isAmbiguous':
                this._model.modelState.handleAmbiguous();
                break;
        }
    }
}