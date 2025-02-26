/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   userBlocked.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/02/26 14:03:42 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/26 14:48:46 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

async function userBlocked(req, res, db, other_id)
{
	const user = req.session.info;
	const conn = await db.pool.getConnection();
	const blocked = await conn.query('SELECT * FROM users_blocked WHERE user_id = ? AND user_blocked_id = ? OR user_id = ? AND user_blocked_id = ?', [user.id, other_id, other_id, user.id]);

	conn.release();
	conn.end();
	return (blocked.length > 0);
}

module.exports = userBlocked;