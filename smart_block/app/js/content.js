import {TextScraper} from "../../../site_labeler/app/js/model/textScraper.js";

// TODO see if you can make imports like this compile/build
const scraper = new TextScraper(document.body);
scraper.extractText(document.body);
