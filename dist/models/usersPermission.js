"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersPermission = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../util/database");
exports.UsersPermission = database_1.sequelize.define('UsersPermission', {
    id: {
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    user_type: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    user_type_th: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    permission: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users_permission',
    timestamp: false,
});
