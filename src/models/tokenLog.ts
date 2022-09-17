import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const TokenLog = sequelize.define('TokenLog',
{
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reset_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'token_log',
    timestamp: false
})