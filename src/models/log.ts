import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Log = sequelize.define('Log',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    user_code: {
        type: DataTypes.TEXT
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    section: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'log',
    timestamp: false
})