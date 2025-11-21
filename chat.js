

const PORT = 8081

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('Nova conexão estabelecida');
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'join':
          clients.set(data.userId, {
            ws: ws,
            username: data.username,
            userId: data.userId
          });
                    
          broadcast({
            type: 'user_joined',
            username: data.username,
            timestamp: Date.now()
          });
                    
          ws.send(JSON.stringify({
            type: 'users_list',
            users: Array.from(clients.values()).map(c => ({
              id: c.userId,
              username: c.username,
              online: true
            }))
          }));
          break;
          
        case 'message':          
          broadcast({
            type: 'message',
            id: `msg_${Date.now()}_${Math.random()}`,
            userId: data.userId,
            username: data.username,
            text: data.text,
            timestamp: data.timestamp
          });
          break;
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });
  
  ws.on('close', () => {
    
    let userId = null;
    let username = null;
    
    for (const [id, client] of clients.entries()) {
      if (client.ws === ws) {
        userId = id;
        username = client.username;
        clients.delete(id);
        break;
      }
    }
    
    if (username) {
      broadcast({
        type: 'user_left',
        username: username,
        timestamp: Date.now()
      });
    }
    
    console.log('Conexão encerrada');
  });
});

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

console.log('Servidor WebSocket rodando na porta', PORT);