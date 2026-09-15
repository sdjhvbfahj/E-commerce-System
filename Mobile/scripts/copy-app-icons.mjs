/**
 * 把 App 图标复制到 App 构建产物里
 * ---------------------------------------------------------------------------
 * 为什么需要这一步：
 *   manifest.json 里图标路径写的是 `unpackage/res/icons/xxx.png`（相对项目根目录）。
 *   两种打包方式：
 *     1) HBuilderX 直接打开项目打包 —— 路径天然正确，不需要本脚本；
 *     2) CLI 构建出 dist/build/app，再用 HBuilderX 导入这个目录打包 ——
 *        此时「项目根目录」变成了 dist/build/app，图标必须也在这个目录下才找得到。
 *   本脚本就是为了照顾第 2 种方式。
 */
import { cp, mkdir, readdir, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(here, '..')
const src = join(projectRoot, 'unpackage', 'res', 'icons')
const targets = [
    join(projectRoot, 'dist', 'build', 'app', 'unpackage', 'res', 'icons'),
    join(projectRoot, 'dist', 'dev', 'app', 'unpackage', 'res', 'icons'),
]

async function exists(path) {
    try {
        await access(path)
        return true
    } catch {
        return false
    }
}

const files = await readdir(src)
let copied = 0

for (const target of targets) {
    const parent = resolve(target, '..', '..', '..')
    if (!(await exists(parent))) continue // 没有这个产物目录就跳过
    await mkdir(target, { recursive: true })
    await cp(src, target, { recursive: true })
    copied += 1
    console.log(`[icons] ${files.length} 个图标 -> ${target.replace(projectRoot, '.')}`)
}

if (!copied) {
    console.log('[icons] 没有找到 App 构建产物目录（先执行 uni build -p app）')
}
