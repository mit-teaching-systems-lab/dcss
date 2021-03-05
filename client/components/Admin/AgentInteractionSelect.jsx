import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Table } from '@components/UI';
import { getInteractions } from '@actions/interaction';

const AgentInteractionSelectItem = ({ name, description }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{name}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {description ? (
          <Table.Row>
            <Table.Cell>{description}</Table.Cell>
          </Table.Row>
        ) : null}
      </Table.Body>
    </Table>
  );
};

AgentInteractionSelectItem.propTypes = {
  description: PropTypes.string,
  name: PropTypes.string
};

class AgentInteractionSelect extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    if (!this.props.interactions.length) {
      await this.props.getInteractions();
    }
  }

  onChange(e, { value }) {
    const selected = value ? this.props.interactionsById[value] : null;
    this.props.onSelect(selected);
  }

  render() {
    if (!this.props.interactions.length) {
      return null;
    }

    const { onChange } = this;
    const {
      emptyText = 'No selection',
      fluid,
      item,
      interactions,
      placeholder,
      search,
      selection,
      value,
      error
    } = this.props;

    // This empty "interaction" option is used to prevent the
    // dropdown from treating "open" as "select".
    interactions.unshift({
      id: '',
      value: null,
      name: emptyText
    });

    const options = interactions.reduce((accum, interaction) => {
      const option = {
        key: interaction.id,
        value: interaction.id,
        text: interaction.name
      };

      if (interaction.id && interaction.name) {
        option.content = <AgentInteractionSelectItem {...interaction} />;
      }
      return accum.concat([option]);
    }, []);

    const scrolling = true;
    const dropdownProps = {
      'aria-label': placeholder,
      fluid,
      item,
      onChange,
      options,
      placeholder,
      scrolling,
      search,
      selection,
      value,
      error
    };

    return <Dropdown {...dropdownProps} />;
  }
}

AgentInteractionSelect.propTypes = {
  getInteractions: PropTypes.func,
  defaultValue: PropTypes.number,
  error: PropTypes.bool,
  emptyText: PropTypes.string,
  fluid: PropTypes.bool,
  interactions: PropTypes.array,
  interactionsById: PropTypes.object,
  item: PropTypes.any,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  search: PropTypes.bool,
  selection: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  const sourceInteractions = state.interactions.length
    ? state.interactions
    : ownProps.interactions || [];

  const interactions = sourceInteractions.slice();
  const interactionsById = interactions.reduce(
    (accum, interaction) => ({
      ...accum,
      [interaction.id]: interaction
    }),
    {}
  );

  return {
    interactions,
    interactionsById
  };
};

const mapDispatchToProps = dispatch => ({
  getInteractions: () => dispatch(getInteractions())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentInteractionSelect);
