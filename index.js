'use strict';

class SillyPromise {

    constructor(onCreation) {
    }

    /* class method */

    static resolve() {
        return new SillyPromise();
    }

    static reject() {
        return new SillyPromise();
    }

    static race() {
        return new SillyPromise();
    }

    static all() {
        return new SillyPromise();
    }

    /* instance method */

    then(onThen) {
        return this;
    }

    catch(onCatch) {
        return this;
    }

    finally(onFinally) {
        return this;
    }
}

module.exports.SillyPromise = SillyPromise;
