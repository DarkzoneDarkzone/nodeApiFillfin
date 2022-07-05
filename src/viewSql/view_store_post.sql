SELECT  store_post.post_code as post_code,
        store_post.store_id,
        store_post.store_name,
        store_post.store_profile,
        store_post.store_concept,
        store_post.caption,
		GROUP_CONCAT(post_image.path_image) as post_img,
        store_post.display,
        store_post.createdAt,
        store_post.updatedAt,
        row_number() OVER (ORDER BY post_image.priority ASC) as priority
FROM (
    SELECT  post.*,
            store.name as store_name,
            store.profile_img as store_profile, 
            store.concept as store_concept
    FROM `store` 
    JOIN post
    ON (store.id = post.store_id AND post.status = "active")
) as store_post 
JOIN post_image 
ON (post_image.post_id = store_post.id)
GROUP BY store_post.id;