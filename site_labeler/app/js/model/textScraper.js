
class TextScraper {

    constructor() {
    }

    ignorableTags = ["SCRIPT", "NOSCRIPT", "APPLET", "EMBED", "OBJECT", "PARAM", "HEAD",
        "META", "BASE", "STYLE", "DIALOG", "DATA", "FOOTER", "AUDIO", "SOURCE", "TRACK", "VIDEO",
        "IMG", "MAP", "AREA", "CANVAS", "PICTURE", "SVG", "TEXTAREA"];

    /**
     * Extracts the text from the body HTMLElement the instance of this class was made with.
     * @param {HTMLElement} element The tag to traverse for text extraction
     * @return {string} A single string containing the text of the document's body
     */
    extractText(element) {
        if (!element) {
            throw new TypeError();
        }
        let text = "";

        const nodes = element.querySelectorAll(':not(.SmartBlockPluginElement)');

        nodes.forEach((node) => {
            const tag = node.tagName;
            // Only select nodes with no children and that aren't in the ignorableTags list
            if (node.children.length === 0 && !this.ignorableTags.includes(tag)) {
                text += node.textContent + " ";
            }
        });


        console.log(this.cleanString(text));
        return this.cleanString(text);
    }

    /**
     * Fixes spacing and removes symbols
     * @param {String} text
     */
    cleanString(text) {
        text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove linebreaks
        text = text.toLowerCase();
        text = text.replace(/[./–;?!)(]/g, ' ');
        text = text.replace(/[^a-z0-9 ]/g, ''); // Remove all but alphanumerics
        text = text.replace(/ +(?= )/g, ''); // Remove sequences of spaces
        text = text.trim();
        return text;
    }


    /**
     * Converts a string of text into a dictionary of words by frequency
     * @param text A long string of text
     */
    getDictionary(text) {
        let dict = {};
        const splitText = text.split(' ');
        for (let s of splitText) {
            if (dict[s] === undefined) {
                dict[s] = 1;
            } else {
                dict[s] += 1;
            }
        }

        // Create items array from dict
        let items = Object.keys(dict).map(function (key) {
            return [key, dict[key]];
        });

        // Sort the array based on the second element of array, or dict value, (count)
        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        return items;
    }
}

export {TextScraper}