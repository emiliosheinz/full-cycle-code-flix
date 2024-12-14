import isEqual from 'lodash/isEqual';

export abstract class ValueObject {
  public equals(valueObject: this): boolean {
    if (!valueObject) {
      return false;
    }

    if (valueObject.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(valueObject, this);
  }
}
