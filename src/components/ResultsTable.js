import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class ResultsTable extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const { location } = this.props;
    const { message, results } = this.props.results;

    return (
      <>
        <p>{message}</p>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {results
              .filter(r => r.value !== '' && r.value !== null)
              .map(r => (
                <tr key={r.variableId}>
                  <td>
                    <Link
                      to={{
                        ...location,
                        pathname: `variables/${r.variableId}`,
                        search: ''
                      }}
                    >
                      {r.variable}
                    </Link>
                  </td>
                  <td>{r.value}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p>
          <Link
            to={{
              ...location,
              pathname: 'variables',
              search: ''
            }}
          >
            Vehicle Variables List
          </Link>
        </p>
      </>
    );
  }
}
