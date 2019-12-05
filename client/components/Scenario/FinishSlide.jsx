import React from 'react';
import PropTypes from 'prop-types';
import { Confirm, Card } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import './Scenario.css';

class FinishSlide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isConfirmBoxOpen: this.isScenarioRun ? true : false
        };
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    get isScenarioRun() {
        return location.pathname.includes('/run/');
    }

    onCancel() {
        if (!this.isScenarioRun) {
            return;
        }
        location.href = this.props.back;
    }

    onConfirm(event) {
        if (!this.isScenarioRun) {
            return;
        }
        this.setState({ isConfirmBoxOpen: false });
        this.props.onChange(event, {
            ended_at: new Date().toISOString()
        });
    }

    render() {
        const { onCancel, onConfirm } = this;
        const { slide } = this.props;
        const { isConfirmBoxOpen } = this.state;
        const components = (slide && slide.components) || [{ html: '' }];
        const className = `scenario__card--run${
            isConfirmBoxOpen ? '-hidden' : ''
        }`;

        return (
            <React.Fragment>
                <Confirm
                    content={`If you're ready to finish, click 'I'm done!'`}
                    header="Ready to finish this scenario?"
                    cancelButton="Go back"
                    confirmButton="I'm done!"
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    open={isConfirmBoxOpen}
                    size="tiny"
                />
                <Card centered className={className}>
                    <Card.Content>
                        {components &&
                            components.map(({ html: __html }, index) => (
                                <p
                                    key={index}
                                    dangerouslySetInnerHTML={{
                                        __html
                                    }}
                                />
                            ))}
                    </Card.Content>
                    <Card.Content extra>
                        <NavLink to="/">Return home</NavLink>
                    </Card.Content>
                </Card>
            </React.Fragment>
        );
    }
}

FinishSlide.propTypes = {
    back: PropTypes.string,
    onChange: PropTypes.func,
    slide: PropTypes.object
};

export default FinishSlide;
