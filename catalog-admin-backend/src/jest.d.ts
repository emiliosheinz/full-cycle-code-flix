import type { FieldsErrors } from './shared/domain/validators/validator-fields-interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      notificationContainsErrorMessages: (expected: Array<FieldsErrors>) => R;
    }
  }
}
