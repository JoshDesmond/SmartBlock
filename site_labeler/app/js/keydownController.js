/**
 * Keylistener for the standard labeling workflow.
 */
class KeydownController {

    /**
     * Creates a keydown event handler/listener
     * @param {Model} model
     */
    constructor(model) {
        this.model = model;
    }

    /** Event listener for the windows 'keydown' event. */
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
            case "v":
                this.model.handleFlag(2);
            case "n":
                this.model.handleFlag(3);
            case "m":
                this.model.handleFlag(4);
            case "a":
                this.model.handleAmbiguous();
            case ";":
                this.model.handleObvious();
            case "Enter":
                this.model.submit();
            case "Escape":
                this.model.resetState();
            default:
                break;
        }
    }
}

export {KeydownController};