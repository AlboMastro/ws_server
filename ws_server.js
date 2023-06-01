const WebSocket = require('ws');

const port = process.env.PORT || 8080;

const server = new WebSocket.Server({ port: port });

const clients = new Set();

server.on('listening', () => {
    console.log(`WebSocket server is listening on port ${port}`);
});

server.on('connection', (socket) => {
    console.log('Client connected');

    clients.add(socket);

    socket.on('message', (message) => {
        console.log('Received message:', message);

        try {
            const parsedMessage = JSON.parse(message);
            const { sender, time, text } = parsedMessage;

            const newMessage = {
                sender,
                time,
                text,
            };

            const messageJSON = JSON.stringify(newMessage);
            clients.forEach((client) => {
                client.send(messageJSON);
            });

            console.log('Broadcasted message:', newMessage);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
        clients.delete(socket);
    });
});

server.on('close', () => {
    console.log('WebSocket server is closed');
});

server.on('error', (error) => {
    console.error('WebSocket server error:', error);
});