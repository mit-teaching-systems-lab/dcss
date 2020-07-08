import React from 'react';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';
import Storage from '@utils/Storage';

const SlideComponents = ({
  asSVG = false,
  components,
  onResponseChange,
  run
}) => {
  const emptyValue = { value: '' };
  const runOnly = run ? { run } : {};
  const style = {
    height: '100px',
    overflow: 'hidden',
    margin: '-1rem !important'
  };
  const transform = 'scale(0.3)';
  const width = '100%';
  const height = '100%';

  // Attempted to use this, but does not provide the
  // interaction prevention that an SVG rect overlay provides:
  // (from https://sequelize.org/v5/)
  //
  // transform: scale(0.4);
  // transform-origin: 0 0;
  // width: 250%;
  //
  return asSVG ? (
    <div style={style}>
      <svg width="500" height="1000">
        {/* intentionally break out */}
        <foreignObject transform={transform} width={width} height={height}>
          {/*
            Only the first three components
            will be rendered. This prevents
            the UI from getting sluggish for
            the sake of rendering these
            entirely non-functional version.
          */}

          {components.slice(0, 3).map((value, index) => {
            const { type } = value;
            if (!Components[type]) return;

            const { Display } = Components[type];
            return (
              <Display
                isEmbeddedInSVG={true}
                key={`component-svg-${index}`}
                persisted={{}}
                {...value}
              />
            );
          })}
        </foreignObject>
        <rect
          x="0"
          y="0"
          fill="transparent"
          transform={transform}
          width={width}
          height={height}
        />
      </svg>
    </div>
  ) : (
    components.map((value, index) => {
      const { type, responseId = null } = value;
      if (!Components[type]) return;

      const { Display } = Components[type];
      const persisted = run
        ? Storage.get(`run/${run.id}/${responseId}`, emptyValue)
        : emptyValue;

      return (
        <Display
          key={`component-html-${index}`}
          persisted={persisted}
          onResponseChange={onResponseChange}
          {...runOnly}
          {...value}
        />
      );
    })
  );
};

SlideComponents.propTypes = {
  asSVG: PropTypes.bool,
  components: PropTypes.array,
  onResponseChange: PropTypes.func,
  run: PropTypes.object
};
export default SlideComponents;
