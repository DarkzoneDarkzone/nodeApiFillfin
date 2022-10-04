import { DBconnect } from "../util/dbconnect";
let sql: string

export class ReportService extends DBconnect {
    constructor() {
        super()
    }
    queryReportStore = async(start: any, end: any) => {
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
                where (reportShop.createdAt > ? AND reportShop.createdAt < ?) OR (reportShop.createdAt IS NULL)`
        return this.findAll(sql, [start, end])
    }
    queryReportCustomer = async(start: any, end: any) => {
        sql =  `SELECT  memberCurrent.*, 
                        orders.priceTotal, 
                        packageOrder.totalPackage
                FROM (
                    SELECT member.id,
                        member.username,
                        view_member_package.name as packageLevel,
                        view_member_package.begin as packageBegin,
                        member.createdAt as registerDate,
                        member.note
                    FROM (
                        SELECT * FROM members 
                        WHERE members.isStore = "no"
                    ) as member 
                    LEFT JOIN view_member_package 
                    ON (member.id = view_member_package.mem_id)
                ) as memberCurrent 
                LEFT JOIN (
                        SELECT orders.*, 
                                SUM(orders.netprice) as priceTotal 
                        FROM orders 
                        WHERE (orders.status = "success" AND orders.payment_status = "confirm")
                        GROUP BY orders.member_id
                ) as orders
                ON (memberCurrent.id = orders.member_id)
                LEFT JOIN (
                        SELECT package_order.member_id, 
                                COUNT(package_order.member_id) as totalPackage 
                        FROM package_order 
                        WHERE (package_order.status_confirm = "confirm" AND package_order.status_payment = "confirm") 
                        GROUP BY (package_order.member_id)
                ) as packageOrder
                ON (memberCurrent.id = packageOrder.member_id)
                where (memberCurrent.registerDate > ? AND memberCurrent.registerDate < ?)`
        return this.findAll(sql, [start, end])
    }
    queryReportOrder = async(start: any, end: any) => {
        sql = `SELECT orders.order_number, 
                    orders_address.name,
                    orders_address.address,
                    orders_address.district,
                    orders_address.subdistrict,
                    orders_address.province,
                    orders_address.code,
                    orders_address.phone,
                    orders.totalprice, 
                    orders.netprice,
                    orders_payment.slip,
                    orders_address.note,
                    orders.payment_status, 
                    orders.status,
                    orders.createdAt
                FROM orders 
                JOIN orders_address 
                ON (orders.order_number = orders_address.order_number)
                JOIN orders_payment 
                ON (orders.order_number = orders_payment.order_number AND orders.payment_status = "confirm")
                WHERE (orders.createdAt > ? AND orders.createdAt < ?)`
        return this.findAll(sql, [start, end])
    }
    queryMemberPackage = async() => {
        sql = `SELECT *, 
                    COUNT(view_member_package.mem_id) as totalMember
                FROM view_member_package 
                WHERE isStore = "no" 
                GROUP BY package_id`
        return this.findAll(sql, [])
    }
    queryStoreOrder = async() => {
        sql =   `SELECT perStore.*, 
                        store.name 
                FROM store 
                JOIN (SELECT allPro.store_id,
                        allPro.status,
                        SUM(allPro.price) as totalPrice, 
                        COUNT(allPro.store_id) as totalProductSold
                    FROM (
                        SELECT orders_product.*, 
                            product.store_id 
                        FROM product 
                        JOIN orders_product 
                        ON (product.id = orders_product.product_id)
                    ) as allPro 
                GROUP BY allPro.store_id) as perStore 
                ON (store.id = perStore.store_id)`
        return this.findAll(sql, [])
    }
    queryNewMember = async() => {
        sql = `SELECT package_order.* 
                FROM members 
                JOIN package_order ON (members.id = package_order.member_id) 
                JOIN package_payment ON (package_payment.package_order_id = package_order.pack_order_id) 
                WHERE package_order.status_confirm != "confirm" OR package_order.status_payment != "confirm" 
                GROUP BY package_order.member_id;`
        return this.findAll(sql, [])
    }
}

