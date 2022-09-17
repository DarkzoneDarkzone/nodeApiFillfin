"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Package = database_1.sequelize.define('Package', {
    pack_id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    day: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    month: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    year: {
        type: sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    gross_profit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    premium: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package',
    timestamp: false,
});
