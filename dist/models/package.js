"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Package = database_1.sequelize.define('Package', {
    pack_id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    day: {
        type: Sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    month: {
        type: Sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    year: {
        type: Sequelize_1.DataTypes.STRING(40),
        allowNull: false,
    },
    image: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    gross_profit: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package',
    timestamp: false,
});
