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
| `Number`, `null` | Writable | `null` |

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
| `String` | Writable | generated |

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
| `Boolean` | Writable | `true` |

All prompt components must have a `required` property, which is assigned a default value of `true`. This is used by the scenario to indicate required prompt responses.


### `timeout`

| Type | Integrity | Default |
|------|------------|---------|
| `Number` | Writable | `0` |

All prompt components must have a `timeout` property, which is assigned a default value of `0`. While currently unused, thie property is reserved for use as a prompt timeout in scenario runs. 


## Optional properties that affect the scenario run


Optional properties may define a `Where` object for their value. `Where` objects can only access data within the component object. The following combinators and operators are available: 

### Combinators

Unary operators. Can appear at the top level, but not in the leading position. 

- `$and`
```js
{
  b: {
    $gt: 0
  }, 
  $and: {
    $lt: 100
  }
}
```
- `$or`
```js
{
  b: {
    $gt: 0
  }, 
  $and: {
    $lt: 100
  }
}
```


### Operators 

Binary operators

Given data: 

```js
{
  number: 9, 
  string: 'Hello!', 
  arrayA: [1, 2, 3],
  arrayB: [0, 1, 2, 3, 4]
  objectA: {x: 1, y: 1}, 
  objectB: {x: 1}
}
```

The following examples will all evaluate to `true`: 

- `$between`
```js
{
  number: {
    $between: [0, 10]
  }
}
```
- `$includes`
```js
{
  string: {
    $includes: 'ello'
  }
}
{
  arrayA: {
    $includes: [1, 2]
  }
}
{
  arrayA: {
    $includes: 1
  }
}
```
- `$eq`
```js
{
  string: {
    $eq: 'Hello!'
  }
}

{
  number: {
    $eq: 9
  }
}
```
- `$gt`
```js
{
  number: {
    $gt: 8
  }
}
```
- `$gte`
```js
{
  number: {
    $gte: 8
  }
}
```
- `$in`
```js
{
  objectB: {
    $in: 'objectA'
  }
}
{
  arrayA: {
    $in: 'arrayB'
  }
}
```
- `$lt`
```js
{
  number: {
    $lt: 10
  }
}
```
- `$lte`
```js
{
  number: {
    $lte: 10
  }
}
```
- `$ne`
```js
{
  number: {
    $ne: 1
  }
}
```
- `$notBetween`
```js
{
  number: {
    $notBetween: [0, 5]
  }
}
```

### Special

- `$value` Use `$value` to reference another path in the data object. It's value is an object path.
```js
{
  b: {
    $includes: {
      $value: 'a'
    }
  }
}
```


### `disableDefaultNavigation`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

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

Example using a `Where` object: 

```js
export const defaultValue = ({ responseId }) => ({
  disableRequireCheckbox: true,
  disableDefaultNavigation: {
    'paths.length': {
      $eq: 0
    }
  },
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
This `Where` object will determine the boolean value of `disableDefaultNavigation` by checking that `path.length > 0`.


## Optional properties that affect the component editor

### `component`

If a slide component has a child property called `component`, and that slide component is active when the Component menu is clicked, the newly selected component will set to the slide component's child `component` property.

### `disableDelete`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

Disables the Delete option in the Slide Component editor menu.


### `disableDuplicate`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

Disables the Delete option in the Slide Component editor menu.


### `disableEmbed`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

Disables embedding as a Previous Response.


### `disablePersona`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

Disables the Persona selector option in the Slide Component editor menu.


### `disableOrdering`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

Disables re-ordering of the component in the Slide editor. Hides Mover options in the Slide Component editor menu.


### `disableRequireCheckbox`

| Type | Integrity | Default |
|------|------------|---------|
| `Boolean` | Writable | `false` |
| `Where` | Non-writable | n/a |

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
