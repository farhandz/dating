import { DateTime, Settings } from 'luxon';

Settings.defaultZoneName = 'Asia/Jakarta';

export const currDate = (): any => {
  return DateTime.now();
};
