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

    it("Should extract new text from a childlist mutation", async () => {
        // Add two new words to the document via childlist mutation
        const newText = document.createElement('p');
        newText.innerHTML = "bruce lee";
        document.body.appendChild(newText);

        // Check that "Adding This" was added to its text
        await sleep(5);
        const formattedText = textState.getFormattedText();
        assert.isTrue(formattedText.includes('bruce'));
        assert.isTrue(formattedText.includes('lee'));
    });

    it("Should not extract from characterData mutations to .SmartBlockPluginElement elements", async () => {
        // Mutate text on the footer
        const button = document.body.querySelector('.footerButton');
        button.firstChild.nodeValue += " chickenz";

        // Check that chickenz wasn't added to text state
        await sleep(5);
        const text = textState.getFormattedText();
        assert.isFalse(text.includes("chickenz"));
    });

    it("Should handle childList mutations to Node.TEXT_NODE nodes.", async () => {
        // Find a text element, confirm its status in textState
        const el = document.body.querySelector('p');
        const oldText = el.innerText.toString();
        assert.isTrue(textState.words.includes(oldText));

        // Cause a childlist mutation
        const newText = "charles darwin";
        el.innerText = newText.toString();

        // Check that newText was added and oldText removed
        await sleep(5);
        assert.isTrue(textState.words.includes(newText));
        assert.isFalse(textState.words.includes(oldText));
    });

    it("Should handle characterData mutations", async () => {
        const el = document.body.querySelector('h3');
        el.firstChild.nodeValue += " draven";

        // Check that draven was added to text state and the original header text too
        await sleep(5);
        assert.isTrue(textState.words.includes("draven"));
        assert.isTrue(textState.words.includes("1"));
    });

    it("Should add spaces between text from seperate elements if multiple are added at once", async () => {
        // <div><div><span>it be like it do, moo</span></div><div><button>mendicant</button></div></div>
        const div = document.createElement('div');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const textNode = document.createTextNode("it be like it do, moo");
        const button = document.createElement('button');
        button.innerText = "mendicant";
        const span = document.createElement('span');

        div.append(div1, div2);
        div1.append(span);
        span.append(textNode);
        div2.append(button);
        document.body.appendChild(div);

        await sleep(5);
        assert.isTrue(textState.words.includes("it be like it do, moo"));
        assert.isTrue(textState.words.includes("mendicant"));
        assert.isTrue(textState.getFormattedText().includes(" moo"));
        assert.isTrue(textState.getFormattedText().includes(" mendicant"));
    });

    it("Should not duplicate text when handling childlist mutations to elements with children", async() => {

    });

    it.skip("Should add spaces between buttons on the same div when added together", async () => {
        /**
         * node.innerText doesn't currently support this, so for now, this test is failing.
         * <div><button>epistomology</button><button>ontology</button></div>
         */
        const div = document.createElement('div');

        const button1 = document.createElement('button');
        const button2 = document.createElement('button');
        button1.innerText = "epistomology";
        button2.innerText = "ontology";

        div.append(button1, button2);
        document.body.appendChild(div);

        await sleep(5);
        assert.isTrue(textState.getFormattedText().includes(" epistomology"));
        assert.isTrue(textState.getFormattedText().includes(" ontology"));
    });

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