class TextScraper {

    /**
     * @param {HTMLElement} body
     */
    constructor(body) {
        this.body = body;
        // TODO set up on listen events
    }

    ignorableTags = ["SCRIPT", "NOSCRIPT", "APPLET", "EMBED", "OBJECT", "PARAM", "HEAD",
        "META", "BASE", "STYLE", "DIALOG", "DATA", "FOOTER", "AUDIO", "SOURCE", "TRACK", "VIDEO",
        "IMG", "MAP", "AREA", "CANVAS", "PICTURE", "SVG", "TEXTAREA"];

    extractText() {
        let text = "";
        /**
         * Iterate through all nodes, ignoring script, noscript, applet, embed, object, param,
         * head, meta, base, style, dialog, data, (footer?), audio, source, track, video, img,
         * map, area, canvas, picture, svg, textarea
         */

        const nodes = this.body.querySelectorAll('*');

        nodes.forEach((node) => {
            const tag = node.tagName;
            if (node.children.length === 0 && !this.ignorableTags.includes(tag)) {
                text += node.textContent + " ";  //    add its text to the result
            }
        });


        text = text.trim();
        text = text.replace(/(\r\n|\n|\r)/gm, "");
        text = text.replace(/ +(?= )/g, '');
        return text;
    }
}

export {TextScraper}