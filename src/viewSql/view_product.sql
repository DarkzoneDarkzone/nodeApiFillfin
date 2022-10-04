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




-- backup
select `product_show`.`id` AS `id`,
        `product_show`.`product_code` AS `product_code`,
        `product_show`.`name_member` AS `name_member`,
        `product_show`.`content_member` AS `content_member`,
        `product_show`.`name_premium` AS `name_premium`,
        `product_show`.`content_premium` AS `content_premium`,
        `product_show`.`price_standard` AS `price_standard`,
        `product_show`.`price_premium` AS `price_premium`,
        `product_show`.`recommend` AS `recommend`,
        `product_show`.`pre_order` AS `pre_order`,
        `product_show`.`status` AS `status`,
        `product_show`.`sex` AS `sex`,
        `product_show`.`clip` AS `clip`,
        `product_show`.`store_id` AS `store_id`,
        `product_show`.`priority` AS `priority`,
        `product_show`.`createdAt` AS `createdAt`,
        `product_show`.`updatedAt` AS `updatedAt`,
        `product_show`.`path_img` AS `path_img`,
        `product_show`.`itemNum` AS `itemNum`,
        `product_show`.`store_name` AS `store_name`,
        `product_show`.`store_profile` AS `store_profile`,
        `product_show`.`store_concept` AS `store_concept`,
        `fillfin`.`package_status`.`package_id` AS `package_id`,
        `fillfin`.`package_status`.`buy_limit` AS `buy_limit`,
        `fillfin`.`package_status`.`show_img_limit` AS `show_img_limit`,
        `fillfin`.`package_status`.`show_gift` AS `show_gift`,
        `fillfin`.`package_status`.`store_detail_limit` AS `store_detail_limit`,
        `fillfin`.`package_status`.`price_sell` AS `price_sell`,
        `fillfin`.`package`.`premium` AS `status_premium` 
from (
    (
        (select `all_product`.`id` AS `id`,
            `all_product`.`product_code` AS `product_code`,
            `all_product`.`name_member` AS `name_member`,
            `all_product`.`content_member` AS `content_member`,
            `all_product`.`name_premium` AS `name_premium`,
            `all_product`.`content_premium` AS `content_premium`,
            `all_product`.`price_standard` AS `price_standard`,
            `all_product`.`price_premium` AS `price_premium`,
            `all_product`.`recommend` AS `recommend`,
            `all_product`.`pre_order` AS `pre_order`,
            `all_product`.`status` AS `status`,
            `all_product`.`sex` AS `sex`,
            `all_product`.`clip` AS `clip`,
            `all_product`.`store_id` AS `store_id`,
            `all_product`.`priority` AS `priority`,
            `all_product`.`createdAt` AS `createdAt`,
            `all_product`.`updatedAt` AS `updatedAt`,
            `all_product`.`path_img` AS `path_img`,
            `all_product`.`itemNum` AS `itemNum`,
            `fillfin`.`store`.`name` AS `store_name`,
            `fillfin`.`store`.`profile_img` AS `store_profile`,
            `fillfin`.`store`.`concept` AS `store_concept` 
        from (`fillfin`.`store` 
            join (
                select `product`.`id` AS `id`,
                    `product`.`product_code` AS `product_code`,
                    `product`.`name_member` AS `name_member`,
                    `product`.`content_member` AS `content_member`,
                    `product`.`name_premium` AS `name_premium`,
                    `product`.`content_premium` AS `content_premium`,
                    `product`.`price_standard` AS `price_standard`,
                    `product`.`price_premium` AS `price_premium`,
                    `product`.`recommend` AS `recommend`,
                    `product`.`pre_order` AS `pre_order`,
                    `product`.`status` AS `status`,
                    `product`.`sex` AS `sex`,
                    `product`.`clip` AS `clip`,
                    `product`.`store_id` AS `store_id`,
                    `product`.`priority` AS `priority`,
                    `product`.`createdAt` AS `createdAt`,
                    `product`.`updatedAt` AS `updatedAt`,
                    `product`.`path_img` AS `path_img`,
                    `product`.`itemNum` AS `itemNum` 
                from (
                        select `fillfin`.`product`.`id` AS `id`,
                            `fillfin`.`product`.`product_code` AS `product_code`,
                            `fillfin`.`product`.`name_member` AS `name_member`,
                            `fillfin`.`product`.`content_member` AS `content_member`,
                            `fillfin`.`product`.`name_premium` AS `name_premium`,
                            `fillfin`.`product`.`content_premium` AS `content_premium`,
                            `fillfin`.`product`.`price_standard` AS `price_standard`,
                            `fillfin`.`product`.`price_premium` AS `price_premium`,
                            `fillfin`.`product`.`recommend` AS `recommend`,
                            `fillfin`.`product`.`pre_order` AS `pre_order`,
                            `fillfin`.`product`.`status` AS `status`,
                            `fillfin`.`product`.`sex` AS `sex`,
                            `fillfin`.`product`.`clip` AS `clip`,
                            `fillfin`.`product`.`store_id` AS `store_id`,
                            `fillfin`.`product`.`priority` AS `priority`,
                            `fillfin`.`product`.`createdAt` AS `createdAt`,
                            `fillfin`.`product`.`updatedAt` AS `updatedAt`,
                            `fillfin`.`product_image`.`path_img` AS `path_img`,
                            row_number() OVER (PARTITION BY `fillfin`.`product`.`id` ORDER BY `fillfin`.`product_image`.`premium` ) AS `itemNum` 
                        from (`fillfin`.`product` 
                            left join `fillfin`.`product_image` 
                            on((`fillfin`.`product`.`id` = `fillfin`.`product_image`.`product_id`))
                        )
                ) `product` order by `product`.`id`,`product`.`itemNum`
            ) `all_product` 
            on(
                (
                    (`fillfin`.`store`.`id` = `all_product`.`store_id`) and (`all_product`.`status` = 'active')
                )
            )
        )
    ) `product_show` join `fillfin`.`package_status`
    ) join `fillfin`.`package` on(((`fillfin`.`package_status`.`package_id` = `fillfin`.`package`.`package_id`) 
    and (`product_show`.`sex` = `fillfin`.`package`.`gender`)))) 
where (`product_show`.`itemNum` <= `fillfin`.`package_status`.`show_img_limit`) 
order by `product_show`.`priority`
