import { Settings } from './settings';
import { TokenLog } from './tokenLog';
import { Log } from './log';
import { Banner } from './banner';
import { Ads } from './ads';
import { Website } from './website';
import { UsersPermission } from './usersPermission';
import { User } from './users';
import { Store } from './store';
import { Review } from './review';
import { ProductImage } from './productImage';
import { Product } from './product';
import { PostImage } from './postImage';
import { Post } from './post';
import { PackageStatus } from './packageStatus';
import { PackagePayment } from './packagePayment';
import { PackageOrder } from './packageOrder';
import { Package } from './package';
import { OrdersProduct } from './ordersProduct';
import { OrdersPayment } from './ordersPayment';
import { OrdersCart } from './ordersCart';
import { OrdersAddress } from './ordersAddress';
import { Orders } from './orders';
import { Members } from './members';
import { BankProvider } from './bankProvider';
import { BankAccount } from './bankAccount';
import { sequelize } from '../util/database';

export function OnInit(){
    const declaredModel = {
        BankAccount,
        BankProvider,
        Members,
        Orders,
        OrdersAddress,
        OrdersCart,
        OrdersPayment,
        OrdersProduct,
        Package,
        PackageOrder,
        PackagePayment,
        PackageStatus,
        Post,
        PostImage,
        Product,
        ProductImage,
        Review,
        Store,
        User,
        UsersPermission,
        Website,
        Ads,
        Banner,
        Log,
        TokenLog,
        Settings
    }
    sequelize.sync(); 
}
