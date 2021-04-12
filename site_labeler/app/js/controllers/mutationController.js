import { extractText, isAllWhitespace, validateForExtraction } from "../model/textScraper.js";
import { TextState } from "../model/textState.js";

/**
 * @implements {MutationCallback}
 */
class MutationController {

    /**
     *
     * @param {TextState} textState
     */
    constructor(textState) {
        this.textState = textState;
    }

    /**
     * Function that is called when mutations occur.
     * 
     * When passed to the MutationObserver, this function must be bound to its MutationController instance in order
     * that `this` in the function below refers to this mutationController & its textState.
     * 
     * @param {MutationRecord[]} mutations
     * @param {MutationObserver} observer
     * @return {void}
     */
    mutationCallback(mutations, observer) {

        for (const mutation of mutations) {
            // First check if max word count has been reached and halt if so
            if (this.textState.wordCount > this.textState.MAX_WORDS) {
                observer.disconnect();
                console.log("MAXWORDS reached, ending mutation observations");
                return;
            }


            if (mutation.type === "characterData") { // When text changes in existing text
                if (validateForExtraction(mutation.target.parentElement) === false) {
                    continue;
                }

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
                console.log(mutation);
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (node.parentElement === null) {
                            console.log(`no parent found ${node}`);
                        }
                        if (validateForExtraction(node.parentElement)) {
                            this.textState.addText(node.nodeValue);
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        if (validateForExtraction(node)) {
                            this.textState.addText(extractText(node));
                        }
                    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                        console.error(`Unexpected Attribute mutation ${node}`);
                    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        console.error(`TODO, handle document fragments like: ${node}`);
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // No validation as the element has no parent as it is now removed
                        this.textState.removeText(node.nodeValue);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // TODO This might be buggy as the computed style of a removed node is ambiguous
                        if (validateForExtraction(node)) {
                            this.textState.removeText(extractText(node));
                        }
                    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                        console.error(`Unexpected Attribute mutation ${node}`);
                    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        console.error(`TODO, handle document fragments like: ${node}`);
                    }
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