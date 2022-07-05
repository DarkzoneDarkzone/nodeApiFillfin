import { DBconnect } from "../util/dbconnect";
let sql: string

export class ViewService extends DBconnect {
    constructor() {
        super()
    }

    view_member_package = async (mem_id: any, gender: any) => {
        sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND member_gender = ?`
        return this.findOne(sql, [mem_id, gender])
    }

    view_product = async (package_id: any, sex: any, store_id: any) => {
        sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id`
        return this.findAll(sql, [package_id, sex, store_id])
    }

    view_product_recommend = async (package_id: any, sex: any) => {
        sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND recommend = "yes" AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`
        return this.findAll(sql, [package_id, sex])
    }

    view_product_preorder = async (package_id: any, sex: any, store_id: any) => {
        sql = ` SELECT  view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`
        return this.findAll(sql, [package_id, sex, store_id])
    }

    view_store_post = async (store_id: any) => {
        sql = `SELECT post_code, store_name, store_profile, store_concept, caption, post_img FROM view_store_post WHERE store_id = ?`
        return this.findAll(sql, [store_id])
    }

    view_product_incart = async (member_id: any, ) => {
        sql = `SELECT * FROM view_product_incart WHERE member_id = ?`
        return this.findAll(sql, [member_id])
    }

    view_member_order = async(member_id: any) => {
        sql = `SELECT * FROM view__member_order WHERE member_id = ? ORDER BY createdAt`
        return this.findAll(sql, [member_id])
    }
}