import dayjs from 'dayjs';

/** 金额：数字 -> 两位小数字符串（金额一律展示两位小数，不做四舍五入以外的加工） */
export function money(value: number | string | undefined, digits = 2): string {
    const num = Number(value ?? 0);
    return Number.isFinite(num) ? num.toFixed(digits) : '0.00';
}

/** 日期：兼容后端返回的 'YYYY-MM-DD HH:mm:ss' 字符串 */
export function dateTime(value: string | undefined, template = 'YYYY-MM-DD HH:mm'): string {
    if (!value) return '';
    const date = dayjs(value);
    return date.isValid() ? date.format(template) : value;
}

/** 手机号脱敏：13812345678 -> 138****5678 */
export function maskMobile(mobile: string | undefined): string {
    if (!mobile) return '';
    return mobile.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

/** 销量文案：12000 -> 1.2万 */
export function salesText(count: number | undefined): string {
    const num = Number(count ?? 0);
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
    return String(num);
}

/** 手机号简单校验 */
export function isMobile(value: string): boolean {
    return /^1[3-9]\d{9}$/.test(value.trim());
}
