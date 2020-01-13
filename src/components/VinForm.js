import React from 'react';
import PropTypes from 'prop-types';

export default class VinForm extends React.Component {
  static propTypes = {
    defaultVin: PropTypes.object.isRequired,
    parseVin: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    vin: this.props.defaultVin
  };

  onVinChange = e => {
    const { name, value } = e.target;
    const { parseVin } = this.props;
    this.setState({ [name]: parseVin(value) });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.vin);
  };

  onReset = e => {
    this.props.onSubmit();
  };

  render() {
    const { vin } = this.state;
    const error = vin.validate();
    return (
      <form name="vin-form" onSubmit={this.onSubmit} onReset={this.onReset}>
        {/* <p>
          The VIN is a composition of 17 characters (capital letters and digits)
          that serves as a unique identifier for each vehicle. However, it
          doesn't include letters I, O and Q. The VIN shows the unique
          specifications, features, and manufacturer of each vehicle. They help
          track recalls, registrations, insurance coverage, warranty claims, and
          theft.
        </p> */}
        <input
          type="text"
          name="vin"
          value={vin.code}
          placeholder="Enter VIN"
          autoFocus
          onChange={this.onVinChange}
        />
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
        <div>
          <small>{error}</small>
        </div>
      </form>
    );
  }
}
