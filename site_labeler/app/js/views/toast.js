/** Length in milliseconds for a toast message to timeout/disappear */
const TOAST_TIMEOUT = 2500;

class Toast {

    /**
     * @param {String} text The message of the toast notification
     * @param {Boolean} isError True if the Toast should be styled as an error/warning
     * @param {Boolean} isSuccess True if the Toast should be styled as a success message, (as
     * opposed to something neutral).
     */
    constructor(text, isError, isSuccess) {
        if (isError && isSuccess) throw Error("Toast can't be both a success and an error");
        if (text === null) throw Error("Toast text can't be null");

        this.toast = document.createElement('div');
        this.toast.className = 'toast SmartBlockPluginElement';
        this.toast.innerText = text;
        if (isError) {
            this.toast.className += " toast--error";
        } else if (isSuccess) {
            this.toast.className += " toast--success";
        } else {
        }
    }

    /**
     * Triggers the show() routine and returns the Toast element
     * @returns {HTMLDivElement} The Toast element itself to be added to the DOM.
     */
    get() {
        this.show();
        return this.toast;
    }

    show() {
        this.toast.classList.add('toast--visible');
        setTimeout(() => {
            this.toast.classList.remove('toast--visible');
        }, TOAST_TIMEOUT);
    }
}

export {Toast}