import Result from './Result';

export default class Vin {
  constructor(code) {
    this.code = (code || '').toUpperCase();
  }

  validate() {
    const { code } = this;

    if (code.length === 0 || code.length > 17) {
      return 'Expecting 1 to 17 characters.';
    }
    if (/[IOQ]/.test(code)) {
      return 'Letters I, O and Q are not allowed.';
    }
    if (code.length > 8 && /[^\d*]/.test(code[8])) {
      return 'Check Digit (9th position) does not calculate properly.';
    }
    return '';
  }

  decode() {
    return Result.get(this);
  }

  toString() {
    return this.code;
  }
}
