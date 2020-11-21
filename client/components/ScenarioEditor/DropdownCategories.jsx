import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from '@components/UI';

export default function DropdownCategories({ options, categories, onChange }) {
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
}

DropdownCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
