const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const chatroomRoutes = require('./routes/chatroom');
const ChatRooms = require('./models/chatroom');
const port = process.env.PORT || 8080;
const path = require('path');
const io = require('./socket/io');
const connectMongo = require('./util/mongo');
const checkAuth = require('./middleware/check-auth');
app.use(express.static(__dirname + '/dist/frontend-chat-app'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
})

connectMongo()
    .then(() => {
        console.log('Connected To Database');
        const server = app.listen(port, () => {
            console.log('Server started on port ' + port);
        })
        io(server);
    })
    .catch(() => {
        console.log('Connection is failed');
    })

app.use("/api/user", userRoutes)
app.use("/api/chatroom", checkAuth, chatroomRoutes);
app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/dist/frontend-chat-app/index.html'));
})
