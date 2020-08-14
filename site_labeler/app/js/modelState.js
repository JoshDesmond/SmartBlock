/**
 * The ModelState contains all of the observable state information used in the labeling workflow.
 *
 * Implements Observable
 */
class ModelState {
    /** True when flag-mode is enabled */
    flagState = false;
    flagOne = false;
    flagTwo = false;
    flagThree = false;
    flagFour = false;
    /** True when the isObvious toggle is enabled. Exclusive in relation to isAmbiguousState. */
    isObviousState = false;
    /** True when the isAmbigious toggle is enabled. Exclusive in relation to isObviousState. */
    isAmbiguousState = false;
    primaryVote;
    /** Optional */
    secondaryVote;
    /** List of observers to notify on update */
    observers;


    constructor() {
        this.observers = new Array();
    }

    /** Clears any votes and disables all flags */
    resetState() {
        this.flagState = false;
        this.flagOne = false;
        this.flagTwo = false;
        this.flagThree = false;
        this.flagFour = false;
        this.isObviousState = false;
        this.isAmbiguousState = false;
        this.primaryVote = null;
        this.secondaryVote = null;
    }

    /** Handles a voting action.
     *
     * This can either update the primary or secondary vote, depending on the
     * flagState
     *
     * @param {number} vote The value of the vote, must be between 1 and 4
     **/
    handleVote(vote){
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

    /** Notify all observers of a change */
    update() {
        for (let observer of this.observers) {
            observer.update();
        }
    }
}