import { Model } from "../model/model.js";

/**
 * Key listener for the standard labeling workflow.
 * @implements {EventListenerObject}
 */
export class VoteButtonController {

    /**
     * Creates a controller for a given voting button
     * @param model {Model} model object to control
     * @param index {Number} The index of the vote, starting at 0
     */
    constructor(model, index) {
        if (index < 0 || index > 3) throw new RangeError(`Illegal index ${index} given`);
        this.value = index + 1;
        this.model = model;
    }


    handleEvent(e) {
        this.model.modelState.handleVote(this.value);
    }
}