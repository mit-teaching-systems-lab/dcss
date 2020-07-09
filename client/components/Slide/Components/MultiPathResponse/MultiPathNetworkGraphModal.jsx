import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import { connect } from 'react-redux';
import { Modal } from '@components/UI';
import { getSlides } from '@actions/scenario';

function makeNodeLabel(index, title) {
  const quotedSlideTitle = title ? `\n"${title}"` : ``;
  return `Slide #${index} ${quotedSlideTitle}`.trim();
}

class MultiPathNetworkGraphModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      slides: [],
      width: window.visualViewport.width,
      height: window.visualViewport.height
    };

    this.onResize = this.onResize.bind(this);
  }

  componentWillUnmount() {
    window.visualViewport.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.visualViewport.addEventListener('resize', this.onResize);

    (async () => {
      const unfiltered = await this.props.getSlides(this.props.scenarioId);
      const slides = unfiltered.filter(({ is_finish }) => !is_finish);

      this.setState({
        isReady: true,
        slides
      });
    })();
  }

  onResize() {
    this.setState({
      width: window.visualViewport.width,
      height: window.visualViewport.height
    });
  }

  render() {
    const { header, onClose, open } = this.props;
    const { isReady, slides } = this.state;

    if (!isReady) {
      return null;
    }

    let slidesCount = slides.length;
    // Dimensions
    // Modal.Content imposes a 21px padding on the left and right
    const mcPaddingLR = 21 * 2;
    // Modal size="fullscreen" fills 95% of viewport width
    const viewableModalWidth = window.visualViewport.width * 0.95 - mcPaddingLR;

    // Modal imposes a 14px margin on the top and bottom
    const mMarginTB = 14 * 2;
    // Modal imposes a 14px top and 5px bottom
    const mPositionTB = 14 + 5;
    // Modal.Header is 61px (margin + padding + content)
    const mhHeight = 61;
    // Modal.Content imposes a 21px padding on the top and bottom
    const mcPaddingTB = 21 * 2;
    // Sum of all Modal height size deductions;
    const mHeightDeductionSum =
      mPositionTB + mMarginTB + mhHeight + mcPaddingTB;

    // Modal size="fullscreen" imposes a
    const viewableModalHeight =
      window.visualViewport.height - mHeightDeductionSum;

    if (slidesCount % 2 !== 0) {
      slidesCount += 1;
    }

    const sizeOfNode = Math.sqrt(
      (viewableModalHeight * viewableModalWidth) / slidesCount
    );

    const nodeCols = Math.round(viewableModalWidth / sizeOfNode);
    const nodeRows = Math.round(viewableModalHeight / sizeOfNode);

    const nodePadding = 10;
    const nodeWidth = Math.round(viewableModalWidth / nodeCols);
    const nodeHeight = Math.round(viewableModalHeight / nodeRows);

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

    let colCounter = 0;
    let rowCounter = 0;

    // .filter(node => !edgesByNodeId[node.id])
    nodes.forEach(node => {
      // Fill in implicit edges
      const slide = slides.find(({ id }) => id === node.id);
      const slideIndex = slides.indexOf(slide);

      const edgeToNode = edges.find(edge => edge.to === node.id);
      const edgeFromNode = edges.find(edge => edge.from === node.id);

      // console.log(node.id, node.label, "edgeToNode", edgeToNode);
      // console.log(node.id, node.label, "edgeFromNode", edgeFromNode);

      const a = slides[slideIndex - 1];
      const b = slides[slideIndex + 1];

      if (!edgeToNode && a) {
        edges.push({
          from: a.id,
          to: slide.id
        });
      }
      if (!edgeFromNode && b) {
        edges.push({
          from: slide.id,
          to: b.id
        });
      }

      // Resolve positioning
      node.x = colCounter * nodeWidth + nodePadding * colCounter ** 3;
      node.y = rowCounter * nodeHeight + nodePadding;

      colCounter++;
      if (colCounter === nodeCols) {
        colCounter = 0;
        rowCounter++;
      }
    });

    const graph = {
      nodes,
      edges
    };

    const options = {
      clickToUse: true,
      edges: {
        color: '#000000',
        smooth: {
          enabled: true,
          type: 'curvedCCW'
          // roundness: 1
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
      width: `${viewableModalWidth}px`,
      height: `${viewableModalHeight}px`,
      physics: {
        enabled: false
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideEdgesOnZoom: false,
        hideNodesOnDrag: false,
        hover: false,
        hoverConnectedEdges: true,
        keyboard: {
          enabled: false,
          speed: { x: 10, y: 10, zoom: 0.02 },
          bindToWindow: true
        },
        multiselect: false,
        navigationButtons: true,
        selectable: true,
        selectConnectedEdges: true,
        tooltipDelay: 300,
        zoomView: true
      }
    };

    const events = {
      select(event) {
        // eslint-disable-next-line no-console
        console.log(event);
      }
    };
    return (
      <Modal
        role="dialog"
        aria-modal="true"
        size="fullscreen"
        closeIcon
        open={open}
        onClose={onClose}
      >
        {header ? <Modal.Header>{header}</Modal.Header> : null}
        <Modal.Content>
          <Graph events={events} graph={graph} options={options} />
        </Modal.Content>
      </Modal>
    );
  }
}

MultiPathNetworkGraphModal.propTypes = {
  getSlides: PropTypes.func,
  header: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  scenarioId: PropTypes.node,
  slides: PropTypes.array
};

const mapStateToProps = state => {
  const slides = state.scenario.slides.filter(slide => !slide.is_finish);
  return {
    slides
  };
};

const mapDispatchToProps = dispatch => ({
  getSlides: params => dispatch(getSlides(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiPathNetworkGraphModal);
