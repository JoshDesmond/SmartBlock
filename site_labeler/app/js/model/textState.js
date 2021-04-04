import { cleanString } from "./textScraper.js";

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
        return (string.split(/\s+/g) || []).length;
    }

    /**
     * Adds new text to the given TextState.
     * @param {string} text Text to add
     */
    addText(text) {
        console.log(`Adding: ${text}`);
        if (typeof text !== 'string') { throw new TypeError() }
        if (this.words.length !== 0 && !this.words.endsWith(" ")) {
            this.words += " ";
        }

        this.wordCount += this.countWordsInString(text);
        if (text) {
            this.words += text;
        }
    }

    /**
     * Removes text from the given TextState. Fails if given text not part of this TextState.
     * @param {string} text Text to remove
     */
    removeText(text) {
        console.log(`Removing: ${text}`);
        if (typeof text !== 'string') { throw new TypeError() }

        if (!this.words.includes(text)) {
            throw new Error(`Attempting to remove text, \"${text}\", not part of words, ${this.words}`);
        }

        this.wordCount -= this.countWordsInString(text);
        this.words = this.words.replace(text, " ");
    }

    replaceText(searchValue, replaceValue) {
        if (typeof searchValue !== 'string') { throw new TypeError() }
        if (typeof replaceValue !== 'string') { throw new TypeError() }
        if (!this.words.includes(searchValue)) {
            throw new Error(`Attempting to replace text, \"${searchValue}\", not part of words, ${this.words}`);
        }
        this.wordCount -= this.countWordsInString(searchValue);
        this.wordCount += this.countWordsInString(replaceValue);
        this.words = this.words.replace(searchValue, replaceValue);
        console.log("Removing: " + searchValue);
        console.log("Adding: " + replaceValue);
    }

    /**
     * Outputs cleaned text.
     * @returns {String} the cleaned and formatted text of the document
     */
    getFormattedText() {
        return cleanString(this.words);
    }
}

export { TextState }