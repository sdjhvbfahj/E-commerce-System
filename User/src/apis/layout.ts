import httpInstance from "@/utils/http.ts";
// 向服务器请求导航区选项数据(封装成一个函数)
export function getCategoryAPI() {
    return httpInstance({
        url: '/home/category/head',
        method: 'GET'
    });
}
// 定义接口, 限制返回数据的类型(只返回首页所需要的分类类别)
// 定义返回的children数据接口
interface ChildrenItem {
    id: string,
    name: string,
    picture: string
}
interface GoodsItem {
    id: string,
    name: string,
    picture: string,
    price: string,
    desc: string
}
export interface CategroyItem {
    id: string,
    name: string
    picture: string,
    children: ChildrenItem[],
    goods: GoodsItem[]
}
