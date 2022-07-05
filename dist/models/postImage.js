"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostImage = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.PostImage = database_1.sequelize.define('PostImage', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    post_id: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    path_image: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    priority: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'post_image',
    timestamp: false,
});
