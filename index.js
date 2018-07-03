const http = require('http');
const fs = require('fs');
const ws = require('ws')

//read and store client code from client.html file
const html = fs.readFileSync('client.html');

//hardcode in crypto prices
const prices = {
	BTCUSD: '$6589.99',
	ETHUSD: '$470.26',
	ETHBTC: '0.071299',
	XRPUSD: '$0.5015',
}

//define app behavior
const app = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    //simply send client code to front-end
    res.end(html);
}

//instantiate http server with app
const server = http.createServer(app)

//instantiate websocket server with http server
const wss = new ws.Server({ server });

//define socket behavior
wss.on('connection', ws => {
	console.log('Socket connection established.')

    //connection is up, let's add a simple simple event
    ws.on('message', message => {
    	console.log('Server received socket message:', message)

    	if(!prices[message]) {
    		ws.send('Unable to price pair.')
    	}
    	else {
    		ws.send(`Result: ${prices[message]}`)
    	}
    });
});

server.listen(3000, function(){
	console.log('Server listening on port 3000.')
});