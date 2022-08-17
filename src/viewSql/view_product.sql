SELECT  product_show.*,
        package_status.package_id AS package_id,
        package_status.buy_limit AS buy_limit,
        package_status.show_img_limit AS show_img_limit,
        package_status.show_gift AS show_gift,
        package_status.store_detail_limit AS store_detail_limit,
        package_status.price_sell AS price_sell,
        package.premium AS status_premium
FROM (
    (SELECT all_product.*,
        store.name AS store_name,
        store.profile_img AS store_profile,
        store.concept AS store_concept 
    FROM (store JOIN 
            (
                SELECT product.*
                FROM (
                    SELECT product.*,
                        product_image.path_img,
                        row_number() OVER (partition by product.id order by product_image.premium ASC) AS itemNum 
                    FROM (product 
                        LEFT JOIN product_image 
                            ON(product.id = product_image.product_id)
                        ) 
                ) AS product ORDER BY product.id, itemNum
            ) AS all_product
            ON (
                store.id = all_product.store_id 
                AND all_product.status = 'active'
            )
        )
    ) AS product_show 
    JOIN package_status 
    INNER JOIN package 
    ON (package_status.package_id = package.package_id AND product_show.sex = package.gender)
) 
WHERE product_show.itemNum <= package_status.show_img_limit 
ORDER BY product_show.priority ASC