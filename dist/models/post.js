"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Post = database_1.sequelize.define('Post', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    post_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    caption: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'post',
    timestamp: false,
});
