let io: any;
export const SIO  = {
    init: (httpServer: any) => {
        io = require('socket.io')(httpServer, {
            cors:{
              credentials: true
            }
        })
        return io;
    },
    getIO: ()=> {
        if(!io){
            throw new Error('Socket.io not initialized')
        }
        return io;
    }
}
