/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Database.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/16 16:54:56 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/19 21:34:21 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const credientials = require('../credentials.json');
const bcrypt = require('bcrypt');
const Debug = require('./Debug');

class Database
{
	ready = false;

	constructor()
	{
		this.db = require('mariadb');
		this.pool = this.db.createPool({
			host: 'mariadb',
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
			this.initTables();
			this.ready = true;
		}).catch(err => {
			console.log('Error connecting to database');
			setTimeout(() => {
				this.tryConnection();
			}, 1000);
		});
	}

	initTables()
	{
		this.pool.getConnection().then((conn) => {
			conn.query(`CREATE TABLE IF NOT EXISTS accounts (
				id INTEGER PRIMARY KEY,
				email VARCHAR(320),
				password TEXT
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_info (
				id INTEGER PRIMARY KEY,
				user_id INT,
				first_name VARCHAR(50),
				last_name VARCHAR(50),
				nickname VARCHAR(50),
				date_of_birth DATE,
				sexe VARCHAR(1),
				orientation VARCHAR(1),
				bio VARCHAR(500),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_tags (
				id INTEGER PRIMARY KEY,
				user_id INT,
				tag VARCHAR(32),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_images (
				id INTEGER PRIMARY KEY,
				user_id INT,
				local_url VARCHAR(64),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.release();
			conn.end();
			console.log("Tables inited");
		});
	}

	addUser(user)
	{
		bcrypt.hash(user.mail + user.password, 10, (err, hash) => {
			if (err)
				throw Error("Error to hash password")
			this.pool.getConnection().then((conn) => {
				conn.query('INSERT INTO accounts (email, password) VALUES (?, ?, ?, ?, ?, ?, ?)', [user.mail, hash]);
				conn.query(`INSERT INTO users_info (first_name, last_name, nickname, date_of_birth, sexe, orientation, bio)`,
					[user.first_name, user.last_name, user.nickname, user.date_of_birth, user.sexe, user.orientation, user.bio]
				);
				for (let i = 0; i < user.tags.length; i++)
					conn.query('INSERT INTO users_tags (tag) VALUES (?)', [user.tags[i]]);
				for (let i = 0; i < user.pictures.length; i++)
					conn.query('INSERT INTO users_images (local_url) VALUES (?)', [user.pictures[i]]);
				conn.release();
				conn.end();
			});

		});
	}
}

module.exports = Database;