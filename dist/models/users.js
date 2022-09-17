"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.User = database_1.sequelize.define('User', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    users_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    access_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    permission: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status_confirm: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    display_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    profile_img: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'user',
    timestamp: false,
});
