import app from './app';
// import net from 'net';

// const srv = net.createServer(function(sock) {
//     sock.end('Hello world\n');
//   });

//   srv.listen(0, function() {
//     console.log('Listening on port ' + srv.address().port);
//   });

  const port = 5965

app.listen(port);
console.log(`Server listen on port ${port}`);