/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wsCall.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:04:07 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/12 18:01:29 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const { time } = require("console");

callInWaiting = [];

function wsCall (users, content, from, db)
{
	if (content.action == 'start')
		startCall(users, from, content.id, db);
	else if (content.action == 'accept')
		acceptCall(users, from);
	else if (content.action == 'reject')
		rejectCall(users, from);
	else if (content.action == 'end')
		endCall(users, from);
	else if (content.action == 'voiceData')
		sendVoiceData(users, content.data, from);
	else
		users[from].send({ type: 'error', content: 'Invalid action' });
}

function findPartner(users, from)
{
	let call = callInWaiting.find(c => c.from == from || c.to == from);

	if (!call)
		return (-1);
	if (call.to == from)
		call = {to: call.from, timeout: call.timeout};
	else
		call = {to: call.to, timeout: call.timeout};
	return (call);
}

async function startCall(users, from, to, db)
{
	if (users[to])
	{
		const user1 = await db.getUserCall(from);
		const user2 = await db.getUserCall(to);

		if (user1 !== null && user2 !== null)
		{
			db.hasMatch(from, to, false).then((res) => {
				if (!res)
				{
					users[from].send({ type: 'error', content: 'You can only call a person you matched with' });
					return;
				}
				users[to].send({ type: 'call', action: 'incoming', from, content: {user1, user2} });
				users[from].send({ type: 'call', action: 'calling', to, content: {user1, user2} });
				let timeout = setTimeout(() => {
					users[to].send({ type: 'call', action: 'end' });
					users[from].send({ type: 'call', action: 'end' });
					callInWaiting = callInWaiting.filter(c => c.from != from && c.to != to);
				}, 15000);
				callInWaiting.push({ from, to, timeout });
			});
		}
		else
			users[from].send({ type: 'error', content: 'Error getting user' });
	}
	else
		users[from].send({ type: 'error', content: 'User not connected' });
}

function acceptCall(users, from)
{
	const call = findPartner(users, from);

	if (call === -1)
	{
		users[from].send({ type: 'error', content: 'Call not found' });
		return;
	}
	users[call.to].send({ type: 'call', action: 'inCall', with: from });
	users[from].send({ type: 'call', action: 'inCall', with: call.to });
	clearTimeout(call.timeout);
}

function rejectCall(users, from)
{
	const call = findPartner(users, from);

	if (call === -1)
	{
		users[from].send({ type: 'error', content: 'Call not found' });
		return ;
	}
	users[call.to].send({ type: 'call', action: 'end' });
	users[from].send({ type: 'call', action: 'end' });
	clearTimeout(call.timeout);
}

function endCall(users, from, to)
{
	const call = findPartner(users, from);

	if (call === -1)
	{
		users[from].send({ type: 'error', content: 'Call not found' });
		return ;
	}
	clearTimeout(call.timeout);
	users[call.to].send({ type: 'call', action: 'end' });
	users[from].send({ type: 'call', action: 'end' });
}

function sendVoiceData(users, data, from)
{
	const call = findPartner(users, from);

	if (call === -1)
		return;
	users[call.to].ws.send(data, { binary: true });
}

module.exports = wsCall;