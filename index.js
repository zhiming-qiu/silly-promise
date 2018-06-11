'use strict';

class SillyPromise {
    constructor(resolve, reject) {
    }

    then() {
        return this;
    }

    catch() {
        return this;
    }
}

module.exports.SillyPromise = SillyPromise;
