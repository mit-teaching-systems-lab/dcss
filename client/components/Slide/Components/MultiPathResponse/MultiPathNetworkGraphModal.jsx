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
    const { header, onClose, open, slides } = this.props;

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
                    const edge = {
                      from,
                      to,
                      label
                    };

                    edgesByNodeId[from] = edge;
                    edgesByNodeId[to] = edge;

                    accum.push({
                      from,
                      to,
                      label
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

    nodes
      .filter(node => !edgesByNodeId[node.id])
      .forEach(node => {
        const slide = slides.find(({ id }) => id === node.id);
        const slideIndex = slides.indexOf(slide);
        const edge = {};

        const a = slides[slideIndex - 1];
        const b = slides[slideIndex + 1];

        if (a && !edgesByNodeId[a.id]) {
          edge.from = a.id;
          edge.to = slide.id;
          edge.level = 1;
        } else {
          if (b) {
            edge.from = slide.id;
            edge.to = b.id;
            edge.level = 1;
          }
        }
        edges.push(edge);
      });

    nodes.forEach(node => {
      let level = nodes.length;
      edges.forEach(edge => {
        if (edge.from === node.id || edge.to === node.id) {
          level -= 1;
        }
      });
      node.level = level;
    });

    const graph = {
      nodes,
      edges
    };

    const height = `${window.innerHeight - 150}px`;
    const options = {
      clickToUse: true,
      layout: {
        randomSeed: 1,
        // improvedLayout: true
        // clusterThreshold: 150,
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'hubsize',
          nodeSpacing: 300
          // levelSeparation: 300,
        }
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
        {header ? <Modal.Header>{header}</Modal.Header> : null}
        <Modal.Content>
          <Graph events={events} graph={graph} options={options} />
        </Modal.Content>
      </Modal>
    );
  }
}

MultiPathNetworkGraphModal.propTypes = {
  header: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
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
