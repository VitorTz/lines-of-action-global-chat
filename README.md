# Lines of Action - global chat


``` bash
npm install -g ws
npm install -g pm2
pm2 start servidor.js --name global-chat-websocket
pm2 save
pm2 startup
```


# Comandos úteis

``` bash
# Listar processos
pm2 list

# Ver logs em tempo real
pm2 logs global-chat-websocket

# Monitorar
pm2 monit

# Parar
pm2 stop global-chat-websocket

# Reiniciar
pm2 restart global-chat-websocket

# Remover
pm2 delete global-chat-websocket

# Recarregar sem downtime
pm2 reload global-chat-websocket
```