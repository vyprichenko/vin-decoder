import React from 'react';
import PropTypes from 'prop-types';

export default function VariablesTable({ variables }) {
  return variables.map(v => (
    <React.Fragment key={v.id}>
      <h2 id={v.id}>{v.name}</h2>
      <div dangerouslySetInnerHTML={{ __html: v.description }} />
    </React.Fragment>
  ));
}

VariablesTable.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object).isRequired
};
