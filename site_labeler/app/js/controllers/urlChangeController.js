/**
 * @implements {EventListenerObject}
 */
export class UrlChangeController {

    /**
     * 
     * @param {Model} model 
     */
    constructor(model) {
        this._model = model;
    }

    /**
     * Event listener for the window hashChange event
     * @param {Event} e
     */
    handleEvent(e) {
        // TODO
        console.log(e);
    }

}
