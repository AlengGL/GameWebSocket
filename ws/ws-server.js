// import express 和 ws 套件
const SocketServer = require('ws').Server;
const url = require('url');

// 存房間 websocket 訊息
const rooms = {};

module.exports = (server) => {
    // 將 express 交给 SocketServer 開啟 WebSocket 服務
    const wss = new SocketServer({ server });
    // 當client連線
    wss.on('connection', (ws, request) => {
        console.log('Client connected');
        // 儲存此 WebSocket 房間 ID
        ws.roomId = null;
        const queryParams = url.parse(request.url, true).query;
        const { username } = queryParams;

        // 收到client message
        ws.on('message', data => {
            // 回傳是Buffer格式
            data = data.toString();
            console.log(data);

            // 建立
            if (data.startsWith('createRoom')) {
                const roomId = generateRoomId();
                rooms[roomId] = { players: [{ ws, username }] };
                console.log(rooms[roomId]);

                ws.roomId = roomId;

                ws.send(`RoomID ${roomId}`);
                const roomUsernames = getRoomUsernames(roomId);
                ws.send("user " + JSON.stringify({ players: roomUsernames }));
                ws.send('Ann Your Create the Room');
            }
            // 加入room
            else if (data.startsWith('joinRoom')) {
                const [, roomId] = data.split(' ').map(str => str.trim());
                if (rooms[roomId]) {
                    ws.send(`RoomID ${roomId}`);
                    // Ensure the room exists
                    if (rooms[roomId].players.length < 2) {
                        // 加入房间
                        rooms[roomId].players.push({ ws, username });

                        ws.roomId = roomId;

                        const roomUsernames = getRoomUsernames(roomId);
                        ws.send(`Ann Joined Room ID: ${roomId}`)

                        rooms[roomId].players.forEach(player => {
                            if (player.ws !== ws && player.ws.readyState === ws.OPEN) {
                                player.ws.send(`Ann Player ${username} join room`);
                            }
                            player.ws.send("user " + JSON.stringify({ players: roomUsernames }));
                        });
                        
                    } else {
                        ws.send('Room is full');
                    }
                } else {
                    ws.send('RoomNot');
                }
            }
            // 離開房间
            else if (data.startsWith('leaveRoom')) {
                if (ws.roomId && rooms[ws.roomId]) {
                    const currentWs = ws; // 保存當前 WebSocket 實例
                    rooms[ws.roomId].players = rooms[ws.roomId].players.filter(player => player.ws !== currentWs);

                    ws.send(`Ann Your left the Room ID: ${ws.roomId}`)
                    ws.send("left");
                    // 发送玩家离开房间的消息给房间中的其他玩家
                    const roomUsernames = getRoomUsernames(ws.roomId);
                    rooms[ws.roomId].players.forEach(player => {
                        if (player.ws.readyState === ws.OPEN) {
                            player.ws.send("left");
                            player.ws.send(`Ann Player ${username} left the room`);
                            player.ws.send("user " + JSON.stringify({ players: roomUsernames }));
                        }
                    });

                    // 如果房间中没有其他玩家，则删除该房间
                    if (rooms[ws.roomId].players.length === 0) {
                        delete rooms[ws.roomId];
                    }
                    
                }
            }
            // 遊戲消息
            else {
                try {
                    // 檢查房間存在
                    if (ws.roomId && rooms[ws.roomId]) {
                        // 處理訊息
                        const mainText = data?.match(/^([^\s]+)\s+.*/);
                        const [, firstWord] = mainText;

                        switch (firstWord) {
                            case 'chat':
                                rooms[ws.roomId].players.forEach(player => {
                                    if (player.ws !== ws && player.ws.readyState === ws.OPEN) {
                                        player.ws.send(`${data}`);
                                    }
                                });
                                break;
                            case 'start':
                                const randomTime = Math.floor(Math.random() * (6 - 2) + 2 * 1000);
                                rooms[ws.roomId].players.forEach(player => {
                                    if (player.ws.readyState === ws.OPEN) {
                                        player.ws.send(`start ${randomTime}`);
                                        player.ws.send('Ann Start Game');
                                    }
                                });
                                break;
                            case 'time':
                                ws.send('win');
                                ws.send('Ann You WIN!');
                                rooms[ws.roomId].players.forEach(player => {
                                    if (player.ws !== ws && player.ws.readyState === ws.OPEN) {
                                        player.ws.send('lose');
                                        player.ws.send('Ann You LOSE...');
                                    }
                                });
                                break;
                            case 'tie':
                                ws.send('tie');
                                ws.send('Ann This game draw');
                                break;
                            case 'finish':
                                ws.send('finish');
                                ws.send('Ann Game Finish');
                                break;
                            default:
                                console.log('Unknown game info type:', data.startsWith('chat'));
                        }
                    } else {
                        console.log('Invalid room or player');
                    }
                } catch (error) {
                    console.error('Error parsing game info:', error);
                }
            }
            console.log(rooms);
        })
        // 關閉連接
        ws.on('close', () => {
            console.log('Close connected');
            if (ws.roomId && rooms[ws.roomId]) {
                rooms[ws.roomId].players = rooms[ws.roomId].players.filter(player => player.ws !== ws);

                rooms[ws.roomId].players.forEach(player => {
                    if (player.ws.readyState === ws.OPEN) {
                        player.ws.send(`Player ${username} left the room`);
                    }
                });

                if (rooms[ws.roomId].players.length === 0) {
                    delete rooms[ws.roomId];
                }
            }
        })
        console.log(rooms);
    })
}

// 生成房间 ID
function generateRoomId() {
    // 生成 6 位数字，例如：123456
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getRoomUsernames(roomId) {
    if (rooms[roomId] && rooms[roomId].players) {
        return rooms[roomId].players.map(player => player.username);
    }
    return [];
}