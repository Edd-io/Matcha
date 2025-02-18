/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:36:18 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/18 10:57:54 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('../Debug');
const users = [];

class Websocket
{
	id = -1;
	ws = null;

	constructor(ws, id)
	{
		users[id] = this;
		this.id = id;
		this.ws = ws;
		Debug.newConnection(ws);

		ws.on('message', (message) => {
			this.onMessage(ws, message)
		});
		ws.on('close', () => this.onClose(ws));

		ws.send('Connected to websocket. Welcome !');
	}

	onClose(ws)
	{
		users.splice(users.indexOf(this), 1);
		Debug.closeConnection(ws);
	}

	onMessage(ws, message)
	{
		let	json;

		try {
			json = JSON.parse(message);
			console.log(json);
		} catch (e) {
			Debug.errorWebsocket("Invalid JSON", message.toString('utf-8'));
			return;
		}
		Debug.logWebsocket(json);
	}
}

module.exports = Websocket;