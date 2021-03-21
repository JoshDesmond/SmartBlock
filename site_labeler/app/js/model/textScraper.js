const ignorableTags = ["SCRIPT", "NOSCRIPT", "APPLET", "EMBED", "OBJECT", "PARAM", "HEAD",
    "META", "BASE", "STYLE", "DIALOG", "DATA", "FOOTER", "AUDIO", "SOURCE", "TRACK", "VIDEO",
    "IMG", "MAP", "AREA", "CANVAS", "PICTURE", "SVG", "TEXTAREA"];
const formattingTags = ["B", "STRONG", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP"];


/**
 * Extracts the text from the given HTMLElement
 * @param {HTMLElement} element The tag to extract text from
 * @return {string} A single string containing the text of the element. Uses .innerText 
 */
function extractText(element) {
    if (!element || !(element instanceof HTMLElement)) {
        throw new TypeError(`Cannot extract text from given element ${element}`);
    }

    /**
     * If an element is the body, return the innerText of all its children except
     * .SmartBlockPluginElement elements. Otherwise, just return the elements innerText
     */
    if (element.tagName.toUpperCase() === "BODY") {
        let text = "";
        for (const node of element.children) {
            // Select the children but ignore the .SmartBlockPluginElement
            if (node.classList.contains(".SmartBlockPluginElement")) {
                continue;
            }

            console.log(node.innerText);
            text += node.innerText + " ";
        }

        return text;
    } else {
        if (element.classList.contains(".SmartBlockPluginElement")) {
            throw new TypeError(`A SmartBlockPluginElement, ${element}, was passed into extractText().`);
        }

        return element.innerText;
    }
}


/**
 * Fixes spacing and removes symbols
 * @param {String} text
 */
function cleanString(text) {
    if (typeof text !== 'string') { throw new TypeError() }
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
 * @param {String} text A long string of text
 */
function getDictionary(text) {
    if (typeof text !== 'string') { throw new TypeError() }
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

export { getDictionary, extractText, cleanString }