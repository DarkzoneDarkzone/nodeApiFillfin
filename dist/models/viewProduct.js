"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewProduct = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.ViewProduct = database_1.sequelize.define('view_product', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    product_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_member: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_member: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_premium: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_premium: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    price_standard: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    price_premium: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    recommend: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    pre_order: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    sex: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    clip: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    path_img: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_profile: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_concept: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    package_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    buy_limit: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    show_img_limit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    show_gift: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    store_detail_limit: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    product_img: {
        field: 'product_img',
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    price_sell: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    status_premium: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'view_product',
    timestamp: false,
});
