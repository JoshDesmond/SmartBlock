import { extractText } from "../model/textScraper.js";
import { TextState } from "../model/textState.js";

class MutationController {

    /**
     *
     * @param {TextState} textState
     */
    constructor(textState) {
        this.textState = textState;
    }

    /**
     *
     * @implements MutationCallback
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     * @return {void}
     */
    mutationCallback(mutations, observer) {

        for (const mutation of mutations) {
            // TODO Ignore mutations from .SmartBlockPluginElement elements

            // First check if max word count has been reached and halt if so
            if (this.textState.wordCount > this.textState.MAX_WORDS) {
                observer.disconnect();
                console.log("MAXWORDS reached, ending mutation observations");
                return;
            }

            if (mutation.type === "characterData") { // When text changes in existing text
                console.log()
                const newText = mutation.target.data;
                if (mutation.oldValue) {
                    const old = mutation.oldValue;
                    this.textState.replaceText(old, newText);
                } else {
                    this.textState.addText(newText);
                }
            }

            /** 
             * // TODO I think the logic below will duplicate its work on nodes and end up doubles of text.
             * This hypothesis requires testing.
             * 
             * The corrected logic will need to consider wonky nests of divs, spans, and text
             */
            else if (mutation.type === "childList") { // When html elements are added/removed
                mutation.addedNodes.forEach((node) => {
                    this.textState.addText(extractText(node));
                });

                mutation.removedNodes.forEach((node) => {
                    // TODO
                });
            }

            else {
                console.error(mutation.type);
                console.log(mutation);
            }
        }
    }
}

// See https://dom.spec.whatwg.org/#mutationrecord when refactoring

export { MutationController };