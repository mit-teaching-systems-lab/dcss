// Note: this file is used by <root>/client/hoc/withSocket.jsx

// Client -> Server
exports.AGENT_ACTIVATE = 'agent-activate';
exports.AGENT_DEACTIVATE = 'agent-deactivate';
exports.CHAT_AGENT_PAUSE = 'chat-agent-pause';
exports.CHAT_AGENT_START = 'chat-agent-start';
exports.CHAT_USER_AWAITING_MATCH = 'chat-user-awaiting-match';
exports.CHAT_USER_CANCELED_MATCH_REQUEST = 'chat-user-canceled-match-request';
exports.AWAITING_AGENT = 'awaiting-agent';
exports.CREATE_CHAT_CHANNEL = 'create-chat-channel';
exports.CREATE_CHAT_SLIDE_CHANNEL = 'create-chat-slide-channel';
exports.CREATE_CHAT_USER_CHANNEL = 'create-chat-user-channel';
exports.CREATE_COHORT_CHANNEL = 'create-cohort-channel';
exports.CREATE_SHARED_RESPONSE_CHANNEL = 'create-shared-response-channel';
exports.CREATE_USER_CHANNEL = 'create-user-channel';
exports.DISCONNECT = 'disconnect';
exports.HEART_BEAT = 'heart-beat';
exports.RUN_AGENT_START = 'run-agent-start';
exports.RUN_AGENT_END = 'run-agent-end';
exports.USER_JOIN = 'user-join';
exports.USER_PART = 'user-part';
exports.USER_JOIN_SLIDE = 'user-join-slide';
exports.USER_PART_SLIDE = 'user-part-slide';
exports.USER_TYPING = 'user-typing';
exports.USER_TYPING_UPDATE = 'user-typing-update';

// Client <-> Server
exports.NEW_INVITATION = 'new-invitation';
exports.SET_INVITATION = 'set-invitation';
exports.NOTIFICATION = 'notification';
exports.PING = 'ping';
exports.PONG = 'pong';

// Server -> Client
exports.AGENT_JOINED = 'agent-joined';
exports.AGENT_RESPONSE_CREATED = 'agent-response-created';
exports.CHAT_CREATED = 'chat-created';
exports.CHAT_CLOSED = 'chat-closed';
exports.CHAT_ENDED = 'chat-ended';
exports.CHAT_OPENED = 'chat-opened';
exports.CHAT_STATE = 'chat-state';
exports.CHAT_USER_MATCHED = 'chat-user-matched';
exports.HOST_JOIN = 'host-join';
exports.JOIN_OR_PART = 'join-or-part';
exports.RUN_CHAT_LINK = 'run-chat-link';

// Client -> Server -> Client
exports.CHAT_CLOSED_FOR_SLIDE = 'chat-closed-for-slide';
exports.CHAT_MESSAGE_CREATED = 'chat-message-created';
exports.CHAT_MESSAGE_UPDATED = 'chat-message-updated';
exports.SHARED_RESPONSE_CREATED = 'shared-response-created';
exports.SHARED_RESPONSE_UPDATED = 'shared-response-updated';
exports.TIMER_END = 'timer-end';
exports.TIMER_START = 'timer-start';
exports.TIMER_STOP = 'timer-stop';
exports.TIMER_TICK = 'timer-tick';
