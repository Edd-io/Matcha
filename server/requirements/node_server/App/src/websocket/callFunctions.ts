/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   callFunctions.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:01:52 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/11 18:08:27 by edbernar         ###   ########.fr       */
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
	
}
