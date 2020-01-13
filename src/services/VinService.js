import { of, BehaviorSubject, Subject } from 'rxjs';
import {
  catchError,
  dematerialize,
  filter,
  materialize,
  scan,
  share,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import Vin from '../model/Vin';
import ResultVariable from '../model/ResultVariable';

export default class VinService {
  constructor() {
    this.variables$ = ResultVariable.get().pipe(
      catchError(e => ResultVariable.create(e.message)),
      shareReplay(1)
    );

    this.results$ = new BehaviorSubject().pipe(
      scan((valueMap, value) => {
        return value && !valueMap.has(value.search)
          ? new Map(
              [...valueMap.entries()]
                .concat([[value.search, value]])
                .reverse()
                .slice(0, 5)
                .reverse()
            )
          : valueMap;
      }, new Map()),
      shareReplay(1)
    );

    this.decode$ = new Subject().pipe(
      filter(vin => vin.code),
      withLatestFrom(this.results$),
      switchMap(([vin, results]) =>
        results.has(vin.code) ? of(results.get(vin.code)) : vin.decode()
      ),
      materialize(),
      tap(({ kind, value }) => {
        if (kind === 'N') this.results$.next(value);
      }),
      share()
    );
  }

  parse(code) {
    return new Vin(code);
  }

  decode(vin) {
    const promise = this.decode$.pipe(dematerialize()).toPromise();
    this.decode$.next(vin);
    return promise;
  }
}
