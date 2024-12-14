/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Websocket.js                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:36:18 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/15 00:51:44 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { json } = require('express');
const Debug = require('./Debug');
const users = [];

class Websocket
{
	static newConnection(ws)
	{
		users.push(ws);
		Debug.newConnection(ws);
	}

	static onClose(ws)
	{
		users.splice(users.indexOf(ws), 1);
		Debug.closeConnection(ws);
	}

	static onMessage(ws, message)
	{
		let	json;

		try {
			json = JSON.parse(message);
		} catch (e) {
			Debug.errorWebsocket("Invalid JSON", message.toString('utf-8'));
			return;
		}
		Debug.logWebsocket(json);
	}
}

module.exports = Websocket;