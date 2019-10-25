import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Label, Checkbox } from 'semantic-ui-react';

import './CheckResponse.css';

const Display = ({
    prompt,
    checked,
    unchecked,
    responseId,
    onResponseChange
}) => (
    <React.Fragment>
        <Label as="label" className="CheckResponse-label">
            <Checkbox
                name={responseId}
                value={checked}
                label={prompt}
                onChange={(event, values) => {
                    if (values.checked) {
                        values.value = checked;
                    } else {
                        values.value = unchecked;
                    }
                    if (onResponseChange) onResponseChange(event, values);
                }}
                className="CheckResponse-input"
            />
        </Label>
    </React.Fragment>
);

Display.propTypes = {
    prompt: PropTypes.string,
    checked: PropTypes.string,
    unchecked: PropTypes.string,
    responseId: PropTypes.string,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
