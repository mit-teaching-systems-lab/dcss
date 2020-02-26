import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'semantic-ui-react';

export const CategoriesDropdown = ({
    categoryOptions,
    scenarioCategories,
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
                options={categoryOptions.map(category => ({
                    key: category.id,
                    text: category.name,
                    value: category.name
                }))}
                defaultValue={scenarioCategories}
                onChange={onChange}
            />
        </Form.Field>
    );
};

export const AuthorDropdown = ({ authorOptions, scenarioAuthor, onChange }) => {
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
                options={authorOptions.map(author => ({
                    key: author.id,
                    text: author.username,
                    value: author.username
                }))}
                defaultValue={scenarioAuthor}
                onChange={onChange}
            />
        </Form.Field>
    );
};

CategoriesDropdown.propTypes = {
    categoryOptions: PropTypes.array.isRequired,
    scenarioCategories: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};

AuthorDropdown.propTypes = {
    authorOptions: PropTypes.array.isRequired,
    scenarioAuthor: PropTypes.string,
    onChange: PropTypes.func.isRequired
};
