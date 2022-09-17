"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewProductAllStore = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.ViewProductAllStore = database_1.sequelize.define('view_product_all_store', {
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
        allowNull: false
    },
    price_premium: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    recommend: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    pre_order: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    sex: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    clip: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    store_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_profile: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    store_concept: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    store_code: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    product_img: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    totalProduct: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'view_product_all_store',
    timestamp: false,
});
