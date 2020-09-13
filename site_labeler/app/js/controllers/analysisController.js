/**
 * Controller for providing additional an textual analysis action (– for checking what text is
 * being extracted).
 * @implements {EventListenerObject}
 */
export class AnalysisController {

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

    handleEvent(evt) {
        console.log(this._model.extractTitle());
        console.log(this._model.extractText());
        this.analyze();
    }

    analyze() {
        // TODO prevent infinite analysis
        //this._views.displayWordCount(wordCount);
        // console.log(this._model.countWords());
        // console.log(this._model.textState.words);
    }
}
