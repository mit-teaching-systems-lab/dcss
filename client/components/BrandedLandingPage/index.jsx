import React, { Component } from 'react';

const DCSS_BRAND_LANDING_PAGE_URL =
  process.env.DCSS_BRAND_LANDING_PAGE_URL || null;
//
// DCSS_BRAND_LANDING_PAGE_URL = https://dcss-tm-landing-staging.herokuapp.com/
//
function BrandedLandingPage() {
  return (
    <iframe
      sandbox="allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
      src={`${DCSS_BRAND_LANDING_PAGE_URL}?${window.location.origin}`}
      style={{
        border: '0',
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}

BrandedLandingPage.hasValidURL = DCSS_BRAND_LANDING_PAGE_URL !== null;

export default BrandedLandingPage;
