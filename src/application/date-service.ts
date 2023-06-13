import dayjs from 'dayjs';
// @ts-ignore
import dayjsPluginUTC from 'dayjs-plugin-utc'
dayjs.extend(dayjsPluginUTC);

export const isExpired = (utcDate: string): boolean => {
  // @ts-ignore
  return dayjs.utc().isAfter(dayjs.utc(utcDate));
}

export const isDateAAfterB = (dateA: Date, dateB: Date): boolean => {
  // @ts-ignore
  return dayjs(dateA).utc().isAfter(dayjs.utc(dateB));
}