import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const PackageOrder = sequelize.define('PackageOrder',
{
    pack_order_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    begin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    expire: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status_expire: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status_confirm: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    status_payment: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'package_order',
    timestamp: false,
})