import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const PackageStatus = sequelize.define('PackageStatus',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    but_limit: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    show_img_limit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    show_gift: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    store_detail_limit: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    price_sell: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'package_status',
    timestamp: false,
})