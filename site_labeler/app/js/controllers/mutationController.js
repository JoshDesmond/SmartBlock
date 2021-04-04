import { extractText } from "../model/textScraper.js";
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

            // Ignore changes to plugin-elements
            if (mutation.target.parentNode.classList.contains("SmartBlockPluginElement")) {
                continue;
            }


            if (mutation.type === "characterData") { // When text changes in existing text
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
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (!isAllWhitespace(node)) { // Ignore formatting textnodes
                            this.textState.addText(node.nodeValue); // TODO this should use extract text
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        this.textState.addText(extractText(node));
                    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                        console.error(`Unexpected Attribute mutation ${node}`);
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (!isAllWhitespace(node)) { // Ignore formatting textnodes
                            this.textState.removeText(node.nodeValue); // TODO this should use extract text
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        this.textState.removeText(extractText(node));
                    } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
                        console.error(`Unexpected Attribute mutation ${node}`);
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

/**
 * Returns true if the given textNode is all whitespace characters
 */
function isAllWhitespace(textNode) {
    if (!textNode instanceof Node) {
        throw new TypeError();
    }
    return !(/[^\t\n\r ]/.test(textNode.textContent));
}

// See https://dom.spec.whatwg.org/#mutationrecord when refactoring

export { MutationController };