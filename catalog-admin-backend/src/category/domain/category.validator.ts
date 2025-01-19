import { MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-field';
import type { Notification } from '../../shared/domain/validators/notification';

class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: unknown,
    fields?: string[],
  ): boolean {
    const fieldsWithFallback = fields?.length ? fields : ['name'];
    return super.validate(
      notification,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      new CategoryRules(data as any),
      fieldsWithFallback,
    );
  }
}
