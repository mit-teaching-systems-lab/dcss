import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Button, Modal, Ref } from '@components/UI';
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
  const { direction, disabled, index = -1, name, onChange, position } = props;
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(props.value);
  const [focusIndex, setFocusIndex] = useState(0);
  const [buttonRef, setButtonRef] = useState(null);
  const [shouldTrackMouse, setShouldTrackMouse] = useState(false);

  const onTriggerClick = e => {
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

  const onSwatchClick = (e, { value }) => {
    setColor(value);
    onChange(
      {},
      {
        index,
        name,
        value
      }
    );
    onTriggerClick(e);
  };

  const ariaLabel = disabled
    ? `Selected color is ${color}`
    : `Click to select a color`;

  const buttonProps = {
    'aria-label': ariaLabel,
    onClick: onTriggerClick,
    style: {
      background: color
    },
    tabIndex: 0
  };

  let swatchSelectPopupClassName = 'cpa__swatch-select-popup';

  if (direction) {
    swatchSelectPopupClassName += ` cpa__swatch-select-popup-${direction}`;
  }

  const swatchSelectPopupStyle = {
    position
  };

  if (position === 'fixed' && buttonRef) {
    const boundingRect = buttonRef.getBoundingClientRect();
    swatchSelectPopupStyle.top = `${boundingRect.top + boundingRect.height}px`;
  }

  return (
    <Fragment>
      <Ref innerRef={setButtonRef}>
        <button className="cpa__swatch-button" role="button" {...buttonProps} />
      </Ref>
      {open ? (
        <div
          className={swatchSelectPopupClassName}
          style={swatchSelectPopupStyle}
        >
          <div
            className="cpa__swatch-select-popup-background"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Modal.Accessible open={open}>
            <div className="cpa__swatch-select-panel">
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

                const onSwatchFocus = () => setFocusIndex(index);
                return (
                  <Button
                    name="color"
                    className="cpa__swatch-select-button"
                    tabIndex={0}
                    index={index}
                    key={key}
                    value={background}
                    title={background}
                    style={style}
                    onFocus={onSwatchFocus}
                    onClick={onSwatchClick}
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
  direction: PropTypes.string,
  disabled: PropTypes.bool,
  index: PropTypes.number,
  name: PropTypes.string,
  onChange: PropTypes.func,
  position: PropTypes.string.isRequired,
  value: PropTypes.string
};

ColorPicker.Accessible = ColorPicker;

export { ColorPicker };
