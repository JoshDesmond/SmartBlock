import { TextScraper } from "../app/js/model/textScraper.js";
import { strict as assert } from 'assert';
import jsdom from 'jsdom';

const { JSDOM } = jsdom; // Suggested by documentation, what does this actually do?

describe('TextExtractor', () => {
    const textScraper = new TextScraper();

    it("Should extract the correct text from test document", (done) => {
        const options = { pretendToBeVisual: true }; // (resources: "usable" allows jsdom to load stylesheets)
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

    describe("test_display_none_doc", () => {
        let testDom, body;

        before(() => {
            const options = { pretendToBeVisual: true };
            return JSDOM.fromFile("./test/test_display_none_text.html", options).then((dom) => {
                testDom = dom;
                body = testDom.window.document.body;
            })
        });


        it("Should not extract text that has display: none", (done) => {
            const text = textScraper.extractText(body);

            // Test for specific word in text
            assert.equal(text.includes("hippy"), true);
            assert.equal(text.includes("boogy"), false);
            done();
        });

        it("Should not extract text whose parent has display: none", (done) => {
            const text = textScraper.extractText(body);

            assert.equal(text.includes("potato"), false);
            done();
        });


        it("Should not extract text whose parent's parent has display: none", (done) => {
            const text = textScraper.extractText(body);

            assert.equal(text.includes("hoot"), true);
            assert.equal(text.includes("toot"), false);
            done();
        });
    });

    it("Should extract text from wiki-like test document", (done) => {

        const options = { pretendToBeVisual: true };
        JSDOM.fromFile("./test/test_wiki_like.html", options).then(dom => {
            const body = dom.window.document.body;
            const text = textScraper.extractText(body);

            // Test for specific word in text
            assert.equal(text.includes("created"), true, "The text 'created' should be found");
            assert.equal(text.includes("1971"), true);
            assert.equal(text.includes("tony"), true);
            assert.equal(text.includes("australian"), true);
            done();
        });
    });

    it("Should handle a non-breaking space ", (done) => {
        // TODO
        const dom = new JSDOM(`<!DOCTYPE html><body><p>Hello&nbsp;world!</p></body>`); // should be two words

        const text = textScraper.extractText(dom.window.document.body);

        // Test that the word count is exactly 2
        const wordCount = text.split(" ").length;
        assert.equal(wordCount, 2);
        done();
    });

    it("cleanString should remove sequences of spaces", (done) => {
        const cleanedText = textScraper.cleanString(" hello    world      hi ");
        assert.equal(cleanedText, "hello world hi");
        done();
    });
});