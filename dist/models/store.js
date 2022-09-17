"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Store = database_1.sequelize.define('Store', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    store_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    access_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    profile_img: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    profile_video: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    concept: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    age: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    height: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    bwh: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'store',
    timestamp: false,
});
