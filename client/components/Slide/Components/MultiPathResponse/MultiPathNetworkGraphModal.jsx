import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@components/UI';
import Cytoscape from 'cytoscape';
import CytoscapeGraph from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';
import hash from 'object-hash';

Cytoscape.use(dagre);


class MultiPathNetworkGraphModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      slides: []
    };
  }

  async componentDidMount() {
    const { scenarioId } = this.props;
    const { slides: unfiltered, status } = await (
      await fetch(`/api/scenarios/${scenarioId}/slides`)
    ).json();
    if (status === 200) {
      const slides = unfiltered.filter(({is_finish}) => !is_finish);
      this.setState({
        isReady: true,
        slides
      });
    }
  }

  render() {

    const { isReady, slides } = this.state;
    const { onClose, open, options } = this.props;

    if (!isReady) {
      return null;
    }

    const nodes = options.map(({ text: label, value }) => {
      const id = value;
      return { data: { id, label } };
    });

    const edges = slides.reduce((accum, slide, index) => {
      const source = slide.id;
      const edgesFromNode = slide.components.reduce((accum, component) => {
        if (component.paths && Array.isArray(component.paths)) {
          accum.push(
            ...component.paths.reduce((accum, {id}) => {
              const target = String(id);
              if (target !== source) {
                accum.push({ data: {source, target}});
              }
              return accum;
            }, [])
          );
        }
        return accum;
      }, []);
      accum.push(...edgesFromNode);
      return accum;
    }, []);

    const elements = [
      ...nodes,
      ...edges
    ];

    const style = {
      width: '100%',
      height: window.innerHeight - 100
    };

    const layout = {
      name: 'dagre',
      // the separation between adjacent nodes in the same rank
      nodeSep: 200,
      // the separation between adjacent edges in the same rank
      edgeSep: 200,
      // the separation between each rank in the layout
      // rankSep: 1,
      // 'TB' for top to bottom flow, 'LR' for left to right,
      // rankDir: undefined,
      // Type of algorithm to assign a rank to each node in the input graph.
      // Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
      ranker: 'network-simplex',
      // ranker: 'tight-tree',
      // number of ranks to keep between the source and target of the edge
      minLen(edge) { return 2; },
      // higher weight edges are generally made shorter and straighter than lower weight edges
      edgeWeight(edge) { return 1; },
      //
      // general layout options
      // whether to fit to viewport
      fit: false,
      // fit padding
      padding: 30,
      // Applies a multiplicative factor (>0) to expand or compress the overall
      // area that the nodes take up
      spacingFactor: undefined,
      // whether labels should be included in determining the space used by a node
      nodeDimensionsIncludeLabels: false,
      // whether to transition the node positions
      animate: false,
      // whether to animate specific nodes when animation is on;
      // non-animated nodes immediately go to their final positions
      // animateFilter( node, i ){ return true; },
      // duration of animation in ms if enabled
      // animationDuration: 500,
      // easing of animation if enabled
      // animationEasing: undefined,
      // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      // boundingBox: { x1: 0, y1: 0, w: 1600, h: style.height },
      // a function that applies a transform to the final node position
      // transform(node, pos) {
      //   return pos;
      // },
      ready() {
        // console.log('ready');
      }, // on layoutready
      stop() {
        // console.log('stop');
      } // on layoutstop
    };

    const stylesheet = [
      {
        selector: 'node',
        style: {
          // 'content': 'data(label)',
          'label': 'data(label)',
          'font-size': '12px',
          'background-color': '#555',
          'color': '#fff',
          'overlay-padding': '6px',
          'shape': 'ellipse',
          'text-background-color': '#555',
          'text-background-opacity': 1,
          'text-background-shape': 'round-rectangle',
          'text-border-color': '#555',
          'text-border-width': 20,
          'text-border-opacity': 1,
          'text-halign': 'center',
          'text-valign': 'center',
          'z-index': '10',
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'width': 4,
          'target-arrow-shape': 'triangle',
          'line-color': '#555',
          'target-arrow-color': '#555',
          'opacity': 0.5
        }
      }
    ];


    // const zoom = -2;
    const cy = (cy) => {
      cy.on('click', (event) => {
        if (event.target.id) {
          console.log('click', event.target.id())
        }
      })
    };

    const cytoscapeGraphProps = {
      autounselectify: true,
      boxSelectionEnabled: false,
      cy,
      elements,
      layout,
      stylesheet,
      style
    };

    return (
      <Modal
        size="fullscreen"
        closeIcon
        open={open}
        onClose={onClose}
      >
        <Modal.Content>
          <CytoscapeGraph {...cytoscapeGraphProps} />
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
  scenarioId: PropTypes.node,
};

export default MultiPathNetworkGraphModal;
