import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dropdown } from 'semantic-ui-react';
import { ThumbnailGallery } from '@components/ThumbnailGallery';
import { ThumbnailGroup } from '@components/ThumbnailGroup';
import { Thumbnail } from '@components/Thumbnail';
import './thumbnailContainer.css';
import 'semantic-ui-css/semantic.min.css';

const dropDownValues = [
    {
        key: 'context',
        value: 'context',
        text: 'Context'
    },
    {
        key: 'anticipate',
        value: 'anticipate',
        text: 'Anticipate'
    },
    {
        key: 'enact',
        value: 'enact',
        text: 'Enact'
    },
    {
        key: 'reflect',
        value: 'reflect',
        text: 'Reflect'
    }
];

//TODO: remove this when actually implementing thumbnails
const getRand = () => Math.floor(Math.random() * Math.floor(10));
const getRandArr = () => {
    let n = getRand() || 1;
    return new Array(n).fill(0, 0, n);
};

export const ThumbnailContainer = ({ width }) => (
    <Grid.Column width={width} className="thumbnail_container" padded={false}>
        <Grid.Row className="dropdown_container">
            <Dropdown
                selection
                placeholder="Add +"
                fluid
                options={dropDownValues}
            />
        </Grid.Row>
        <ThumbnailGallery>
            {dropDownValues.map(v => (
                <ThumbnailGroup title={v.text} key={v}>
                    {getRandArr().map((i, index) => (
                        <Thumbnail key={index} />
                    ))}
                </ThumbnailGroup>
            ))}
        </ThumbnailGallery>
    </Grid.Column>
);

ThumbnailContainer.propTypes = {
    width: PropTypes.number
};
