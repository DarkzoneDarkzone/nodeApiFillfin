import { DBconnect } from "../util/dbconnect";
let sql: string

export class PackageService extends DBconnect {
    constructor() {
        super()
    }
    queryPackageOrderLast = async (member_id: any, gender: any) => {
        sql =   `SELECT 
                    pack.order_id,
                    pack.name, 
                    pack.day, 
                    pack.content, 
                    pack.price, 
                    pack.gender, 
                    pack.status_expire, 
                    pack.status_confirm, 
                    pack.status_payment, 
                    pack.status_payment, 
                    members.username as member_username, 
                    members.password as member_password
                FROM (SELECT 
                        package.*, 
                        package_order.pack_order_id as order_id, 
                        package_order.status_expire, 
                        package_order.status_confirm, 
                        package_order.status_payment, 
                    package_order.member_id FROM package_order 
                    JOIN package ON package_order.package_id = package.package_id
                ) AS pack
                JOIN members ON (pack.member_id = members.id) 
                where member_id = ? AND status_confirm = "pending" 
                AND (status_payment = "notpay" || status_payment = "pending") AND pack.gender = ?
                ORDER BY pack.createdAt DESC`
        return this.findOne(sql, [member_id, gender])
    }

    view_member_package = async (mem_id: any, gender: any) => {
        sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND member_gender = ?`
        return this.findOne(sql, [mem_id, gender])
    }
}