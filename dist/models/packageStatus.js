"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.PackageStatus = database_1.sequelize.define('PackageStatus', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    buy_limit: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    show_img_limit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    show_gift: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_detail_limit: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    price_sell: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package_status',
    timestamp: false,
});
