import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export default class ResultVariable {
  constructor({ DataType, Description, ID, Name }) {
    this.id = ID;
    this.type = DataType;
    this.name = Name;
    this.description = Description;
  }

  static get() {
    return ajax
      .getJSON(
        'https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json'
      )
      .pipe(
        map(json => {
          try {
            return ResultVariable.create(json.Message, json.Results);
          } catch (e) {
            return ResultVariable.create(e.message);
          }
        })
      );
  }

  static create(message = '', results = []) {
    return {
      message,
      results: results.map(r => new ResultVariable(r))
    };
  }
}
