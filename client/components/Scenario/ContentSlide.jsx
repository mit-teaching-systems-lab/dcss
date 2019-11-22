import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import { setRun } from '@client/actions';

import SlideComponentsList from '@components/SlideComponentsList';

class ContentSlide extends React.Component {
    constructor(props) {
        super(props);
        this.onSkip = this.onSkip.bind(this);
    }

    onSkip(event) {
        const { onClickNext, onResponseChange, slide } = this.props;

        slide.components.forEach(component => {
            if (component.responseId) {
                onResponseChange(event, {
                    name: component.responseId,
                    value: 'Participant Skipped',
                    type: component.type
                });
            }
        });

        onClickNext();
    }

    render() {
        const { isLastSlide, onResponseChange, run, slide } = this.props;
        const cardClass = run ? 'scenario__card--run' : 'scenario__card';
        const runOnly = run ? { run } : {};
        const hasPrompt = slide.components.some(
            component => component.responseId
        );

        const proceedButtonLabel = hasPrompt ? 'Submit' : 'Next';
        const finishOrProceedLabel = isLastSlide
            ? 'Finish'
            : proceedButtonLabel;

        return (
            <Card id={slide.id} key={slide.id} centered className={cardClass}>
                <Card.Content style={{ flexGrow: '0' }}>
                    <Card.Header key={`header${slide.id}`}>
                        {slide.title}
                    </Card.Header>
                </Card.Content>
                <Card.Content key={`content${slide.id}`}>
                    <SlideComponentsList
                        {...runOnly}
                        components={slide.components}
                        onResponseChange={onResponseChange}
                    />

                    <Button.Group>
                        <Button
                            color="grey"
                            onClick={this.props.onClickBack}
                            content={'Back'}
                        />
                        <Button
                            color="green"
                            onClick={this.props.onClickNext}
                            content={finishOrProceedLabel}
                        />
                        {hasPrompt && (
                            <React.Fragment>
                                <Button.Or />
                                <Button
                                    color="yellow"
                                    onClick={this.onSkip}
                                    content="Skip"
                                />
                            </React.Fragment>
                        )}
                    </Button.Group>
                </Card.Content>
            </Card>
        );
    }
}

ContentSlide.propTypes = {
    run: PropTypes.object,
    slide: PropTypes.object,
    isLastSlide: PropTypes.bool,
    onResponseChange: PropTypes.func,
    onClickBack: PropTypes.func,
    onClickNext: PropTypes.func
};

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

const mapDispatchToProps = {
    setRun
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContentSlide);
