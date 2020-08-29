'use strict';

import {Model, FLAG_NAMES} from './model/model.js';
import {Views} from './views/views.js';
import {KeydownController} from './controllers/keydownController.js';
import {AnalysisController} from './controllers/analysisController.js';
import {VoteButtonController} from './controllers/voteButtonController.js'
import {CertaintyButtonController} from "./controllers/certaintyButtonController";

const model = new Model();
const views = new Views(model);

// Add controllers
views.votingButtons.forEach((button, index) => {
    button.addEventListener('click', new VoteButtonController(model, index));
});

views.otherButtons.forEach((button) => {
    button.addEventListener('click', new CertaintyButtonController(model));
});


// TODO figure out what you want to do with this analysis controller thingy
const ac = new AnalysisController(model, views);
views.footerDiv.onclick = (() => views.createSuccessToast("Hello"));

// Add hotkeys
const keydownController = new KeydownController(model, views);
window.addEventListener('keydown', keydownController);

// Observe the document for mutations, and trigger analysis on mutation
// Code below from: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the html node that will be observed for mutations
const targetNode = document.body;
// Options for the observer (which mutations to observe)
const config = {childList: true, subtree: true};
let analyzedFlag = false; // to prevent infinite loops
let readyForAnalysis = true; // to rate limit analysis

// Callback function to execute when mutations are observed
const mutationCallback = function (mutationsList, observer) {
    /**
     * TODO create a method that causes the cessation of analysis
     * TODO refactor into controller
     */

    console.log("Mutation observed, running investigation");
    /** Check the type of mutation to see if there was a childList mutation */
    let wasThereAChildListMutation = false;
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            wasThereAChildListMutation = true;
        }
    }
    if (wasThereAChildListMutation === false) {
        console.log("False alarm");
        return;
    } else {
        console.log("There was a childList mutation"); // TODO temp
    }

    if (model.getLatestWordCount() > model.MAX_WORDS) {
        console.log("Maxwords already reached, halting analysis");
        return;
    }

    if (model.voteAlreadySubmitted) {
        console.log("Vote already submitted, halting analysis")
    }

    /**
     * If the document is not ready, wait at least 1000ms since the last analysis before running
     * analysis again.
     */
    if (document.readyState !== "complete" && readyForAnalysis === false) {
        console.log("Skipping analysis because readyForAnalysis is false and the Document no rdy");
        setTimeout(() => {
            readyForAnalysis = true
        }, 1000);
        return;
    }

    /**
     * If the analyzed flag is true, (-> analysis was just run), then halt any analysis on this
     * invocation, as running analysis can trigger a mutation in the document and
     * would therefore continue to trigger analysis in an infinite loop.
     *
     * // TODO this logic currently prevents every other invocation of analysis, and might
     * // potentially prevent the last ?
     */
    if (analyzedFlag) {
        console.log("Skipping analysis was just run");
        analyzedFlag = false;
        return;
    }

    if (document.readyState !== "complete") {
        console.log("Turning readyForAnalysis back off since document no rdy");
        readyForAnalysis = false;
    }
    console.log("Running analysis and toggling on the analyzed flag");
    analyzedFlag = true;
    ac.analyze();
};

const observer = new MutationObserver(mutationCallback);
observer.observe(targetNode, config);