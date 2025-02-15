/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Database.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/16 16:54:56 by edbernar          #+#    #+#             */
/*   Updated: 2025/02/15 18:51:31 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const credientials = require('../credentials.json');
const bcrypt = require('bcrypt');
const Debug = require('./Debug');
const haversine = require('./utils/haversine');

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
				location VARCHAR(100),
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
			conn.query(`CREATE TABLE IF NOT EXISTS users_messages (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				from_id INT,
				to_id INT,
				message TEXT,
				date DATETIME,
				FOREIGN KEY(from_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(to_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_last_message (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				from_id INT,
				to_id INT,
				message TEXT,
				date DATETIME,
				FOREIGN KEY(from_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(to_id) REFERENCES accounts(id) ON DELETE CASCADE
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

	async getUserInfo(user_id)
	{
		const getCityName = async (lat, lon) => {
			const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
			if (!response.ok)
				return (null);
			const data = await response.json();
			return (data);
		}

		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_info WHERE user_id = ?', [user_id]);
		const rowTags = await conn.query('SELECT tag FROM users_tags WHERE user_id = ?', [user_id]);
		const rowImages = await conn.query('SELECT local_url FROM users_images WHERE user_id = ?', [user_id]);
		const location = row[0]?.location ? await getCityName(JSON.parse(row[0].location).latitude, JSON.parse(row[0].location).longitude) : "Position inconnue";
		const tags = [];
		const images = [];
		let	  sexe = row[0].sexe == 'M' ? "Homme" : (row[0].sexe == 'F' ? "Femme" : "Autre");
		let	  orientation = null;

		if (row[0].orientation == 'M' && row[0].sexe == 'M')
			orientation = "Homosexuel";
		else if (row[0].orientation == 'F' && row[0].sexe == 'F')
			orientation = "Lesbienne";
		else if ((row[0].orientation == 'M' && row[0].sexe == 'F') || (row[0].orientation == 'F' && row[0].sexe == 'M'))
			orientation = "Hétérosexuel";
		else
			orientation = "Autre";

		for (let i = 0; i < rowTags.length; i++)
			tags.push(rowTags[i].tag);
		for (let i = 0; i < rowImages.length; i++)
			images.push(rowImages[i].local_url);
		conn.release();
		conn.end();
		return ({
			nbPhotos: images.length,
			name: row[0].first_name,
			age: new Date().getFullYear() - new Date(row[0].date_of_birth).getFullYear(),
			city: typeof location == 'string' ? "Position inconnue" : (location.address.city || location.address.town || location.address.village),
			country: typeof location == 'string' ? "Pays inconnue" : location.address.country,
			sexe,
			orientation,
			bio: row[0].bio,
			tags,
			images
		});
	}

	buffer_neverSeenUser = [];

	getNeverSeenUser(user_id, filter)
	{
		let	selfInfo = null;

		const getScore = async (other_id) => {
			const	otherInfo = await getOtherInfo(other_id);
			let		distance = 0;
			let		scoreDistance = 0;
			let		scoreTags = 0;
			let		tags = [];

			if (!selfInfo)
				selfInfo = await getOtherInfo(user_id);

			if (otherInfo.age < filter.range_age[0] || otherInfo.age > filter.range_age[1])
				return (0);
			
			if (selfInfo.orientation != otherInfo.sexe || otherInfo.orientation != selfInfo.sexe)
				return (0);

			if (filter.distance == 100)
				filter.distance = 32089;

			// calcul score for interests
			if (filter.interests.length == 0)
				tags = selfInfo.tags;
			else
				tags = filter.interests;
			for (let i = 0; i < tags.length; i++)
			{
				if (otherInfo.tags.includes(tags[i]))
					scoreTags++;
			}

			// calcul score for distance
			if (selfInfo.location && otherInfo.location)
			{
				distance = haversine([selfInfo.location.latitude, selfInfo.location.longitude], [otherInfo.location.latitude, otherInfo.location.longitude]);
				if (distance < filter.distance)
					scoreDistance = 5 - ((distance * 100 / filter.distance) / 100);
			}
			if (filter.interests.length > 0 && scoreTags != filter.interests.length)
				return (0);
			if (filter.distance < 100 && scoreDistance == 0)
				return (0);
			return (scoreTags + scoreDistance);
		}

		const getOtherInfo = async (other_id) => {
			const conn = await this.pool.getConnection();
			const rowInfo = await conn.query('SELECT location, date_of_birth, sexe, orientation FROM users_info WHERE user_id = ?', [other_id]);
			const rowTags = await conn.query('SELECT tag FROM users_tags WHERE user_id = ?', [other_id]);
			const tags = [];

			for (let i = 0; i < rowTags.length; i++)
				tags.push(rowTags[i].tag);
			conn.release();
			conn.end();
			return ({
				location: rowInfo[0] && rowInfo[0].location ? JSON.parse(rowInfo[0].location) : null,
				tags,
				age: rowInfo[0] && rowInfo[0] ? new Date().getFullYear() - new Date(rowInfo[0].age).getFullYear() : null,
				sexe: rowInfo[0] && rowInfo[0].sexe ? rowInfo[0].sexe : null,
				orientation: rowInfo[0] && rowInfo[0].orientation ? rowInfo[0].orientation : null
			});
		}

		return (new Promise(async (resolve) => {
			const	nbUsers = await this.#getNbUsers();
			const	seen = await this.#getListSeenUsers(user_id);
			let		index = -1;
			
			while (++index && index < this.buffer_neverSeenUser.length)
			{
				if (this.buffer_neverSeenUser[index].id == user_id)
					break;
			}
			if (index == this.buffer_neverSeenUser.length)
			{
				this.buffer_neverSeenUser.push({id: user_id, neverSeen: [], lastNb: nbUsers})
				for (let i = 0; i <= nbUsers; i++)
				{
					if (i != user_id)
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: seen.includes(i) ? -2 : -1});
					else
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -2});
				}
			}
			else
			{
				for (let i = 0; i <= nbUsers; i++)
				{
					if (seen.includes(this.buffer_neverSeenUser[index].neverSeen[i].id))
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -2});
				}
				while (this.buffer_neverSeenUser[index].lastNb < nbUsers)
				{
					this.buffer_neverSeenUser[index].neverSeen.push({id: this.buffer_neverSeenUser[index].lastNb, score: -1});
					this.buffer_neverSeenUser[index].lastNb++;
				}
			}
			for (let i = 0; i < this.buffer_neverSeenUser[index].neverSeen.length; i++)
			{
				if (this.buffer_neverSeenUser[index].neverSeen[i].score == -1)
					this.buffer_neverSeenUser[index].neverSeen[i].score = await getScore(this.buffer_neverSeenUser[index].neverSeen[i].id);
			}
			this.buffer_neverSeenUser[index].neverSeen.sort((a, b) => b.score - a.score);
			console.log(this.buffer_neverSeenUser[index]);
			if (this.buffer_neverSeenUser[index].neverSeen[0].score == 0)
				resolve({finished: true});
			else
				resolve(this.getUserInfo(this.buffer_neverSeenUser[index].neverSeen[0].id));
		}));
	}

	async reactToUser(user_id, react)
	{
		let		index = -1;
		let		other_id = -1;
			
		while (++index && index < this.buffer_neverSeenUser.length)
		{
			if (this.buffer_neverSeenUser[index].id == user_id)
				break;
		}
		if (index == this.buffer_neverSeenUser.length)
			return ({error: "User never initialized"});
		if (this.buffer_neverSeenUser[index].neverSeen[0].score == 0)
			return ({error: "No more user to see"});
		other_id = this.buffer_neverSeenUser[index].neverSeen[0].id;
		this.buffer_neverSeenUser[index].neverSeen[0].score = -2;
		this.buffer_neverSeenUser[index].neverSeen.sort((a, b) => b.score - a.score);

		const conn = await this.pool.getConnection();
		if (react == true)
		{
			await conn.query('INSERT INTO users_likes (user_id, user_liked_id) VALUES (?, ?)', [user_id, other_id]);
			if (await this.#hasMatch(user_id, other_id))
			{
				// send notification on websocket
			}
		}
		else
			await conn.query('INSERT INTO users_dislikes (user_id, user_disliked_id) VALUES (?, ?)', [user_id, other_id]);

		conn.release();
		conn.end();
		return ({success: true});
	}

	async #hasMatch(user_id, other_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_likes WHERE user_id = ? AND user_liked_id = ?', [other_id, user_id]);

		conn.release();
		conn.end();
		return (row.length != 0);
	}

	// async getChatList(user_id)
	// {
	// 	const conn = await this.pool.getConnection();
	// 	const row = await conn.query('SELECT * FROM users_messages WHERE from_id = ? OR to_id = ?', [user_id, user_id]);

	// 	conn.release();
	// 	conn.end();
	// 	for (let i = 0; i < row.length; i++)
	// 		row[i].id = undefined;
	// 	return (row);
	// }

	// async sendMessage(from_id, to_id, message)
	// {
	// 	const conn = await this.pool.getConnection();
	// 	const date = new Date().toISOString();
	// }
		
}

module.exports = Database;