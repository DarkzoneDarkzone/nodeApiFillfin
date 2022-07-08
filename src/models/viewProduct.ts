import { Sequelize, DataTypes, Model } from "Sequelize"
import { sequelize } from "../util/database"

export const ViewProduct = sequelize.define('view_product',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    product_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name_member: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content_member: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name_premium: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content_premium: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price_standard: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_premium: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recommend: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    pre_order: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    sex: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    clip: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    path_img: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_profile: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_concept: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    package_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    buy_limit: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    show_img_limit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    show_gift: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    store_detail_limit: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    product_img: {
        field: 'product_img',
        type: DataTypes.TEXT,
        allowNull: true
    },
    price_sell: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status_premium: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
},
{
    sequelize,
    tableName: 'view_product',
    timestamp: false,
})