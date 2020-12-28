import {TextScraper} from "../model/textScraper.js";
import {AnalysisController} from "./analysisController.js";

class MutationController {

    /**
     *
     * @param {Model} model
     * @param {AnalysisController} analysisController
     */
    constructor(model, analysisController) {
        this.model = model;
        this.ac = analysisController;
    }

    /**
     *
     * @implements MutationCallback
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     * @return {void}
     */
    mutationCallback(mutations, observer) {

        /**
         * - Text mutation
         * - ChildListMutation
         */

        const textScraper = new TextScraper();


        for (const mutation of mutations) {
            if (this.model.textState.wordCount > this.model.MAX_WORDS) {
                observer.disconnect();
                console.log("MAXWORDS reached, ending mutation observations");
                return;
            }
            if (mutation.type === "characterData") {
                const newText = textScraper.cleanString(mutation.target.data);
                if (mutation.oldValue) {
                    const old = textScraper.cleanString(mutation.oldValue);
                    this.model.textState.replaceText(old, newText);
                } else {
                    this.model.textState.addText(newText);
                }

            } else if (mutation.type === "childList") { // childList
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        this.model.textState.addText(textScraper.cleanString(node.textContent));
                    } else if (node.nodeType === Node.COMMENT_NODE) {
                        // Ignore it
                    } else {
                        // TODO there might still be issues with casting Node's to HTML elements
                        this.model.textState.addText(textScraper.extractText(node));
                    }
                });
                this.ac.analyze();
            } else {
                console.error(mutation.type);
                console.log(mutation);
            }
        }
    }
}

export {MutationController};