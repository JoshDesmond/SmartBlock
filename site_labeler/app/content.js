'use strict';

import {Model} from './js/model.js';
import {Views} from "./js/views.js";
import {KeydownController} from './js/keydownController.js';
import {AnalysisController} from "./js/analysisController.js";
import {FlagsController} from "./js/flagsController.js";


const model = new Model();
const views = new Views(model);

// Add controllers
const ac = new AnalysisController(model, views);
views.footerDiv.onclick = (() => ac.onClick());

const flagsController = new FlagsController(model, views);

// Add hotkeys
const keydownController = new KeydownController();
window.addEventListener('keydown', keydownController);

// Code below from: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = {childList: true, subtree: true};

let analyzedFlag = false;

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
    if (analyzedFlag) { // This check prevents an infinite analysis loop
        analyzedFlag = false;
        return;
    }
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            analyzedFlag = true;
            ac.analyze(); // Refresh word count
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
