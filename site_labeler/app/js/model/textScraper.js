
class TextScraper {
    constructor(body) {
        this.body = body;
        // TODO set up on listen events
    }

    extractText() {
        let text = "";
        this.body.querySelectorAll('*').forEach((el) => {
            text += " " + el.innerText;
        });
        console.log(text);
        return text;
    }
}

export {TextScraper}