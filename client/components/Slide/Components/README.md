# Slide Components

*Slide Somponents* produce a serializable data entity. 

The required structure of a slide component directory is: 

```
.
├── Card.jsx
├── Component.css
├── Display.jsx
├── Editor.jsx
├── index.js
└── meta.js
```

## Files

### `Card.jsx`

Contains the "Card" view of a component.

Example, from `AudioPrompt`: 

```js
import React from 'react';
import { Icon } from '@components/UI';
import { name } from './meta';

const Card = () => (
  <React.Fragment>
    <Icon name="microphone" aria-label={name} />
    {name}
  </React.Fragment>
);

export default React.memo(Card);
```

### `Component.css`

Contains the styles used by component.


### `Display.jsx`

Contains the "Display" view used by component in a scenario run.


### `Editor.jsx`

Contains the "Editor" view used by component in the scenario editor.


### `index.js`

Consolidates the exports of all other component modules.

Example, from `AudioPrompt`: 

```js
import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  header: '',
  id: '',
  persona: null,
  prompt: '',
  recallId: '',
  required: true,
  responseId,
  type
});
```

> NOTE: Everything shown above is **_required_**.


## Required properties of All Components

### `id`

| Type | Integrity | Default |
|------|------------|---------|
| `UUID` | non-writable | generated |

All components must have an `id` property. The value is auto generated and must not be altered by Slide Component code.


### `persona`

| Type | Integrity | Default |
|------|------------|---------|
| `Number`, `null` | writable | `null` |

All components must have a `persona` property, but its value is only used in Multi-Participant scenarios. The `persona` property determines which participants see the content provided by the component. If the value is `null`, then all participants will see the content provided by the component. 

### `type`

| Type | Integrity | Default |
|------|------------|---------|
| `String` | non-writable | provided |

All components must have a `type` property. The value is provided by the specific Slide Component itself and must not be altered by Slide Component code. `type` must be defined in `meta.js` and present in `index.js`: 

Example: 

```js
import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  header: '',
  id: '',
  foo: '...'
  persona: null,
  recallId: '',
  required: true,
  responseId,
  type
});

```


## Required properties of Prompt Components

### `header` 

| Type | Integrity | Default |
|------|------------|---------|
| `String` | writable | generated |

All prompt components must have an `header` property. The value is assigned a default value, but can be changed by an author in the component editor. This is used in the data downloads to label participant response data, as the header value in the generated CSV files. 


### `responseId`

| Type | Integrity | Default |
|------|------------|---------|
| `UUID` | non-writable | generated |

All prompt components must have a `responseId` property. The value is auto generated and must not be altered by Slide Component code. This must also be included in the object argument of the `defaultValue(...)` function. 

Example: 

```js
export const defaultValue = ({ responseId }) => ({
  header: '',
  id: '',
  recallId: '',
  required: true,
  responseId,
  type
});
```


### `recallId`

| Type | Integrity | Default |
|------|------------|---------|
| `UUID` | non-writable | assigned |

All prompt components must have a `recallId` property. The value is assigned when an author selects a Previous Response to embed with their Prompt component.


### `required`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `true` |

All prompt components must have a `required` property, which is assigned a default value of `true`. This is used by the scenario to indicate required prompt responses.


### `timeout`

| Type | Integrity | Default |
|------|------------|---------|
| `Number` | writable | `0` |

All prompt components must have a `timeout` property, which is assigned a default value of `0`. While currently unused, thie property is reserved for use as a prompt timeout in scenario runs. 


## Optional properties that affect the scenario run

### `disableDefaultNavigation`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Components that set this to `true` will override the slide's default navigation by hiding the "Next" button. This is currently only used by the `MultiPathResponse` component, which takes control of navigation.

Example, derived from `MultiPathResponse`: 

```js
export const defaultValue = ({ responseId }) => ({
  disableRequireCheckbox: true,
  disableDefaultNavigation: true,
  header: '',
  id: '',
  paths: [],
  persona: null,
  recallId: '',
  required: true,
  responseId,
  timeout: 0,
  type
});
```

## Optional properties that affect the component editor


### `disableDelete`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Disables the Delete option in the Slide Component editor menu.


### `disableDuplicate`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Disables the Delete option in the Slide Component editor menu.


### `disableEmbed`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Disables embedding as a Previous Response.


### `disablePersona`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Disables the Persona selector option in the Slide Component editor menu.


### `disableOrdering`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Disables re-ordering of the component in the Slide editor. Hides Mover options in the Slide Component editor menu.


### `disableRequireCheckbox`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | writable | `false` |

Hides the checkbox that allows for toggling the `required`-ness of a prompt. The value given for `required`, in the `defaultValue(...)` function will be the constant value.

Example, from `MultiPathResponse`: 

```js
export const defaultValue = ({ responseId }) => ({
  disableRequireCheckbox: true,
  disableDefaultNavigation: true,
  header: '',
  id: '',
  paths: [
    {
      display: '',
      value: null
    }
  ],
  persona: null,
  recallId: '',
  required: true,
  responseId,
  timeout: 0,
  type
});
```
