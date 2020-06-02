export const makeHeader = (props, prompts) => {
  const { buttons, header, prompt, recallId, required } = props || {};
  const parentheticals = [];

  if (required) {
    parentheticals.push('Required');
  }

  if (recallId && recallId !== -1) {
    const response = prompts.find(({ responseId }) => responseId === recallId);
    if (response) {
      parentheticals.push(`Reflecting on '${response.prompt}'`);
    }
  }

  if (buttons) {
    parentheticals.push(
      `Choices: ${buttons.map(button => button.display).join(', ')}`
    );
  }

  if (!header) {
    return `${prompt} (${parentheticals.join(', ')})`;
  } else {
    return `${header} (${parentheticals.join(', ')})`;
  }
};
