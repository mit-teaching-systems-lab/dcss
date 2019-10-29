import React from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm } from 'semantic-ui-react';

class ConfirmableDeleteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        const { onConfirm, itemType } = this.props;

        const ariaLabel = `Delete ${itemType}`.trim();
        // TODO: figure out a nicer way to do this :|
        const content = itemType
            ? `Are you sure you want to delete this ${itemType}?`
            : `Are you sure you want to delete?`;

        return (
            <React.Fragment>
                <Button
                    icon="trash alternate outline"
                    aria-label={ariaLabel}
                    onClick={() => this.setState({ open: true })}
                />
                <Confirm
                    open={this.state.open}
                    content={content}
                    cancelButton="No Thanks"
                    confirmButton="Confirm Delete"
                    onCancel={() => this.setState({ open: false })}
                    onConfirm={() => {
                        onConfirm();
                        this.setState({ open: false });
                    }}
                />
            </React.Fragment>
        );
    }
}

ConfirmableDeleteButton.propTypes = {
    itemType: PropTypes.string,
    onConfirm: PropTypes.func.isRequired
};
export default ConfirmableDeleteButton;
