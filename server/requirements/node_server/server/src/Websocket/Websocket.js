/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:36:18 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/07 15:41:27 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('../Debug');
const wsMessage = require('./typeRequest/message');
const wsMessageSeen = require('./typeRequest/messageSeen');
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
		this.db.userDisconnected(this.id);
	}

	onMessage(message)
	{
		let	json;

		try {
			json = JSON.parse(message);
			if (json.type == 'message')
				wsMessage(users, json.content, this.id, json.to, this.db);
			else if (json.type == 'message_seen')
				wsMessageSeen(this.id, json.to, this.db);
			else if (json.type == 'seen_notifs')
				this.db.seenNotifs(this.id);
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

	static sendNotification(id, message, image)
	{
		if (users[id])
			users[id].send({type: 'notification', content: {message: message, image: image}});
	}

	static sendMatch(id, name, image)
	{
		if (users[id])
			users[id].send({type: 'match', content: {name: name, image: image}});
	}

	bannedUser()
	{
		this.ws.send(JSON.stringify({type: 'ban'}));
		this.ws.close();
	}

	static userIsConnected(user_id)
	{
		return (users[user_id] ? true : false);
	}
}

module.exports = {Websocket, users};