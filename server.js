import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { handler } from './build/handler.js';
import WebSocket from 'ws';
import { Client } from 'node-osc';

const app = express();

const server = createServer(app);
const ws = new WebSocketServer({ server });

ws.on('connection', () => {
	console.info('New client connected. ');
});

ws.on('message', (message) => {
	console.info('Received message:', message.toString());

	// Broadcastlog the message to all connected clients
	ws.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message.toString());
		}
	});
});

ws.on('close', () => {
	console.info('Client disconnected. ');
});

app.post('/tag', (req, res) => {
	const tag = req.header('TAG_ID');
	const reader = req.header('READER_ID');

	ws.clients.forEach(function (client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ tag, reader }));
		}
	});

	return res.json({ tag, reader });
});

app.get('/osc', (_, res) => {
	const osc = new Client('127.0.0.1', 53000);
	osc.send('/cue/1/start', () => {
		osc.close();
	});
	res.json({ ok: true });
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

server.listen(process.env.PORT || 4000, () => {
	console.info(`listening on port ${process.env.PORT || 4000}`);
});
