function extractText(body) {
    const words = {};
    body.textContent
        .trim()
        .split(/\s/)
        .filter(x => !~x.search(/[\d\W\s]/))
        .forEach(word => words[word] = word);
    console.log(words);
    return words;
}

export {extractText}