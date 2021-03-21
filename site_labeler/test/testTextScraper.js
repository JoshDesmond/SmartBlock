import { extractText, cleanString } from "../app/js/model/textScraper.js";
import { strict as assert } from 'assert';
import jsdom from 'jsdom';

// The following snippet allows text extract to check instanceof HTMLElement without causing
// ReferenceError: HTMLElement is not defined
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

const { JSDOM } = jsdom; // Suggested by documentation, what does this actually do?

// TODO consider using JSDOM's fragment class instead of full on dom emulation for efficiency

describe('TextExtractor', () => {

    it("Should extract the correct text from test document", (done) => {
        const options = { pretendToBeVisual: true }; // (resources: "usable" allows jsdom to load stylesheets)
        JSDOM.fromFile("./test/test_doc.html", options).then(dom => {
            // Extract text
            const body = dom.window.document.body;
            const text = cleanString(extractText(body));

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

    describe("Should handle hidden text", () => {
        let testDom, body;

        before(() => {
            const options = { pretendToBeVisual: true };
            return JSDOM.fromFile("./test/test_display_none_text.html", options).then((dom) => {
                testDom = dom;
                body = testDom.window.document.body;
            })
        });


        it("Should not extract text that has display: none", (done) => {
            const text = cleanString(extractText(body));

            // Test for specific word in text
            assert.equal(text.includes("hippy"), true);
            assert.equal(text.includes("boogy"), false);
            done();
        });

        it("Should not extract text whose parent has display: none", (done) => {
            const text = cleanString(extractText(body));

            assert.equal(text.includes("hippy"), true);
            assert.equal(text.includes("potato"), false);
            done();
        });


        it("Should not extract text whose parent's parent has display: none", (done) => {
            const text = cleanString(extractText(body));

            assert.equal(text.includes("hoot"), true);
            assert.equal(text.includes("toot"), false);
            done();
        });
    });

    describe("Should handle nested formatting tags", () => {

        let body;

        before(() => {
            const options = { pretendToBeVisual: true };
            return JSDOM.fromFile("./test/test_formatted_text.html", options).then(dom => {
                body = dom.window.document.body;
            });
        });

        it("Should extract text with formatting tags", (done) => {
            const text = cleanString(extractText(body));

            // <!-- Text with single formatting element -->
            assert.equal(text.includes("world"), true);
            // <!-- Text with two formatting elements -->
            assert.equal(text.includes("planet"), true);
            // <!-- Text formatted with a span element -->
            assert.equal(text.includes("spam"), true);
            assert.equal(text.includes("meat"), true);
            done();
        });
    });

    it("Should handle a non-breaking space ", (done) => {
        const dom = new JSDOM(`<!DOCTYPE html><body><p>Hello&nbsp;world!</p></body>`); // should be two words

        const text = cleanString(extractText(dom.window.document.body));

        // Test that the word count is exactly 2
        const wordCount = text.split(" ").length;
        assert.equal(wordCount, 2);
        done();
    });

    it("cleanString should remove sequences of spaces", (done) => {
        const cleanedText = cleanString(" hello    world      hi ");
        assert.equal(cleanedText, "hello world hi");
        done();
    });
});