import {strict as assert} from 'assert';
import jsdom from 'jsdom';
import {TextScraper} from "../app/js/model/textScraper.js";
import {ModelState} from "../app/js/model/modelState.js";

const {JSDOM} = jsdom; // Suggested by documentation, what does this actually do?

describe('ModelState', () => {
    it("should create a new ModelState and apply vote", () => {
        const modelState = new ModelState();
        modelState.handleVote(2);
        assert.equal(modelState.primaryVote, 2);
    });

    it("ModelState without primary vote should be invalid", () => {
        const modelState = new ModelState();
        modelState.toggleFlags();
        modelState.handleVote(3);
        modelState.handleAmbiguous();
        assert.equal(modelState.isValidForSubmission(), false);
    });

    it("ModelState should be invalid for submission after clearing inputs", () => {
        const modelState = new ModelState();
        modelState.handleVote(3);
        modelState.resetState();
        assert.equal(modelState.isValidForSubmission(), false);
    });
});

describe('TextExtractor', () => {
    const textScraper = new TextScraper();

    it("Should extract the correct text from test document", (done) => {
        const options = {pretendToBeVisual: true};
        JSDOM.fromFile("./test/test_doc.html", options).then(dom => {
            // Extract text
            const body = dom.window.document.body;
            const text = textScraper.extractText(body);

            // Test for specific word in text
            assert.equal(text.includes("seventy"), true);

            // Test that the word count is exactly 72
            const wordCount = text.split(" ").length;
            assert.equal(wordCount, 72);

            // Test that ,'s and ...'s are stripped from the text
            assert.equal(text.includes("laboris"), true);
            assert.equal(text.includes("amet"), true);

            // Test that casing is lowered
            assert.equal(text.includes("column"), true);

            done();
        });
    });

    it("Should handle a non-breaking space ", (done) => {
        // TODO
        done();
        const element = "<p>hello&nbsp;world!</p>"; // should be two words
    });

    it("cleanString should remove sequences of spaces", (done) => {
        const cleanedText = textScraper.cleanString(" hello    world      hi ");
        assert.equal(cleanedText, "hello world hi");
        done();
    });
});