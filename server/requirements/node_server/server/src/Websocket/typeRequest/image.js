/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   image.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/15 11:36:35 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/15 14:06:21 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const base64ToFile = require('../../utils/base64ToFile');

function wsImage(wsUsers, base64Image, from, to, db)
{
	try {
		const path_name = base64ToFile(base64Image);
		const filename = path_name.split('/')[path_name.split('/').length - 1];
		const json = {
			type: 'image',
			content: filename,
			from: from,
			to: to,
		};
		if (wsUsers[to])
		{
			wsUsers[to].ws.send(JSON.stringify(json));
		}
		wsUsers[from].ws.send(JSON.stringify(json));
		db.sendImage(from, to, filename);
	}
	catch (e) {
		wsUsers[from].ws.send(JSON.stringify({ type: 'error', content: e.message }));
	}
}

module.exports = wsImage;