class Toast {
    constructor() {
        this.toast = document.createElement('div');
        this.toast.className = 'toast';
        this.toast.innerText = "Hello";
    }

    get() {
        return this.toast;
    }
}

export {Toast}