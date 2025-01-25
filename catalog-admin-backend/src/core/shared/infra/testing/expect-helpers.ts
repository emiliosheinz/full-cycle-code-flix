import type { Notification } from '../../domain/validators/notification';

expect.extend({
	notificationContainsErrorMessages(
		expected: Notification,
		received: Array<string | { [key: string]: string[] }>,
	) {
		const every = received.every((error) => {
			if (typeof error === 'string') {
				return expected.errors.has(error);
			}

			return Object.entries(error).every(([field, messages]) => {
				const fieldMessages = expected.errors.get(field) as string[];

				return (
					fieldMessages?.length &&
					fieldMessages.every((message) => messages.includes(message))
				);
			});
		});

		return every
			? { pass: true, message: () => '' }
			: {
					pass: false,
					message: () =>
						`The validation errors not contains ${JSON.stringify(
							received,
						)}. Current: ${JSON.stringify(expected.toJSON())}`,
				};
	},
});
