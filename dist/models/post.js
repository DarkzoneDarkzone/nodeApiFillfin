"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Post = database_1.sequelize.define('Post', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    post_code: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_id: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    caption: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'post',
    timestamp: false,
});
