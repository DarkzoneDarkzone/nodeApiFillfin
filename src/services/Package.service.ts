import { DBconnect } from "../util/dbconnect";
let sql: string

export class PackageService extends DBconnect {
    constructor() {
        super()
    }
    queryPackageOrderLast = async (member_id: any, gender: any) => {
        sql =   `SELECT * FROM 
                    (SELECT package_order.*, 
                            package_payment.slip, 
                            package_payment.status_confirm as payment_confirm, 
                            package_payment.user_confirm, 
                            package_payment.bank_ref 
                    FROM package_order 
                    JOIN package_payment 
                        ON (package_order.pack_order_id = package_payment.package_order_id)
                    ) as pack
                    WHERE pack.member_id = ? AND pack.status_confirm = "pending" 
                AND (status_payment = "notpay" || status_payment = "pending") AND pack.gender = ?
                ORDER BY pack.createdAt DESC`
        return this.findOne(sql, [member_id, gender])
    }
    view_member_package = async (mem_id: any, gender: any) => {
        sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND member_gender = ?`
        return this.findOne(sql, [mem_id, gender])
    }
    query_package_order = async() => {
        sql = `SELECT * FROM 
                (   SELECT pack.*, members.id as mem_id
                    FROM (SELECT package.*, package_order.*, package_payment.* 
                            FROM package_order
                            JOIN package ON (package_order.package_id = package.package_id)
                            JOIN package_payment ON (package_order.pack_order_id = package_payment.package_order_id)
                        ) AS pack
                    INNER JOIN members ON (pack.member_id = members.id AND pack.gender = members.gender)
                ) as orders ORDER BY orders.createdAt DESC`
        return this.findAll(sql, [])
    }
}