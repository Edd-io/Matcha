/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 22:25:21 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/21 17:11:41 by edbernar         ###   ########.fr       */
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
const multer = require('multer');
const upload = multer({ dest: 'user_static_data/pfp' });

const app = express();
const server = http.createServer(app);
const port = 3000;

function init(db)
{
	app.use(session({
		secret: 'dndlsahwp9u4hoe8uhdwnow1du81g',
		resave: false,
		saveUninitialized: true,
	}));
	app.use(express.json());
	app.use((req, res, next) => {
		if (!req.session.info)
			req.session.info = {logged: false, id: -1};
		next();
	})
	app.use(express.static('user_static_data'));

	init_ws();

	app.get('/', (req, res) => {
		Debug.log(req);
		res.send('Hello World');
	});

	app.post('/login', (req, res) => PostRequest.login(req, res, db));
	app.post('/register', (req, res) => PostRequest.register(req, res, db));
	app.post('/confirm_register', PostRequest.confirm_register);
	app.post('/first_step_register', PostRequest.first_step_register);
	app.post('/second_step_register', PostRequest.second_step_register);
	app.post('/add_picture_register', upload.single('file'), PostRequest.add_picture_register);
	app.post('/delete_picture_register', PostRequest.delete_picture_register);
	app.post('/finish_register', (req, res) => PostRequest.finish_register(req, res, db));
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

	init(db);

	process.on('SIGINT', () => {
		console.log('Server stopped');
		process.exit(0);
	});
}

main();