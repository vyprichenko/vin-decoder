import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import VinService from './services/VinService';
import VinForm from './components/VinForm';
import LastSearches from './components/LastSearches';
import ResultsTable from './components/ResultsTable';
import VariablesTable from './components/VariablesTable';
import Variable from './components/Variable';

class App extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      variables: null
    };

    this.vinService = new VinService();
  }

  componentDidMount() {
    this.resultsSubscription = this.vinService.results$.subscribe(results =>
      this.setState({ results })
    );
    this.variablesSubscription = this.vinService.variables$.subscribe(results =>
      this.setState({ variables: results })
    );
    this.vinService.decode(this.vin);
  }

  componentDidUpdate({ location: prevLocation }) {
    const prevVin = this.parseVinQuery(prevLocation);
    const thisVin = this.vin;

    if (thisVin.code !== prevVin.code) {
      this.vinService.decode(thisVin);
    }
  }

  componentWillUnmount() {
    this.resultsSubscription.unsubscribe();
    this.variablesSubscription.unsubscribe();
  }

  parseVinQuery(location) {
    const { vin } = QueryString.parse(location.search);
    return this.vinService.parse(vin);
  }

  get vin() {
    const { location } = this.props;
    return this.parseVinQuery(location);
  }

  get codeResults() {
    const { results } = this.state;
    return results ? results.get(this.vin.code) : null;
  }

  get searches() {
    const { results } = this.state;
    return results ? [...results.keys()] : [];
  }

  onVinSubmit = vin => {
    const { history, location } = this.props;
    history.push({
      ...location,
      search: vin ? `?vin=${vin.code}` : null
    });
  };

  renderRootRoute({ location }) {
    const { vin, codeResults: results } = this;
    return (
      <>
        <h1>VIN Decoder</h1>
        <VinForm
          key={`vin[${vin.code}]`}
          defaultVin={vin}
          parseVin={this.vinService.parse}
          onSubmit={this.onVinSubmit}
        />
        <LastSearches location={location} searches={this.searches} />
        {results ? (
          <ResultsTable location={location} results={results} />
        ) : null}
      </>
    );
  }

  renderVariablesTableRoute() {
    const { variables } = this.state;

    if (variables) {
      const { message, results } = variables;

      if (results.length === 0)
        return (
          <>
            <h1>Vehicle Variables</h1>
            <p>{message}</p>
          </>
        );
      else
        return (
          <>
            <h1>Vehicle Variables</h1>
            <VariablesTable variables={results} />
          </>
        );
    }
    return null;
  }

  renderVariableRoute({ match }) {
    const { variables } = this.state;
    const variableId = parseInt(match.params.variableId, 10);

    if (variables) {
      const { message, results } = variables;
      const variable = results.find(v => v.id === variableId);

      if (results.length === 0)
        return (
          <>
            <h1>Variable</h1>
            <p>{message}</p>
          </>
        );
      if (!variable)
        return (
          <>
            <h1>Variable</h1>
            <p>Not Found</p>
          </>
        );
      else
        return (
          <>
            <h1>{variable.name}</h1>
            <Variable variable={variable} />
          </>
        );
    }
    return null;
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" render={props => this.renderRootRoute(props)} />
        <Route
          exact
          path="/variables"
          render={props => this.renderVariablesTableRoute(props)}
        />
        <Route
          exact
          path="/variables/:variableId"
          render={props => this.renderVariableRoute(props)}
        />
        <Redirect to="/" />
      </Switch>
    );
  }
}

export default () => (
  <Router>
    <Route component={App} />
  </Router>
);
