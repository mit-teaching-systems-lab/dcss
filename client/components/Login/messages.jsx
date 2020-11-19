import React, { Fragment } from 'react';

export default {
  'Authentication failed.': (
    <Fragment>
      <strong>There was a problem logging you in.</strong>
      <ul style={{ paddingInlineStart: '2em' }}>
        <li>
          Verify that you&apos;re using the correct username and password for
          this website.
        </li>
        <li>Check that your username and password are typed correctly.</li>
      </ul>
    </Fragment>
  )
};
