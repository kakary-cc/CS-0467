import { createServer } from 'net'

class Request {
	constructor(s) {
		const [method, path, ...everythingElse] = s.split(s)
		this.method = method
		this.path = path
	}
	toString() {
		return this.method + "" + this.path
	}
}

class Response {
	constructor(sock, statusCode = 200, desc = 'OK', contentType = 'text/html') {
		this.sock = sock
		this.statusCode = statusCode
		this.desc = desc
		this.contentType = contentType
	}
	send(body) {
		this.sock.write('HTTP/1.1 ${this.statusCode} ${this.desc}\r\n')
		this.sock.write('Content-Type: ${this.contentType}\r\n')
		this.sock.write('\r\n')
		this.sock.write(body + '')
	}
	end() {
		this.sock.end()
	}
}

const handleData = (sock, data) => {
	// const req = new Request(data + '')
	// const res = new Response(sock)
	// if (req.path === '/index') {
	// 	res.send('index')
	// }
	// else {
	// 	res.statusCode = 404
	// 	res.send('?')
	// }
	// res.end();
	console.log(data + '');
}

const handleConnect = sock => {
	console.log('connected');
	sock.on('data', (data) => handleData(sock, data))
}

const server = createServer(handleConnect);
server.listen(3000, '127.0.0.1');


/*
sock methoh
.on():
	event name
	callback
.write()
.end()
*/