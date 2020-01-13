import React from 'react';
import PropTypes from 'prop-types';

export default function Variable({ variable }) {
  return <div dangerouslySetInnerHTML={{ __html: variable.description }} />;
}

Variable.propTypes = {
  variable: PropTypes.object.isRequired
};
