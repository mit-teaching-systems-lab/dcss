// Note: this file is used by <root>/client/hoc/withSocket.jsx

// Client -> Server
exports.AGENT_JOINED = 'agent-joined';
exports.DISCONNECT = 'disconnect';
exports.USER_JOIN = 'user-join';
exports.USER_PART = 'user-part';
exports.USER_IS_TYPING = 'user-is-typing';
exports.USER_NOT_TYPING = 'user-not-typing';

// Client <- Server
exports.NOTIFICATION = 'notification';

// Server -> Client
// exports.AGENT_ADDED = 'agent-added';
// exports.USER_ADDED = 'user-added';
// exports.USER_REMOVED = 'user-removed';

// Client -> Server -> Client
exports.NEW_MESSAGE = 'new-message';
