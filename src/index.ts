import * as dayjs from "dayjs";
import * as isLeapYear from "dayjs/plugin/isLeapYear";
import * as weekOfYear from "dayjs/plugin/weekOfYear";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as dayOfYear from "dayjs/plugin/dayOfYear";
import * as jalaali from "jalaali-js";
import { MONTH_NAMES, WEEKDAY_NAMES, WEEKDAY_SHORT_NAMES, zeroLeading } from "./utils";

dayjs.extend(isLeapYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);

type CalendarType = "jal" | "geo";

class DoDate {
    public static now(): DoDate {
        return new DoDate();
    }

    public static fromDate(date: Date): DoDate {
        return new DoDate(date);
    }

    public static fromJalali(
        year: number,
        month: number,
        day: number,
        hour: number = 0,
        minute: number = 0,
        second: number = 0,
    ): DoDate {
        const x = jalaali.toGregorian(year, month, day);
        return new DoDate(new Date(x.gy, x.gm - 1, x.gd, hour, minute, second));
    }

    public static parse(date: string, pattern: string = "YYYY-MM-DD hh:mm:ss"): DoDate {
        const [y, m, d, h, min, sec] = this.parseFormat(date, pattern, "geo");
        return new DoDate(new Date(y, m - 1, d, h, min, sec));
    }

    public static parseJalali(date: string, pattern: string = "YYYY-MM-DD hh:mm:ss"): DoDate {
        const [y, m, d, h, min, sec] = this.parseFormat(date, pattern, "jal");
        const x = jalaali.toGregorian(y, m, d);
        const outPut = new DoDate(new Date(x.gy, x.gm - 1, x.gd, h, min, sec));
        return outPut;
    }

    public static isLeapYear(date: Date | number): boolean {
        if (typeof date === "number") {
            return dayjs(new Date(date, 2, 2)).isLeapYear();
        }
        return dayjs(date).isLeapYear();
    }

    public static isLeapYearJalali(date: Date | number): boolean {
        if (typeof date === "number") {
            return jalaali.isLeapJalaaliYear(date);
        }
        const jd = jalaali.toJalaali(date);
        return jalaali.isLeapJalaaliYear(jd.jy);
    }

    private static setYearStr(fullYear: number, year: string): string {
        return fullYear.toString().substr(0, 2) + year;
    }

    private static parseFormat(date: string, pattern: string, type: CalendarType): number[] {
        const yearArray = ["YYYY", "YY"];
        const monthArray = ["MM", "M"];
        const dayArray = ["DD", "D"];
        const fullHourArray = ["HH", "H"];
        const hourArray = ["hh", "h"];
        const minuteArray = ["mm", "m"];
        const secondArray = ["ss", "s"];

        let year: string = "";
        let month: string = "";
        let day: string = "";
        let hour: string = "";
        let minute: string = "";
        let second: string = "";

        yearArray.forEach((y) => {
            const yearIndex = pattern.indexOf(y);
            year = year === "" ? (year = yearIndex > -1 ? date.substring(yearIndex, yearIndex + y.length) : "") : year;
        });
        monthArray.forEach((m) => {
            const monthIndex = pattern.indexOf(m);
            month =
                month === ""
                    ? (month = monthIndex > -1 ? date.substring(monthIndex, monthIndex + m.length) : "")
                    : month;
        });
        dayArray.forEach((d) => {
            const dayIndex = pattern.indexOf(d);
            day = day === "" ? (day = dayIndex > -1 ? date.substring(dayIndex, dayIndex + d.length) : "") : day;
        });
        fullHourArray.forEach((hourItem) => {
            const hourIndex = pattern.indexOf(hourItem);
            hour =
                hour === ""
                    ? (hour = hourIndex > -1 ? date.substring(hourIndex, hourIndex + hourItem.length) : "")
                    : hour;
        });
        hourArray.forEach((hourItem) => {
            const hourIndex = pattern.indexOf(hourItem);
            hour =
                hour === ""
                    ? (hour = hourIndex > -1 ? date.substring(hourIndex, hourIndex + hourItem.length) : "")
                    : hour;
        });
        minuteArray.forEach((m) => {
            const minuteIndex = pattern.indexOf(m);
            minute =
                minute === ""
                    ? (minute = minuteIndex > -1 ? date.substring(minuteIndex, minuteIndex + m.length) : "")
                    : minute;
        });
        secondArray.forEach((s) => {
            const secondIndex = pattern.indexOf(s);
            second =
                second === ""
                    ? (second = secondIndex > -1 ? date.substring(secondIndex, secondIndex + s.length) : "")
                    : second;
        });

        if (year === "" || month === "" || day === "") {
            return [];
        }
        if (year.length < 4) {
            if (type === "jal") {
                const d = new Date(Date.now());
                const j = jalaali.toJalaali(+d.getFullYear(), +d.getMonth(), +d.getDate());
                year = this.setYearStr(j.jy, year);
            }
            if (type === "geo") {
                const d = new Date(Date.now());
                year = this.setYearStr(d.getFullYear(), year);
            }
        }
        return [+year, +month, +day, +hour, +minute, +second];
    }

    private date: Date;
    private year: number;
    private yearJalali: number;
    private month: number;
    private monthJalali: number;
    private day: number;
    private dayJalali: number;
    private hour: number;
    private minute: number;
    private second: number;
    private hasValidValue: boolean;

    private constructor(input: Date = new Date()) {
        this.date = input;
        this.hasValidValue = this.isValidDate(this.date);
        if (this.hasValidValue) {
            const tempDate = dayjs(input);
            const [jy, jm, jd] = this.getJalali();

            this.year = tempDate.year();
            this.yearJalali = jy;
            this.month = tempDate.month() + 1;
            this.monthJalali = jm;
            this.day = tempDate.date();
            this.dayJalali = jd;
            this.hour = tempDate.hour();
            this.minute = tempDate.minute();
            this.second = tempDate.second();
        } else {
            this.year = 0;
            this.yearJalali = 0;
            this.month = 0;
            this.monthJalali = 0;
            this.day = 0;
            this.dayJalali = 0;
            this.hour = 0;
            this.minute = 0;
            this.second = 0;
        }
    }

    public getDate(): Date {
        return this.date;
    }

    public getYear(): number {
        return this.year;
    }

    public getYearJalali(): number {
        return this.yearJalali;
    }

    public getMonth(): number {
        return this.month;
    }

    public getMonthJalali(): number {
        return this.monthJalali;
    }

    public getDay(): number {
        return this.day;
    }

    public getDayJalali(): number {
        return this.dayJalali;
    }

    public getHour(): number {
        return this.hour;
    }

    public getMinute(): number {
        return this.minute;
    }

    public getSecond(): number {
        return this.second;
    }

    public isValid(): boolean {
        return this.hasValidValue;
    }

    public dayOfWeek(): number {
        return dayjs(this.date).day();
    }

    public dayOfWeekJalali(): number {
        const day = dayjs(this.date).day();
        switch (day) {
            case 0: {
                // یک شنبه
                return 1;
            }
            case 1: {
                // دوشنبه
                return 2;
            }
            case 2: {
                // سه شنبه
                return 3;
            }
            case 3: {
                // چهارشنبه
                return 4;
            }
            case 4: {
                // پتج شنبه
                return 5;
            }
            case 5: {
                // جمعه
                return 6;
            }
            case 6: {
                // شنبه
                return 0;
            }
            default: {
                return 0;
            }
        }
    }

    public dayOfYear(): number {
        return dayjs(this.date).dayOfYear();
    }

    public dayOfYearJalali(): number {
        const jd = jalaali.j2d(this.yearJalali, 1, 1);
        const jdCurrent = jalaali.j2d(this.yearJalali, this.monthJalali, this.dayJalali);

        return jdCurrent - jd + 1;
    }

    public weekOfYear(): number {
        return dayjs(this.date).week();
    }

    public weekOfYearJalali(): number {
        const dayOfYear = this.dayOfYearJalali();
        return Math.floor((dayOfYear + 6) / 7);
    }

    public addDays(days: number): DoDate {
        return new DoDate(dayjs(this.date).add(days, "day").toDate());
    }

    public subDays(days: number): DoDate {
        return new DoDate(dayjs(this.date).add(days, "day").toDate());
    }

    public addJalaliDays(days: number): DoDate {
        const jd = jalaali.j2d(this.yearJalali, this.monthJalali, this.dayJalali);
        const newDay = jd + days;
        const newDate = jalaali.d2j(newDay);
        return DoDate.fromJalali(newDate.jy, newDate.jm, newDate.jd, this.hour, this.minute, this.second);
    }

    public subJalaliDays(days: number): DoDate {
        const jd = jalaali.j2d(this.yearJalali, this.monthJalali, this.dayJalali);
        const newDay = jd - days;
        const newDate = jalaali.d2j(newDay);
        return DoDate.fromJalali(newDate.jy, newDate.jm, newDate.jd, this.hour, this.minute, this.second);
    }

    public addMonths(months: number): DoDate {
        return new DoDate(dayjs(this.date).add(months, "month").toDate());
    }

    public subMonths(months: number): DoDate {
        return new DoDate(dayjs(this.date).add(months, "month").toDate());
    }

    public addJalaliMonths(months: number): DoDate {
        if (this.monthJalali + months > 12) {
            const y = Math.floor((this.monthJalali + months) / 12);
            const m = (this.monthJalali + months) % 12;
            const newMonth = m;
            const newYear = this.yearJalali + y;
            return DoDate.fromJalali(newYear, newMonth, this.dayJalali, this.hour, this.minute, this.second);
        } else {
            const newMonth = this.monthJalali + months;
            return DoDate.fromJalali(this.yearJalali, newMonth, this.dayJalali, this.hour, this.minute, this.second);
        }
    }

    public subJalaliMonths(months: number): DoDate {
        if (this.monthJalali - months < 0) {
            const y = Math.floor((this.monthJalali + months) / 12);
            const m = Math.abs(months - this.monthJalali) % 12;
            const newMonth = 12 - m;
            const newYear = this.yearJalali - y;
            return DoDate.fromJalali(newYear, newMonth, this.dayJalali, this.hour, this.minute, this.second);
        } else {
            const newMonth = this.monthJalali - months;
            return DoDate.fromJalali(this.yearJalali, newMonth, this.dayJalali, this.hour, this.minute, this.second);
        }
    }

    public addYears(years: number): DoDate {
        return new DoDate(dayjs(this.date).add(years, "year").toDate());
    }

    public subYears(years: number): DoDate {
        return new DoDate(dayjs(this.date).add(years, "year").toDate());
    }

    public addJalaliYears(years: number): DoDate {
        const newYear = this.yearJalali + years;
        return DoDate.fromJalali(newYear, this.monthJalali, this.dayJalali, this.hour, this.minute, this.second);
    }

    public subJalaliYears(years: number): DoDate {
        const newYear = this.yearJalali - years;
        return DoDate.fromJalali(newYear, this.monthJalali, this.dayJalali, this.hour, this.minute, this.second);
    }

    public startOfMonth(): DoDate {
        return new DoDate(dayjs(this.date).startOf("month").toDate());
    }

    public endOfMonth(): DoDate {
        return new DoDate(dayjs(this.date).endOf("month").toDate());
    }

    public startOfMonthJalali(): DoDate {
        const [jy, jm] = this.getJalali();
        return DoDate.fromJalali(jy, jm, 1);
    }

    public endOfMonthJalali(): DoDate {
        const [jy, jm] = this.getJalali();
        const ml = jalaali.jalaaliMonthLength(jy, jm);
        return DoDate.fromJalali(jy, jm, ml);
    }

    public isAfter(date: Date | DoDate, onlyDate: boolean = false): boolean {
        const d1: Date = this.date;
        let d2: Date | undefined;
        if (date instanceof Date) {
            d2 = date;
        } else {
            d2 = date.date;
        }
        if (onlyDate) {
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
            return dayjs(d1).isAfter(dayjs(d2), "day");
        }
        return dayjs(d1).isAfter(dayjs(d2), "second");
    }

    public isAfterOrEqual(date: Date | DoDate, onlyDate: boolean = false): boolean {
        const d1: Date = this.date;
        let d2: Date | undefined;
        if (date instanceof Date) {
            d2 = date;
        } else {
            d2 = date.date;
        }
        if (onlyDate) {
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
        }
        return dayjs(d1).isSameOrAfter(dayjs(d2));
    }

    public isBefore(date: Date | DoDate, onlyDate: boolean = false): boolean {
        const d1: Date = this.date;
        let d2: Date | undefined;
        if (date instanceof Date) {
            d2 = date;
        } else {
            d2 = date.date;
        }
        if (onlyDate) {
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
        }
        return dayjs(d1).isBefore(dayjs(d2));
    }

    public isBeforeOrEqual(date: Date | DoDate, onlyDate: boolean = false): boolean {
        const d1: Date = this.date;
        let d2: Date | undefined;
        if (date instanceof Date) {
            d2 = date;
        } else {
            d2 = date.date;
        }
        if (onlyDate) {
            d1.setHours(0, 0, 0, 0);
            d2.setHours(0, 0, 0, 0);
        }
        return dayjs(d1).isSameOrBefore(dayjs(d2));
    }

    public format(pattern: string): string {
        return dayjs(this.date).format(pattern);
    }

    public isLeapYear(): boolean {
        return dayjs(this.date).isLeapYear();
    }

    public isLeapYearJalali(): boolean {
        const jd = jalaali.toJalaali(this.date);
        return jalaali.isLeapJalaaliYear(jd.jy);
    }

    public formatJalali(pattern: string): string {
        const [jy, jm, jd] = this.getJalali();
        pattern = pattern.replace(/YYYY/g, `${jy}`);
        pattern = pattern.replace(/YYY/g, `${jy}`);
        pattern = pattern.replace(/YY/g, `${jy}`.slice(2));
        pattern = pattern.replace(/MMMM/g, MONTH_NAMES[this.monthJalali - 1]);
        pattern = pattern.replace(/MMM/g, MONTH_NAMES[this.monthJalali - 1]);
        pattern = pattern.replace(/MM/g, zeroLeading(`${jm}`));
        pattern = pattern.replace(/M/g, `${jm}`);
        pattern = pattern.replace(/DD/g, zeroLeading(`${jd}`));
        pattern = pattern.replace(/D/g, `${jd}`);
        pattern = pattern.replace(/dd/g, WEEKDAY_NAMES[this.dayOfWeekJalali()]);
        pattern = pattern.replace(/d/g, WEEKDAY_SHORT_NAMES[this.dayOfWeekJalali()]);

        pattern = pattern.replace(/HH/g, zeroLeading(`${this.hour}`));
        pattern = pattern.replace(/H/g, `${this.hour}`);

        pattern = pattern.replace(
            /hh/g,
            this.hour > 12 ? zeroLeading(`${this.hour - 12}`) : zeroLeading(`${this.hour}`),
        );
        pattern = pattern.replace(
            /h/g,
            this.hour > 12 ? zeroLeading(`${this.hour - 12}`) : zeroLeading(`${this.hour}`),
        );

        pattern = pattern.replace(/mm/g, zeroLeading(`${this.minute}`));
        pattern = pattern.replace(/m/g, `${this.minute}`);

        pattern = pattern.replace(/ss/g, zeroLeading(`${this.second}`));
        pattern = pattern.replace(/s/g, `${this.second}`);

        pattern = pattern.replace(/a/g, this.hour > 12 ? "ب.ظ." : "ق.ظ.");
        return pattern;
    }

    public setYear(year: number): DoDate {
        return new DoDate(dayjs(this.date).set("year", year).toDate());
    }

    public setMonth(month: number): DoDate {
        return new DoDate(dayjs(this.date).set("month", month).toDate());
    }

    public setDay(day: number): DoDate {
        return new DoDate(dayjs(this.date).set("day", day).toDate());
    }

    public setJalaliYear(year: number): DoDate {
        return DoDate.fromJalali(year, this.monthJalali, this.dayJalali, this.hour, this.minute, this.second);
    }

    public setJalaliMonth(month: number): DoDate {
        return DoDate.fromJalali(this.yearJalali, month, this.dayJalali, this.hour, this.minute, this.second);
    }

    public setJalaliDay(day: number): DoDate {
        return DoDate.fromJalali(this.yearJalali, this.monthJalali, day, this.hour, this.minute, this.second);
    }

    public setHour(hour: number): DoDate {
        return new DoDate(dayjs(this.date).set("hour", hour).toDate());
    }

    public setMinute(minute: number): DoDate {
        return new DoDate(dayjs(this.date).set("minute", minute).toDate());
    }

    public setSecond(second: number): DoDate {
        return new DoDate(dayjs(this.date).set("second", second).toDate());
    }

    public toString(): string {
        return this.date.toString();
    }

    public toJSON(): string {
        return this.format("YYYY-MM-DDTHH:mm:ss.000");
    }

    private getJalali(): number[] {
        const jd = jalaali.toJalaali(this.date);
        return [jd.jy, jd.jm, jd.jd];
    }

    private isValidDate(date: Date): boolean {
        return date instanceof Date && date.getTime() === date.getTime();
    }
}

export default DoDate;
