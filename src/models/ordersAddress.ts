import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const OrdersAddress = sequelize.define('OrdersAddress',
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
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    subdistrict: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    province: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'orders_address',
    timestamp: false,
})