'use strict';

const PROMISE_STATUS = Object.freeze({
    PENDING:   Symbol("Pending"),
    FULFILLED: Symbol("Fulfilled"),
    REJECTED:  Symbol("Rejected"),
    RESOLVED:  Symbol("Resolved")
});

const PROMISE_TYPES = Object.freeze({
    THEN: Symbol('Then'),
    CATCH: Symbol('Catch')
});

class SillyPromise {

    init() {
        this.status = PROMISE_STATUS.PENDING;
        this.handlers = [];
        //this.finallyHandler = undefined;
        this.value = undefined;
    }

    constructor(onCreation) {
        this.init();
        if (onCreation && typeof onCreation === 'function')
            onCreation(this._resolve.bind(this), this._reject.bind(this));
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

    _getHandler(promiseType) {
        if (!this.handlers.length) {
            return;
        }

        let handler = this.handlers.shift();
        while (handler && handler.type !== promiseType) {
            handler = this.handlers.shift();
        }

        return handler && handler.func;
    }

    // TODO when either then or catch handler is pickup, it should clean the other handler stack for all preceeding ones
    // When under invocation, the status should be no PENDING
    run() {
        while (this.status !== PROMISE_STATUS.PENDING) {
            let handler = null;
            if (this.status === PROMISE_STATUS.REJECTED) {
                handler = this._getHandler(PROMISE_TYPES.CATCH);
            } else {
                handler = this._getHandler(PROMISE_TYPES.THEN);
            }

            if (!handler) {
                break;
            }

            try {
                const tempPromise = handler(this.value);

                console.log(tempPromise);
                // return scalar, null, undefined
                if (!tempPromise instanceof SillyPromise) {
                    this.value = this.value || tempPromise;
                    this.status = PROMISE_STATUS.RESOLVED;
                }
                // return new Promise
                else {
                    this.value = tempPromise.value;
                    this.status = tempPromise.status;
                    this.handlers = tempPromise.handlers.concat(this.handlers);
                }
            } catch (error) {
                this.status = PROMISE_STATUS.REJECTED;
                this.value = error;
            }
        }
    }

    then(onThen) {
        this.handlers.push({
            type: PROMISE_TYPES.THEN,
            func: onThen
        });
        return this;
    }

    catch(onCatch) {
        this.handlers.push({
            type: PROMISE_TYPES.CATCH,
            func: onCatch
        });
        return this;
    }

    /*
    finally(onFinally) {
        this.finallyHandler = onFinally;
    }
    */
}

module.exports.SillyPromise = SillyPromise;
