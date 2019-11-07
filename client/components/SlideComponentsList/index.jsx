import React from 'react';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';

const SlideComponentsList = ({ asSVG = false, components }) => {
    const style = {
        height: '150px',
        overflow: 'hidden'
    };
    return asSVG ? (
        <div style={style}>
            <svg width="500" height="400">
                {/* intentionally break out */}
                <foreignObject
                    transform="scale(0.5)"
                    width="100%"
                    height="100%"
                >
                    {components.map((value, index) => {
                        const { type } = value;
                        const { Display } = Components[type];
                        return <Display key={`slide${index}`} {...value} />;
                    })}
                </foreignObject>
                <rect
                    x="0"
                    y="0"
                    transform="scale(0.5)"
                    width="500"
                    height="400"
                    fill="transparent"
                />
            </svg>
        </div>
    ) : (
        components.map((value, index) => {
            const { type } = value;
            const { Display } = Components[type];
            return <Display key={`slide${index}`} {...value} />;
        })
    );
};

SlideComponentsList.propTypes = {
    asSVG: PropTypes.bool,
    components: PropTypes.array
};
export default SlideComponentsList;
