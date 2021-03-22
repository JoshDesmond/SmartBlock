import { extractText, cleanString } from "../app/js/model/textScraper.js";


describe('TextExtractor', () => {

    it("Should add spaces between text from seperate elements", (done) => {
        document.body.innerHTML = "<div><div><p>Hello</p></div><div><p>World!</p></div></div>";

        const text = cleanString(extractText(document.body));
        console.log(text.split(" "));
        assert.equal(text.split(" ").length, 2);
        done();
    });

    it("Should extract the correct text from test document", (done) => {
        document.body.innerHTML = __html__['test/test_doc.html'];

        // Extract text
        const text = cleanString(extractText(document.body));
        console.log(text);

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

    describe("Should handle hidden text", () => {

        before(() => {
            document.body.innerHTML = __html__['test/test_display_none_text.html'];
        })


        it("Should not extract text that has display: none", (done) => {
            const text = cleanString(extractText(document.body));

            // Test for specific word in text
            assert.equal(text.includes("hippy"), true);
            assert.equal(text.includes("boogy"), false);
            done();
        });

        it("Should not extract text whose parent has display: none", (done) => {
            const text = cleanString(extractText(document.body));

            assert.equal(text.includes("hippy"), true);
            assert.equal(text.includes("potato"), false);
            done();
        });


        it("Should not extract text whose parent's parent has display: none", (done) => {
            const text = cleanString(extractText(document.body));

            assert.equal(text.includes("hoot"), true);
            assert.equal(text.includes("toot"), false);
            done();
        });
    });

    describe("Should handle nested formatting tags", () => {

        before(() => {
            document.body.innerHTML = __html__['test/test_formatted_text.html'];
        });

        it("Should extract text with formatting tags", (done) => {
            const text = cleanString(extractText(document.body));

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
        document.body.innerHTML = `<p>Hello${String.fromCharCode(160)}world!</p>`; // should be two words 
        const text = cleanString(extractText(document.body));

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