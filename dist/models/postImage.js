"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostImage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.PostImage = database_1.sequelize.define('PostImage', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    post_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    path_image: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'post_image',
    timestamp: false,
});
