SELECT all_store.*, COUNT(all_store.product_code) as totalProduct
FROM (
       SELECT 
              store.name as store_name,
              store.profile_img as store_profile, 
              store.concept as store_concept, 
              store.store_code,
              store.status as storeStatus,
              products.*,
              row_number() over (partition by products.store_id order by products.createdAt desc) as productPriority
       FROM store 
       JOIN (
              SELECT product.*,
                     GROUP_CONCAT(product_image.path_img) as product_img
              FROM product
              LEFT JOIN (SELECT * FROM product_image where (product_image.premium = "no")) as product_image 
              ON (product.id = product_image.product_id)
              WHERE  product.status = "active"
           	GROUP BY product.id
       ) as products
       ON (store.id = products.store_id)
       ORDER BY products.pre_order ASC
) as all_store GROUP BY all_store.store_id