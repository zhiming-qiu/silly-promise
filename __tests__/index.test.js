const index = require('./../index');

describe('index', () => {
    it('should exists', () => {
        expect(index).not.toBeNull();
    });

    it('should export SillyPromise', () => {
        expect(index.SillyPromise).not.toBeNull();
    });
});

describe('SillyPromise', () => {
    let sp = null;

    beforeEach(() => {
        sp = new index.SillyPromise((resolve, reject) => {});
    });

    afterEach(() => {
        sp = null; 
    });

    it('should be able to create new object', () => {
        expect(sp).toBeInstanceOf(index.SillyPromise);
    });

    it('should be a thenable', () => {
        expect(typeof sp.then).toEqual('function');
    });

    it('should be a catch-able', () => {
        expect(typeof sp.catch).toEqual('function');
    });
});
