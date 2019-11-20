import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card } from 'semantic-ui-react';
import { setRun } from '@client/actions';

import SlideComponentsList from '@components/SlideComponentsList';

class ContentSlide extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isLastSlide, onResponseChange, run, slide } = this.props;
        const nextButtonLabel = isLastSlide ? 'Finish' : 'Next';
        const cardClass = run ? 'scenario__card--run' : 'scenario__card';
        const runOnly = run ? { run } : {};
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
                            content={nextButtonLabel}
                        />
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
