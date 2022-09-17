"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnInit = void 0;
const chat_temp_1 = require("./chat_temp");
const settings_1 = require("./settings");
const tokenLog_1 = require("./tokenLog");
const log_1 = require("./log");
const banner_1 = require("./banner");
const ads_1 = require("./ads");
const website_1 = require("./website");
const usersPermission_1 = require("./usersPermission");
const users_1 = require("./users");
const store_1 = require("./store");
const review_1 = require("./review");
const productImage_1 = require("./productImage");
const product_1 = require("./product");
const postImage_1 = require("./postImage");
const post_1 = require("./post");
const packageStatus_1 = require("./packageStatus");
const packagePayment_1 = require("./packagePayment");
const packageOrder_1 = require("./packageOrder");
const package_1 = require("./package");
const ordersProduct_1 = require("./ordersProduct");
const ordersPayment_1 = require("./ordersPayment");
const ordersCart_1 = require("./ordersCart");
const ordersAddress_1 = require("./ordersAddress");
const orders_1 = require("./orders");
const members_1 = require("./members");
const bankProvider_1 = require("./bankProvider");
const bankAccount_1 = require("./bankAccount");
const database_1 = require("../util/database");
function OnInit() {
    const declaredModel = {
        BankAccount: bankAccount_1.BankAccount,
        BankProvider: bankProvider_1.BankProvider,
        Members: members_1.Members,
        Orders: orders_1.Orders,
        OrdersAddress: ordersAddress_1.OrdersAddress,
        OrdersCart: ordersCart_1.OrdersCart,
        OrdersPayment: ordersPayment_1.OrdersPayment,
        OrdersProduct: ordersProduct_1.OrdersProduct,
        Package: package_1.Package,
        PackageOrder: packageOrder_1.PackageOrder,
        PackagePayment: packagePayment_1.PackagePayment,
        PackageStatus: packageStatus_1.PackageStatus,
        Post: post_1.Post,
        PostImage: postImage_1.PostImage,
        Product: product_1.Product,
        ProductImage: productImage_1.ProductImage,
        Review: review_1.Review,
        Store: store_1.Store,
        User: users_1.User,
        UsersPermission: usersPermission_1.UsersPermission,
        Website: website_1.Website,
        Ads: ads_1.Ads,
        Banner: banner_1.Banner,
        Log: log_1.Log,
        TokenLog: tokenLog_1.TokenLog,
        Settings: settings_1.Settings,
        ChatTemp: chat_temp_1.ChatTemp
    };
    database_1.sequelize.sync();
}
exports.OnInit = OnInit;
