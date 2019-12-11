import storage from 'local-storage-fallback';

const TIMEOUT = 1000 * 60 * 60;

const getSession = () => {
    const {
        timestamp = Date.now(),
        username = '',
        permissions = []
    } = JSON.parse(storage.getItem('session')) || {
        timestamp: '',
        username: '',
        permissions: []
    };

    return {
        timestamp,
        username,
        permissions
    };
};

const isSessionActive = () => {
    const { timestamp } = getSession();
    return Number(timestamp) >= Date.now() - TIMEOUT;
};

const isLoggedIn = () => {
    const { username } = getSession();
    return isSessionActive() && username !== '';
};

const destroy = () => {
    storage.removeItem('session');
};

const create = session => {
    storage.setItem('session', JSON.stringify(session));
};

export default {
    create,
    destroy,
    getSession,
    isLoggedIn,
    isSessionActive,
    timeout() {
        if (!isSessionActive()) {
            destroy();
        }
    }
};
