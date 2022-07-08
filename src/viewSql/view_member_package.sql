select current.pack_id AS pack_id,
       current.package_id AS package_id,
       current.name AS name,
       current.member_gender AS member_gender,
       current.begin,
       current.expire,
       current.status_expire,
       current.mem_id AS mem_id,
       current.isStore AS isStore,
       current.username AS username,
       current.buy_limit AS buy_limit,
       current.premium,
       current.show_img_limit AS show_img_limit,
       current.show_gift AS show_gift,
       current.store_detail_limit AS store_detail_limit,
       current.price_sell AS price_sell
from (
       select current_pack.pack_id AS pack_id,
              current_pack.package_id AS package_id,
              current_pack.name AS name,
              current_pack.member_gender AS member_gender,
              current_pack.mem_id AS mem_id,
              current_pack.username AS username,
              current_pack.isStore AS isStore,
              current_pack.package_priority AS package_priority,
              current_pack.premium,
              current_pack.begin,
              current_pack.expire,
              current_pack.status_expire,
              package_status.buy_limit AS buy_limit,
              package_status.show_img_limit AS show_img_limit,
              package_status.show_gift AS show_gift,
              package_status.store_detail_limit AS store_detail_limit,
              package_status.price_sell AS price_sell,
              row_number() over ( order by current_pack.package_priority ASC) AS priority
       from (
              (select package.pack_id AS pack_id,
                     package.package_id AS package_id,
                     package.name AS name,
                     package.premium,
                     members.id AS mem_id,
                     members.username AS username,
                     members.isStore AS isStore,
                     members.gender AS member_gender,
                     package_order.begin,
                     package_order.expire,
                     package_order.status_expire,
                     row_number() over (order by package.priority desc) AS package_priority 
              from (
                     (
                            (members 
                            left join store 
                                   on (members.username = store.username)
                            ) 
                            join package
                     ) 
                     left join package_order 
                     on(package_order.member_id = members.id 
                            and package_order.package_id = package.package_id)
              ) 
              where package_order.member_id = members.id 
                     and package_order.status_confirm = 'confirm' 
                     and package_order.status_payment = 'confirm' 
                     and package_order.status_expire = 'no'
                     or members.isStore = 'yes' 
                     and package.package_id = 'PACKAGE_EXCLUSIVE' 
                     and store.gender = members.gender
              ) current_pack 
       join package_status 
       on(current_pack.package_id = package_status.package_id)
       )
) current group by current.mem_id,current.member_gender;