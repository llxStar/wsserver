const http = require('http');
const WebSocket = require('ws');
const wsserver = require('ws').Server;

const server = http.createServer((req, res) => {
  if (req.url.indexOf('ajax') > -1) { // ajax请求
    res.writeHead(200, 'request ok',{
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/javascript;charset=UTF-8',
    });
    res.end(JSON.stringify({
      data: {
        ctime: new Date().getTime(),
      },
      msg: '请求成功！',
      errno: 0,
    }));
    ws.clients.forEach( client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send('广播：接收到ajax请求！');
      }
    });
  } else {
    res.end(req.url);
  }

}).listen(23333);

const ws = new wsserver({
  server,
  port: 9999,
  perMessageDeflate: {
    zlibDeflateOptions: { // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    clientMaxWindowBits: 10,       // Defaults to negotiated value.
    serverMaxWindowBits: 10,       // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10,          // Limits zlib concurrency for perf.
    threshold: 1024,               // Size (in bytes) below which messages
                                   // should not be compressed.
  }
});
ws.on('connection', function (w) {
  w.on('message', function (data) {
    // Broadcast to everybody exclude slef
    ws.clients.forEach(function each(client) {
      if (client !== w && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});