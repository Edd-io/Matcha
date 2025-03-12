/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   callFunctions.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:01:52 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/12 08:52:12 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export function callFunctions(data: any)
{
	if (data.action === "incoming")
	{
		const incomingCall = new CustomEvent("incomingCall", {detail: {user1: data.content.user1, user2: data.content.user2}});
		window.dispatchEvent(incomingCall);
	}
	else if (data.action === "end")
	{
		const endCall = new CustomEvent("endCall", {});
		window.dispatchEvent(endCall);
	}
	else if (data.action === "inCall")
	{
		const inCall = new CustomEvent("inCall", {});
		window.dispatchEvent(inCall);
	}
	else if (data.action === "calling")
	{
		const calling = new CustomEvent("calling", {detail: {user1: data.content.user2, user2: data.content.user1}});
		window.dispatchEvent(calling);
	}
	else if (data.action === "voiceData")
	{
		const audioBlob = new Blob([data.data], { type: 'audio/webm' });
		const audioUrl = URL.createObjectURL(audioBlob);
		new Audio(audioUrl).play();
	}
	
}
