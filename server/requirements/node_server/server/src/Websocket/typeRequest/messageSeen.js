/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   messageSeen.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/21 07:49:22 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/21 07:55:43 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('../../Debug');

function messageSeen(id, to, db)
{
	if (!checkJson(to))
	{
		Debug.errorWebsocket("Invalid JSON", 'Failed to parse JSON');
		wsUsers[id].send({type: 'error', content: 'Invalid JSON'});
		return;
	}
	db.messageSeen(id, to);
}

function checkJson(to)
{
	if (typeof to !== 'number')
		return (false);
	return (true);
}

module.exports = messageSeen;