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
  return dayjs.utc(dateA).isAfter(dayjs.utc(dateB));
}

export const isUtcDateAEqualOrAfterB = (dateAUtc: string, dateBUtc: string): boolean => {
  // @ts-ignore
  return (dateAUtc === dateBUtc) || dayjs.utc(dateAUtc).isAfter(dayjs.utc(dateBUtc));
}

export const isDateCreatedInLastGivenMinutes = (utcDate: string, minutes: number): boolean => {
  // @ts-ignore
  const a = dayjs.utc(utcDate).isSame(dayjs.utc());
  // @ts-ignore
  const b = dayjs.utc(utcDate).isBefore(dayjs.utc());
  // @ts-ignore
  const c = dayjs.utc(utcDate).isAfter(dayjs.utc().subtract(minutes, 'minute'));
  return ( a || b) && c;
}
export const isDateInTheFuture = (utcDate: string): boolean => {
  // @ts-ignore
  return dayjs.utc(utcDate).isAfter(dayjs.utc());
}

export const formatDateNice = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}