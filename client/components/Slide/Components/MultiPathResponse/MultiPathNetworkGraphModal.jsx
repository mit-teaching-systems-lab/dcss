import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import { connect } from 'react-redux';
import { Modal } from '@components/UI';

function makeNodeLabel(index, title) {
  const quotedSlideTitle = title ? `\n"${title}"` : ``;
  return `Slide #${index} ${quotedSlideTitle}`.trim();
}

class MultiPathNetworkGraphModal extends Component {
  render() {
    const { onClose, open, slides } = this.props;

    if (!slides || (slides && !slides.length)) {
      return null;
    }

    const nodesById = {};
    const edgesByNodeId = {};
    const { nodes, edges } = slides.reduce(
      (accum, slide, index) => {
        const { id, title } = slide;
        const label = makeNodeLabel(index + 1, title);

        nodesById[id] = true;
        accum.nodes.push({
          id,
          label
        });

        const from = id;
        accum.edges.push(
          ...slide.components.reduce((accum, component) => {
            if (component.paths && Array.isArray(component.paths)) {
              accum.push(
                ...component.paths.reduce((accum, path) => {
                  const { display: label, value } = path;
                  if (!value) {
                    return accum;
                  }
                  const to = value;
                  // When a target slide has been deleted, but the component has not
                  // been editted (which would purge the deleted target, there may be
                  // stale targets, this will ensure that we don't try to render an
                  // edge to a node that doesn't exist.
                  // if (!nodesById[to]) {
                  //   return accum;
                  // }
                  if (to !== from) {
                    edgesByNodeId[from] = true;
                    edgesByNodeId[to] = true;
                    accum.push({
                      from,
                      to,
                      label,
                      length: 150
                    });
                  }
                  return accum;
                }, [])
              );
            }
            return accum;
          }, [])
        );
        return accum;
      },
      {
        nodes: [],
        edges: []
      }
    );

    const graph = {
      // Remove nodes that don't actually connect to anything.
      nodes: nodes.filter(node => edgesByNodeId[node.id]),
      edges
    };
    const height = `${window.innerHeight - 100}px`;
    const options = {
      clickToUse: true,
      layout: {
        randomSeed: 1,
        improvedLayout: true
        // clusterThreshold: 150,
      },
      edges: {
        color: '#000000',
        smooth: {
          enabled: true,
          type: 'horizontal',
          roundness: 1
        }
      },

      nodes: {
        color: 'rgb(248, 248, 249)',
        shape: 'box',
        margin: 10,
        font: {
          size: 12,
          color: '#000'
        }
      },
      width: '100%',
      height,
      physics: {
        enabled: false
      }
    };

    const events = {
      select(event) {
        // eslint-disable-next-line no-console
        console.log(event);
      }
    };
    return (
      <Modal size="fullscreen" closeIcon open={open} onClose={onClose}>
        <Modal.Content>
          <Graph events={events} graph={graph} options={options} />
        </Modal.Content>
      </Modal>
    );
  }
}

MultiPathNetworkGraphModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  options: PropTypes.array,
  paths: PropTypes.array,
  scenarioId: PropTypes.any,
  slides: PropTypes.array
};

const mapStateToProps = state => {
  const slides = state.scenario.slides.filter(slide => !slide.is_finish);
  return {
    slides
  };
};

export default connect(
  mapStateToProps,
  null
)(MultiPathNetworkGraphModal);
