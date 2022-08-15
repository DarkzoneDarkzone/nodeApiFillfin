import { Sequelize, DataTypes, Model } from "Sequelize"
import { sequelize } from "../util/database"

export const ViewReportShop = sequelize.define('view_report_shop',
{
    storeName: {
        type: DataTypes.STRING(255),
    },
    gender: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    packageLevel: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    order_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    product_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalprice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    netprice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
},
{
    sequelize,
    tableName: 'view_report_shop',
    timestamp: false,
    updatedAt: false,
})