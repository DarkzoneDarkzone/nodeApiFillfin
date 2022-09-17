"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Product = database_1.sequelize.define('Product', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    product_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_member: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_member: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_premium: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_premium: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    price_standard: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    price_premium: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    recommend: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    pre_order: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    sex: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    clip: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'product',
    timestamp: false,
});
