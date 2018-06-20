'use strict';

const PROMISE_STATUS = Object.freeze({
    PENDING:   Symbol("Pending"),
    FULFILLED: Symbol("Fulfilled"),
    REJECTED:  Symbol("Rejected"),
    RESOLVED:  Symbol("Resolved")
});

class SillyPromise {

    init() {
        this.status = PROMISE_STATUS.PENDING;
        this.thenHandlers = [];
        this.catchHandlers = [];
        //this.finallyHandler = undefined;
        this.value = undefined;
    }

    constructor(onCreation) {
        this.init();
        if (onCreation && typeof onCreation === 'function')
            onCreation();
    }

    /* class method */

    static resolve(v) {
        let resolved = new SillyPromise();
        resolved._resolve(v);
        return resolved;
    }

    static reject(v) {
        let rejected = new SillyPromise();
        rejected._reject(v);
        return rejected;
    }

    static race() {
        throw new Error('Not implemented');
    }

    static all() {
        throw new Error('Not implemented');
    }

    /* instance method */

    _resolve(v) {
        this.status = PROMISE_STATUS.RESOLVED;
        this.value = v;
        process.nextTick(this.run.bind(this));
        return this;
    }

    _reject(v) {
        this.status = PROMISE_STATUS.REJECTED;
        this.value = v;
        process.nextTick(this.run.bind(this));
        return this;
    }

    // When under invocation, the status should be no PENDING
    run() {
        /* if (this.status === PROMISE_STATUS.PENDING) {
            throw new Error('Promise should have been fulfilled.');
        }*/

        while (this.status !== PROMISE_STATUS.PENDING) {
            let theHandler;
            if (this.status === PROMISE_STATUS.REJECTED) {
                if (this.catchHandlers.length === 0) {
                    break;
                }
                theHandler = this.catchHandlers.shift();
            } else {
                if (this.thenHandlers.length === 0) {
                    break;
                }
                theHandler = this.thenHandlers.shift();
            }
            let tempPromise = theHandler(this.value);
            // TODO handle exception from handler
            if (!tempPromise) {
                tempPromise = new SillyPromise();
                tempPromise.status = PROMISE_STATUS.RESOLVED;
                tempPromise.value = null;
            }
            this.value = tempPromise.value;
            this.status = tempPromise.status;
            this.thenHandlers = tempPromise.thenHandlers.concat(this.thenHandlers);
            this.catchHandlers = tempPromise.catchHandlers.concat(this.catchHandlers);
        }
    }

    then(onThen) {
        this.thenHandlers.push(onThen);
        return this;
    }

    catch(onCatch) {
        this.catchHandlers.push(onCatch);
        return this;
    }

    /*
    finally(onFinally) {
        this.finallyHandler = onFinally;
    }
    */
}

module.exports.SillyPromise = SillyPromise;
