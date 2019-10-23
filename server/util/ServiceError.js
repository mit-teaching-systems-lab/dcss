class ServiceError extends Error {
    constructor({ message, stack = '', status = 500 }) {
        super(message);
        this.stack = stack;
        this.status = status;
    }
}

module.exports = ServiceError;
