"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Website = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Website = database_1.sequelize.define('Website', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    type: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    h1: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    h2: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    video_link: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    image_link: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    isFile: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'website',
    timestamp: false,
});
