import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Orders = sequelize.define('Orders',
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
    payment_status: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    netPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'orders',
    timestamp: false,
})