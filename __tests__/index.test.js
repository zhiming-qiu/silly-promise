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

    it('should be exposing class methods', () => {
        ['resolve', 'reject', 'race', 'all'].forEach((m) => {
            expect(typeof index.SillyPromise[m]).toEqual('function');
        });
    });

    it('should be exposing instance methods', () => {
        ['then', 'catch'/*, 'finally'*/].forEach((m) => {
            expect(typeof sp[m]).toEqual('function');
            sp[m]();
        });
    });

    it('should be able to generate a rejected instance', (done) => {
        let rejected = index.SillyPromise.reject(new Error('Foo error'));
        const mockOnThen = jest.fn();
        rejected.then(mockOnThen).catch(() => {
            expect(mockOnThen.mock.calls.length).toBe(0);
            done();
        });
    });

});
