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

export {FlagsController};