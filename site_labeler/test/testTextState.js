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

    it("Should handle out of order text removals", async () => {
        const ts= new TextState();
        await ts.addText("abc def");
        await ts.addText("abc");
        await ts.removeText("abc");
        await ts.removeText("abc def");
        assert.equal(ts.wordCount, 0);
    });

    it("Should handle out of order text removals with newlines", async () => {
        const ts= new TextState();
        await ts.addText("abc\ndef");
        await ts.addText("abc");
        await ts.removeText("abc");
        await ts.removeText("abc\ndef");
        assert.equal(ts.wordCount, 0);
    });

    it("Should throw an error when removing non-existing text", (done) => {
        assert.throws(() => { textState.removeText("fjfdkl") }, Error);
        done();
    });
});