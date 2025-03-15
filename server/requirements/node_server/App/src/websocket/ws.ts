/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ws.ts                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/18 11:03:32 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/15 13:48:47 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { callFunctions } from "./callFunctions.ts";

class Ws
{
	socket: WebSocket;

	constructor()
	{
		this.socket = new WebSocket("/ws");
		this.socket.binaryType = "arraybuffer";

		this.socket.onopen = function()
		{
			console.log("Connection established");
		};

		this.socket.onmessage = function(event: any)
		{
			let customEvent: any = null;
			let data: any = null;

			console.log("Message received: " + event.data);
			if (event.data instanceof ArrayBuffer)
			{
				callFunctions({action: "voiceData", data: event.data});
				return;
			}
			try {
				data = JSON.parse(event.data);
			}
			catch (e) {
				console.error("Error parsing JSON:", e);
				return;
			}
			if (data.type === "message")
				customEvent = new CustomEvent("newMessage", {detail: {content: data.content, from: data.from}});
			else if (data.type === "image")
				customEvent = new CustomEvent("newImage", {detail: {content: data.content, from: data.from, to: data.to}});
			else if (data.type === "notification")
				customEvent = new CustomEvent("newNotification", {detail: {content: data.content}});
			else if (data.type === "ban")
				globalThis.banned.set(true);
			else if (data.type === "call")
				callFunctions(data);
			if (customEvent)
				document.dispatchEvent(customEvent);

		};

		this.socket.onclose = function()
		{
			console.log("Connection closed");
		};

		this.socket.onerror = function()
		{
			console.log("Error");
		};
	}

	send(message: any)
	{
		this.socket.send(message);
	}

	startCall(id: number)
	{
		this.socket.send(JSON.stringify({type: "call", content: {action: "start", id: id}}));
	}
}

export default Ws;