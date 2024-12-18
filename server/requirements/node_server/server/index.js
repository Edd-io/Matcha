/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 22:25:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/18 14:02:58 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express');
const http = require('http');
const PostRequest = require('./src/PostRequest');
const Websocket = require('./src/Websocket');
const Debug = require('./src/Debug');
const ws = require('ws');
const session = require('express-session');
const Database = require('./src/Database');

const app = express();
const server = http.createServer(app);
const port = 3000;

function init()
{
	app.use(express.json());
	app.use(express.static('build'));
	app.use(session({
		secret: 'dndlsahwp9u4hoe8uhdwnow1du81g',
		resave: false,
		saveUninitialized: true,
	}));

	init_ws();

	app.get('/', (req, res, next) => {
		Debug.log(req);
		if (!req.session.info)
			req.session.info = {logged: false, id: -1, username: ''};
		res.send('Hello World');
	});

	app.post('/login', PostRequest.login);
	app.post('/register', PostRequest.register);
	app.post('/confirm_register', PostRequest.confirm_register);
	app.post('/first_step_register', PostRequest.first_step_register);
	app.post('/second_step_register', PostRequest.second_step_register);
	app.post('/logout', PostRequest.logout);
	app.post('/get_swipe_user', PostRequest.get_swipe_user);
	app.post('/react_to_user', PostRequest.react_to_user);
	
	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});

}

function init_ws()
{
	const wss = new ws.Server({ noServer: true });

	server.on('upgrade', (request, socket, head) => {
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit('connection', ws, request);
		});
	});

	wss.on('connection', (ws) => {
		Websocket.newConnection(ws);

		ws.on('message', (message) => {
			Websocket.onMessage(ws, message)
		});
		ws.on('close', () => Websocket.onClose(ws));

		ws.send('Connected to websocket. Welcome !');
	});
}

function main()
{
	const db = new Database();

	init();

	process.on('SIGINT', () => {
		console.log('Server stopped');
		process.exit(0);
	});
}

main();