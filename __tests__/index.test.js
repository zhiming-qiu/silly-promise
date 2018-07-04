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

    it('should be able to generate a rejected instance', () => {
        let rejected = index.SillyPromise.reject(new Error('Foo error'));
    });

    it('should be able to catch a rejected instance', (done) => {
        let rejected = index.SillyPromise.reject(new Error('Foo error'));
        const mockOnThen = jest.fn();
        rejected.then(mockOnThen).catch(() => {
            expect(mockOnThen.mock.calls.length).toBe(0);
            done();
        });
    });

    it('should be able to generate a resolved instance', () => {
        let rejected = index.SillyPromise.resolve('Foo');
    });


    it('should be able to then directly a resolved instance', (done) => {
        let resolved = index.SillyPromise.resolve("Foo");
        const mockOnCatch = jest.fn();
        resolved.catch(mockOnCatch).then(() => {
            expect(mockOnCatch.mock.calls.length).toBe(0);
            done();
        });
    });

    it('should be able to then indirectly a resolved instance', (done) => {
        let resolved = index.SillyPromise.resolve("Foo");
        const mockOnCatch = jest.fn();
        resolved.catch(mockOnCatch).then((v) => {
            return index.SillyPromise.resolve(v);
        }).then(() => {
            expect(mockOnCatch.mock.calls.length).toBe(0);
            done();
        });
    });

    /*
    it('should raise error when racing a list of promises', () => {
        expect(index.SillyPromise.race).toThrow(new Error('Not implemented'));
    });
    */

    it('should raise error when waiting for a list of promises to resolve', () => {
        expect(index.SillyPromise.all).toThrow(new Error('Not implemented'));
    });

    it('should catch a thrown error via catch handler', (done) => {
        sp = new index.SillyPromise((resolve, reject) => {
            resolve('3');
        });
        sp.then(() => {
            throw new Error('Mr T');
        }).catch((e) => {
            expect(e.message).toBe('Mr T');
            done();
        }).then(() => {});
    });

    it('should find the correct then handler from handler chain', (done) => {
        let zero = 0;
        sp = new index.SillyPromise((resolve, reject) => {
            resolve("resolved");
        });
        sp.then(() => {
            return null;
        }).catch(() => {
            zero += 1; // should not be reached
        }).then(() => {
            return index.SillyPromise.reject('Rejected');
        }).catch(() => {
            expect(zero).toBe(0);
            done();
        }).then(() => {
        });
    });

    it('should race out when the faster promise resolves', (done) => {
        let fastPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve("Cheetah");
            }, 0);
        });
        let slowPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve("Snail");
            }, 1000);
        });
        sp = index.SillyPromise.race([fastPromise, slowPromise]).then((result) => {
            expect(result).toBe('Cheetah');
            done();
        });
    });

    it('should race out when the faster promise rejects', (done) => {
        let fastPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                reject("Cheetah");
            }, 0);
        });
        let slowPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                reject("Snail");
            }, 1000);
        });
        sp = index.SillyPromise.race([fastPromise, slowPromise]).catch((e) => {
            expect(e).toBe('Cheetah');
            done();
        });
    });

    it('should race out when the faster promise rejects', (done) => {
        let fastPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                reject("Cheetah");
            }, 0);
        });
        let slowPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve("Snail");
            }, 1000);
        });
        sp = index.SillyPromise.race([fastPromise, slowPromise]).then((result) => {
            expect(e).toBe('Snail');
        }).catch((e) => {
            expect(e).toBe('Cheetah');
            done();
        });
    });

    it('should race out when the faster promise rejects', (done) => {
        let fnMock = jest.fn();
        let catchHandler = (e) => {
            fnMock();
            expect(e).toBe('Snail');
            if (fnMock.mock.calls.length === 2)
                setTimeout(done, 1000);
        };
        let fastPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve("Cheetah");
            }, 10);
        });
        let slowPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                reject("Snail");
            }, 0);
        });
        let sp2 = index.SillyPromise.race([fastPromise, slowPromise]).catch(
            catchHandler
        ).then((result) => {
            expect(result).toBe('Cheetah');
        });
        let sp1 = index.SillyPromise.race([fastPromise, slowPromise]).catch(
            catchHandler
        ).then((result) => {
            expect(result).toBe('Cheetah');
        });
    });

    it('should race out when the faster promise resolves', (done) => {
        let fnMock = jest.fn();
        let thenHandler = (result) => {
            fnMock();
            expect(result).toBe('Cheetah');
            if (fnMock.mock.calls.length === 2)
                setTimeout(done, 1000);
        };
        let fastPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve("Cheetah");
            }, 0);
        });
        let slowPromise = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                reject("Snail");
            }, 10);
        });
        let sp2 = index.SillyPromise.race([fastPromise, slowPromise]).then(
            thenHandler
        ).catch((e) => {
            expect(e).toBe('Snail');
        });
        let sp1 = index.SillyPromise.race([fastPromise, slowPromise]).then(
            thenHandler
        ).catch((e) => {
            expect(e).toBe('Snail');
        });
    });

    it('should wait until all promises resolve', (done) => {
        let sp1 = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve(1);
            }, 100);
        });
        let sp2 = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve(2);
            }, 200);
        });
        let sp3 = new index.SillyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve(3);
            }, 300);
        });
        let final = index.SillyPromise.all([sp1, sp2, sp3]).then((result) => {
            expect(result.reduce((a,b)=>{return a+b;}, 0)).toBe(1+2+3);
            done();
        });
    });

});
