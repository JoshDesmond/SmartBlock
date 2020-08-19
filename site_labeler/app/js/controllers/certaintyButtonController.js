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


    handleEvent(e) {
        // TODO how to reference the data-action attribute of the event target?
        // this.isObviousButton.setAttribute("data-action", 'isObvious');
        if (e.target) {} // ...
        this._model.modelState.handleAmbiguous();
        this._model.modelState.handleObvious();
    }
}