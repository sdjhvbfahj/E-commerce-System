/**
 * 离线假图生成器
 * ---------------------------------------------------------------------------
 * 为什么要自己生成图片？
 *   原来的 Demo 里商品图都挂在黑马图床上，一旦没网（或者图床挂了）整站就是一堆裂图。
 *   这里用「内联 SVG（data URI）」现场画图：不依赖任何外部资源，永远不裂图，
 *   文字用的是系统字体，所以中文也能正常渲染。
 *
 * 想换成真实图片怎么办？
 *   数据里所有图片字段都只是字符串，直接把 image('xxx') 换成图片地址（或 /public 下的路径）即可。
 */

export interface ImageOptions {
    /** 宽（默认 400） */
    width?: number;
    /** 高（默认 400） */
    height?: number;
    /** 随机种子：相同种子 => 相同配色，保证每次刷新图片一致 */
    seed?: number | string;
    /** 图片主标题，默认取 name */
    label?: string;
    /** 主标题下方的小字 */
    subLabel?: string;
}

/* ---------------------------------------------------------------------------
 * base64 编码
 * ---------------------------------------------------------------------------
 * 小程序 / App 端没有 btoa，也不能依赖 Node 的 Buffer，所以自己实现一份：
 * 先把字符串按 UTF-8 编成字节，再做标准 base64。
 * 为什么非要 base64？—— 小程序的 <image> 只认 base64 形式的 data URI，
 * URL 编码形式（data:image/svg+xml;charset=utf-8,%3Csvg...）在小程序里加载不出来，
 * 表现就是「图片位置一片白」。
 */
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toUtf8Bytes(text: string): number[] {
    const bytes: number[] = [];
    for (const char of text) {
        const code = char.codePointAt(0) ?? 0;
        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            bytes.push(
                0xf0 | (code >> 18),
                0x80 | ((code >> 12) & 0x3f),
                0x80 | ((code >> 6) & 0x3f),
                0x80 | (code & 0x3f)
            );
        }
    }
    return bytes;
}

export function toBase64(text: string): string {
    const bytes = toUtf8Bytes(text);
    let result = '';
    for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i] as number;
        const b1 = bytes[i + 1];
        const b2 = bytes[i + 2];
        result += BASE64_CHARS[b0 >> 2];
        result += BASE64_CHARS[((b0 & 0x03) << 4) | ((b1 ?? 0) >> 4)];
        result += b1 === undefined ? '=' : BASE64_CHARS[((b1 & 0x0f) << 2) | ((b2 ?? 0) >> 6)];
        result += b2 === undefined ? '=' : BASE64_CHARS[b2 & 0x3f];
    }
    return result;
}

/** 621电商风格的一组渐变色（以暖橙为主，配几个冷色做点缀） */
const PALETTE: ReadonlyArray<readonly [string, string]> = [
    ['#ffb27a', '#ef5f2a'],
    ['#ffd28a', '#f0a13c'],
    ['#ff9e9e', '#e8544f'],
    ['#f7b7d8', '#d2659c'],
    ['#b9c6f2', '#5f74c9'],
    ['#9fd8c4', '#3f9e84'],
    ['#ffc7a3', '#e07a3c'],
    ['#c9b6f0', '#7a5fd0'],
    ['#a8d8f0', '#4a90c2'],
    ['#ffe0a3', '#e2a82c'],
];
const DEFAULT_GRADIENT: readonly [string, string] = ['#ffb27a', '#ef5f2a'];

const FONT_STACK = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei',-apple-system,'Segoe UI',sans-serif";

/** 字符串 -> 稳定的数字种子 */
function hashString(text: string): number {
    let hash = 5381;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) + hash + text.charCodeAt(i)) % 2147483647;
    }
    return Math.abs(hash);
}

function escapeXml(text: string): string {
    return text.replace(/[&<>"']/g, (char) => {
        switch (char) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            default:
                return '&apos;';
        }
    });
}

/** 按字数折行，超出 maxLines 用省略号收尾 */
function wrapText(text: string, perLine: number, maxLines: number): string[] {
    const chars = Array.from(text);
    if (chars.length <= perLine) return [text];
    const lines: string[] = [];
    for (let i = 0; i < chars.length && lines.length < maxLines; i += perLine) {
        lines.push(chars.slice(i, i + perLine).join(''));
    }
    const lastIndex = lines.length - 1;
    const lastLine = lines[lastIndex];
    if (chars.length > perLine * maxLines && lastLine !== undefined) {
        lines[lastIndex] = `${Array.from(lastLine).slice(0, Math.max(1, perLine - 1)).join('')}…`;
    }
    return lines;
}

/**
 * 生成一张假图（返回 data URI，可以直接丢给 <img src>）
 */
export function image(name: string, options: ImageOptions = {}): string {
    const width = options.width ?? 400;
    const height = options.height ?? 400;
    const seed = typeof options.seed === 'string' ? hashString(options.seed) : options.seed ?? hashString(name);
    const [from, to] = PALETTE[Math.abs(seed) % PALETTE.length] ?? DEFAULT_GRADIENT;
    const label = options.label ?? name;
    /** label 传空字符串时只画纯色背景（用于做「背景图」，文字由页面自己叠加） */
    const hasText = label.trim().length > 0;

    const shortSide = Math.min(width, height);
    const fontSize = Math.max(11, Math.min(56, Math.round(shortSide * 0.1)));
    const perLine = Math.max(3, Math.floor((width * 0.8) / fontSize));
    const lines = hasText ? wrapText(label, perLine, 2) : [];
    const lineHeight = Math.round(fontSize * 1.32);

    const showDecor = shortSide >= 160;
    const subLabel = showDecor && hasText ? options.subLabel : undefined;
    const subFontSize = Math.max(10, Math.round(fontSize * 0.42));
    const subLineHeight = subLabel ? Math.round(subFontSize * 1.8) : 0;

    const totalHeight = lines.length * lineHeight + subLineHeight;
    const top = Math.round((height - totalHeight) / 2);
    const cx = Math.round(width / 2);

    const labelSpans = lines
        .map((line, index) => {
            const baseline = Math.round(top + index * lineHeight + fontSize * 0.82);
            return `<tspan x="${cx}" y="${baseline}">${escapeXml(line)}</tspan>`;
        })
        .join('');

    const subText = subLabel
        ? `<text x="${cx}" y="${Math.round(top + lines.length * lineHeight + subFontSize * 0.9)}" font-size="${subFontSize}" fill="#ffffff" opacity="0.82">${escapeXml(subLabel)}</text>`
        : '';

    const circleBig = Math.round(shortSide * 0.28);
    const circleSmall = Math.round(shortSide * 0.22);

    // label 为空时不输出任何文字节点（纯背景图）
    const textGroup = hasText
        ? [
              `<g font-family="${FONT_STACK}" text-anchor="middle">`,
              `<text font-size="${fontSize}" font-weight="600" fill="#ffffff">${labelSpans}</text>`,
              subText,
              '</g>',
          ]
        : [];

    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
        '<defs>',
        '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
        `<stop offset="0" stop-color="${from}"/>`,
        `<stop offset="1" stop-color="${to}"/>`,
        '</linearGradient>',
        '</defs>',
        '<rect width="100%" height="100%" fill="url(#bg)"/>',
        `<circle cx="${Math.round(width * 0.86)}" cy="${Math.round(height * 0.16)}" r="${circleBig}" fill="#ffffff" opacity="0.10"/>`,
        `<circle cx="${Math.round(width * 0.12)}" cy="${Math.round(height * 0.88)}" r="${circleSmall}" fill="#ffffff" opacity="0.08"/>`,
        ...textGroup,
        '</svg>',
    ].join('');

    // base64 形式：H5 / App / 小程序 三端都能渲染
    return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

/**
 * 生成一组假图（轮播图、商品多图、详情长图都会用到）
 * 每张的配色不同，看起来像是不同的实拍图。
 */
export function imageSet(name: string, count: number, options: ImageOptions = {}): string[] {
    const base = typeof options.seed === 'string' ? hashString(options.seed) : options.seed ?? hashString(name);
    return Array.from({ length: count }, (_, index) =>
        image(name, { ...options, seed: base + index * 7 + 1 })
    );
}
