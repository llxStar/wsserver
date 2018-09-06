/**
 * Created by llx on 2018/9/5.
 */
const ws = new (require('ws')).Server({
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
    // Broadcast
    ws.clients.forEach(function each(client) {
      client.send(JSON.stringify({a:1}));
      console.log('send data');
    });
  });
});