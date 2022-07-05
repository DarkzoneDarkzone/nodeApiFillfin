import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const OrdersPayment = sequelize.define('OrdersPayment',
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
    bank_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    slip: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status_confirm: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    total_pay: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date_pay: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'orders_payment',
    timestamp: false,
})