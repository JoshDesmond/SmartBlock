/** The program logic for static text analysis & labeling */
class Model {

    /**
     * TODO how to reference "document" as a link in JavaScriptDocs?
     * Counts how many words there are in the readable text of document
     * @return {Number} The word count of document
     */
    countWords() {
        const paragraphs = document.getElementsByTagName("p");
        let wordCount = 0;
        for (let i = 0; i < paragraphs.length; i++) {
            let words = paragraphs[i].innerText.split(" ");
            for (let j = 0; j < words.length; j++) {
                wordCount++;
            }
        }

        return wordCount;
    }
}

/** The GUI overlay shown when labeling sites */
class Views {

    /**
     * Creates a new View and appends the GUI to the tab associated with this script
     * @param {!Model} model The model object in use by the plugin.
     */
    constructor(model) {
        this._model = model;
        this.footerDiv = document.createElement('div');
        document.body.appendChild(this.footerDiv);

        this.footerDiv.id = 'LabelingFooter';
        this.footerDiv.style.position = 'fixed';
        this.footerDiv.style.width = '100%';
        this.footerDiv.style.bottom = '0';
        this.footerDiv.style.backgroundColor = 'black';
        this.footerDiv.style.opacity = '0.95';
        this.footerDiv.style.textAlign = 'center';
    }

    /**
     * Updates the footer to display the page's current word count.
     */
    displayWordCount() {
        const wordCount = this._model.countWords();
        const wordCountText = document.createElement('p');
        wordCountText.innerText = wordCount.toString();
        views.footerDiv.appendChild(wordCountText);
    }
}

const model = new Model();
const views = new Views(model);

views.displayWordCount();