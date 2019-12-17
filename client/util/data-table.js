export const makeHeader = (props, prompts) => {
    const { buttons, header, prompt, recallId, required } = props || {};
    const parentheticals = [];

    if (required) {
        parentheticals.push('Required');
    }

    if (recallId) {
        const reflected = prompts.find(
            ({ responseId }) => responseId === recallId
        ).prompt;
        parentheticals.push(`Reflecting on '${reflected}'`);
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
