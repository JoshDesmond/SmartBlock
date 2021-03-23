import { MutationController } from "../app/js/controllers/mutationController.js";
import { TextState } from "../app/js/model/textState.js";
import { extractText } from "../app/js/model/textScraper.js";


describe('MutationController', () => {

    /** @type {MutationController} */
    let mutationController
    const textState = new TextState();

    before(() => {
        // Inject the test_doc's html into the live document. Syntax is from the html2js plugin.
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
        textState.addText(extractText(document.body));
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

    it("Should avoid extracting text from .SmartBlockPluginElement elements", (done) => {
        // Mutate text on the footer
        const button = document.body.querySelector('.footerButton');
        button.nodeValue += " chickenz";

        sleep(5).then(() => {
            // Check that chickenz wasn't added to text state
            const text = textState.getFormattedText();
            assert.isFalse(text.includes("chickenz"));
            done();
        });
    });

    it("Should handle Node.TEXT_NODE childlist mutations");

    it("Should handle characterData mutations");

    it("Should add spaces between text from seperate elements if multiple are added at once");
});

/**
 * 
 * @param {Number} time Time in millaseconds to sleep
 * @returns {Promise} promise that resolves after sleeping
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}