"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.ProductImage = database_1.sequelize.define('ProductImage', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    product_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    path_img: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    hover: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    premium: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    display: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    member_type: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'product_image',
    timestamp: false,
});
