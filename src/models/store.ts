import { Sequelize, DataTypes } from "sequelize"
import { sequelize } from "../util/database"

export const Store = sequelize.define('Store',
{
    id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    store_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    profile_img: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    profile_video: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    concept: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    age: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    weight: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    height: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    bwh: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'store',
    timestamp: false,
})