"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatTemp = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.ChatTemp = database_1.sequelize.define('ChatTemp', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    user_code: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    member_code: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    from: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'chat_temp',
    timestamp: false
});
