/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   message.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/18 17:51:32 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/20 21:49:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('../../Debug');

function wsMessage(wsUsers, message, from, to, db)
{
	if (!checkJson(message, from, to))
	{
		Debug.errorWebsocket("Invalid JSON", 'Failed to parse JSON');
		wsUsers[from].send({type: 'error', content: 'Invalid JSON'});
		return;
	}
	if (message.length < 1)
		return;
	if (message.length > 1000)
	{
		Debug.errorWebsocket("Message too long", 'Message too long');
		wsUsers[from].send({type: 'error', content: 'Message too long'});
		return;
	}
	db.sendMessage(from, to, message);
	if (wsUsers[to])
		wsUsers[to].send({type: 'message', content: message, from: from});
}

function checkJson(message, from, to)
{
	if (!message || typeof message !== 'string')
		return (false);
	if (typeof from !== 'number' || typeof to !== 'number')
		return (false);
	return (true);
}

module.exports = wsMessage;