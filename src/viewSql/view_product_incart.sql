SELECT * FROM (SELECT products.*, 
        orders_product.id as ord_product_id,
        orders_product.order_number,
        orders_product.member_id,
        row_number() over (partition by products.id order by products.premium DESC) AS priority
FROM orders_product 
JOIN (
    SELECT product.*, 
        product_image.path_img, 
        product_image.premium 
    FROM product 
    JOIN product_image 
        ON (
            product.id = product_image.product_id
            AND product.status = "active"
            )
    ) AS products
ON (orders_product.product_id = products.id 
AND orders_product.status = "incart")
) as prod WHERE prod.priority < 2