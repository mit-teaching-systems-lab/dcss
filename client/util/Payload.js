const getLocationHrefIfAvailable = () => {
  const href = window && window.location && window.location.href;
  return href || '';
};

export default {
  compose(props, data = {}) {
    let {
      agent,
      chat,
      cohort,
      persona,
      prompt,
      response,
      scenario,
      user
    } = props;
    let url = props.url || getLocationHrefIfAvailable();

    // These may be null, so we can't rely on default params
    if (!agent) {
      agent = {};
    }

    if (!cohort) {
      cohort = {};
    }

    if (!chat) {
      chat = {};
    }

    if (!persona) {
      persona = {};
    }

    if (!prompt) {
      prompt = {};
    }

    if (!response) {
      response = {};
    }

    if (!scenario) {
      scenario = {};
    }

    if (!user) {
      user = {};
    }

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
      cohort: {
        id: cohort.id
      },
      persona: {
        id: persona.id
      },
      prompt: {
        id: prompt.id
      },
      response: {
        id: response.id
      },
      scenario: {
        id: scenario.id
      },
      user: {
        id: user.id
      },
      url,
      ...data
    };
    // console.log("Payload.compose(props, data) -> ", payload);
    return payload;
  }
};
