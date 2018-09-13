const http = require('http');
const WebSocket = require('ws');
const wsserver = require('ws').Server;
const querystring = require('querystring');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;
const schema = new mongoose.Schema({
  info: Object,
  ctime: Date,
});
const infoModel = mongoose.model('info', schema, 'info');
db.once('open', () => {
  console.log('mongodb connect success');
});
db.on('error', (err) => {
  console.log(`mongodb connect fail:${err}`)
});

const server = http.createServer((req, res) => {
  res.writeHead(200, 'request ok',{
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'aplication/json;charset=utf-8',
  });
  if (req.url.indexOf('get') > -1) { // ajax请求
    console.log(req.url);
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
  } else if (req.url.indexOf('/post') > -1 && req.method.toLowerCase() === 'post') { // 指定url的post请求
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    
    req.on('end', () => {
      data = data.toString();
      const info = querystring.parse(data);
      console.log(data);
      let d = new infoModel({
        info,
        ctime: new Date(),
      });
      d.save((err, d) => {
        if (err) throw err;
        res.end(JSON.stringify({
          data: {
            ctime: new Date().getTime(),
          },
          msg: '成功接受请求！',
          errno: 0,
        }));
        console.log(`save success:${d}`);
      });
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
    // Broadcast to everybody exclude self
    ws.clients.forEach(function each(client) {
      if (client !== w && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });
});