import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Button, Modal, Segment } from '@components/UI';
import './ColorPickerAccessible.css';

const accessibleColorPalette = [
  '#781c81',
  '#462987',
  '#3f59a9',
  '#4686c2',
  '#58a4ac',
  '#73b580',
  '#95bd5e',
  '#b9bd4a',
  '#d6b13e',
  '#e59235',
  '#e55e2b',
  '#d92120'
];

let timeout = null;

function isMouseClick(e) {
  return !!(e && (e.screenX || e.screenY));
}

function ColorPicker(props) {
  const { disabled, name: id, name, onChange } = props;
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(props.value);
  const [focusIndex, setFocusIndex] = useState(0);
  const [shouldTrackMouse, setShouldTrackMouse] = useState(false);

  const onOpenOrCloseClick = e => {
    if (!disabled) {
      e.persist();
      // Picker opened via mouse click.
      setShouldTrackMouse(isMouseClick(e));
      setOpen(!open);
    }
  };

  const onMouseEnter = () => {
    if (!shouldTrackMouse) {
      return;
    }
    if (open) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setOpen(!open);
      }, 700);
    }
  };

  const onMouseLeave = () => {
    if (!shouldTrackMouse) {
      return;
    }
    clearTimeout(timeout);
  };

  const onFocus = index => {
    setFocusIndex(index);
  };

  const onClick = (e, { value }) => {
    setColor(value);
    onChange(
      {},
      {
        name,
        value
      }
    );
    onOpenOrCloseClick(e);
  };

  const ariaLabel = disabled
    ? `Select color is ${color}`
    : `Click to select a color`;

  const buttonProps = {
    'aria-label': ariaLabel,
    id,
    onClick: onOpenOrCloseClick,
    style: {
      background: color
    },
    tabIndex: 0
  };

  // TODO: move this into css
  const pickerPanelStyle = {
    background: '#ffffff',
    border: '0px solid rgba(0, 0, 0, 0.25)',
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 4px',
    borderRadius: '4px',
    padding: '1em 0.5em 0.5em 1em',
    width: '315px'
  };

  return (
    <Fragment>
      <button
        className="cpa__swatch-button"
        role="button"
        {...buttonProps}
      ></button>
      {open ? (
        <div className="cpa__swatch-select-popup">
          <div
            className="cpa__swatch-select-popup-background"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Modal.Accessible open={open}>
            <div style={pickerPanelStyle}>
              {accessibleColorPalette.map((background, index) => {
                const key = Identity.key({ background });
                let style = {
                  background
                };

                if (focusIndex === index) {
                  style = {
                    ...style,
                    border: '2px solid black'
                  };
                }

                const onButtonFocus = () => onFocus(index);
                return (
                  <Button
                    name="color"
                    tabIndex={0}
                    key={key}
                    value={background}
                    title={background}
                    className="cpa__swatch-select-button"
                    style={style}
                    onFocus={onButtonFocus}
                    onClick={onClick}
                  />
                );
              })}
              <div style={{ clear: 'both' }} />
            </div>
          </Modal.Accessible>
        </div>
      ) : null}
    </Fragment>
  );
}

ColorPicker.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

ColorPicker.Accessible = ColorPicker;

export { ColorPicker };
