import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from '@components/UI';

export const CategoriesDropdown = ({ options, categories, onChange }) => {
  return (
    <Form.Field>
      <label>Categories</label>
      <Dropdown
        label="Categories"
        name="categories"
        placeholder="Select..."
        fluid
        multiple
        selection
        options={options.map(category => ({
          key: category.id,
          text: category.name,
          value: category.name
        }))}
        defaultValue={categories}
        onChange={onChange}
      />
    </Form.Field>
  );
};

export const OwnerDropdown = ({ options, author = {}, onChange }) => {
  const onOwnerChange = (event, { name, value: id }) => {
    const value = options.find(author => author.id === id);
    onChange(event, {
      name,
      value
    });
  };
  const { id: defaultValue } = author;

  return (
    <Form.Field>
      <label>Owner</label>
      <Dropdown
        label="Owner"
        name="author"
        placeholder="Select..."
        fluid
        multiple={false}
        selection
        options={options.map(author => ({
          key: author.id,
          text: author.username,
          value: author.id
        }))}
        defaultValue={defaultValue}
        onChange={onOwnerChange}
      />
    </Form.Field>
  );
};

CategoriesDropdown.propTypes = {
  categories: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

OwnerDropdown.propTypes = {
  author: PropTypes.object,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
