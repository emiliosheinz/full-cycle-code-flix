import { Notification } from '../notification';

describe('Notification', () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  it('should add an error without a field', () => {
    notification.addError('Error message');
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('Error message')).toBe('Error message');
  });

  it('should add an error with a field', () => {
    notification.addError('Error message', 'field');
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('field')).toEqual(['Error message']);
  });

  it('should set an error without a field', () => {
    notification.setError('Error message');
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('Error message')).toBe('Error message');
  });

  it('should set an error with a field', () => {
    notification.setError('Error message', 'field');
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('field')).toEqual(['Error message']);
  });

  it('should set multiple errors with a field', () => {
    notification.setError(['Error message 1', 'Error message 2'], 'field');
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('field')).toEqual(['Error message 1', 'Error message 2']);
  });

  it('should check if there are errors', () => {
    expect(notification.hasErrors()).toBe(false);
    notification.addError('Error message');
    expect(notification.hasErrors()).toBe(true);
  });

  it('should copy errors from another notification', () => {
    const anotherNotification = new Notification();
    anotherNotification.addError('Error message', 'field');
    notification.copyErrors(anotherNotification);
    expect(notification.errors.size).toBe(1);
    expect(notification.errors.get('field')).toEqual(['Error message']);
  });

  it('should convert errors to JSON', () => {
    notification.addError('Error message', 'field');
    expect(notification.toJSON()).toEqual([{ field: ['Error message'] }]);
  });
});
