const ChatMessage = require('../mongoose-models/ChatMessage');

module.exports = function(io) {
    io.sockets.on('connection', socket => {

        socket.username = 'Anonymous_' + (socket.id || '').substr(0, 4);
    
        socket.on('user_join_room', data => {
            Object.assign(socket, data);
            socket.valid = true;
            socket.join(data.roomId);
            socket.broadcast.in(data.roomId).emit(`${socket.username} has joined`);
        });
    
        socket.on('new_message', data => {
            if (! socket.valid) {
                return console.log('Invalid_user', data);
            }
    
            if (! (data.body || '').trim()) {
                return;
            }
    
            const messageDate = new Date;
            const messageData = {
                userId: socket.userId,
                userName: socket.userName,
                date: messageDate,
                roomId: data.roomId,
                body: data.body
            };
    
            io.sockets.in(data.roomId).emit('new_message', messageData);
            const chatMessage = new ChatMessage(messageData);
    
            chatMessage.save().catch(e => {
                console.log('ChatMessage_saving_error', e);
            });
        })
    
        socket.on('typing', (data) => {
            io.sockets.in(data.roomId).emit('typing', {
                userName : socket.userName,
                userId: socket.userId
            });
        })
    });
};