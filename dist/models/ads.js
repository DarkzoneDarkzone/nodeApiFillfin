"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ads = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Ads = database_1.sequelize.define('Ads', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    position: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    isMen: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.STRING(255),
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
    display: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    img_path: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'ads',
    timestamp: false
});
