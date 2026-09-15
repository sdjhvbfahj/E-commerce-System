import httpInstance from "@/mock"

/**
 * @description: 获取一级分类列表
 * @param {string} id 分类id
 * @return {*}
 */
export function getCategoryAPI(id:string) {
    return httpInstance({
        url: '/category',
        params: {
            id: id
        }
    })
}
interface CategoryChildrenGoods {
    id: string,
    name: string,
    picture: string,
    price: string,
    desc: string
}
interface CategoryChildren {
    id: string,
    name: string,
    picture: string,
    goods?: CategoryChildrenGoods[]
}
export interface CategoryItem {
    id: string,
    name: string,
    children?: CategoryChildren[]
}