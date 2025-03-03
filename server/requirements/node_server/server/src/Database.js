/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Database.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/16 16:54:56 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/03 08:15:53 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const credientials = require('../credentials.json');
const bcrypt = require('bcrypt');
const haversine = require('./utils/haversine');
const Websocket = require('./Websocket/Websocket').Websocket;

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
				date DATETIME DEFAULT CURRENT_TIMESTAMP,
				system BOOLEAN DEFAULT FALSE,
				seen BOOLEAN DEFAULT FALSE,
				FOREIGN KEY(from_id) REFERENCES accounts(id) ON DELETE CASCADE,
				FOREIGN KEY(to_id) REFERENCES accounts(id) ON DELETE CASCADE
			)`);
			conn.query(`CREATE TABLE IF NOT EXISTS users_notifications (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				user_id INT,
				message TEXT,
				image VARCHAR(80),
				seen BOOLEAN DEFAULT FALSE,
				FOREIGN KEY(user_id) REFERENCES accounts(id) ON DELETE CASCADE
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

	async addPicture(user_id, picture)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_images WHERE user_id = ?', [user_id]);

		if (row.length >= 6)
		{
			conn.release();
			conn.end();
			return ({error: "Too many pictures"});
		}
		await conn.query('INSERT INTO users_images (local_url, user_id) VALUES (?, ?)', [picture, user_id]);
		conn.release();
		conn.end();
		return ({success: true});
	}

	async deletePicture(user_id, picture)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_images WHERE user_id = ? AND local_url = ?', [user_id, picture]);

		if (row.length == 0)
		{
			conn.release();
			conn.end();
			return ({error: "Picture not found"});
		}
		await conn.query('DELETE FROM users_images WHERE user_id = ? AND local_url = ?', [user_id, picture]);
		conn.release();
		conn.end();
		return ({success: true});
	}

	async blockUser(self_id, block_id)
	{
		const conn = await this.pool.getConnection();

		const row = await conn.query('SELECT * FROM users_blocked WHERE user_id = ? AND user_blocked_id = ?', [self_id, block_id]);
		if (row.length != 0)
			return ({alreadyBlocked: true});
		else
		{
			const row2 = await conn.query('SELECT id FROM accounts WHERE id = ?', [block_id]);
			if (row2.length == 0)
			{
				conn.release();
				conn.end();
				return ({alreadyBlocked: false, exist: false});
			}
			else
			{
				await conn.query('INSERT INTO users_blocked (user_id, user_blocked_id) VALUES (?, ?)', [self_id, block_id]);
				await conn.query('DELETE FROM users_likes WHERE user_id = ? AND user_liked_id = ?', [self_id, block_id]);
				await conn.query('DELETE FROM users_likes WHERE user_id = ? AND user_liked_id = ?', [block_id, self_id]);
				await conn.query('DELETE FROM users_dislikes WHERE user_id = ? AND user_disliked_id = ?', [self_id, block_id]);
				await conn.query('DELETE FROM users_dislikes WHERE user_id = ? AND user_disliked_id = ?', [block_id, self_id]);
				await conn.query('DELETE FROM users_messages WHERE from_id = ? AND to_id = ? OR from_id = ? AND to_id = ?', [self_id, block_id, block_id, self_id]);
				await conn.query('DELETE FROM users_last_message WHERE from_id = ? AND to_id = ? OR from_id = ? AND to_id = ?', [self_id, block_id, block_id, self_id]);
				conn.release();
				conn.end();
				return ({alreadyBlocked: false, exist: true});
			}
		}
	}

	async reportedUser(self_id, reported_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_reported WHERE user_id = ? AND user_reported_id = ?', [self_id, reported_id]);

		if (row.length != 0)
			return ({alreadyReported: true});
		else
		{
			const row2 = await conn.query('SELECT id FROM accounts WHERE id = ?', [reported_id]);

			if (row2.length == 0)
			{
				conn.release();
				conn.end();
				return ({alreadyReported: false, exist: false});
			}
			else
			{
				conn.query('INSERT INTO users_reported (user_id, user_reported_id) VALUES (?, ?)', [self_id, reported_id]);
				conn.release();
				conn.end();
				return ({alreadyReported: false, exist: true});
			}
		}
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

		const fameRatingCalc = async (user_id) => {
			const conn = await this.pool.getConnection();
			const row = await conn.query('SELECT * FROM users_likes WHERE user_liked_id = ?', [user_id]);
			const row2 = await conn.query('SELECT * FROM users_dislikes WHERE user_disliked_id = ?', [user_id]);
			const nbInteractions = row.length + row2.length;

			conn.release();
			conn.end();
			console.log("Fame rating for user", user_id, "is", nbInteractions * row2.length / 100);
			return (nbInteractions * row2.length / 100);
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
			id: user_id,
			nbPhotos: images.length,
			name: row[0].first_name,
			age: new Date().getFullYear() - new Date(row[0].date_of_birth).getFullYear(),
			city: typeof location == 'string' ? "Position inconnue" : (location.address.city || location.address.town || location.address.village),
			country: typeof location == 'string' ? "Pays inconnue" : location.address.country,
			sexe,
			orientation,
			bio: row[0].bio,
			tags,
			images,
			fameRatingCalc: await fameRatingCalc(user_id),
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
				if (otherInfo.tags.includes(String(tags[i])))
					scoreTags++;
			}

			// calcul score for distance
			if (selfInfo.location !== null && otherInfo.location !== null)
			{
				distance = haversine([selfInfo.location.latitude, selfInfo.location.longitude], [otherInfo.location.latitude, otherInfo.location.longitude]);
				if (distance < filter.distance)
					scoreDistance = 5 - ((distance * 100 / filter.distance) / 100);
				else
					return (0);
			}
			if (filter.interests.length > 0 && scoreTags != filter.interests.length)
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
				age: new Date().getFullYear() - new Date(rowInfo[0].date_of_birth).getFullYear(),
				sexe: rowInfo[0] && rowInfo[0].sexe ? rowInfo[0].sexe : null,
				orientation: rowInfo[0] && rowInfo[0].orientation ? rowInfo[0].orientation : null
			});
		}

		const isSameFilter = (filter1, filter2, lastLocation, newLocation) => {
			if (filter1.distance == undefined || filter2.distance == undefined)
				return (false);
			if (filter1.range_age[0] != filter2.range_age[0] || filter1.range_age[1] != filter2.range_age[1])
				return (false);
			console.log(filter1.distance, filter2.distance);
			if (filter1.distance != filter2.distance)
				return (false);
			if (filter1.interests.length != filter2.interests.length)
				return (false);
			for (let i = 0; i < filter1.interests.length; i++)
			{
				if (!filter2.interests.includes(filter1.interests[i]))
					return (false);
			}
			if ((!lastLocation && !newLocation) || lastLocation.latitude != newLocation.latitude || lastLocation.longitude != newLocation.longitude)
				return (false);
			return (true);
		}

		const blockedUser = async (user_id) => {
			const conn = await this.pool.getConnection();
			const row = await conn.query('SELECT * FROM users_blocked WHERE user_id = ? OR user_blocked_id = ?', [user_id, user_id]);
			const blockedUser = [];

			for (let i = 0; i < row.length; i++)
			{
				if (row[i].user_id == user_id)
					blockedUser.push(row[i].user_blocked_id);
				else
					blockedUser.push(row[i].user_id);
			}
			conn.release();
			conn.end();
			return (blockedUser);
		}

		const getLocation = async (user_id) => {
			const conn = await this.pool.getConnection();
			const row = await conn.query('SELECT location FROM users_info WHERE user_id = ?', [user_id]);

			conn.release();
			conn.end();
			return (row[0].location);
		}

		return (new Promise(async (resolve) => {
			const	blockedUsersList = await blockedUser(user_id);
			const	nbUsers = await this.#getNbUsers();
			const	seen = await this.#getListSeenUsers(user_id);
			const	lastLocation = await getLocation(user_id);
			let		index = 0;

			while (index < this.buffer_neverSeenUser.length)
			{
				if (this.buffer_neverSeenUser[index].id == user_id)
					break;
				index++;
			}
			if (index == this.buffer_neverSeenUser.length)
			{
				this.buffer_neverSeenUser.push({id: user_id, neverSeen: [], lastNb: nbUsers, lastFilter: {}, blockedUsersList: blockedUsersList, lastLocation: lastLocation});
				for (let i = 1; i <= nbUsers; i++)
				{
					if (i == user_id || seen.includes(i) || blockedUsersList.includes(i))
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -2});
					else
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -1});
				}
			}
			else
			{
				for (let i = 0; i <= this.buffer_neverSeenUser[index].neverSeen; i++)
				{
					if (seen.includes(this.buffer_neverSeenUser[index].neverSeen[i].id))
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -2});
					else if (blockedUsersList.includes(this.buffer_neverSeenUser[index].neverSeen[i].id))
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: -2});
					else
						this.buffer_neverSeenUser[index].neverSeen.push({id: i, score: await getScore(this.buffer_neverSeenUser[index].neverSeen[i].id)});
				}
				while (this.buffer_neverSeenUser[index].lastNb < nbUsers)
				{
					if (blockedUsersList.includes(this.buffer_neverSeenUser[index].neverSeen[lastNb].id))
						this.buffer_neverSeenUser[index].neverSeen.push({id: this.buffer_neverSeenUser[index].lastNb, score: -2});
					else
						this.buffer_neverSeenUser[index].neverSeen.push({id: this.buffer_neverSeenUser[index].lastNb, score: await getScore(this.buffer_neverSeenUser[index].lastNb)});
					this.buffer_neverSeenUser[index].lastNb++;
				}
			}
			if (!isSameFilter(this.buffer_neverSeenUser[index].lastFilter, filter, lastLocation, this.buffer_neverSeenUser[index].lastLocation) || blockedUsersList.length != this.buffer_neverSeenUser[index].blockedUsersList.length)
			{
				console.log("Filter changed");
				for (let i = 0; i < this.buffer_neverSeenUser[index].neverSeen.length; i++)
				{
					if (this.buffer_neverSeenUser[index].neverSeen[i].score != -2)
					{
						if (blockedUsersList.includes(this.buffer_neverSeenUser[index].neverSeen[i].id))
							this.buffer_neverSeenUser[index].neverSeen[i].score = -2;
						else
							this.buffer_neverSeenUser[index].neverSeen[i].score = await getScore(this.buffer_neverSeenUser[index].neverSeen[i].id);
					}
				}
			}
			else
				console.log("Filter not changed");
			this.buffer_neverSeenUser[index].lastFilter = filter;
			this.buffer_neverSeenUser[index].blockedUsersList = blockedUsersList;
			this.buffer_neverSeenUser[index].lastLocation = lastLocation;
			this.buffer_neverSeenUser[index].neverSeen.sort((a, b) => b.score - a.score);
			console.log(this.buffer_neverSeenUser[index]);
			if (this.buffer_neverSeenUser[index].neverSeen[0].score == 0 || this.buffer_neverSeenUser[index].neverSeen[0].score == -2 || this.buffer_neverSeenUser[index].neverSeen[0].score == -1)
				resolve({finished: true});
			else
				resolve(this.getUserInfo(this.buffer_neverSeenUser[index].neverSeen[0].id));
		}));
	}

	async reactToUser(user_id, react)
	{
		let		index = 0;
		let		other_id = -1;
			
		while (index < this.buffer_neverSeenUser.length)
		{
			if (this.buffer_neverSeenUser[index].id == user_id)
				break;
			index++;
		}
		if (index == this.buffer_neverSeenUser.length)
			return ({error: "User never initialized"});
		if (this.buffer_neverSeenUser[index].neverSeen.length == 0)
			return ({error: "No more user to see"});
		if (this.buffer_neverSeenUser[index].neverSeen[0].score == 0 || this.buffer_neverSeenUser[index].neverSeen[0].score == -2)
			return ({error: "No more user to see"});
		other_id = this.buffer_neverSeenUser[index].neverSeen[0].id;
		this.buffer_neverSeenUser[index].neverSeen[0].score = -2;
		this.buffer_neverSeenUser[index].neverSeen.sort((a, b) => b.score - a.score);

		const conn = await this.pool.getConnection();
		if (react == true)
		{
			console.log("User liked");
			await conn.query('INSERT INTO users_likes (user_id, user_liked_id) VALUES (?, ?)', [user_id, other_id]);
			if (await this.#hasMatch(user_id, other_id))
			{
				Websocket.sendNotification(user_id, "Tu as un nouveau match ! Vas voir ça dans tes messages", "match.png");
				Websocket.sendNotification(other_id, "Tu as un nouveau match ! Vas voir ça dans tes messages", "match.png");
				await conn.query('INSERT INTO users_notifications (user_id, message, image) VALUES (?, ?, ?)', [user_id, "Tu as un nouveau match ! Vas voir ça dans tes messages", "match.png"]);
				await conn.query('INSERT INTO users_notifications (user_id, message, image) VALUES (?, ?, ?)', [other_id, "Tu as un nouveau match ! Vas voir ça dans tes messages", "match.png"]);
				await conn.query('INSERT INTO users_last_message (from_id, to_id, message, system) VALUES (?, ?, ?, ?)', [user_id, other_id, "Commence la conversation !", true]);
			}
			else
			{
				const name_user = await conn.query('SELECT first_name FROM users_info WHERE user_id = ?', [user_id]);
				Websocket.sendNotification(other_id, `${name_user[0].first_name} a vu ton profil`, "seen.png");
				await conn.query('INSERT INTO users_notifications (user_id, message, image) VALUES (?, ?, ?)', [other_id, `${name_user[0].first_name} a vu ton profil`, "seen.png"]);
			}
		}
		else
		{
			const name_user = await conn.query('SELECT first_name FROM users_info WHERE user_id = ?', [user_id]);
			Websocket.sendNotification(other_id, `${name_user[0].first_name} a vu ton profil`, "seen.png");
			await conn.query('INSERT INTO users_notifications (user_id, message, image) VALUES (?, ?, ?)', [other_id, `${name_user[0].first_name} a vu ton profil`, "seen.png"]);
			await conn.query('INSERT INTO users_dislikes (user_id, user_disliked_id) VALUES (?, ?)', [user_id, other_id]);
		}

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
		if (row.length != 0)
		{
			const name_user_one = await conn.query('SELECT first_name FROM users_info WHERE user_id = ?', [user_id]);
			const name_user_two = await conn.query('SELECT first_name FROM users_info WHERE user_id = ?', [other_id]);
			const pfp_user_one = await conn.query('SELECT local_url FROM users_images WHERE user_id = ?', [user_id]);
			const pfp_user_two = await conn.query('SELECT local_url FROM users_images WHERE user_id = ?', [other_id]);

			Websocket.sendMatch(user_id, name_user_two[0].first_name, pfp_user_two[0].local_url);
			Websocket.sendMatch(other_id, name_user_one[0].first_name, pfp_user_one[0].local_url);
		}
		return (row.length != 0);
	}

	async getChatList(user_id)
	{
		const getOtherInfo = async (other_id) => {
			const conn = await this.pool.getConnection();
			const rowInfo = await conn.query('SELECT first_name FROM users_info WHERE user_id = ?', [other_id]);
			const rowPfp = await conn.query('SELECT local_url FROM users_images WHERE user_id = ?', [other_id]);

			conn.release();
			conn.end();
			return ({
				name: rowInfo[0].first_name,
				pfp: rowPfp[0].local_url
			})
		}

		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_last_message WHERE from_id = ? OR to_id = ?', [user_id, user_id]);
		const chatList = [];

		conn.release();
		conn.end();
		for (let i = row.length - 1; i >= 0; i--)
		{
			const	other_id = row[i].from_id == user_id ? row[i].to_id : row[i].from_id;
			const	otherInfo = await getOtherInfo(other_id);
			let		seen = true;

			if (row[i].system)
				seen = false;
			else if (row[i].from_id != user_id)
				seen = row[i].seen;
			chatList.push({
				name: otherInfo.name,
				pfp: otherInfo.pfp,
				lastMessage: row[i].message,
				date: row[i].date,
				seen,
				sendBySelf: row[i].from_id == user_id,
				id: other_id,
				sendBySystem: row[i].system
			});
		}
		return (chatList);
	}

	async getChat(from_id, to_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)', [from_id, to_id, to_id, from_id]);
		const chat = [];

		conn.release();
		conn.end();
		for (let i = 0; i < row.length; i++)
		{
			chat.push({
				content: row[i].message,
				sendBySelf: row[i].from_id == from_id,
			});
		}
		return (chat);
	}

	async sendMessage(from_id, to_id, message)
	{
		const conn = await this.pool.getConnection();

		await conn.query('INSERT INTO users_messages (from_id, to_id, message) VALUES (?, ?, ?)', [from_id, to_id, message]);

		const row = await conn.query('SELECT * FROM users_last_message WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)', [from_id, to_id, to_id, from_id]);
		if (row.length == 0)
			await conn.query('INSERT INTO users_last_message (from_id, to_id, message) VALUES (?, ?, ?)', [from_id, to_id, message]);
		else
		{
			await conn.query('DELETE FROM users_last_message WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?)', [from_id, to_id, to_id, from_id]);
			await conn.query('INSERT INTO users_last_message (from_id, to_id, message) VALUES (?, ?, ?)', [from_id, to_id, message]);
		}
		conn.release();
		conn.end();
	}

	async messageSeen(id, to)
	{
		const conn = await this.pool.getConnection();

		await conn.query('UPDATE users_last_message SET seen = true WHERE from_id = ? AND to_id = ?', [to, id]);
		conn.release();
		conn.end();
	}
	
	async newNotification(user_id, message, image)
	{
		const conn = await this.pool.getConnection();

		await conn.query('INSERT INTO users_notifications (user_id, message, image) VALUES (?, ?, ?)', [user_id, message, image]);
		conn.release();
		conn.end();
	}

	async getNotifications(user_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_notifications WHERE user_id = ?', [user_id]);
		const notifications = [];

		conn.release();
		conn.end();
		for (let i = row.length - 1; i >= 0; i--)
		{
			notifications.push({
				message: row[i].message,
				image: row[i].image,
				seen: row[i].seen
			});
		}
		return (notifications);
	}

	async seenNotifs(user_id)
	{
		const conn = await this.pool.getConnection();

		await conn.query('UPDATE users_notifications SET seen = true WHERE user_id = ?', [user_id]);
		conn.release();
		conn.end();
	}
	
	async deleteUser(user_id)
	{
		const conn = await this.pool.getConnection();

		await conn.query('DELETE FROM accounts WHERE id = ?', [user_id]);
		conn.release();
		conn.end();
	}

	async changeInfo(user_id, info)
	{
		const conn = await this.pool.getConnection();
		const rowAccounts = await conn.query('SELECT email FROM accounts WHERE id = ?', [user_id]);
		
		await conn.query(
			'UPDATE users_info SET first_name = ?, last_name = ?, nickname = ?, date_of_birth = ? WHERE user_id = ?',
			[info.first_name, info.last_name, info.nickname, info.date_of_birth, user_id]
		);
		conn.release();
		conn.end();
		if (info.password.length != 0)
		{
			bcrypt.hash(rowAccounts[0].email + info.password, 10, (err, hash) => {
				if (err)
					throw Error("Error to hash password")
				this.pool.getConnection().then((conn) => {
					conn.query('UPDATE accounts SET password = ? WHERE id = ?', [hash, user_id]);
				}).finally(() => {conn.release(); conn.end()});
			});
		}
	}

	async getInfo(user_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT * FROM users_info WHERE user_id = ?', [user_id]);
		const date = new Date(row[0].date_of_birth);
		const year = date.toLocaleString("default", { year: "numeric" });
		const month = date.toLocaleString("default", { month: "2-digit" });
		const day = date.toLocaleString("default", { day: "2-digit" });

		conn.release();
		conn.end();
		return ({
			first_name: row[0].first_name,
			last_name: row[0].last_name,
			nickname: row[0].nickname,
			date_of_birth: year + "-" + month + "-" + day,
		})
	}

	async getAllLocations(self_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT first_name, last_name, date_of_birth, user_id, location FROM users_info');
		const row2 = await conn.query(`SELECT t1.user_id, t1.local_url
			FROM users_images t1
			INNER JOIN (
				SELECT user_id, MIN(id) AS min_id
				FROM users_images
				GROUP BY user_id
			) t2 ON t1.id = t2.min_id;`);
		const row3 = await conn.query('SELECT * FROM users_blocked WHERE user_id = ? OR user_blocked_id = ?', [self_id, self_id]);
		const usersList = [];

		conn.release();
		conn.end();
		for (let i = 0; i < row.length; i++)
		{
			if (row3.find((element) => element.user_id == row[i].user_id || element.user_blocked_id == row[i].user_id))
				continue;
			if (row[i].location)
			{
				usersList.push({
					id: row[i].user_id,
					name: row[i].first_name + " " + row[i].last_name,
					age: new Date().getFullYear() - new Date(row[i].date_of_birth).getFullYear(),
					location: JSON.parse(row[i].location),
					pfp: row2.find((element) => element.user_id == row[i].user_id).local_url,
				});
				if (row[i].user_id == self_id)
					usersList[usersList.length - 1].self = true;
			}
		}
		return (usersList);
	}

	async getSelfInfo(user_id)
	{
		const conn = await this.pool.getConnection();
		const row = await conn.query('SELECT bio FROM users_info WHERE user_id = ?', [user_id]);
		const row2 = await conn.query('SELECT tag FROM users_tags WHERE user_id = ?', [user_id]);
		const row3 = await conn.query('SELECT local_url FROM users_images WHERE user_id = ?', [user_id]);

		conn.release();
		conn.end();
		return ({
			bio: row[0].bio,
			tags: row2.map((element) => Number(element.tag)),
			pfp: row3.map((element) => element.local_url),
		});
	}

}

module.exports = Database;