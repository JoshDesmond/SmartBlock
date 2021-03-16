import { MutationController } from "../app/js/controllers/mutationController.js";
import { strict as assert } from 'assert';
import jsdom from 'jsdom';
import { TextState } from "../app/js/model/textState.js";

const { JSDOM } = jsdom;

describe('MutationController', () => {
    const textState = new TextState();

    /** @type {Document} */
    let document;
    /** @type {jsdom.JSDOM} */
    let testDom;
    /** @type {MutationController} */
    let mutationController

    before(() => {
        console.log("Hello");
        const options = { pretendToBeVisual: true };
        return JSDOM.fromFile("./test/test_doc.html", options).then((dom) => {
            testDom = dom;
            document = testDom.window.document;

            // Add mutation observer to watch for future changes to text content of the page
            const config = {
                childList: true,
                subtree: true,
                characterData: true,
                characterDataOldValue: true,
                attributes: false,
            };
            mutationController = new MutationController(textState);
            const observer = new dom.window.MutationObserver(mutationController.mutationCallback.bind(mutationController));
            console.log(`Observer: ${observer}`);
            observer.observe(document.body, config);
        })
    });

    it("Should extract text when new text is added", (done) => {
        const wcBefore = textState.wordCount;

        // Add two new words to the document
        testDom.window.document.createElement
        const newText = document.createElement('p');
        newText.innerHTML = "Adding This";
        document.body.appendChild(newText);

        // Check that wordcount has increased by two
        const wcAfter = textState.wordCount;
        assert.equal(wcBefore + 2, wcAfter);

        done();
    });
});