import { UserFriendlyDateTimePipe } from './user-friendly-date-time.pipe';

describe('UserFriendlyDateTimePipe', () => {
  it('create an instance', () => {
    const pipe = new UserFriendlyDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});
