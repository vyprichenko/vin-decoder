import { throwError } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export default class Result {
  constructor({ Value, ValueId, Variable, VariableId }) {
    this.value = Value;
    this.valueId = ValueId;
    this.variable = Variable;
    this.variableId = VariableId;
  }

  static get(vin) {
    const error = vin.validate();

    if (error) {
      return throwError(Result.create(vin.code, error));
    }
    return ajax
      .getJSON(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin.code}?format=json`
      )
      .pipe(
        map(json => {
          try {
            return Result.create(vin.code, json.Message, json.Results);
          } catch (e) {
            return Result.create(vin.code, e.message);
          }
        })
      );
  }

  static create(search = '', message = '', results = []) {
    return {
      search,
      message,
      results: results.map(r => new Result(r))
    };
  }
}
