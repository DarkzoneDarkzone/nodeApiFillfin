import { Sequelize, DataTypes } from "Sequelize"
import { sequelize } from "../util/database"

export const Members = sequelize.define('Members',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    member_code: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    isStore: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    statusMember: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'members',
    timestamp: false,
})