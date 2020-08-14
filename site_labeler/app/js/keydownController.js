/**
 * Key listener for the standard labeling workflow.
 */
class KeydownController {

    /**
     * Creates a keydown event handler/listener
     * @param {Model} model
     * @param {Document} document Document which listener is listening for
     */
    constructor(model, document) {
        this.model = model;
        this.document = document;
    }

    /** Event listener for the window 'keydown' event. */
    handleEvent(e) {
        if (e.target !== document.body) {
            return
        }

        switch (e.key) {
            case 'd':
                e.preventDefault();
                this.model.handleVote(1);
                break;
            case 'f':
                e.preventDefault();
                this.model.handleVote(2);
                break;
            case 'j':
                e.preventDefault();
                this.model.handleVote(3);
                break;
            case 'k':
                e.preventDefault();
                this.model.handleVote(4);
                break;
            case "Backspace":
            case "Delete":
                e.preventDefault();
                this.model.undoLastVote();
                break;
            case " ":
                e.preventDefault();
                this.model.toggleFlags();
                break;
            case "c":
                this.model.handleFlag(1);
                break;
            case "v":
                this.model.handleFlag(2);
                break;
            case "n":
                this.model.handleFlag(3);
                break;
            case "m":
                this.model.handleFlag(4);
                break;
            case "a":
                this.model.handleAmbiguous();
                break;
            case ";":
                this.model.handleObvious();
                break;
            case "Enter":
                this.model.submit();
                break;
            case "Escape":
                this.model.resetState();
                break;
            default:
                break;
        }
    }
}

export {KeydownController};