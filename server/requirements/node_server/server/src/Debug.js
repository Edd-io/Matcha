/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Debug.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 22:41:08 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/17 15:06:39 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const	debug_mode = true;

class Debug
{
	static log(req, res=null)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Receive request ${req.method}] ------`);
		console.log(`URL : ${req.url}`);
		if (req.method == 'POST')
			console.log("Data :", req.body);
	}

	static logResponse(res)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Send response] ------`);
		console.log("Data :", res);
	}

	static simpleLog(message)
	{
		if (!debug_mode)
			return;
		console.log('------ [Log] ------');
		console.log(message);
	}

	static logError(err)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Error] ------`);
		console.log("Error :", err);
	}

	static newConnection(ws)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Websocket] ------`);
		console.log('New user connected');

	}

	static closeConnection(ws)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Websocket] ------`);
		console.log('User disconnected');
	}

	static logWebsocket(message)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Websocket] ------`);
		console.log("Message :", message);
	}

	static errorWebsocket(err, message)
	{
		if (!debug_mode)
			return;
		console.log(`------ [Websocket] ------`);
		console.log("Error :", err);
		console.log("Message :", message);
	}
};

module.exports = Debug;