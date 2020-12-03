import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Identity from '@utils/Identity';
import PropTypes from 'prop-types';
import { Dropdown, Form } from '@components/UI';
import { getLabels } from '@actions/tags';

function makeOptions(labels) {
  return labels.map(label => ({
    key: Identity.key(label),
    text: label.name,
    value: label.name
  }));
}

class DropdownLabels extends Component {
  onAddItem = (e, { value }) => {
    this.setState(prevState => ({
      options: [{ text: value, value }, ...prevState.options]
    }));
  };

  onChange = (e, { value }) => {
    this.setState({ labels: value });
    this.props.onChange(e, {
      name: 'labels',
      value
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      labels: props.scenario.labels,
      options: null
    };
  }

  async componentDidMount() {
    const options = makeOptions(await this.props.getLabels());

    this.setState({
      options
    });
  }

  render() {
    const { labels, options = [] } = this.state;

    return (
      <Form.Field>
        <label>Labels</label>
        <Dropdown
          search
          selection
          fluid
          multiple
          allowAdditions
          label="Labels"
          placeholder="Select labels, or type to create new labels"
          options={options}
          value={labels}
          onAddItem={this.onAddItem}
          onChange={this.onChange}
        />
      </Form.Field>
    );
  }
}

DropdownLabels.propTypes = {
  getLabels: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object
};

const mapStateToProps = state => {
  const { scenario } = state;
  return { scenario };
};

const mapDispatchToProps = dispatch => ({
  getLabels: () => dispatch(getLabels())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropdownLabels);
