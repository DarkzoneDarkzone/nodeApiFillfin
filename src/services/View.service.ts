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
        sql = ` SELECT view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id`
        return this.findAll(sql, [package_id, sex, store_id])
    }
    query_product_recommend = async (package_id: any, sex: any) => {
        sql = ` SELECT view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND recommend = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`
        return this.findAll(sql, [package_id, sex])
    }
    query_product_preorder = async (package_id: any, sex: any, store_id: any) => {
        sql = ` SELECT view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY RAND()`
        return this.findAll(sql, [package_id, sex, store_id])
    }
    query_store_post = async (store_id: any) => {
        sql = `SELECT * FROM 
                (   SELECT store_post.*, GROUP_CONCAT(post_image.path_image) as post_img, row_number() OVER (ORDER BY post_image.priority ASC) as priority
                    FROM (
                        SELECT post.*,
                            store.name as store_name,
                            store.profile_img as store_profile, 
                            store.concept as store_concept
                        FROM store
                        JOIN post ON (store.id = post.store_id AND post.status = "active")
                    ) as store_post 
                    LEFT JOIN post_image ON (post_image.post_id = store_post.id)
                    GROUP BY store_post.id
                ) as posts
                WHERE posts.store_id = ?
                ORDER BY posts.createdAt DESC`
        return this.findAll(sql, [store_id])
    }
    query_product_incart = async (member_id: any, ) => {
        sql = `SELECT * FROM 
                    (SELECT products.*, 
                            view_member_package.premium 
                    FROM view_member_package 
                        INNER JOIN 
                        (
                            SELECT product.*, orders_cart.memberId 
                            FROM (
                                SELECT product.*, 
                                    product_image.path_img 
                                FROM product 
                                LEFT JOIN product_image 
                                    on (product.id = product_image.product_id) 
                                GROUP BY product.id
                            ) as product 
                            INNER JOIN orders_cart ON orders_cart.productId = product.id
                        ) as products
                        ON (view_member_package.mem_id = products.memberId)
                    ) as cart
                WHERE cart.memberId = ?`
        return this.findAll(sql, [member_id])
    }
    query_member_order = async(member_id: any) => {
        sql = `SELECT * FROM 
                        (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                            updatedAt, name, address, phone, district, subdistrict, province, code, note,
                            GROUP_CONCAT(product_id) as product_id,
                            GROUP_CONCAT(product_name) as product_name,
                            GROUP_CONCAT(product_content) as product_content,
                            GROUP_CONCAT(price) as price,
                            GROUP_CONCAT(product_status) as product_status,
                            GROUP_CONCAT(store_id) as store_id,
                            GROUP_CONCAT(product_image) as product_image
                        FROM 
                            (SELECT orders.*,
                                orders_address.name, 
                                orders_address.address, 
                                orders_address.phone, 
                                orders_address.district, 
                                orders_address.subdistrict, 
                                orders_address.province, 
                                orders_address.code,
                                orders_address.note,
                                ord_product.product_id, 
                                ord_product.product_name, 
                                ord_product.product_content, 
                                ord_product.price, 
                                ord_product.store_id,
                                ord_product.status as product_status,
                                ord_product.path_img as product_image
                            FROM orders 
                            JOIN orders_address ON (orders.order_number = orders_address.order_number)
                            JOIN 
                                (SELECT orders_product.*, 
                                    product.store_id,
                                    product.path_img
                                FROM orders_product 
                                JOIN (SELECT product.*, 
                                        product_image.path_img
                                FROM product JOIN product_image ON (product.id = product_image.product_id) 
                                GROUP BY product.id) as product 
                            ON (orders_product.product_id = product.id)
                        ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                        ) as ord GROUP BY ord.order_number
                ) as mem_ord WHERE mem_ord.member_id = ? ORDER BY mem_ord.createdAt DESC`
        return this.findAll(sql, [member_id])
    }
    query_store_order = async(store_id: any) => {
        sql = `SELECT * FROM 
                    (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, name, address, phone, district, subdistrict, province, code, note, store_id,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(product_image) as product_image
                    FROM
                    (SELECT orders.*,
                            orders_address.name, 
                            orders_address.address, 
                            orders_address.phone, 
                            orders_address.district, 
                            orders_address.subdistrict, 
                            orders_address.province, 
                            orders_address.code,
                            orders_address.note,
                            ord_product.product_id, 
                            ord_product.product_name, 
                            ord_product.product_content, 
                            ord_product.price, 
                            ord_product.store_id,
                            ord_product.status as product_status,
                            ord_product.path_img as product_image
                    FROM orders 
                            JOIN orders_address ON (orders.order_number = orders_address.order_number)
                            JOIN 
                                (SELECT orders_product.*, 
                                    product.store_id,
                                    product.path_img
                                FROM orders_product 
                                JOIN (SELECT product.*, 
                                        product_image.path_img
                                FROM product JOIN product_image ON (product.id = product_image.product_id) 
                                GROUP BY product.id) as product 
                            ON (orders_product.product_id = product.id)
                            ) as ord_product
                            ON (orders.order_number = ord_product.order_number)
                    ) as ord GROUP BY ord.order_number, ord.store_id) as store_order
                WHERE store_order.store_id = ? ORDER BY store_order.createdAt DESC`
        return this.findAll(sql, [store_id])
    }
    query_admin_order = async() => {
        sql = `SELECT * FROM 
                    (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, name, address, phone, district, subdistrict, province, code, note, store_id, slip, isRead,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(recommend) as recommend,
                        GROUP_CONCAT(pre_order) as preOrder,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(product_image) as product_image
                    FROM
                    (SELECT orders.*,
                            orders_address.name, 
                            orders_address.address, 
                            orders_address.phone, 
                            orders_address.district, 
                            orders_address.subdistrict, 
                            orders_address.province, 
                            orders_address.code,
                            orders_address.note,
                            ord_product.product_id, 
                            ord_product.product_name, 
                            ord_product.product_content, 
                            ord_product.price, 
                            ord_product.store_id,
                            ord_product.status as product_status,
                            ord_product.path_img as product_image,
                            orders_payment.slip,
                            ord_product.recommend,
                        ord_product.pre_order
                    FROM orders 
                            JOIN orders_address ON (orders.order_number = orders_address.order_number)
                            JOIN 
                                (SELECT orders_product.*, 
                                    product.store_id,
                                    product.path_img,
                                    product.recommend,
                                product.pre_order
                                FROM orders_product 
                                JOIN (SELECT product.*, 
                                        product_image.path_img
                                FROM product JOIN product_image ON (product.id = product_image.product_id) 
                                GROUP BY product.id) as product 
                                ON (orders_product.product_id = product.id)
                                ) as ord_product
                            ON (orders.order_number = ord_product.order_number)
                            JOIN orders_payment ON (orders_payment.order_number = orders.order_number)
                    ) as ord GROUP BY ord.order_number, ord.store_id) as store_order ORDER BY store_order.isRead ASC, store_order.createdAt DESC`
        return this.findAll(sql, [])
    }
    query_order_one = async(order_number: any, product_id: any) => {
        sql = `SELECT * FROM 
                    (SELECT orders.*,
                            orders_address.name,
                            orders_address.address,
                            orders_address.phone,
                            orders_address.district,
                            orders_address.subdistrict,
                            orders_address.province,
                            orders_address.code,
                            orders_address.note,
                            ord_product.product_id,
                            ord_product.product_name,
                            ord_product.product_content,
                            ord_product.price,
                            ord_product.status as status_product,
                            ord_product.store_id
                         FROM orders 
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id 
                            FROM orders_product 
                            JOIN product ON (orders_product.product_id = product.id)
                            ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord 
                WHERE ord.order_number = ? AND ord.product_id = ?`
        return this.findOne(sql, [order_number, product_id])
    }
    queryReviewForMember = async(store_id: any) => {
        sql = `SELECT   review.id as reviewId,
                        members.username, 
                        review.message, 
                        review.star, 
                        review.store_id, 
                        review.display  
                FROM review JOIN members ON (review.member_id = members.id) where review.display = "yes" AND store_id = ?`
        return this.findAll(sql, [store_id])
    }
    queryChatMember = async() => {
        sql = `SELECT * FROM (
                        SELECT chat_temp.*, 
                            members.username, 
                            row_number() over (partition by chat_temp.member_code order by chat_temp.isRead ASC) AS priority 
                        FROM chat_temp 
                        JOIN members ON (chat_temp.member_code = members.member_code)
                ) as chatMember 
                GROUP BY chatMember.member_code`
        return this.findAll(sql, [])
    }
}