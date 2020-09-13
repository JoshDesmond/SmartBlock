/**
 * Stores the current state of textual analysis.
 */
class TextState {

    wordCount;
    /** @type {String} */
    words;
    constructor() {
        this.words = "";
    }

    addText(text) {
        if (text) {
            this.words += text;
            if (!this.words.endsWith(" ")) {
                this.words += " ";
            }
        }
    }

    replaceText(searchValue, replaceValue) {
        this.words.replace(searchValue, replaceValue);
        console.log("Removing: " + searchValue);
        console.log(this.words);
    }

}

export {TextState}