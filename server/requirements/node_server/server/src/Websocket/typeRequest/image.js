/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   image.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/15 11:36:35 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/17 16:30:26 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const base64ToFile = require('../../utils/base64ToFile');

async function wsImage(wsUsers, base64Image, from, to, db)
{
	try {
		const path_name = base64ToFile(base64Image);
		const filename = path_name.split('/')[path_name.split('/').length - 1];
		let json = {
			type: 'image',
			content: filename,
			from: from,
			to: to,
		};
		wsUsers[from].ws.send(JSON.stringify(json));
		if (wsUsers[to])
		{
			const dataUser = await db.getNameAndPfp(from);
			wsUsers[to].ws.send(JSON.stringify({type: 'image', content: filename, from: from, name: dataUser.name, pfp: dataUser.pfp}));
		}
		db.sendImage(from, to, filename);
	}
	catch (e) {
		wsUsers[from].ws.send(JSON.stringify({ type: 'error', content: e.message }));
	}
}

module.exports = wsImage;