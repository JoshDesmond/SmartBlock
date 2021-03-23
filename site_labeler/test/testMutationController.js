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

    it("Should extract new text from a childlist mutation", (done) => {
        // Add two new words to the document via childlist mutation
        const newText = document.createElement('p');
        newText.innerHTML = "bruce lee";
        document.body.appendChild(newText);

        sleep(5).then(() => {
            // Check that "Adding This" was added to its text
            const formattedText = textState.getFormattedText();
            assert.isTrue(formattedText.includes('bruce'));
            assert.isTrue(formattedText.includes('lee'));
            done();
        });
    });

    it("Should not extract from characterData mutations to .SmartBlockPluginElement elements", (done) => {
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

    it("Should handle childList mutations to Node.TEXT_NODE nodes.", (done) => {
        // Find a text element, confirm its status in textState
        const el = document.body.querySelector('p');
        const oldText = el.innerText;
        assert.isTrue(textState.words.includes(oldText));

        // Cause a childlist mutation
        const newText = "charles darwin";
        el.innerText = newText;

        sleep(5).then(() => {
            // Check that newText was added and oldText removed
            assert.isTrue(textState.words.includes(newText));
            assert.isFalse(textState.words.includes(oldText));
            done();
        });
    });

    it("Should handle characterData mutations");

    it("Should add spaces between text from seperate elements if multiple are added at once");

    it("Should not duplicate text when handling childlist mutations to elements with children")
});

/*
 * Note that changing an elements nodeValue causes a characterData mutation, while 
 * changing its innerText or innerHtml causes a childlist mutation with a node of type Text
 */

/**
 * 
 * @param {Number} time Time in millaseconds to sleep
 * @returns {Promise} promise that resolves after sleeping
 */
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}