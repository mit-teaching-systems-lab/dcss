import React from 'react';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';
import Session from '@utils/Session';

const SlideList = ({ asSVG = false, components, onResponseChange, run }) => {
  const emptyValue = { value: '' };
  const runOnly = run ? { run } : {};
  const style = {
    height: '100px',
    overflow: 'hidden',
    margin: '-1rem !important'
  };
  const transform = 'scale(0.45)';
  const width = '100%';
  const height = '100%';

  // check this out: https://sequelize.org/v5/
  // transform: scale(0.4);
  // transform-origin: 0 0;
  // width: 250%;
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
            return <Display key={`slide-${index}`} persisted={{}} {...value} />;
          })}
        </foreignObject>
        <rect
          x="0"
          y="0"
          transform={transform}
          width={width}
          height={height}
          fill="transparent"
        />
      </svg>
    </div>
  ) : (
    components.map((value, index) => {
      const { type, responseId = null } = value;
      if (!Components[type]) return;

      const { Display } = Components[type];
      const persisted = run
        ? Session.get(`run/${run.id}/${responseId}`, emptyValue)
        : emptyValue;

      return (
        <Display
          key={`slide-${index}`}
          persisted={persisted}
          onResponseChange={onResponseChange}
          {...runOnly}
          {...value}
        />
      );
    })
  );
};

SlideList.propTypes = {
  asSVG: PropTypes.bool,
  components: PropTypes.array,
  onResponseChange: PropTypes.func,
  run: PropTypes.object
};
export default SlideList;
