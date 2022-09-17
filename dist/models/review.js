"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.Review = database_1.sequelize.define('Review', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    member_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    star: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'review',
    timestamp: false,
});
