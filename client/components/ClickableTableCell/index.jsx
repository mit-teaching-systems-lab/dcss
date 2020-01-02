import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { detect } from 'detect-browser';

const IS_ANDROID = detect()
    .os.toLowerCase()
    .includes('android');

const ClickableTableCell = props => {
    const { className, display, href } = props;
    const onClick = IS_ANDROID ? () => (location.href = href) : null;
    return (
        <Table.Cell
            className={className}
            onClick={onClick}
            onTouchStart={onClick}
        >
            {href && display && <Link to={href}>{display}</Link>}
        </Table.Cell>
    );
};

ClickableTableCell.propTypes = {
    className: PropTypes.string,
    display: PropTypes.string,
    href: PropTypes.string
};

export default ClickableTableCell;
