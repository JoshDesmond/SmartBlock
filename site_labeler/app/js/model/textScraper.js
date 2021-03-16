const ignorableTags = ["SCRIPT", "NOSCRIPT", "APPLET", "EMBED", "OBJECT", "PARAM", "HEAD",
    "META", "BASE", "STYLE", "DIALOG", "DATA", "FOOTER", "AUDIO", "SOURCE", "TRACK", "VIDEO",
    "IMG", "MAP", "AREA", "CANVAS", "PICTURE", "SVG", "TEXTAREA"];
const formattingTags = ["B", "STRONG", "I", "EM", "MARK", "SMALL", "DEL", "INS", "SUB", "SUP"];



/**
 * Extracts the text from the body HTMLElement the instance of this class was made with.
 * @param {HTMLElement} element The tag to traverse for text extraction
 * @return {string} A single string containing the text of the document's body
 */
function extractText(element) {
    if (!element) {
        throw new TypeError();
    }
    let text = "";

    // TODO querySelectorAll does not include the root element itself. This is fine for body, but not when passing in <p> elements!
    const nodes = element.querySelectorAll(':not(.SmartBlockPluginElement):not([style*="display:none"]):not([style*="display: none"])');

    // TODO use functional programming to iteratively descend and find textual trees, and
    //  only count the entire content of those tree's once to be parsed for text
    // TODO edit: scratch that, just use document.body.innertext for the first round
    for (const node of nodes) {
        const tag = node.tagName;

        // Only select nodes that aren't in the ignorableTags or formatting list
        if (ignorableTags.includes(tag) || formattingTags.includes(tag)) {
            continue;
        }

        if (isTextualLeaf(node)) {
            text += node.textContent + " ";
        }
    }

    console.log(cleanString(text));
    return cleanString(text);
}

/**
 * Determines if the node is a textual leaf. A textual leaf contains only children nodes
 * that are formatting elements, (or no children at all).
 * @param {HTMLElement} element The node to inspect
 */
function isTextualLeaf(element) {
    if (!element) { throw new TypeError(); }
    if (ignorableTags.includes(element.tagName)) {
        return false;
    }

    if (element.children.length === 0) {
        return true;
    }

    for (const node of element.children) {
        if (!isFormattingLeaf(node)) {
            return false;
        }
    }

    return true;
}

function isFormattingLeaf(element) {
    if (!element) { throw new TypeError(); }
    if (formattingTags.includes(element.tagName)) {
        return true;
    } else if (element.tagName === "SPAN") {
        console.log("Ignoring SPAN element");
        // TODO, iterate through all children and return true if they are all formatting leaves
        return false; // For now text formatted with Span will be ignored.
    } else if (element.tagName === "A") { // Handle text with embedded links
        return true;
        // TODO this will currently double count links I believe?, as they aren't ignored
    }

    return false;
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

export { getDictionary, extractText, cleanString}