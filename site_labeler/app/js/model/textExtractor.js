function extractText(body) {
    let text = "";
    body.querySelectorAll('*').forEach((el) => {

        text += " " + el.innerText;
    });
    console.log(text);
    return text;
}

export {extractText}