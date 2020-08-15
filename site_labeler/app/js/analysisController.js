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
        const lastWordCount = this._model.getLatestWordCount();
        const wordCount = this._model.countWords();
        if (lastWordCount !== wordCount) { // Only update if there's been a change
            this._views.displayWordCount(wordCount);
        }
    }
}

export {AnalysisController};