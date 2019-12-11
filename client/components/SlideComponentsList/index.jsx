import React from 'react';
import PropTypes from 'prop-types';
import * as Components from '@components/Slide/Components';
import storage from 'local-storage-fallback';

const SlideComponentsList = ({
    asSVG = false,
    components,
    onResponseChange,
    run
}) => {
    const emptyValue = '{"value":""}';
    const runOnly = run ? { run } : {};
    const style = {
        height: '150px',
        overflow: 'hidden',
        margin: '-1rem !important'
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
                        if (!Components[type]) return;

                        const { Display } = Components[type];
                        return (
                            <Display
                                key={`slide${index}`}
                                persisted={{}}
                                {...value}
                            />
                        );
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
            const { type, responseId = null } = value;
            if (!Components[type]) return;

            const { Display } = Components[type];
            const persisted = JSON.parse(
                run && responseId
                    ? storage.getItem(`${run.id}-${responseId}`) || emptyValue
                    : emptyValue
            );
            return (
                <Display
                    key={`slide${index}`}
                    persisted={persisted}
                    onResponseChange={onResponseChange}
                    {...runOnly}
                    {...value}
                />
            );
        })
    );
};

SlideComponentsList.propTypes = {
    asSVG: PropTypes.bool,
    components: PropTypes.array,
    onResponseChange: PropTypes.func,
    run: PropTypes.object
};
export default SlideComponentsList;
