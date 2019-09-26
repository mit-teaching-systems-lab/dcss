const { asyncMiddleware } = require('../../../server/util/api');

describe('util/api', () => {
    describe('asyncMiddleware', () => {
        test('two param middleware', async () => {
            const mockReq = {};
            const mockRes = {};

            expect.assertions(2);

            const testMiddle = async (req, res) => {
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
            };

            const wrapped = asyncMiddleware(testMiddle);

            await wrapped(mockReq, mockRes);
        });

        test('two param middleware throws', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockError = new Error('mock');

            expect.assertions(4);

            const testMiddle = async (req, res) => {
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                throw mockError;
            };

            const mockNext = jest.fn(error => {
                expect(error).toBe(mockError);
            });

            const wrapped = asyncMiddleware(testMiddle);

            expect(wrapped.length).toBe(3);

            // express will still call it with 3 params cuz asyncMiddleware gives it 3 params
            await wrapped(mockReq, mockRes, mockNext);
        });

        test('three param middleware', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockNext = jest.fn();

            expect.assertions(3);

            const testMiddle = async (req, res, next) => {
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                expect(next).toEqual(mockNext);
            };

            const wrapped = asyncMiddleware(testMiddle);

            await wrapped(mockReq, mockRes, mockNext);
        });

        test('three param middleware throws', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockError = new Error('mock');
            const mockNext = jest.fn(error => {
                expect(error).toBe(mockError);
            });

            expect.assertions(5);

            const testMiddle = async (req, res, next) => {
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                expect(next).toEqual(mockNext);
                throw mockError;
            };

            const wrapped = asyncMiddleware(testMiddle);

            expect(wrapped.length).toBe(3);

            // express will still call it with 3 params cuz asyncMiddleware gives it 3 params
            await wrapped(mockReq, mockRes, mockNext);
        });

        test('three param middleware nexts', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockError = new Error('mock');
            const mockNext = jest.fn(error => {
                expect(error).toBe(mockError);
            });

            expect.assertions(5);

            const testMiddle = async (req, res, next) => {
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                expect(next).toEqual(mockNext);
                next(mockError);
            };

            const wrapped = asyncMiddleware(testMiddle);

            expect(wrapped.length).toBe(3);

            // express will still call it with 3 params cuz asyncMiddleware gives it 3 params
            await wrapped(mockReq, mockRes, mockNext);
        });

        test('four param middlewares', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockError = new Error('mock');
            const mockNext = jest.fn(() => {
                // this expect doesn't count toward assertions, it SHOULDNT assert
                expect('Not called').toBe('But was');
            });

            expect.assertions(5);

            const testMiddle = async (error, req, res, next) => {
                expect(error).toEqual(mockError);
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                expect(next).toEqual(mockNext);
            };

            const wrapped = asyncMiddleware(testMiddle);

            expect(wrapped.length).toBe(4);
            await wrapped(mockError, mockReq, mockRes, mockNext);
        });

        test('four param middlewares throw', async () => {
            const mockReq = {};
            const mockRes = {};
            const mockError = new Error('mock');

            const mockNext = jest.fn(error => {
                expect(error).toBe(mockError);
            });

            expect.assertions(6);

            const testMiddle = async (error, req, res, next) => {
                expect(error).toEqual(mockError);
                expect(req).toEqual(mockReq);
                expect(res).toEqual(mockRes);
                expect(next).toEqual(mockNext);
                throw mockError;
            };

            const wrapped = asyncMiddleware(testMiddle);

            expect(wrapped.length).toBe(4);
            await wrapped(mockError, mockReq, mockRes, mockNext);
        });
    });
});
