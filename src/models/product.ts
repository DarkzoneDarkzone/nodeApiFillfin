import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Product = sequelize.define('Product',
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
        allowNull: false,
    },
    price_premium: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recommend: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    pre_order: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    sex: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    clip: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'product',
    timestamp: false,
})