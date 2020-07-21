import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import { Card, Container, Grid, Responsive } from '@components/UI';
// import Loading from '@components/Loading';
import SlideComponents from '@components/SlideComponents';
import { getSlides, getScenario } from '@actions/scenario';
import '@components/Scenario/Scenario.css';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    await this.props.getSlides(this.props.scenario.id);

    this.setState({
      isReady: true
    });
  }
  render() {
    const { isReady } = this.state;

    if (!isReady) {
      return null;
    }

    const { slides } = this.props;

    slides.sort((a, b) => {
      return a.is_finish === b.is_finish ? 0 : a.is_finish ? 1 : -1;
    });

    return (
      <Container fluid className="scenario__slide-preview-pane">
        <Grid>
          <Grid.Row>
            <Grid.Column stretched>
              <Responsive
                onUpdate={() => {
                  // eslint-disable-next-line no-console
                  console.log('resize');
                }}
              >
                <Card.Group doubling stackable itemsPerRow={4}>
                  {slides.map(slide => {
                    return (
                      <Card key={hash(slide)}>
                        <Card.Content>
                          <Card.Header>
                            Slide #{slide.index}{' '}
                            {slide.title ? `, ${slide.title}` : ''}
                          </Card.Header>
                        </Card.Content>
                        <Card.Content>
                          <SlideComponents
                            components={slide.components}
                            onResponseChange={() => {
                              alert(
                                'Prompts are not functional in review mode'
                              );
                            }}
                          />
                        </Card.Content>
                      </Card>
                    );
                  })}
                </Card.Group>
              </Responsive>
            </Grid.Column>
          </Grid.Row>

          {/*<Grid.Row>
            <Grid.Column stretched>
              {scenariosPages > 1 ? (
                <Pagination
                  borderless
                  name="scenarios"
                  siblingRange={1}
                  boundaryRange={0}
                  ellipsisItem={null}
                  firstItem={null}
                  lastItem={null}
                  activePage={activePage}
                  onPageChange={onPageChange}
                  totalPages={scenariosPages}
                />
              ) : null}
            </Grid.Column>
          </Grid.Row>
          */}
        </Grid>
      </Container>
    );
  }
}

Review.propTypes = {
  scenario: PropTypes.object,
  slides: PropTypes.array,
  getSlides: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { scenario, user } = state;
  const slides = scenario.slides;
  return { scenario, slides, user };
};

const mapDispatchToProps = dispatch => ({
  getScenario: params => dispatch(getScenario(params)),
  getSlides: params => dispatch(getSlides(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Review);
