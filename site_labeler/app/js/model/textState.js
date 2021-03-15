/**
 * Stores the current state of textual analysis.
 */
class TextState {

    constructor() {
        /** The maximum number of words that will be analyzed on a given page */
        this.MAX_WORDS = 2000;
        /** @type {String} */
        this.words = "";
        this.wordCount = 0;
    }

    countWordsInString(string) {
        return string.split(/\s+/g).length;
    }

    addText(text) {
        if (typeof text !== 'string') { throw new TypeError() }
        if (this.words.length !== 0 && !this.words.endsWith(" ")) {
            this.words += " ";
        }

        this.wordCount += this.countWordsInString(text);
        if (text) {
            this.words += text;
        }
    }

    replaceText(searchValue, replaceValue) {
        if (typeof searchValue !== 'string') { throw new TypeError() }
        if (typeof replaceValue !== 'string') { throw new TypeError() }
        this.wordCount -= this.countWordsInString(searchValue);
        this.wordCount += this.countWordsInString(replaceValue);
        this.words.replace(searchValue, replaceValue);
        console.log("Removing: " + searchValue);
        console.log("Adding: " + replaceValue);
    }
}

export { TextState }