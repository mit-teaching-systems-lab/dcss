import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Table } from '@components/UI';
import * as Color from '@utils/Color';

const ScenarioPersonaSelectItem = ({
  name,
  description,
  color: backgroundColor
}) => {
  const color = Color.foregroundColor(backgroundColor);
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ color, backgroundColor }}>
            {name}
          </Table.HeaderCell>
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

ScenarioPersonaSelectItem.propTypes = {
  color: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string
};

class ScenarioPersonaSelect extends Component {
  constructor(props) {
    super(props);

    this.personasById = props.personas.reduce((accum, persona) => {
      accum[persona.id] = persona;
      return accum;
    }, {});

    this.onChange = this.onChange.bind(this);
  }

  onChange(e, { value }) {
    this.props.onSelect((value && this.personasById[value]) || null);
  }

  render() {
    const { onChange } = this;
    const {
      defaultValue,
      emptyText = 'No selection',
      fluid,
      item,
      personas,
      placeholder,
      scenario,
      search,
      selection,
      value
    } = this.props;

    // This empty "persona" option is used to prevent the
    // dropdown from treating "open" as "select".
    personas.unshift({
      id: '',
      value: null,
      name: emptyText
    });

    const options = personas.reduce((accum, persona) => {
      const option = {
        key: persona.id,
        value: persona.id,
        text: persona.name
      };

      if (persona.id && persona.name) {
        option.content = <ScenarioPersonaSelectItem {...persona} />;
      }
      return accum.concat([option]);
    }, []);

    const dropdownProps = {
      'aria-label': placeholder,
      defaultValue,
      fluid,
      item,
      onChange,
      options,
      placeholder,
      search,
      selection,
      value
    };

    return <Dropdown className="sp__dropdown" {...dropdownProps} />;
  }
}

ScenarioPersonaSelect.propTypes = {
  defaultValue: PropTypes.node,
  emptyText: PropTypes.string,
  fluid: PropTypes.bool,
  onSelect: PropTypes.func,
  personas: PropTypes.array,
  placeholder: PropTypes.node,
  scenario: PropTypes.object,
  search: PropTypes.bool,
  selection: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.node
};

const mapStateToProps = (state, ownProps) => {
  const { scenario } = state;
  const personas = ownProps.personas.slice(0);
  return {
    personas,
    scenario
  };
};

export default connect(
  mapStateToProps,
  null
)(ScenarioPersonaSelect);
