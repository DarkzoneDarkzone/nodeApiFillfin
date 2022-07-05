"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIO = void 0;
let io;
exports.SIO = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    }
};
