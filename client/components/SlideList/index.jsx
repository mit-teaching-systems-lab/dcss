import React, { Component } from 'react';
import * as Components from '@components/Slide/Components';
import './SlideList.css';

const SlideList = ({ components }) => {
    return components.map((value, index) => {
        const { type } = value;
        const { Display } = Components[type];
        return <Display key={`slide${index}`} {...value} />;
    });
};

export default SlideList;
