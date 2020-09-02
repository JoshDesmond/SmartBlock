
class TextScraper {

    /**
     * @param {HTMLElement} body
     */
    constructor(body) {
        this.body = body;
        // TODO set up on listen events
    }

    extractText() {
        let text = "";
        this.body.querySelectorAll('*').forEach((el) => {
            text += " " + el.textContent;
        });
        return text;
    }
}

export {TextScraper}