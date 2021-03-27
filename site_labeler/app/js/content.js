'use strict';

import { Model } from './model/model.js';
import { Views } from './views/views.js';
import { KeydownController } from './controllers/keydownController.js';
import { VoteButtonController } from './controllers/voteButtonController.js'
import { CertaintyButtonController } from "./controllers/certaintyButtonController.js";
import { MutationController } from "./controllers/mutationController.js";
import { UrlChangeController } from './controllers/urlChangeController.js';
import { extractText, getDictionary } from './model/textScraper.js';

function run() {
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
        console.log(getDictionary(model.textState.words));
    });

    // Add hotkeys
    const keydownController = new KeydownController(model, views);
    window.addEventListener('keydown', keydownController);

    // Creates & configures mutation observer to watch for future changes to text
    const config = {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
        attributes: false,
    };
    const mc = new MutationController(model.textState);
    const targetNode = document.body;
    // The mutation observer will call mc.mutationcallback() on events, 
    // and when called, the functions 'this' will be bound to the context of mc itself
    const observer = new MutationObserver(mc.mutationCallback.bind(mc));

    // Run an initial text analysis
    model.textState.addText(extractText(document.body));

    // Runs the mutation observer
    observer.observe(targetNode, config);

    // Add controller to watch for URL changes
    const urlChangeController = new UrlChangeController(model);
    window.addEventListener('hashchange', urlChangeController, true);
}

function stop() {
    // TODO
    console.log("Stopping execution, TODO");
}

function activeLabeler() {
    console.log("Go");
    run();
}

function disableLabeler() {
    console.log("End");
    stop();
}

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.message == "activate") {
        activeLabeler();
    } else if (request.message == "disable") {
        disableLabeler();
    }
});

chrome.storage.local.get(['labeler_active'], (result) => {
    if (result.labeler_active) {
        run();
    }
});