/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 22:25:21 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/04 22:48:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express');
const http = require('http');
const PostRequest = require('./src/PostRequest');
const Websocket = require('./src/Websocket/Websocket').Websocket;
const Debug = require('./src/Debug');
const ws = require('ws');
const session = require('express-session');
const Database = require('./src/Database');

const app = express();
const server = http.createServer(app);
const port = 3000;
const sessionParser = session({
		secret: 'dndlsahwp9u4hoe8uhdwnow1du81g',
		resave: false,
		saveUninitialized: true,
	});

function init(db)
{
	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true, limit: '10mb' }));
	app.use(sessionParser);
	app.use(express.json());
	app.use((req, res, next) => {
		if (!req.session.info)
			req.session.info = {logged: false, id: -1};
		next();
	})
	app.use(express.static('user_static_data'));

	init_ws(db);

	app.get('/', (req, res) => {
		Debug.log(req);
		res.sendFile('/app/website/index.html');
	});
	
	// Move static files to nginx later
	app.get('/assets/:file', (req, res) => {
		res.sendFile(`/app/website/assets/${req.params.file}`);
	});

	app.get('/get_status_self_connected', (req, res) => PostRequest.get_status_self_connected(req, res));
	app.post('/login', (req, res) => PostRequest.login(req, res, db));
	app.post('/register', (req, res) => PostRequest.register(req, res, db));
	app.post('/confirm_register', PostRequest.confirm_register);
	app.post('/first_step_register', PostRequest.first_step_register);
	app.post('/second_step_register', PostRequest.second_step_register);
	app.post('/add_picture_register', (req, res) => PostRequest.add_picture_register(req, res, db));
	app.post('/delete_picture_register', (req, res) => PostRequest.delete_picture_register(req, res, db));
	app.post('/finish_register', (req, res) => PostRequest.finish_register(req, res, db));
	app.post('/report_user', (req, res) => PostRequest.report_user(req, res, db));
	app.post('/block_user', (req, res) => PostRequest.block_user(req, res, db));
	app.post('/change_location', (req, res) => PostRequest.change_location(req, res, db));
	app.get('/logout', PostRequest.logout);
	app.get('/delete_account', (req, res) => PostRequest.delete_account(req, res, db));
	app.post('/get_swipe_user', (req, res) => PostRequest.get_swipe_user(req, res, db));
	app.post('/react_to_user', (req, res) => PostRequest.react_to_user(req, res, db));
	app.get('/get_chat_list', (req, res) => PostRequest.get_chat_list(req, res, db));
	app.post('/get_chat', (req, res) => PostRequest.get_chat(req, res, db));
	app.get('/get_notifications', (req, res) => PostRequest.get_notifications(req, res, db));
	app.post('/change_info', (req, res) => PostRequest.change_info(req, res, db));
	app.get('/get_info', (req, res) => PostRequest.get_info(req, res, db));
	app.get('/get_all_locations', (req, res) => PostRequest.get_all_locations(req, res, db));
	app.get('/get_self_info', (req, res) => PostRequest.get_self_info(req, res, db));
	app.post('/update_profile', (req, res) => PostRequest.update_profile(req, res, db));
	app.get('/auth42', (req, res) => PostRequest.auth42(req, res, db));
	app.get('/link42', (req, res) => PostRequest.link42(req, res, db));
	app.post('/reset_password', (req, res) => PostRequest.reset_password(req, res, db));
	app.get('/reset_password_mail', (req, res) => PostRequest.reset_password_mail(req, res, db));

	server.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});

}

function init_ws(db)
{
	const wss = new ws.Server({ noServer: true });

	server.on('upgrade', (request, socket, head) => {
		sessionParser(request, {}, () => {
			if (!request.session.info || !request.session.info.logged)
				return (res.send(JSON.stringify({error: "You are not logged in"})));
			wss.handleUpgrade(request, socket, head, (ws) => {
				wss.emit('connection', ws, request);
			});
		});
	});

	wss.on('connection', (ws, req) => {
		new Websocket(ws, req.session.info.id, db);
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