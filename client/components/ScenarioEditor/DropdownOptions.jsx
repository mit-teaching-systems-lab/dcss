import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';

export const CategoriesDropdown = ({
    options,
    categories,
    onChange
}) => {
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

export const AuthorDropdown = ({ options, author = {}, onChange }) => {
    const onAuthorChange = (event, { name, value: id }) => {
        const value = options.find(author => author.id === id);
        onChange(event, {
            name, value
        });
    };
    const {
        id: defaultValue
    } = author;

    return (
        <Form.Field>
            <label>Author</label>
            <Dropdown
                label="Author"
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
                onChange={onAuthorChange}
            />
        </Form.Field>
    );
};

CategoriesDropdown.propTypes = {
    categories: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};

AuthorDropdown.propTypes = {
    author: PropTypes.object,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};
