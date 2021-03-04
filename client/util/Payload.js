export default {
  compose(props, data = {}) {
    const { agent = {}, chat = {}, response = {}, user = {} } = props;
    // To override the minimal payload properties, pass
    // an object property of the same name in `data`:
    //
    //  const props = {
    //    agent: {
    //      id: 1
    //      title: "Foo"
    //    },
    //    chat: {
    //      id: 2,
    //      host_id: 9,
    //      users: []
    //    },
    //    response: {
    //      id: 3,
    //      text: 'blah blah'
    //    },
    //    user: {
    //      id: 4
    //    }
    //  };
    //
    //  const user = {
    //    id: 4,
    //    username: 'a user',
    //    personalname: 'A Cool User'
    //  };
    //
    //  Payload.compose(props, {
    //    user
    //  });
    //
    //  {
    //    agent: {
    //      id: 1
    //    },
    //    chat: {
    //      id: 2,
    //      host_id: 9
    //    },
    //    response: {
    //      id: 3
    //    },
    //    user: {
    //      id: 4,
    //      username: 'a user',
    //      personalname: 'A Cool User'
    //    }
    //  }
    //
    const payload = {
      agent,
      chat: {
        id: chat.id,
        host_id: chat.host_id
      },
      response: {
        id: response.id
      },
      user: {
        id: user.id
      },
      ...data
    };
    // console.log("Payload.compose(props, data) -> ", payload);
    return payload;
  }
}
