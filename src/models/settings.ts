import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Settings = sequelize.define('Settings',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    setting_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    setting_value: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    display: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'settings',
    timestamp: false,
})