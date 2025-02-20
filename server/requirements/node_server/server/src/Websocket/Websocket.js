/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:36:18 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/20 21:47:07 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('../Debug');
const wsMessage = require('./typeRequest/message');
const users = [];

class Websocket
{
	id = -1;
	ws = null;
	db = null;

	constructor(ws, id, db)
	{
		users[id] = this;
		this.id = id;
		this.ws = ws;
		this.db = db;
		Debug.newConnection(ws);

		ws.on('message', (message) => this.onMessage(message));
		ws.on('close', () => this.onClose(ws));

		ws.send('Connected to websocket. Welcome !');
	}

	onClose(ws)
	{
		users.splice(users.indexOf(this), 1);
		Debug.closeConnection(ws);
	}

	onMessage(message)
	{
		let	json;

		try {
			json = JSON.parse(message);
			if (json.type == 'message')
				wsMessage(users, json.content, this.id, json.to, this.db);
			else
			{
				Debug.errorWebsocket("Invalid type", json.type);
				this.send({type: 'error', content: 'Invalid type'});
				return;
			}
		} catch (e) {
			Debug.errorWebsocket("Invalid JSON", e.message);
			this.send({type: 'error', content: 'Invalid JSON'});
			return;
		}
		Debug.logWebsocket(json);
	}

	send(message)
	{
		if (typeof message !== 'object')
			throw new Error("Message is not an object");
		this.ws.send(JSON.stringify(message));
	}
}

module.exports = Websocket;