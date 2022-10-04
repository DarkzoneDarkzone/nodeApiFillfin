SELECT all_store.*
FROM (
       SELECT 
              store.id as store_id,
              store.name as store_name,
              store.profile_img as store_profile, 
              store.concept as store_concept, 
              store.store_code,
              store.status as storeStatus,
              store.updatedAt as lastUpdate,
              products.id,
              products.product_code,
              products.name_member,
              products.content_member,
              products.name_premium,
              products.content_premium,
              products.price_standard,
              products.price_premium,
              products.recommend,
              products.pre_order,
              products.status,
              products.clip,
              products.priority,
              products.createdAt,
              products.updatedAt,
              products.product_img,
              store.gender as sex,
              row_number() over (partition by products.store_id order by products.createdAt desc) as productPriority
       FROM store 
       LEFT JOIN (
              SELECT product.id,
                     product.product_code,
                     product.name_member,
                     product.content_member,
                     product.name_premium,
                     product.content_premium,
                     product.price_standard,
                     product.price_premium,
                     product.recommend,
                     product.pre_order,
                     product.status,
                     product.clip,
                     product.store_id,
                     product.priority,
                     product.createdAt,
                     product.updatedAt,
                     GROUP_CONCAT(product_image.path_img) as product_img
              FROM product
              LEFT JOIN (SELECT * FROM product_image where (product_image.premium = "no")) as product_image 
              ON (product.id = product_image.product_id)
              WHERE  product.status = "active"
           	GROUP BY product.id
       ) as products
       ON (store.id = products.store_id)
       ORDER BY products.pre_order ASC
) as all_store WHERE all_store.storeStatus = "active" ORDER BY all_store.lastUpdate DESC, all_store.updatedAt DESC;