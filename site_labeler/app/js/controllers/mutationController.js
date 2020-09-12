/**
 *
 * @implements MutationCallback
 * @param {MutationRecord[]} mutations
 * @param {MutationObserver} observer
 * @return {void}
 */
function MutationController(mutations, observer) {

    console.log(document.readyState);

    console.log(observer);
    for (const mutation of mutations) {
        console.log(document.readyState);
        console.log(mutation);
    }

    // TODO if wordCount > maxwords,
    // observer.disconnect

}

export {MutationController};