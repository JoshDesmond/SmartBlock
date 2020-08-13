class KeydownController {

    /** Event listener for the windows 'keydown' event. */
    handleEvent(e) {
        if (e.target === document.body) {
            switch (e.key) {
                case 'd':
                    e.preventDefault();
                    // TODO not sure how this will refactor out in later iterations :/
                    model.handleVote(1);
                    break;
                case 'f':
                    e.preventDefault();
                    model.handleVote(2);
                    break;
                case 'j':
                    e.preventDefault();
                    model.handleVote(3);
                    break;
                case 'k':
                    e.preventDefault();
                    model.handleVote(4);
                    break;
                case "Backspace":
                case "Delete":
                    e.preventDefault();
                    model.undoLastVote();
                    break;
                case " ":
                    e.preventDefault();
                    flagsController.toggle();
                    break;
            }
        }
    }
}

export {KeydownController};