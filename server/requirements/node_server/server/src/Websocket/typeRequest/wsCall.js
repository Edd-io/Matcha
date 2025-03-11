/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wsCall.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:04:07 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/11 10:40:24 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

callInWaiting = [];

function wsCall (users, content, from, db)
{
	if (content.action == 'start')
		startCall(users, from, content.id);
	else if (content.action == 'accept')
		acceptCall(users, from, to);
	else if (content.action == 'end')
		endCall(users, from, to);
	else if (content.action == 'voiceData')
		sendVoiceData(users, from, to, content.data);
	else
		users[from].ws.send(JSON.stringify({ type: 'error', content: 'Invalid action' }));

}

function startCall(users, from, to)
{
	let call = callInWaiting.find(c => c.from == from && c.to == to);

	if (call)
	{
		users[from].ws.send(JSON.stringify({ type: 'error', content: 'Call already in progress' }));
		return;
	}
	if (users[to])
	{
		users[to].ws.send(JSON.stringify({ type: 'call', action: 'incoming', from }));
		users[from].ws.send(JSON.stringify({ type: 'call', action: 'calling', to }));
		let timeout = setTimeout(() => {
			users[to].ws.send(JSON.stringify({ type: 'call', action: 'end' }));
			users[from].ws.send(JSON.stringify({ type: 'call', action: 'end' }));
		}, 15000);
		callInWaiting.push({ from, to, timeout });
	}
	else
		users[from].ws.send(JSON.stringify({ type: 'error', content: 'User not connected' }));
}

function acceptCall(users, from, to)
{
	let call = callInWaiting.find(c => c.from == to && c.to == from);

	if (call)
	{
		clearTimeout(call.timeout);
		users[to].ws.send(JSON.stringify({ type: 'call', action: 'inCall', with: from }));
		users[from].ws.send(JSON.stringify({ type: 'call', action: 'inCall', with: to }));
	}
}

function endCall(users, from, to)
{
	let call = callInWaiting.find(c => c.from == from && c.to == to);

	if (call)
	{
		clearTimeout(call.timeout);
		users[to].ws.send(JSON.stringify({ type: 'call', action: 'end' }));
		users[from].ws.send(JSON.stringify({ type: 'call', action: 'end' }));
	}
}

function sendVoiceData(users, from, to, data)
{
	let call = callInWaiting.find(c => c.from == from && c.to == to);

	if (call)
		users[to].ws.send(JSON.stringify({ type: 'call', action: 'voiceData', data }));
}

module.exports = wsCall;