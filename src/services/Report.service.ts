import { DBconnect } from "../util/dbconnect";
let sql: string

export class ReportService extends DBconnect {
    constructor() {
        super()
    }
    queryReportStore = async(start: any = "", end: any = new Date()) => {
        sql = ` SELECT  store.name as storeName, 
                        store.gender, 
                        reportShop.* 
                FROM store 
                LEFT JOIN (
                            SELECT 
                                view_member_package.name as packageLevel,
                                view_member_package.username,
                                orderss.*
                            FROM view_member_package
                            JOIN (
                                SELECT 	
                                        orders_products.*,
                                        orders.totalprice,
                                        orders.netprice,
                                        orders.member_id,
                                        orders.createdAt
                                FROM orders 
                                JOIN (
                                    SELECT orders_product.order_number, 
                                            orders_product.product_id, 
                                            orders_product.product_name, 
                                            orders_product.price,
                                            products.store_id
                                    FROM orders_product JOIN 
                                    (
                                        SELECT product.id, 
                                                store.id as store_id, 
                                                store.name as store_name 
                                        FROM product 
                                        JOIN store ON (product.store_id = store.id)
                                    ) as products ON (orders_product.product_id = products.id)
                                ) as orders_products
                                ON (orders.order_number = orders_products.order_number)
                            ) as orderss ON (view_member_package.mem_id = orderss.member_id)
                ) as reportShop
                ON (store.id = reportShop.store_id)
                where reportShop.createdAt > ? AND reportShop.createdAt < ?`
        return this.findAll(sql, [start, end])
    }
}

