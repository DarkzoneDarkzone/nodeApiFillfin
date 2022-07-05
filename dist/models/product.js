"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Product = database_1.sequelize.define('Product', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    product_code: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_member: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_member: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    name_premium: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    content_premium: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    price_standard: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    price_premium: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    recommend: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    pre_order: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    sex: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    clip: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'product',
    timestamp: false,
});
