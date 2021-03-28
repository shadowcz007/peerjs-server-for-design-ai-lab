const { PeerServer } = require('peer');
const WebSocket = require('ws');

let peerIds = {};

const wss = new WebSocket.Server({ port: 9001 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        // console.log('received: %s', message);
        ws.send(JSON.stringify(peerIds));
    });
});

const customGenerationFunction = () => {
    return (Math.random().toString(36) + '0000000000000000000').substr(2, 16)
};
const peerServer = PeerServer({
    port: 9000,
    // debug: true,
    // proxied: true,
    path: '/myapp',
    generateClientId: customGenerationFunction
});
peerServer.on('connection', c => {
    // console.log('connection', c.id)
    peerIds[c.id] = (new Date()).getTime();
});
peerServer.on('disconnect', c => {
    // console.log('disconnect', c.id);
    delete peerIds[c.id];
});