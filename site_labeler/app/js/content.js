'use strict';

import {Model} from './model/model.js';
import {Views} from './views/views.js';
import {KeydownController} from './controllers/keydownController.js';
import {VoteButtonController} from './controllers/voteButtonController.js'
import {CertaintyButtonController} from "./controllers/certaintyButtonController";
import {MutationController} from "./controllers/mutationController.js";

const model = new Model();
const views = new Views(model);

// Add controllers
views.votingButtons.forEach((button, index) => {
    button.addEventListener('click', new VoteButtonController(model, index));
});

views.otherButtons.forEach((button) => {
    button.addEventListener('click', new CertaintyButtonController(model));
});

views.footerDiv.addEventListener('click', () => {
    console.log(model.textScraper.getDictionary(model.textState.words));
});

// Add hotkeys
const keydownController = new KeydownController(model, views);
window.addEventListener('keydown', keydownController);
model.textState.addText(model.textScraper.extractText(document.body));

// Add mutation observer
const config = {
    childList: true,
    subtree: true,
    characterData: true,
    characterDataOldValue: true,
    attributes: false,
};
const mc = new MutationController(model);
const targetNode = document.body;
const observer = new MutationObserver(mc.mutationCallback.bind(mc));
observer.observe(targetNode, config);

