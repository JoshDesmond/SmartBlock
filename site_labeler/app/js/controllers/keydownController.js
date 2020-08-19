/**
 * Key listener for the standard labeling workflow.
 * @implements {EventListenerObject}
 */
class KeydownController {

    /**
     * Creates a keydown event handler/listener
     * @param {Model} model
     */
    constructor(model) {
        this.model = model;
    }

    /** Event listener for the window 'keydown' event. */
    handleEvent(e) {
        if (e.target !== document.body) {
            return
        }

        switch (e.key) {
            case 'd':
                e.preventDefault();
                this.model.modelState.handleVote(1);
                break;
            case 'f':
                e.preventDefault();
                this.model.modelState.handleVote(2);
                break;
            case 'j':
                e.preventDefault();
                this.model.modelState.handleVote(3);
                break;
            case 'k':
                e.preventDefault();
                this.model.modelState.handleVote(4);
                break;
            case "Backspace":
            case "Delete":
                e.preventDefault();
                this.model.undoLastVote();
                break;
            case " ":
                e.preventDefault();
                this.model.modelState.toggleFlags();
                break;
            case "c":
                this.model.modelState.handleFlag(0);
                break;
            case "v":
                this.model.modelState.handleFlag(1);
                break;
            case "n":
                this.model.modelState.handleFlag(2);
                break;
            case "m":
                this.model.modelState.handleFlag(3);
                break;
            case "a":
                this.model.modelState.handleAmbiguous();
                break;
            case ";":
                this.model.modelState.handleObvious();
                break;
            case "Enter":
                this.model.submit();
                break;
            case "Escape":
                this.model.modelState.resetState();
                break;
            default:
                break;
        }
    }
}

export {KeydownController};