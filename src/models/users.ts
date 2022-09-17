import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const User = sequelize.define('User',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    users_code: {
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
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    permission: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status_confirm: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    profile_img: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'user',
    timestamp: false,
})