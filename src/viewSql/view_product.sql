select  product_show.*,
        package_status.package_id AS package_id,
        package_status.buy_limit AS buy_limit,
        package_status.show_img_limit AS show_img_limit,
        package_status.show_gift AS show_gift,
        package_status.store_detail_limit AS store_detail_limit,
        package_status.price_sell AS price_sell,
        package.premium as status_premium
from (
    (select all_product.*,
        store.name AS store_name,
        store.profile_img AS store_profile,
        store.concept AS store_concept 
    from (store join 
            (
                select product.*
                from (
                    select product.*,
                        product_image.path_img,
                        row_number() over ( partition by product.id order by product_image.premium asc) AS itemNum 
                    from (product 
                        join product_image 
                            on(product.id = product_image.product_id)
                        ) 
                ) product order by product.id, itemNum
            ) all_product
            on (
                store.id = all_product.store_id 
                and all_product.status = 'active'
            )
        )
) product_show join package_status inner join package on (package_status.package_id = package.package_id AND product_show.sex = package.gender)) 
where product_show.itemNum <= package_status.show_img_limit ORDER BY product_show.priority ASC