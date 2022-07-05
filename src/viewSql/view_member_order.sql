SELECT  orders_pro.product_name AS product_name,
        orders_pro.product_content AS product_content,
        orders_pro.product_price AS product_price,
        orders_pro.member_id AS member_id,
        orders_pro.path_img AS path_img,
        orders.* 
FROM (
    SELECT orders.order_number,
            orders.payment_status,
            orders.status as order_status,
            orders.totalprice as totalPrice,
            orders.netprice as netPrice,
            orders_address.name as member_name,
            orders_address.address,
            orders_address.phone,
            orders_address.district,
            orders_address.subdistrict,
            orders_address.province,
            orders_address.code,
            orders_address.note,
            orders.createdAt
     FROM orders 
    JOIN orders_address 
        ON (orders.order_number = orders_address.order_number)
    ) as orders 
    JOIN (
        SELECT orders_product.order_number,
                orders_product.product_name, 
                orders_product.product_content, 
                orders_product.price as product_price, 
                orders_product.member_id,
                orders_product.status,
                product_image.path_img
        FROM orders_product 
        JOIN product_image ON 
            (orders_product.product_id = product_image.product_id)  
        ORDER BY product_image.premium DESC
) as orders_pro 
ON (orders.order_number = orders_pro.order_number AND orders_pro.status = "ordered")
GROUP BY orders_pro.order_number