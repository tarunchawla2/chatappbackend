const ChatRooms = require('../models/chatroom');
const socket = require('socket.io');

let count;

const initialize = server => {
    const io = socket.listen(server);
    io.sockets.on('connection', (socket) => {
        socket.on('join', (data) => {
            socket.join(data.room);
            ChatRooms.find()
                .then(rooms => {
                    count = 0;
                    rooms.forEach((room) => {
                        if (room.name == data.room) {
                            count++;
                        }
                    })
                    if (count == 0) {
                        const chatRooms = new ChatRooms({
                            name: data.room, messages: []
                        })
                        chatRooms.save({ name: data.room, messages: [] });
                    }
                })
        })
        socket.on('message', (data) => {
            io.in(data.room).emit('new message', { user: data.user, message: data.message });
            ChatRooms.update({ name: data.room }, { $push: { messages: { user: data.user, message: data.message } } })
                .then(() => {
                    console.log('Document updated');
                })
        })
        socket.on('typing', (data) => {
            socket.broadcast.in(data.room).emit('typing', { data: data, isTyping: true });
        });
    })
}

module.exports = initialize;