"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Users = database_1.sequelize.define('Users', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    users_code: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    access_token: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    refresh_token: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    permission: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status_confirm: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    display_name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
    timestamp: false,
});
