import { MutationController } from "../app/js/controllers/mutationController.js";
import { TextState } from "../app/js/model/textState.js";


describe('MutationController', () => {

    /** @type {MutationController} */
    let mutationController
    const textState = new TextState();

    before(() => {
        // Inject the test_doc's html into the live document
        document.body.innerHTML = __html__['test/test_doc.html'];

        // Add mutation observer to watch for future changes to text content of the page
        const config = {
            childList: true,
            subtree: true,
            characterData: true,
            characterDataOldValue: true,
            attributes: false,
        };
        mutationController = new MutationController(textState);
        const observer = new MutationObserver(mutationController.mutationCallback.bind(mutationController));
        observer.observe(document.body, config);
    });

    it("Should extract text when new text is added", (done) => {
        const wcBefore = textState.wordCount;

        // Add two new words to the document
        const newText = document.createElement('p');
        newText.innerHTML = "Adding This";
        document.body.appendChild(newText);

        sleep(5).then(() => {
            // Check that wordcount has increased by two
            const wcAfter = textState.wordCount;
            assert.equal(wcBefore + 2, wcAfter);
            done();
        });
    });

    it("Should avoid extracting text from .SmartBlockPluginElement elements");

});

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}