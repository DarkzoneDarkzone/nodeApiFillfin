import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const PackagePayment = sequelize.define('PackagePayment',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    package_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    slip: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status_confirm: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    user_confirm: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bank_ref: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'package_payment',
    timestamp: false,
})