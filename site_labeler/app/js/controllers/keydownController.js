/**
 * Key listener for the standard labeling workflow.
 * @implements {EventListenerObject}
 */
export class KeydownController {

    /**
     * Creates a keydown event handler/listener
     * @param {Model} model
     * @param {Views} views
     */
    constructor(model, views) {
        this._model = model;
        this._views = views;
    }

    /** Event listener for the window 'keydown' event. */
    handleEvent(e) {
        if (e.target !== document.body && e.target.getAttribute('class') !== "footerButton") {
            return;
        }

        switch (e.key) {
            case 'd':
                e.preventDefault();
                this._model.modelState.handleVote(1);
                break;
            case 'f':
                e.preventDefault();
                this._model.modelState.handleVote(2);
                break;
            case 'j':
                e.preventDefault();
                this._model.modelState.handleVote(3);
                break;
            case 'k':
                e.preventDefault();
                this._model.modelState.handleVote(4);
                break;
            case "Backspace":
            case "Delete":
                e.preventDefault();
                this._model.undoLastVote((message, wasError) => {
                    if (wasError) {
                        this._views.createErrorToast(message);
                    } else {
                        this._views.createNeutralToast(message);
                    }
                });
                break;
            case " ":
                e.preventDefault();
                this._model.modelState.toggleFlags();
                break;
            case "c":
                this._model.modelState.handleFlag(0);
                break;
            case "v":
                this._model.modelState.handleFlag(1);
                break;
            case "n":
                this._model.modelState.handleFlag(2);
                break;
            case "m":
                this._model.modelState.handleFlag(3);
                break;
            case "a":
                this._model.modelState.handleAmbiguous();
                break;
            case ";":
                this._model.modelState.handleObvious();
                break;
            case "Enter":
                this._model.submit((message, wasSuccessful) => {
                    if (wasSuccessful) {
                        this._views.createSuccessToast(message);
                    } else {
                        this._views.createErrorToast(message);
                    }
                });
                break;
            case "Escape":
                this._model.modelState.resetState(() => {
                    this._views.createNeutralToast("Input state cleared");
                });
                break;
            default:
                break;
        }
    }
}
