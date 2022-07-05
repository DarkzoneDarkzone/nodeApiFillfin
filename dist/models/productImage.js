"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.ProductImage = database_1.sequelize.define('ProductImage', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    product_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    path_img: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    hover: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    member_type: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'product_image',
    timestamp: false,
});
