"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Members = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Members = database_1.sequelize.define('Members', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    member_code: {
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
    gender: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    isStore: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'members',
    timestamp: false,
});
