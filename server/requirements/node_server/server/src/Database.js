/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Database.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/16 16:54:56 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/16 17:48:08 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const credientials = require('../credentials.json');

class Database
{
	ready = false;

	constructor()
	{
		console.log('Database created');
		this.db = require('mariadb');
		this.pool = this.db.createPool({
			host: credientials.host,
			user: credientials.user,
			password: credientials.password,
			database: credientials.database,
		});
		this.tryConnection();
	}

	tryConnection()
	{
		this.pool.getConnection().then(conn => {
			console.log('Connected to database');
			conn.end();
			this.ready = true;
		}).catch(err => {
			console.log('Error connecting to database');
			setTimeout(() => {
				this.tryConnection();
			}, 1000);
		});
	}

}

module.exports = Database;