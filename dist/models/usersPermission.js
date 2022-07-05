"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersPermission = void 0;
const Sequelize_1 = require("Sequelize");
const database_1 = require("../util/database");
exports.UsersPermission = database_1.sequelize.define('UsersPermission', {
    id: {
        autoIncrement: true,
        type: Sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    user_type: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    user_type_th: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    permission: {
        type: Sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users_permission',
    timestamp: false,
});
