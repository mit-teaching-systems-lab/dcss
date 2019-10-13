const TIMEOUT = 1000 * 60 * 60;

const getSession = () => {
    const { timestamp = Date.now(), username = '' } = JSON.parse(
        localStorage.getItem('session')
    ) || {
        timestamp: '',
        username: ''
    };

    return {
        timestamp,
        username
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
    localStorage.removeItem('session');
};

const create = session => {
    localStorage.setItem('session', JSON.stringify(session));
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
