import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function LastSearches({ searches, location }) {
  return searches.length > 0 ? (
    <p>
      {'History: '}
      {searches.map((vin, i, arr) => (
        <React.Fragment key={vin}>
          <Link to={{ ...location, search: `?vin=${vin}` }}>{vin}</Link>
          {i + 1 < arr.length ? ', ' : null}
        </React.Fragment>
      ))}
    </p>
  ) : null;
}

LastSearches.propTypes = {
  searches: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.object.isRequired
};
