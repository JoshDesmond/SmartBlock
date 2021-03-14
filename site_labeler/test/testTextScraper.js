import { TextScraper } from "../app/js/model/textScraper.js";
import { strict as assert } from 'assert';
import jsdom from 'jsdom';

const { JSDOM } = jsdom; // Suggested by documentation, what does this actually do?

describe('TextExtractor', () => {
    const textScraper = new TextScraper();

    it("Should extract the correct text from test document", (done) => {
        const options = { pretendToBeVisual: true };
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

    it("Should not extract text that has display: none", (done) => {
        const options = { pretendToBeVisual: true };
        JSDOM.fromFile("./test/test_display_none_text.html", options).then(dom => {
            const body = dom.window.document.body;
            const text = textScraper.extractText(body);

            // Test for specific word in text
            assert.equal(text.includes("visible"), true);
            assert.equal(text.includes("invisible"), false);
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

    it("Should extract text correctly from wikipedia document", (done) => {
        const options = { pretendToBeVisual: true };
        JSDOM.fromURL("https://en.wikipedia.org/w/index.php?title=Catwalk_(Australian_TV_series)&oldid=978884033", options).then(dom => {
            // Extract text
            const body = dom.window.document.body;
            const text = textScraper.extractText(body);

            // Test for specific words in text
            assert.equal(text.includes("created"), true, "The text 'created' should be found");
            assert.equal(text.includes("oldid978884033"), false, "The text oldid978... should" +
                " not be found");
            assert.equal(text.includes("oldid"), false, "The text oldid should not be found");
            assert.equal(text.includes("978884033"), false, "The text 978.. should not be found");

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