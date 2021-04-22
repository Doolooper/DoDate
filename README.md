# DoDate

[![Build Status](https://travis-ci.com/Doolooper/DoDate.svg?branch=main)](https://travis-ci.com/Doolooper/DoDate)

### A simple immutable solution to jalali/shamsi date without timezone

```
⚠ if use pass time zoned value you will get different value
```

```ts
DoDate.now();
```

## Installation

```shell
$ npm install @doolooper/dodate
```

or

```shell
$ yarn add @doolooper/dodate
```

## static methods
---

-   `now(): DoDate`
-   `fromDate(date: Date): DoDate`
-   `fromJalali(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): DoDate`
-   `parse(date: string, pattern: string = "YYYY-MM-DDTHH:mm:ss"): DoDate`
-   `parseJalali(date: string, pattern: string = "YYYY-MM-DDTHH:mm:ss"): DoDate`
-   `isLeapYear(date: Date | number): boolean`
-   `isLeapYearJalali(date: Date | number): boolean`

## methods
---
-   `getDate(): Date`
-   `getYear(): number`
-   `getYearJalali(): number`
-   `getMonth(): number`
-   `getMonthJalali(): number`
-   `getDay(): number`
-   `getDayJalali(): number`
-   `getHour(): number`
-   `getMinute(): number`
-   `getSecond(): number`
-   `isValid(): boolean`
-   `dayOfWeek(): number`
-   `dayOfWeekJalali(): number`
-   `dayOfYear(): number`
-   `dayOfYearJalali(): number`
-   `weekOfYear(): number`
-   `weekOfYearJalali(): number`
-   `addDays(days: number): DoDate`
-   `subDays(days: number): DoDate`
-   `addJalaliDays(days: number): DoDate`
-   `subJalaliDays(days: number): DoDate`
-   `addMonths(months: number): DoDate`
-   `subMonths(months: number): DoDate`
-   `addJalaliMonths(months: number): DoDate`
-   `subJalaliMonths(months: number): DoDate`
-   `addYears(years: number): DoDate`
-   `subYears(years: number): DoDate`
-   `addJalaliYears(years: number): DoDate`
-   `subJalaliYears(years: number): DoDate`
-   `startOfMonth(): DoDate`
-   `endOfMonth(): DoDate`
-   `startOfMonthJalali(): DoDate`
-   `endOfMonthJalali(): DoDate`
-   `isAfter(date: Date | DoDate, onlyDate: boolean = false): boolean`
-   `isAfterOrEqual(date: Date | DoDate, onlyDate: boolean = false): boolean`
-   `isBefore(date: Date | DoDate, onlyDate: boolean = false): boolean`
-   `isBeforeOrEqual(date: Date | DoDate, onlyDate: boolean = false): boolean`
-   `isEqual(date: Date | DoDate, onlyDate: boolean = false): boolean`
- `format(pattern: string): string`
- `formatJalali(pattern: string): string`
- `isLeapYear(): boolean`
- `isLeapYearJalali(): boolean`
- `setYear(year: number): DoDate`
- `setMonth(month: number): DoDate`
- `setDay(day: number): DoDate`
- `setJalaliYear(year: number): DoDate`
- `setJalaliMonth(month: number): DoDate`
- `setJalaliDay(day: number): DoDate`
- `setHour(hour: number): DoDate`
- `setMinute(minute: number): DoDate`
- `setSecond(second: number): DoDate`
- `toString(): string`
- `toJSON(): string`