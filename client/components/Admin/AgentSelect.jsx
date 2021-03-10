import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Table } from '@components/UI';

const AgentSelectItem = ({ title, description }) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>{title}</Table.HeaderCell>
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

AgentSelectItem.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string
};

class AgentSelect extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, { value }) {
    const selected = value ? this.props.agentsById[value] : null;
    this.props.onSelect(selected);
  }

  render() {
    const { onChange } = this;
    const {
      emptyText = 'No selection',
      fluid,
      item,
      agents,
      placeholder,
      search,
      selection,
      types,
      value,
      error
    } = this.props;

    // This empty "agent" option is used to prevent the
    // dropdown from treating "open" as "select".
    agents.unshift({
      id: '',
      description: '',
      title: emptyText
    });

    const options = agents.reduce((accum, agent) => {
      const option = {
        key: agent.id,
        value: agent.id,
        text: agent.title
      };

      if (agent.id && agent.interaction) {
        option.content = <AgentSelectItem {...agent} />;

        const isSupported =
          agent.interaction.types &&
          types.every(type => agent.interaction.types.includes(type));
        if (isSupported) {
          // Only display agents that are compatible
          // with this component type
          accum.push(option);
        }
      } else {
        // Include the dummy.
        accum.push(option);
      }
      return accum;
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

AgentSelect.propTypes = {
  agents: PropTypes.array,
  agentsById: PropTypes.object,
  agentsInUse: PropTypes.array,
  defaultValue: PropTypes.number,
  error: PropTypes.bool,
  emptyText: PropTypes.string,
  fluid: PropTypes.bool,
  item: PropTypes.any,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  search: PropTypes.bool,
  selection: PropTypes.bool,
  style: PropTypes.object,
  types: PropTypes.array,
  value: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  const types = ownProps.types && ownProps.types.length ? ownProps.types : [];
  const agentsInUse = ownProps.agentsInUse;
  const sourceAgents = state.agents.length
    ? state.agents
    : ownProps.agents || [];

  // Ensure that we only display agents that are actually in use.
  // If none are in use, then the component does nothing.
  const preFilteredAgents = agentsInUse
    ? sourceAgents.filter(a => agentsInUse.includes(a.id))
    : sourceAgents;

  const filteredAgents = preFilteredAgents.filter(a => !a.deleted_at);

  const emptyText = !filteredAgents.length
    ? 'There are currently no compatible agents in use'
    : ownProps.emptyText;

  const placeholder = !filteredAgents.length ? emptyText : ownProps.placeholder;

  const agents = filteredAgents.slice();
  const agentsById = agents.reduce(
    (accum, agent) => ({
      ...accum,
      [agent.id]: agent
    }),
    {}
  );

  return {
    agents,
    agentsInUse,
    agentsById,
    emptyText,
    placeholder,
    types
  };
};

const mapDispatchToProps = dispatch => ({
  // getAgents: () => dispatch(getAgents())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AgentSelect);
