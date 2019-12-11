import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Icon, Popup } from 'semantic-ui-react';
import storage from 'local-storage-fallback';

import SlideComponentsList from '@components/SlideComponentsList';

class ContentSlide extends React.Component {
    constructor(props) {
        super(props);

        const {
            slide: { components }
        } = this.props;

        const required = components.reduce((accum, component) => {
            if (component.required) {
                accum.push(component.responseId);
            }
            return accum;
        }, []);

        this.state = {
            // Provides a reference to compare
            // prompt responseIds as the value
            // changes.
            required,
            // Tracks prompt input, but must be a copy
            pending: required.slice(),
            // Skip button display
            skipButton: 'Choose to Skip',
            skipOrKeep: 'skip'
        };

        this.onSkip = this.onSkip.bind(this);
        this.onInterceptResponseChange = this.onInterceptResponseChange.bind(
            this
        );
    }

    onSkip(event, { name }) {
        const { onClickNext, onResponseChange, slide } = this.props;
        const isSkip = true;
        const value = '';

        if (!this.props.run) {
            // TODO: implement some kind of feedback to
            // make previewer aware that Preview mode
            // does not function like Run mode.
            // alert('Slides cannot be skipped in Preview');
            return null;
        }

        if (name === 'skip') {
            slide.components.forEach(({ responseId, type }) => {
                if (responseId) {
                    const name = responseId;
                    onResponseChange(event, {
                        created_at: new Date().toISOString(),
                        ended_at: new Date().toISOString(),
                        isSkip,
                        name,
                        type,
                        value
                    });
                }
            });
        }

        onClickNext();
    }

    onInterceptResponseChange(event, data) {
        const { name, value } = data;
        const { pending, required } = this.state;

        if (!this.props.run) {
            // TODO: implement some kind of feedback to
            // make previewer aware that Preview mode
            // does not function like Run mode.
            // alert('Slides cannot accept responses in Preview');
            return null;
        }

        const { run } = this.props;

        // If we have a response change for a responseId that
        // was marked required, and the value isn't empty,
        // then it can be removed from the list.
        if (required.includes(name)) {
            if (value !== '') {
                if (pending.includes(name)) {
                    pending.splice(pending.indexOf(name), 1);
                }
            } else {
                // Otherwise, if it is not empty, but was
                // previously removed, add it back.
                pending.push(name);
            }
        }

        this.setState({ pending });

        if (!data.isFulfilled) {
            this.props.onResponseChange(event, data);
            storage.setItem(`${run.id}-${name}`, JSON.stringify(data));
            this.setState({
                skipButton: 'Choose to skip',
                skipOrKeep: 'skip'
            });
        } else {
            this.setState({
                skipButton: 'Keep and continue',
                skipOrKeep: 'keep'
            });
        }
    }

    render() {
        const { pending, skipButton, skipOrKeep } = this.state;
        const {
            isLastSlide,
            onClickNext,
            onClickBack,
            run,
            slide
        } = this.props;
        const { onInterceptResponseChange, onSkip } = this;
        const cardClass = run ? 'scenario__card--run' : 'scenario__card';
        const runOnly = run ? { run } : {};
        const hasPrompt = slide.components.some(
            component => component.responseId
        );

        const proceedButtonLabel = hasPrompt ? 'Submit' : 'Next';
        const submitNextOrFinish = isLastSlide ? 'Finish' : proceedButtonLabel;

        const awaitingRequiredPrompts = (
            <React.Fragment>
                <Icon name="asterisk" /> Required
            </React.Fragment>
        );

        const color = pending.length ? 'red' : 'green';
        const content = pending.length
            ? awaitingRequiredPrompts
            : submitNextOrFinish;
        const onClick = pending.length ? () => {} : onClickNext;

        const fwdButtonProps = {
            color,
            content,
            onClick
        };
        let fwdButtonTip = 'Submit response and go to next slide';
        let skipButtonTip =
            skipOrKeep === 'skip'
                ? 'Skip these prompts and go to next slide'
                : 'Keep these responses and go to next slide';

        fwdButtonTip += pending.length
            ? ` (${pending.length} required responses are not complete)`
            : '';

        let skipButtonContent = skipButton;

        if (isLastSlide) {
            skipButtonContent =
                skipOrKeep === 'skip' ? 'Skip and finish' : 'Keep and finish';
            skipButtonTip = skipButtonTip.replace('go to next slide', 'finish');
            fwdButtonTip = fwdButtonTip.replace('go to next slide', 'finish');
        }

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
                        onResponseChange={onInterceptResponseChange}
                    />
                    <Popup
                        content="Go back to the previous slide"
                        trigger={
                            <Button
                                floated="left"
                                color="grey"
                                onClick={onClickBack}
                                content={'Back'}
                            />
                        }
                    />
                    <Button.Group floated="right">
                        <Popup
                            content={fwdButtonTip}
                            trigger={<Button {...fwdButtonProps} />}
                        />
                        {hasPrompt && (
                            <React.Fragment>
                                <Button.Or />
                                <Popup
                                    content={skipButtonTip}
                                    trigger={
                                        <Button
                                            color="yellow"
                                            name={skipOrKeep}
                                            onClick={onSkip}
                                            content={skipButtonContent}
                                        />
                                    }
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
    const { run } = state;
    return { run };
}

export default connect(mapStateToProps)(ContentSlide);
