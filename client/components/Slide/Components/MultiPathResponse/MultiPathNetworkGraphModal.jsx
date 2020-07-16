import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';
import { connect } from 'react-redux';
import { Modal, Ref } from '@components/UI';
import { getSlides } from '@actions/scenario';

function makeNodeLabel(index, slide) {
  const quotedSlideTitle = slide.title ? `\n"${slide.title}"` : ``;
  return slide.is_finish
    ? 'Finish'
    : `Slide #${index} ${quotedSlideTitle}`.trim();
}

class MultiPathNetworkGraphModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      slides: [],
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.onResize = this.onResize.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    (async () => {
      const slides = await this.props.getSlides(this.props.scenario.id);
      this.setState({
        isReady: true,
        slides
      });
    })();
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  render() {
    const { header, onClose, open, scenario } = this.props;
    const { isReady, slides, width, height } = this.state;

    if (!isReady) {
      return null;
    }

    let slidesCount = slides.length;
    // Dimensions
    // Modal.Content imposes a 21px padding on the left and right
    const mcPaddingLR = 21 * 2;
    // Modal size="fullscreen" fills 95% of viewport width
    const viewableModalWidth = width * 0.95 - mcPaddingLR;

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
    const viewableModalHeight = height - mHeightDeductionSum;

    if (slidesCount % 2 !== 0) {
      slidesCount += 1;
    }

    const sizeOfNode = Math.sqrt(
      (viewableModalHeight * viewableModalWidth) / slidesCount
    );

    const nodeCols = Math.round(viewableModalWidth / sizeOfNode);
    const nodeRows = Math.round(viewableModalHeight / sizeOfNode);

    const nodePadding = 10;
    const nodeWidth = Math.round(viewableModalWidth / nodeCols + 1);
    const nodeHeight = Math.round(viewableModalHeight / nodeRows + 1);

    const nodesById = {};
    const edgesByNodeId = {};

    slides.sort((a, b) => {
      return a.is_finish === b.is_finish ? 0 : a.is_finish ? 1 : -1;
    });

    const { nodes, edges } = slides.reduce(
      (accum, slide, index) => {
        const { id } = slide;
        const label = makeNodeLabel(index + 1, slide);

        nodesById[id] = label;
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

      const a = slides[slideIndex - 1];
      const b = slides[slideIndex + 1];

      if (!edgeToNode && a) {
        const edgeFromA = edges.find(edge => edge.from === a.id);
        if (!edgeFromA) {
          edges.push({
            from: a.id,
            to: slide.id
          });
        }
      }
      if (!edgeFromNode && b) {
        edges.push({
          from: slide.id,
          to: b.id
        });
      }

      // Resolve positioning
      node.x = colCounter * nodeWidth + nodePadding * colCounter ** 4;
      node.y = rowCounter * nodeHeight + nodePadding * rowCounter ** 3;

      colCounter++;
      if (colCounter === nodeCols) {
        // EXPERITMENTAL: Try using different edge types to make the
        // layout more readable.
        //
        // When we've reached the last column, make the edge connector
        // curve nicely, since it almost always must point all the way
        // back to the left.
        // const isNotLastNode = nodes.indexOf(node) !== nodes[nodes.length - 1];
        // const lastEdge = edges[edges.length - 1];
        // if (isNotLastNode && lastEdge.from && lastEdge.to) {
        //   // edges[edges.length - 1].smooth = {
        //   lastEdge.smooth = {
        //     enabled: true,
        //     type: 'cubicBezier'
        //   };
        // }

        colCounter = 0;
        rowCounter++;
      }
    });

    const description = edges.reduce((accum, edge) => {

      const fromNodeLabel = nodesById[edge.from];
      const toNodeLabel = nodesById[edge.to];
      let pathDescription =
        `The node labeled "${fromNodeLabel}" leads to the node labeled "${toNodeLabel}"`;

      if (edge.label) {
        pathDescription += `, with the label ${edge.label}`;
      }

      pathDescription += '.';

      return accum.concat([pathDescription]);
    }, []).join(' ').trim();

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
          type: 'curvedCW'
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
    const makeAccessible = (node) => {
      if (node) {
        const canvas = node.querySelector('canvas');

        if (canvas) {
          if (!canvas.getAttribute('role')) {
            canvas.setAttribute('role', 'img');
          }

          if (!canvas.getAttribute('aria-label')) {
            canvas.setAttribute('aria-label', description);
          }

          if (!canvas.innerText) {
            canvas.innerText = description;
          }
        }
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
        <Modal.Header>{scenario.title}</Modal.Header>
        <Modal.Content>
          <Ref innerRef={makeAccessible}>
            <Graph events={events} graph={graph} options={options} />
          </Ref>
        </Modal.Content>
      </Modal>
    );
  }
}

MultiPathNetworkGraphModal.propTypes = {
  getSlides: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  scenario: PropTypes.object,
  slides: PropTypes.array
};

const mapStateToProps = state => {
  const { slides } = state.scenario;
  return { slides };
};

const mapDispatchToProps = dispatch => ({
  getSlides: params => dispatch(getSlides(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiPathNetworkGraphModal);
