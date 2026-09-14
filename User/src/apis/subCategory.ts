import httpInstance from "@/utils/http.ts"

/**
 * @description: 获取二级分类列表
 * @param {*} id 分类id
 * @return {*}
 */
export function getSubCategoryFilterAPI(id:string) {
    return httpInstance({
        url: '/category/sub/filter',
        params: {
            id: id
        }
    });
}
interface SubCategoryFilterCategoriesItem {
    id: string,
    name: string
}
interface SubCategoryFilterGoodsItem {
    id: string,
    name: string,
    desc: string,
    orderNum: number,
    picture: string,
    price: string
}
export interface SubCategoryFilterItem {
    id: string,
    name: string,
    parentId: string,
    parentName: string,
    categories: SubCategoryFilterCategoriesItem[],
    goods: SubCategoryFilterGoodsItem[]
}

/**
 * @description: 获取导航数据
 * @data { 
     categoryId: 1005000 ,
     page: 1,
     pageSize: 20,
     sortField: 'publishTime' | 'orderNum' | 'evaluateNum'
   } 
 * @return {*}
 */
interface SubCategorypostDataItem {
    categoryId: string,
    page: number,
    pageSize: number,
    sortField: string
}
export const getSubCategoryAPI = (data:SubCategorypostDataItem) => {
  return httpInstance({
    url:'/category/goods/temporary',
    method:'POST',
    data
  });
}
interface SubCategoryItemsItem {
    id: string,
    desc: string,
    name: string,
    price: string,
    picture: string,
    orderNum: number
}
export interface SubCategoryItem {
    page: number,
    pageSize: number,
    pages: number,
    counts: number,
    items: SubCategoryItemsItem[]
}