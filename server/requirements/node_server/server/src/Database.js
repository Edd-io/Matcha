/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Database.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/16 16:54:56 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/10 14:30:14 by edbernar         ###   ########.fr       */
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
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				email VARCHAR(320),
				password TEXT,
				banned BOOLEAN DEFAULT FALSE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_info (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				first_name VARCHAR(50),
				last_name VARCHAR(50),
				nickname VARCHAR(50),
				date_of_birth DATE,
				sexe VARCHAR(1),
				orientation VARCHAR(1),
				bio VARCHAR(500),
				location VARCHAR(50),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_tags (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				tag VARCHAR(32),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_images (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				local_url VARCHAR(80),
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_blocked (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				user_blocked_id INT,
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(user_blocked_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_reported (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				user_reported_id INT,
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(user_reported_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_likes (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				user_liked_id INT,
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(user_liked_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_dislikes (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				user_disliked_id INT,
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(user_disliked_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.release();
			conn.end();
			console.log("Tables inited");
		});
	}
	
	isValidAccount(email)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT * FROM accounts WHERE email = ?', [email]).then((row) => {
					if (row.length == 0)
						resolve({valid: false});
					else
						resolve({valid: true, id: row[0].id, password: row[0].password, banned: row[0].banned});
				}).finally(() => {conn.release(); conn.end()});
			});
		}));
	}

	checkIfMailExist(email)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT id FROM accounts WHERE email = ?', [email]).then((row) => {
					resolve(row.length != 0);
				}).finally(() => {conn.release(); conn.end()});
			});
		}));
	}

	addUser(user)
	{
		bcrypt.hash(user.mail + user.password, 10, (err, hash) => {
			if (err)
				throw Error("Error to hash password")
			this.pool.getConnection().then((conn) => {
				conn.query('INSERT INTO accounts (email, password) VALUES (?, ?)', [user.mail, hash]);
				conn.release().then(() => {
					conn.query('SELECT id FROM accounts WHERE email = ?', [user.mail]).then((row) => {
						const user_id = row[0].id;
						conn.query(`INSERT INTO users_info (first_name, last_name, nickname, date_of_birth, sexe, orientation, bio, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
							[user.first_name, user.last_name, user.nickname, user.date_of_birth, user.sexe, user.orientation, user.bio, user_id]
						);
						for (let i = 0; i < user.tags.length; i++)
							conn.query('INSERT INTO users_tags (tag, user_id) VALUES (?, ?)', [user.tags[i], user_id]);
						for (let i = 0; i < user.pictures.length; i++)
							conn.query('INSERT INTO users_images (local_url, user_id) VALUES (?, ?)', [user.pictures[i], user_id]);
						})
				}).finally(() => {conn.release(); conn.end()});
			});
		});
	}

	blockUser(self_id, block_id)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT * FROM users_blocked WHERE user_id = ? AND user_blocked_id = ?', [self_id, block_id]).then((row) => {
					if (row.length != 0)
						resolve({alreadyBlocked: true});
					else
					{
						conn.query('SELECT id FROM accounts WHERE id = ?', [block_id]).then((row) => {
							if (row.length == 0)
								resolve({alreadyBlocked: false, exist: false});
							else
							{
								conn.query('INSERT INTO users_blocked (user_id, user_blocked_id) VALUES (?, ?)', [self_id, block_id]);
								resolve({alreadyBlocked: false, exist: true});
							}
						});
					}
				}).finally(() => {conn.release(); conn.end()});
			});
		}));
	}

	reportedUser(self_id, reported_id)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT * FROM users_reported WHERE user_id = ? AND user_reported_id = ?', [self_id, reported_id]).then((row) => {
					if (row.length != 0)
						resolve({alreadyReported: true});
					else
					{
						conn.query('SELECT id FROM accounts WHERE id = ?', [reported_id]).then((row) => {
							if (row.length == 0)
								resolve({alreadyReported: false, exist: false});
							else
							{
								conn.query('INSERT INTO users_reported (user_id, user_reported_id) VALUES (?, ?)', [self_id, reported_id]);
								resolve({alreadyReported: false, exist: true});
							}
						});
					}
				}).finally(() => {conn.release(); conn.end()});
			});
		}));
	}

	getNbReport(reported_id)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT * FROM users_reported WHERE user_reported_id = ?', [reported_id]).then((row) => {
					resolve(row.length);
				}).finally(() => {conn.release(); conn.end()});
			})
		}));
	}

	banUser(banned_id)
	{
		this.pool.getConnection().then((conn) => {
			conn.query('UPDATE accounts SET banned = ? WHERE id = ?', [true, banned_id])
			.finally(() => {conn.release(), conn.end()});
		})
	}

	getIdFromMail(email)
	{
		return (new Promise((resolve) => {
			this.pool.getConnection().then((conn) => {
				conn.query('SELECT id FROM accounts WHERE email = ?', [email]).then((row) => {
					if (row.length == 0)
						resolve(null);
					else
						resolve(row[0].id);
				}).finally(() => {conn.release(); conn.end()});
			});
		}));
	}

	addLocation(user_id, latitude, longitude)
	{
		const location = JSON.stringify({latitude: latitude, longitude: longitude});
		this.pool.getConnection().then((conn) => {
			conn.query('UPDATE users_info SET location = ? WHERE user_id = ?', [location, user_id])
			.finally(() => {conn.release(); conn.end()});
		});
	}

	async #getNbUsers()
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT COUNT(*) FROM accounts');

		conn.release();
		conn.end();
		return (row[0]['COUNT(*)']);
	}

	async #getListSeenUsers(user_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT user_liked_id FROM users_likes WHERE user_id = ?', [user_id]);
		const row2 = await conn.query('SELECT user_disliked_id FROM users_dislikes WHERE user_id = ?', [user_id]);
		const seen = [];

		conn.release();
		conn.end();
		for (let i = 0; i < row.length; i++)
			seen.push(row[i].user_liked_id);
		for (let i = 0; i < row2.length; i++)
			seen.push(row2[i].user_disliked_id);
		return (seen);
	}

	getNeverSeenUser(user_id)
	{
		return (new Promise(async (resolve) => {
			const nbUsers = await this.#getNbUsers();
			const seen = await this.#getListSeenUsers(user_id);
			const neverSeen = [];

			for (let i = 1; i <= nbUsers; i++)
			{
				if (i < seen.length && seen.includes(i))
					continue;
				neverSeen.push(i);
			}
			
		}));
	}

}

module.exports = Database;