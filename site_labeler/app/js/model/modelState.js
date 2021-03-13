/**
 * The ModelState contains all of the observable state information used in the labeling workflow.
 *
 * Implements Observable
 */
class ModelState {


    constructor() {
        this.observers = [];
        /** Status of individual flags. Flag names are given by FLAG_NAMES */
        this.flags = [false, false, false, false];
        /** True when flag-mode is enabled */
        this.flagState = false;
        /** True when the isObvious toggle is enabled. Exclusive in relation to isAmbiguousState. */
        this.isObviousState = false;
        /** True when the isAmbiguous toggle is enabled. Exclusive in relation to isObviousState. */
        this.isAmbiguousState = false;
        /** @type {?Number} Primary vote on a page. Required for submission(?) */
        this.primaryVote = null;
        /** @type {?Number} */
        this.secondaryVote = null;
    }

    /** Clears any votes and disables all flags */
    resetState(callback) {
        this.flagState = false;
        this.flags = [false, false, false, false];
        this.isObviousState = false;
        this.isAmbiguousState = false;
        this.primaryVote = null;
        this.secondaryVote = null;
        this.update();
        if (typeof callback === "function") callback();
    }

    /** Handles a voting action.
     *
     * This can either update the primary or secondary vote, depending on the
     * flagState
     *
     * @param {number} vote The value of the vote, must be between 1 and 4
     **/
    handleVote(vote) {
        if (vote < 1 || vote > 4) {
            throw RangeError(`Illegal vote value ${vote} given`);
        }

        if (this.flagState === false) {
            this.primaryVote = vote;
        } else {
            this.secondaryVote = vote;
        }

        this.update();
    }

    handleFlag(flagNumber) {
        if (flagNumber >= this.flags.length || flagNumber < 0) {
            throw RangeError(`Illegal flag number value ${flagNumber}`);
        }
        this.flags[flagNumber] = !this.flags[flagNumber];
        this.update();
    }

    /** Toggles the status of isAmbiguousState */
    handleAmbiguous() {
        this.isAmbiguousState = !this.isAmbiguousState;
        if (this.isAmbiguousState && this.isObviousState) {
            this.isObviousState = false; // Ensure mutual exclusivity
        }
        this.update();
    }

    /** Toggles the status of isObviousState */
    handleObvious() {
        this.isObviousState = !this.isObviousState;
        if (this.isObviousState && this.isAmbiguousState) {
            this.isAmbiguousState = false; // Ensure mutual exclusivity
        }
        this.update();
    }

    /**
     * Toggles the status of flag-mode. Flag mode allows for the setting of flags
     * and for secondary voting
     */
    toggleFlags() {
        this.flagState = !this.flagState;
        this.update();
    }

    /**
     * @return true if a primary vote has been submitted and there is no illegal configuration
     */
    isValidForSubmission() {
        if (this.primaryVote === null) return false;
        if (this.secondaryVote === this.primaryVote) return false;
        return !(this.isAmbiguousState && this.isObviousState);
    }

    /**
     * Registers a new observer to be notified on all update actions.
     *
     * @param observer An object which implements the notify() method, called any time the model
     * updates
     */
    registerObserver(observer) {
        if (!observer) {
            throw new TypeError(`Illegal observer passed ${observer}`);
        }
        this.observers.push(observer);
    }

    /** Notify all observers of a change by calling their notify() method's*/
    update() {
        for (let observer of this.observers) {
            observer.notify();
        }

        console.log(`Updating model state: ${this}`);
    }
}

export { ModelState };