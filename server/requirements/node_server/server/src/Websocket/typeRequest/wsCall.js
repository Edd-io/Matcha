/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   wsCall.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:04:07 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/12 09:01:04 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

callInWaiting = [];

function wsCall (users, content, from, db)
{
	if (content.action == 'start')
		startCall(users, from, content.id, db);
	else if (content.action == 'accept')
		acceptCall(users, from, content.id);
	else if (content.action == 'reject')
		rejectCall(users, from, content.id);
	else if (content.action == 'end')
		endCall(users, from, to);
	else if (content.action == 'voiceData')
		sendVoiceData(users, content.data, from);
	else
		users[from].send({ type: 'error', content: 'Invalid action' });

}

async function startCall(users, from, to, db)
{
	let call = callInWaiting.find(c => c.from == from && c.to == to);

	if (call)
	{
		users[from].send({ type: 'error', content: 'Call already in progress' });
		return;
	}
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

function acceptCall(users, from, to)
{
	let call = callInWaiting.find(c => c.from == to && c.to == from);

	if (call)
	{
		users[to].send({ type: 'call', action: 'inCall', with: from });
		users[from].send({ type: 'call', action: 'inCall', with: to });
		clearTimeout(call.timeout);
	}
	else
	{
		users[to].send({ type: 'error', content: 'Call not found' });
	}
}

function rejectCall(users, from, to)
{
	console.log('reject with', from, to);
	let call = callInWaiting.find(c => c.from == to && c.to == from);

	if (call)
	{
		users[to].send({ type: 'call', action: 'end' });
		users[from].send({ type: 'call', action: 'end' });
		callInWaiting = callInWaiting.filter(c => c.from != to && c.to != from);
		clearTimeout(call.timeout);
	}
	else
	{
		users[from].send({ type: 'error', content: 'Call not found' });
	}
}

function endCall(users, from, to)
{
	let call = callInWaiting.find(c => c.from == from && c.to == to);

	if (call)
	{
		clearTimeout(call.timeout);
		users[to].send({ type: 'call', action: 'end' });
		users[from].send({ type: 'call', action: 'end' });
	}
}

function sendVoiceData(users, data, from)
{
	let to = callInWaiting.find(c => c.from == from || c.to == from);

	if (!to)
	{
		users[from].send({ type: 'error', content: 'You are not in a call' });
		return;
	}
	if (to.to == from)
		to = to.from;
	else
		to = to.to;
	if (call)
		users[to].send({ type: 'call', action: 'voiceData', data });
}

module.exports = wsCall;