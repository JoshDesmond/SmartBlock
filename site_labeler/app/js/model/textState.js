/**
 * Stores the current state of textual analysis.
 */
class TextState {

    /** @type {Number} */
    wordCount;
    /** @type {String} */
    words;

    constructor() {
        this.words = "";
        this.wordCount = 0;
    }

    countWordsInString(string) {
        return string.split(/\s+/g).length;
    }

    addText(text) {
        if (this.words.length !== 0 && !this.words.endsWith(" ")) {
            this.words += " ";
        }

        this.wordCount += this.countWordsInString(text);
        if (text) {
            this.words += text;
        }
    }

    replaceText(searchValue, replaceValue) {
        this.wordCount -= this.countWordsInString(searchValue);
        this.wordCount += this.countWordsInString(replaceValue);
        this.words.replace(searchValue, replaceValue);
        console.log("Removing: " + searchValue);
        console.log("Adding: " + replaceValue);
    }

}

export {TextState}