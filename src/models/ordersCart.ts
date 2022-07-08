import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const OrdersCart = sequelize.define('OrdersCart',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    memberId: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'orders_cart',
    timestamp: false,
})