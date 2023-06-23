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

export const isUtcDateAAfterB = (dateAUtc: string, dateBUtc: string): boolean => {
  // @ts-ignore
  return dayjs(dateAUtc).utc().isAfter(dayjs.utc(dateBUtc));
}


export const isDateCreatedInLast5minutes = (utcDate: string): boolean => {
  // @ts-ignore
  return dayjs(utcDate).utc().isBefore(dayjs()) && dayjs(utcDate).utc().isAfter(dayjs().subtract(5, 'minute'));
}
export const isDateInTheFuture = (utcDate: string): boolean => {
  // @ts-ignore
  return dayjs(utcDate).utc().isAfter(dayjs());
}