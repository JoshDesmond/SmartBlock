import {TextScraper} from "../model/textScraper.js";


/**
 *
 * @implements MutationCallback
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 * @return {void}
 */
function MutationController(mutations, observer) {

    /**
     * - Text mutation
     * - ChildListMutation
     */

    console.log(observer);
    let x = 0;
    for (const mutation of mutations) {
        if (mutation.type === "characterData") {
            if (mutation.oldValue) {
                console.log("Removing:" + mutation.oldValue);
            }



        } else if (mutation.type === "childList") { // childList
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Text) {
                    // parse node.data
                } else {
                    const textScraper = new TextScraper(node);
                    console.log(textScraper.extractText());
                }
            });
        } else {
            console.error(mutation.type);
            console.log(mutation);
        }

        //console.log(mutation);
    }

    // TODO if wordCount > maxwords,
    // observer.disconnect

}

export {MutationController};