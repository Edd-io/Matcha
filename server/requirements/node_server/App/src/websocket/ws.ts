/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ws.ts                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/18 11:03:32 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/11 10:27:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { callFunctions } from "./callFunctions.ts";

class Ws
{
	private socket: any;

	constructor()
	{
		this.socket = new WebSocket("/ws");

		this.socket.onopen = function()
		{
			console.log("Connection established");
		};

		this.socket.onmessage = function(event: any)
		{
			let customEvent: any = null;
			let data: any = null;

			console.log("Message received: " + event.data);
			try {
				data = JSON.parse(event.data);
			}
			catch (e) {
				return;
			}
			if (data.type === "message")
				customEvent = new CustomEvent("newMessage", {detail: {content: data.content, from: data.from}});
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