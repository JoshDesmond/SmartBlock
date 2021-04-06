import { TextState } from "../app/js/model/textState.js";

describe('TextState', () => {

    /** @type {TextState} */
    let textState;

    before(() => {
        textState = new TextState();
    });

    it("Should increase word count given text to add", async () => {
        const wcBefore = textState.wordCount;
        await textState.addText("Hello World!");
        assert.equal(textState.wordCount, wcBefore + 2);
    });

    it("Should not increase word count for adding empty strings", async () => {
        const wcBefore = textState.wordCount;
        await textState.addText("");
        assert.equal(textState.wordCount, wcBefore);
    });
});