"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageStatus = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.PackageStatus = database_1.sequelize.define('PackageStatus', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    package_id: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    but_limit: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    show_img_limit: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    show_gift: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_detail_limit: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    price_sell: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'package_status',
    timestamp: false,
});
