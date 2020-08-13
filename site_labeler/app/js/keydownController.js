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
        if (e.target === document.body) {
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
                default:
                    break;
            }
        }
    }
}

export {KeydownController};