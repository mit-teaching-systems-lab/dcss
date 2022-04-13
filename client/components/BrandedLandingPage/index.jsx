import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const DCSS_BRAND_LANDING_PAGE_URL =
  process.env.DCSS_BRAND_LANDING_PAGE_URL || null;
//
// DCSS_BRAND_LANDING_PAGE_URL = https://dcss-tm-landing-staging.herokuapp.com/
//
class BrandedLandingPage extends Component {
  render() {
    return (
      <iframe
        sandbox="allow-scripts allow-top-navigation"
        src={`${DCSS_BRAND_LANDING_PAGE_URL}?${window.location.origin}`}
        style={{
          border: '0',
          width: '100vw',
          height: '100vh'
        }}
      />
    );
  }
}

BrandedLandingPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

const WrappedBrandedLandingPage = withRouter(BrandedLandingPage);

WrappedBrandedLandingPage.hasValidURL = DCSS_BRAND_LANDING_PAGE_URL !== null;

export default WrappedBrandedLandingPage;
