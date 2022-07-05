"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Website = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Website = database_1.sequelize.define('Website', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    type: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    title: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    h1: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    h2: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    video_link: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    image_link: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    display: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    priority: {
        type: Sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'website',
    timestamp: false,
});
