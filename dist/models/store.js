"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.Store = database_1.sequelize.define('Store', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    store_code: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    password: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    profile_img: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    profile_video: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    concept: {
        type: Sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    age: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    weight: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    height: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    bwh: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    gender: {
        type: Sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    status: {
        type: Sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'store',
    timestamp: false,
});
