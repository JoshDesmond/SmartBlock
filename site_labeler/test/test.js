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
    it("Should extract words from simple p elements", (done) => {
        const options = { pretendToBeVisual: true }
        JSDOM.fromFile("./test/test_doc.html", options).then(dom => {
            const body = dom.window.document.body; // TODO, how do I import an HTML?
            const scraper = new TextScraper(body);
            assert.equal(scraper.extractText().includes("seventy"), true);
            done();
        });
    });

    it("Should have spaces between text from different elements", () => {
        // TODO
    });
});