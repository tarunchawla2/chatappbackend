const ChatRooms=require('../models/chatroom');

exports.getAllMessages = (req, res, next) => {
    let room = req.params.room;
    ChatRooms.find({ name: room })
        .then((chatroom) => {
            if (!chatroom) {
                console.log(err);
                return false;

            }
            if (chatroom[0]) {
                res.json(chatroom[0].messages);
            }
        });
}