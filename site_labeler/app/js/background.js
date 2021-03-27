'use strict';

chrome.runtime.onInstalled.addListener(function () {
    console.log("Hello, World!");
    // Set labeler_active if undefined
    chrome.storage.local.get(['labeler_active'], function (result) {
        console.log(`labeler_active: ${result.labeler_active}`);
        if (result.labeler_active === undefined) {
            chrome.storage.local.set({ labeler_active: true },);
        }
    });
});


chrome.commands.onCommand.addListener(function (command) {

    console.log('Command:', command);
    if (command === "toggle-plugin-active") {
        chrome.storage.local.get(['labeler_active'], (result) => {
            const newVal = !result.labeler_active;
            chrome.storage.local.set({ labeler_active: newVal }, function () {
                console.log(`Toggling val to ${newVal}`);

                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { message: `${newVal ? "activate" : "disable"}` },);
                });
            });
        });
    }
});

/*
chrome.scripting.executeScript(
        {code: 'document.body.style.backgroundColor="orange"'});
*/
