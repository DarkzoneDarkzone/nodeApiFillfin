import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const OrdersProduct = sequelize.define('OrdersProduct',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    order_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    product_content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'orders_product',
    timestamp: false,
})