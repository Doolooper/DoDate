import { expect } from "chai";
import "mocha";
import DoDate from "../src";

describe("constructor", () => {
    it("should return correct Date from date", () => {
        expect(DoDate.fromDate(new Date(2019, 0, 1)).getDate()).to.eql(new Date(2019, 0, 1));
    });

    it("should return correct Date And Time from date", () => {
        const d = DoDate.fromDate(new Date(2019, 0, 1, 10, 10, 10));
        expect(d.getYear()).to.eq(2019);
        expect(d.getMonth()).to.eq(1);
        expect(d.getDay()).to.eq(1);
        expect(d.getHour()).to.eq(10);
        expect(d.getMinute()).to.eq(10);
        expect(d.getSecond()).to.eq(10);
    });
});

describe("add", () => {
    it("should add day", () => {
        const d = DoDate.fromDate(new Date(2019, 0, 1));
        expect(d.addDays(3).getDay()).to.eql(4);
    });
    it("should add month", () => {
        const d = DoDate.fromDate(new Date(2019, 0, 1));
        expect(d.addMonths(3).getMonth()).to.eql(4);
    });
    it("should add year", () => {
        const d = DoDate.fromDate(new Date(2010, 0, 1));
        expect(d.addYears(4).getYear()).to.eql(2014);
    });
});

describe("invalid", () => {
    it("invalid georgian parse", () => {
        const d = DoDate.parse("ABCD");
        expect(d.isValid()).to.eql(false);
    });

    it("invalid georgian parse", () => {
        const d = DoDate.parse("");
        expect(d.isValid()).to.eql(false);
    });

    it("invalid jalali parse", () => {
        const d = DoDate.parseJalali("ABCD");
        expect(d.isValid()).to.eql(false);
    });

    it("invalid jalali parse", () => {
        const d = DoDate.parseJalali("");
        expect(d.isValid()).to.eql(false);
    });
});

describe("add jalali", () => {
    it("should add jalali day", () => {
        const d = DoDate.fromJalali(1397, 1, 1);
        expect(d.addJalaliDays(5).getDayJalali()).to.eql(6);

        expect(d.addJalaliDays(35).getDayJalali()).to.eql(5);
        expect(d.addJalaliDays(35).getMonthJalali()).to.eql(2);

        expect(d.addJalaliDays(380).getDayJalali()).to.eql(16);
        expect(d.addJalaliDays(380).getMonthJalali()).to.eql(1);
        expect(d.addJalaliDays(380).getYearJalali()).to.eql(1398);
    });
    it("should add jalali month", () => {
        const d = DoDate.fromJalali(1397, 1, 1);
        expect(d.addJalaliMonths(3).getMonthJalali()).to.eql(4);
        expect(d.addJalaliMonths(14).getMonthJalali()).to.eql(3);
        expect(d.addJalaliMonths(14).getYearJalali()).to.eql(1398);
    });
    it("should add jalali year", () => {
        const d = DoDate.fromJalali(1397, 1, 1);
        expect(d.addJalaliYears(1).getYearJalali()).to.eql(1398);
    });
});

describe("sub jalali", () => {
    it("should sub jalali day", () => {
        const d = DoDate.fromJalali(1397, 2, 1);
        expect(d.subJalaliDays(5).getDayJalali()).to.eql(27);
    });
    it("should sub jalali month", () => {
        const d = DoDate.fromJalali(1397, 4, 1);
        expect(d.subJalaliMonths(2).getMonthJalali()).to.eql(2);
        expect(d.subJalaliMonths(10).getMonthJalali()).to.eql(6);
        expect(d.subJalaliMonths(12).getMonthJalali()).to.eql(4);
        expect(d.subJalaliMonths(12).getYearJalali()).to.eql(1396);
        expect(d.subJalaliMonths(20).getMonthJalali()).to.eql(8);
        expect(d.subJalaliMonths(20).getYearJalali()).to.eql(1395);
        expect(d.subJalaliMonths(10).getYearJalali()).to.eql(1396);
    });

    it("should sub jalali year", () => {
        const d = DoDate.fromJalali(1397, 1, 1);
        expect(d.subJalaliYears(1).getYearJalali()).to.eql(1396);
    });
});

describe("time", () => {
    it("should return time from jalali", () => {
        const d = DoDate.fromJalali(1397, 1, 1, 22, 12, 14);
        expect(d.getHour()).to.eql(22);
        expect(d.getMinute()).to.eql(12);
        expect(d.getSecond()).to.eql(14);
    });

    it("should return time from string", () => {
        const d = DoDate.parse("2019-01-15 22:12:14");
        expect(d.getHour()).to.eql(22);
        expect(d.getMinute()).to.eql(12);
        expect(d.getSecond()).to.eql(14);
    });
});

describe("startOfMonth", () => {
    it("should return start of the month georgian", () => {
        const d = DoDate.parse("2019-01-15").startOfMonth();
        expect(d.getDate()).to.eql(new Date(2019, 0, 1));
    });

    it("should return start of the month jalali", () => {
        const d = DoDate.fromJalali(1397, 1, 15).startOfMonthJalali();
        expect(d.getDate()).to.eql(DoDate.fromJalali(1397, 1, 1).getDate());
    });
});

describe("endOfMonth", () => {
    it("should return end of the month georgian", () => {
        const d = DoDate.parse("2019-01-15").endOfMonth();
        expect(d.getDate().toLocaleDateString()).to.be.equal(new Date(2019, 0, 31).toLocaleDateString());
    });

    it("should return end of the month jalali", () => {
        const d = DoDate.fromJalali(1397, 1, 15).endOfMonthJalali();
        expect(d.getDate()).to.eql(DoDate.fromJalali(1397, 1, 31).getDate());
    });
});

describe("format", () => {
    it("should return formatted georgian date", () => {
        const d = DoDate.parse("2019-01-15");
        expect(d.format("MM/DD/YYYY")).to.be.equal("01/15/2019");
    });

    it("should return formatted jalali date", () => {
        const d = DoDate.fromJalali(1397, 1, 1);
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1397/01/01");
    });

    it("should return formatted georgian full date", () => {
        const d = DoDate.parse("2019-01-15 22:13:15");
        expect(d.format("YYYY/MM/DD hh:mm:ss a")).to.be.equal("2019/01/15 10:13:15 pm");

        expect(d.format("YYYY/MM/DD HH:mm:ss")).to.be.equal("2019/01/15 22:13:15");
    });

    it("should return formatted jalali full date", () => {
        const d1 = DoDate.fromJalali(1397, 1, 1, 22, 13, 15);
        const d2 = DoDate.fromJalali(1397, 1, 1, 10, 13, 15);
        expect(d1.formatJalali("YYYY/MM/DD hh:mm:ss a")).to.be.equal("1397/01/01 10:13:15 ب.ظ.");

        expect(d2.formatJalali("YYYY/MM/DD hh:mm:ss a")).to.be.equal("1397/01/01 10:13:15 ق.ظ.");

        expect(d1.formatJalali("YYYY/MM/DD HH:mm:ss")).to.be.equal("1397/01/01 22:13:15");
        expect(d1.formatJalali("YYYY/MM/DD HH:mm:ss")).to.be.equal("1397/01/01 22:13:15");

        expect(d2.formatJalali("YYYY/MM/DD HH:mm:ss")).to.be.equal("1397/01/01 10:13:15");
        expect(d2.formatJalali("YYYY/MM/DD HH:mm:ss")).to.be.equal("1397/01/01 10:13:15");
    });

    it("should return name of jalali month", () => {
        const d1 = DoDate.fromJalali(1397, 1, 1);
        const d2 = DoDate.fromJalali(1397, 2, 1);
        expect(d1.formatJalali("MMM")).to.be.equal("فروردین");
        expect(d2.formatJalali("MMMM")).to.be.equal("اردیبهشت");
    });

    it("should return name of jalali weekday", () => {
        const d = DoDate.fromJalali(1398, 3, 22);
        expect(d.formatJalali("dd")).to.be.equal("چهارشنبه");
        expect(d.formatJalali("d")).to.be.equal("چ");
    });
});

describe("days Of Week", () => {
    it("return day of week", () => {
        const d1 = DoDate.parse("2020-05-12").dayOfWeek();
        expect(d1).to.be.equal(2);

        const d2 = DoDate.parse("2020-05-13").dayOfWeek();
        expect(d2).to.be.equal(3);

        const d3 = DoDate.parse("2020-05-14").dayOfWeek();
        expect(d3).to.be.equal(4);

        const d4 = DoDate.parse("2020-05-15").dayOfWeek();
        expect(d4).to.be.equal(5);

        const d5 = DoDate.parse("2020-05-16").dayOfWeek();
        expect(d5).to.be.equal(6);

        const d6 = DoDate.parse("2020-05-17").dayOfWeek();
        expect(d6).to.be.equal(0);

        const d7 = DoDate.parse("2020-05-18").dayOfWeek();
        expect(d7).to.be.equal(1);
    });
    it("return day of jalali week", () => {
        const d1 = DoDate.fromJalali(1399, 2, 6).dayOfWeekJalali();
        expect(d1).to.be.equal(0);

        const d2 = DoDate.fromJalali(1399, 2, 7).dayOfWeekJalali();
        expect(d2).to.be.equal(1);

        const d3 = DoDate.fromJalali(1399, 2, 8).dayOfWeekJalali();
        expect(d3).to.be.equal(2);

        const d4 = DoDate.fromJalali(1399, 2, 9).dayOfWeekJalali();
        expect(d4).to.be.equal(3);

        const d5 = DoDate.fromJalali(1399, 2, 10).dayOfWeekJalali();
        expect(d5).to.be.equal(4);

        const d6 = DoDate.fromJalali(1399, 2, 11).dayOfWeekJalali();
        expect(d6).to.be.equal(5);

        const d7 = DoDate.fromJalali(1399, 2, 12).dayOfWeekJalali();
        expect(d7).to.be.equal(6);
    });
});

describe("leap year", () => {
    it("is leap year", () => {
        const d = DoDate.isLeapYear(2012);
        expect(d).to.be.equal(true);
    });
    it("is not leap year", () => {
        const d = DoDate.isLeapYear(2019);
        expect(d).to.be.equal(false);
    });

    it("is leap year by date", () => {
        const d = DoDate.isLeapYear(new Date("2012-02-25"));
        expect(d).to.be.equal(true);
    });
    it("is not leap year by date", () => {
        const d = DoDate.isLeapYear(new Date("2019-02-25"));
        expect(d).to.be.equal(false);
    });

    it("is jalali leap year", () => {
        const d = DoDate.isLeapYearJalali(1403);
        expect(d).to.be.equal(true);
    });
    it("is not jalali leap year", () => {
        const d = DoDate.isLeapYearJalali(1398);
        expect(d).to.be.equal(false);
    });

    it("is jalali leap year by date", () => {
        const d = DoDate.isLeapYearJalali(new Date("2025-02-25"));
        expect(d).to.be.equal(true);
    });
    it("is not jalali leap year by date", () => {
        const d = DoDate.isLeapYearJalali(new Date("2019-02-25"));
        expect(d).to.be.equal(false);
    });
});

describe("parse date", () => {
    it("should parse jalaali date", () => {
        const d = DoDate.parseJalali("1389-10-12");
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1389/10/12");
    });
    it("should parse geo date", () => {
        const d = DoDate.parse("2019-01-12");
        expect(d.format("YYYY/MM/DD")).to.be.equal("2019/01/12");
    });
    it("should return correct Date from array number", () => {
        expect(DoDate.fromJalali(1397, 10, 11).getDate()).to.eql(new Date(2019, 0, 1));
    });
});

describe("parse date with format", () => {
    it("should parse jalaali without time", () => {
        const d = DoDate.parse("2010-05-02", "YYYY-DD-MM");
        expect(d.format("YYYY/MM/DD")).to.be.equal("2010/02/05");
    });
    it("should parse jalaali to geo with time", () => {
        const d = DoDate.parse("2019/05/02 12:50", "YYYY/MM/DD hh:mm");
        expect(d.format("YYYY/MM/DD hh:mm")).to.be.equal("2019/05/02 12:50");
    });

    it("should parse geo to jalaali with time", () => {
        const d = DoDate.parseJalali("1389-02-12 12:05", "YYYY-MM-DD hh:mm");
        expect(d.formatJalali("YYYY/MM/DD hh:mm")).to.be.equal("1389/02/12 12:05");
    });
    it("should parse geo to jalaali without time", () => {
        const d = DoDate.parseJalali("1398-02-12", "YYYY-MM-DD");
        expect(d.formatJalali("YYYY/MM/DD")).to.be.equal("1398/02/12");
    });
    it("should parse geo to jalaali with 24h time", () => {
        const d = DoDate.parseJalali("1389-02-12 22:05", "YYYY-MM-DD HH:mm");
        expect(d.formatJalali("YYYY/MM/DD hh:mm")).to.be.equal("1389/02/12 10:05");
        expect(d.formatJalali("YYYY/MM/DD HH:mm")).to.be.equal("1389/02/12 22:05");
    });
});

describe("comparison", () => {
    it("should return true if one date is smaller than the other", () => {
        const d1 = DoDate.fromJalali(1398, 1, 1);
        const d2 = DoDate.fromJalali(1398, 1, 2);
        expect(d2.isAfter(d1, true)).to.be.equal(true);
        expect(d1.isAfter(d2, true)).to.be.equal(false);
    });

    it("should return true if one date is smaller than the other", () => {
        const d1 = DoDate.fromJalali(1398, 1, 1);
        const d2 = DoDate.fromJalali(1398, 1, 1);
        expect(d2.isAfterOrEqual(d1, true)).to.be.equal(true);
        expect(d1.isAfterOrEqual(d2, true)).to.be.equal(true);
    });

    it("should return true if one date is bigger than the other", () => {
        const d1 = DoDate.fromJalali(1398, 1, 1);
        const d2 = DoDate.fromJalali(1398, 1, 2);
        expect(d2.isBefore(d1, true)).to.be.equal(false);
        expect(d1.isBefore(d2, true)).to.be.equal(true);
    });

    it("should return true if one date is bigger or equal than the other", () => {
        const d1 = DoDate.fromJalali(1398, 1, 1);
        const d2 = DoDate.fromJalali(1398, 1, 1);
        expect(d2.isBeforeOrEqual(d1, true)).to.be.equal(true);
        expect(d1.isBeforeOrEqual(d2, true)).to.be.equal(true);
    });
});

describe("week of year", () => {
    it("should get correct number of week of year", () => {
        const d1 = DoDate.fromDate(new Date(2019, 0, 1));
        expect(d1.weekOfYear()).to.be.equal(1);

        const d2 = DoDate.fromDate(new Date(2019, 0, 8));
        expect(d2.weekOfYear()).to.be.equal(2);

        const d3 = DoDate.fromDate(new Date(2021, 2, 27));
        expect(d3.weekOfYear()).to.be.equal(13);
    });

    it("should get correct number of week of jalali year", () => {
        const d1 = DoDate.fromJalali(1400, 1, 1);
        expect(d1.weekOfYearJalali()).to.be.equal(1);

        const d2 = DoDate.fromJalali(1400, 1, 8);
        expect(d2.weekOfYearJalali()).to.be.equal(2);

        const d3 = DoDate.fromJalali(1400, 1, 31);
        expect(d3.weekOfYearJalali()).to.be.equal(5);

        const d4 = DoDate.fromJalali(1400, 2, 2);
        expect(d4.weekOfYearJalali()).to.be.equal(5);

        const d5 = DoDate.fromJalali(1400, 4, 1);
        expect(d5.weekOfYearJalali()).to.be.equal(14);

        const d6 = DoDate.fromJalali(1400, 7, 20);
        expect(d6.weekOfYearJalali()).to.be.equal(30);

        const d7 = DoDate.fromJalali(1400, 8, 9);
        expect(d7.weekOfYearJalali()).to.be.equal(33);
    });
});

describe("day of year", () => {
    it("should get correct number of day of year", () => {
        const d1 = DoDate.fromDate(new Date(2019, 0, 1));
        expect(d1.dayOfYear()).to.be.equal(1);

        const d2 = DoDate.fromDate(new Date(2019, 0, 8));
        expect(d2.dayOfYear()).to.be.equal(8);

        const d3 = DoDate.fromDate(new Date(2021, 2, 27));
        expect(d3.dayOfYear()).to.be.equal(86);
    });

    it("should get correct number of day of jalali year", () => {
        const d1 = DoDate.fromJalali(1400, 1, 1);
        expect(d1.dayOfYearJalali()).to.be.equal(1);

        const d2 = DoDate.fromJalali(1400, 1, 31);
        expect(d2.dayOfYearJalali()).to.be.equal(31);

        const d3 = DoDate.fromJalali(1400, 3, 31);
        expect(d3.dayOfYearJalali()).to.be.equal(93);
    });
});

describe("json", () => {
    it("should return iso string from jalali", () => {
        const d = DoDate.fromJalali(1399, 1, 1, 10, 10, 10);
        expect(JSON.stringify(d)).to.be.equal('"2020-03-20T10:10:10.000"');
    });

    it("should return iso string from date", () => {
        const d = DoDate.fromDate(new Date(2010, 1, 1, 10, 10, 10));
        expect(JSON.stringify(d)).to.be.equal('"2010-02-01T10:10:10.000"');
    });
});
