export const MONTH_NAMES = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
];
export const WEEKDAY_SHORT_NAMES = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
export const WEEKDAY_NAMES = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
export const zeroLeading = (str: string): string => {
    if (str && str.length === 1) {
        return `0${str}`;
    }
    return str;
};
