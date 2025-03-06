var fs = require('fs');
const bcrypt = require('bcrypt');
const Debug = require('./Debug');
const {sendVerificationMail, checkIfCodeIsValid} = require('./utils/verificationMail');
const {sendResetPasswordMail, checkIfTokenIsValid, template_page} = require('./utils/resetPasswordMail');
const getIndexUserCreatingAccount = require('./utils/getIndexUserCreatingAccount');
const {checkIfCodeIsValidChangeMail} = require('./utils/changeMail');
const base64ToFile = require('./utils/base64ToFile');
const usersWs = require('./Websocket/Websocket').users;
const userBlocked = require('./utils/userBlocked');
const isPasswordStrong = require('./utils/isPasswordStrong');
const sendMailResetPassword = require('./utils/resetPasswordMail');

const	missing = "Missing parameters";
let		userCreatingAccount = [];

class PostRequest
{
	// Request to get status of user connected
	static get_status_self_connected(req, res)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			res.send(JSON.stringify({logged: true}));
		else
			res.send(JSON.stringify({logged: false}));
	}

	// Request to login
	// {email: string, password: string}
	static login(req, res, db)
	{
		Debug.log(req);

		// just to get the hash of the password for testing
		bcrypt.hash(req.body.email + req.body.password, 10, (err, hash) => {
			console.log('Password hash:', hash);
		});

		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.body.email || !req.body.password)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		db.isValidAccount(req.body.email).then((data) => {
			if (data.valid)
			{
				bcrypt.compare(req.body.email + req.body.password, data.password, (err, result) => {
					if (result)
					{
						if (data.banned)
							return (res.send(JSON.stringify({error: "You has been banned"})));
						req.session.info = {logged: true, id: data.id};
						return (res.send(JSON.stringify({success: "Connected"})));
					}
					return (res.send(JSON.stringify({Error: "Invalid mail or password"})));
				});
			}
			else
				return (res.send(JSON.stringify({error: "Invalid mail or password"})));
		});
	}

	static reset_password(req, res, db)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.body.email)
			return (res.send(JSON.stringify({error: missing})));
		if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)))
			return (res.send(JSON.stringify({error: "Invalid email format"})));
		db.checkIfMailExist(req.body.email).then((exist) => {
			if (!exist)
				return ;
			sendResetPasswordMail(req.body.email);
		});
		res.send(JSON.stringify({success: true}));
	}

	static reset_password_mail(req, res, db)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.query.token)
			return (res.send(JSON.stringify({error: missing})));
		const resToken = checkIfTokenIsValid(req.query.token);
		if (resToken.valid)
		{
			db.createPassword(resToken.mail).then((data) => {
				if (data.error)
					return (res.send(JSON.stringify({error: 'Error creating password'})));
				const password = data.password;
				res.send(template_page.replace('{{newPassword}}', password));
			});
		}
		else
			res.send(JSON.stringify({error: "Token invalid"}));
	}

	// Request to register
	// {email: string}
	static register(req, res, db)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.body.email)
			return (res.send(JSON.stringify({error: missing})));
		if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)))
			return (res.send(JSON.stringify({error: "Invalid mail"})));
		db.checkIfMailExist(req.body.email).then((exist) => {
			if (exist)
			{
				res.send(JSON.stringify({error: "Mail already use"}));
				return ;
			}
			sendVerificationMail(req.body.email).then((token) => {
				res.send(JSON.stringify({success: "Mail sent", token}));
			}).catch(() => {
				res.send(JSON.stringify({error: "Error sending mail"}));
			});
		})
	}

	// Request to confirm mail
	// {token: string, code: string}
	static confirm_register(req, res)
	{
		Debug.log(req);
		if (!req.body.token || !req.body.code)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.token !== 'string' || typeof req.body.code !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		if (req.body.code.length !== 4)
			return (res.send(JSON.stringify({error: "Code must be 4 characters"})));
		const resCode = checkIfCodeIsValid(req.body.token, req.body.code);
		if (resCode.valid)
		{
			userCreatingAccount.push({mail: resCode.mail, token: resCode.token});
			res.send(JSON.stringify({success: "Mail confirmed"}));
		}
		else
			res.send(JSON.stringify({error: "Code invalid"}));
	}

	// Request to register step 1 (who contain first name, last name, nickname, password)
	// {first_name: string, last_name: string, nickname: string, password: string, token: string}
	static first_step_register(req, res)
	{
		const	authorizedCharsNickname = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
		const	authorizedCharsNames = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ";
		let		index;

		Debug.log(req);
		if (!req.body.first_name || !req.body.last_name || !req.body.password || !req.body.token)
			return (res.send(JSON.stringify({error: missing})));

		if (typeof req.body.first_name !== 'string' || typeof req.body.last_name !== 'string' ||
				typeof req.body.password !== 'string' || typeof req.body.token !== 'string' ||
				typeof req.body.nickname !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));

		if (req.body.first_name.length < 2 || req.body.first_name.length > 50)
			return (res.send(JSON.stringify({error: "First name must be between 2 and 50 characters"})));
		if (req.body.last_name.length < 2 || req.body.last_name.length > 50)
			return (res.send(JSON.stringify({error: "Last name must be between 2 and 50 characters"})));
		if (req.body.first_name.split('').some((c) => !authorizedCharsNames.includes(c)))
			return (res.send(JSON.stringify({error: "First name contains unauthorized characters"})));
		if (req.body.last_name.split('').some((c) => !authorizedCharsNames.includes(c)))
			return (res.send(JSON.stringify({error: "Last name contains unauthorized characters"})));
		if (isPasswordStrong(req.body.password) === false)
			return (res.send(JSON.stringify({error: "Password must be between 8 and 50 characters and contain at least one uppercase, one lowercase, one number and one special character"})));
		if (req.body.nickname.length < 2 || req.body.nickname.length > 50)
			return (res.send(JSON.stringify({error: "Nickname must be between 2 and 50 characters"})));
		if (req.body.nickname.split('').some((c) => !authorizedCharsNickname.includes(c)))
			return (res.send(JSON.stringify({error: "Nickname contains unauthorized characters"})));

		index = getIndexUserCreatingAccount(userCreatingAccount, req.body.token)
		if (index == -1)
			return (res.send(JSON.stringify({error: "Invalid token"})));

		userCreatingAccount[index].first_name = req.body.first_name;
		userCreatingAccount[index].last_name = req.body.last_name;
		userCreatingAccount[index].password = req.body.password;
		userCreatingAccount[index].nickname = req.body.nickname;
		res.send(JSON.stringify({success: "First step register request"}));
	}

	// Request to register step 2 (who contain date of birth, sexe, orientation, bio, tags)
	// {date_of_birth: string(YYYY-MM-DD), sexe: string(M/F/O), orientation: string(M/F/O), bio: string, tags: string[], token: string}
	static second_step_register(req, res)
	{
		let	index;

		Debug.log(req);
		if (!req.body.date_of_birth || !req.body.sexe || !req.body.orientation || !req.body.bio || !req.body.tags || !req.body.token)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.date_of_birth !== 'string' || typeof req.body.sexe !== 'string' ||
				typeof req.body.orientation !== 'string' || typeof req.body.bio !== 'string' ||
				!Array.isArray(req.body.tags) || typeof req.body.token !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		
		if (req.body.date_of_birth.length !== 10 || req.body.date_of_birth[4] !== '-' || req.body.date_of_birth[7] !== '-' ||
				isNaN(parseInt(req.body.date_of_birth.substr(0, 4))) || isNaN(parseInt(req.body.date_of_birth.substr(5, 2))) ||
				isNaN(parseInt(req.body.date_of_birth.substr(8, 2)))
			)
			return (res.send(JSON.stringify({error: "Invalid date of birth"})));
		if (req.body.sexe !== 'M' && req.body.sexe !== 'F' && req.body.sexe !== 'O')
			return (res.send(JSON.stringify({error: "Invalid sexe"})));
		if (req.body.orientation !== 'M' && req.body.orientation !== 'F' && req.body.orientation !== 'O')
			return (res.send(JSON.stringify({error: "Invalid orientation"})));
		if (req.body.bio.length < 10 || req.body.bio.length > 500)
			return (res.send(JSON.stringify({error: "Bio must be between 10 and 500 characters"})));
		if (req.body.tags.length < 1 || req.body.tags.length > 5)
			return (res.send(JSON.stringify({error: "Tags must be between 1 and 5"})));

		index = getIndexUserCreatingAccount(userCreatingAccount, req.body.token)
		if (index == -1)
			return (res.send(JSON.stringify({error: "Invalid token"})));

		userCreatingAccount[index].date_of_birth = req.body.date_of_birth;
		userCreatingAccount[index].sexe = req.body.sexe;
		userCreatingAccount[index].orientation = req.body.orientation;
		userCreatingAccount[index].bio = req.body.bio;
		userCreatingAccount[index].tags = req.body.tags;
		res.send(JSON.stringify({success: "Second step register request"}));
	}

	// Request to add picture to register
	// {base64: string, token: string}
	static add_picture_register(req, res, db)
	{
		let	index;

		Debug.log(req, res);
		if (req.session.info && req.session.info.logged)
		{
			if (!req.body.base64)
				return (res.send(JSON.stringify({error: missing})));
			const img = base64ToFile(req.body.base64);
			const filename = img.split('/')[img.split('/').length - 1];

			db.addPicture(req.session.info.id, filename).then((ret) => {
				if (ret.error)
					return (res.send({error: ret.error}));
				res.send(JSON.stringify({success: "Image added", imgName: filename}));
			});
		}
		else
		{
			if (!req.body.token || !req.body.base64)
				return (res.send(JSON.stringify({error: missing})));
			index = getIndexUserCreatingAccount(userCreatingAccount, req.body.token)
			if (index == -1)
				return (res.send(JSON.stringify({error: "Invalid token"})));
			if (!userCreatingAccount[index]?.pictures)
				userCreatingAccount[index].pictures = [];
			try {
				const img = base64ToFile(req.body.base64);
				const filename = img.split('/')[img.split('/').length - 1];

				userCreatingAccount[index].pictures.push(filename);
				res.send(JSON.stringify({success: "Image added", imgName: filename}));
			}
			catch (e) {
				res.send(JSON.stringify({error: e.message}));
			}
		}
	}

	// Request to delete picture to register
	// {imgName: string, token: string}
	static delete_picture_register(req, res, db)
	{
		let	index;
	
		Debug.log(req, res);
		try {
			if (req.session.info && req.session.info.logged)
			{
				if (!req.body.imgName)
					return (res.send(JSON.stringify({error: missing})));
				if (typeof req.body.imgName !== 'string')
					return (res.send(JSON.stringify({error: "Invalid parameters"})));
				db.deletePicture(req.session.info.id, req.body.imgName).then((ret) => {
					if (ret.error)
						return (res.send({error: ret.error}));
					fs.unlinkSync('/app/user_static_data/' + req.body.imgName);
					res.send(JSON.stringify({success: "Image deleted"}));
				});
			}
			else
			{
				if (!req.body.token || !req.body.imgName)
					return (res.send(JSON.stringify({error: missing})));
				
				index = getIndexUserCreatingAccount(userCreatingAccount, req.body.token)
				if (index == -1)
					return (res.send(JSON.stringify({error: "Invalid token"})));
		
				for (let i = 0; i < userCreatingAccount[index].pictures.length; i++)
				{
					if (userCreatingAccount[index].pictures[i] == req.body.imgName)
					{
						fs.unlinkSync('/app/user_static_data/' + req.body.imgName);
						res.send(JSON.stringify({success: "Image deleted"}));
						return ;
					}
					if (i + 1 == userCreatingAccount[index].pictures.length)
						return (res.send(JSON.stringify({error: "No image with this name"})));
				}
			}
		}
		catch (e) {
			res.send({error: e.message});
		}
	}

	// Request to finish register
	// {token: string}
	static finish_register(req, res, db)
	{
		let	index;

		if (!req.body.token)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.token !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		
		for (index = 0; index < userCreatingAccount.length; index++)
		{
			if (userCreatingAccount[index].token === req.body.token)
				break;
		}
		if (index === userCreatingAccount.length)
			return (res.send(JSON.stringify({error: "Invalid token"})));
		
		if (!userCreatingAccount[index].first_name || !userCreatingAccount[index].last_name || !userCreatingAccount[index].password ||
				!userCreatingAccount[index].nickname || !userCreatingAccount[index].date_of_birth || !userCreatingAccount[index].sexe ||
				!userCreatingAccount[index].orientation || !userCreatingAccount[index].bio || !userCreatingAccount[index].tags ||
				!userCreatingAccount[index].pictures)
			return (res.send(JSON.stringify({error: "Incomplete account"})));
		db.addUser(userCreatingAccount[index]);
		db.getIdFromMail(userCreatingAccount[index].mail).then((id) => {
			req.session.info = {logged: true, id: id};
		});
		userCreatingAccount.pop(index);
		res.send(JSON.stringify({success: "Account created"}));
	}

	static change_location(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (req.body.lat == undefined || req.body.lon == undefined)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.lat !== 'number' || typeof req.body.lon !== 'number')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		db.addLocation(req.session.info.id, Number(req.body.lat).toFixed(6), Number(req.body.lon).toFixed(6));
		res.send(JSON.stringify({success: "Location changed"}));
	}

	// Request to logout
	// {}
	// need to be tested
	static logout(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		req.session.info = {logged: false, id: -1};
		res.send(JSON.stringify({success: "Disconnected"}));
	}

	static delete_account(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.deleteUser(req.session.info.id);
		req.session.info = {logged: false, id: -1};
		res.send(JSON.stringify({success: "Account deleted"}));
	}

	// Request to block a user
	// {block_id: int}
	static block_user(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.body.block_id)
			return (res.send(JSON.stringify({error: missing})));
		db.blockUser(req.session.info.id, req.body.block_id).then((data) => {
			if (data.alreadyBlocked)
				return (res.send(JSON.stringify({error: "User already blocked"})));
			else if (!data.exist)
				return (res.send(JSON.stringify({error: "User not exist"})));
			res.send(JSON.stringify({success: "User blocked"}));
		});
	}

	// Request to report a user
	// {report_id: int}
	static report_user(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.body.report_id)
			return (res.send(JSON.stringify({error: missing})));
		userBlocked(req, res, db, req.body.report_id).then((blocked) => {
			if (blocked)
				return (res.send(JSON.stringify({error: "User blocked"})));
			db.reportedUser(req.session.info.id, req.body.report_id).then((data) => {
				if (data.alreadyReported)
					return (res.send(JSON.stringify({error: "User already reported"})));
				else if (!data.exist)
					return (res.send(JSON.stringify({error: "User not exist"})));
				res.send(JSON.stringify({success: "User blocked"}));
				db.getNbReport(req.body.report_id).then((nb_report) => {
					if (nb_report >= 5)
					{
						db.banUser(req.body.report_id);
						if (usersWs[req.body.report_id])
							usersWs[req.body.report_id].bannedUser();
					}
				});
			});
		});
		
	}

	////// SWIPE ZONE //////
	// Request to get user profile on page "Swipe zone"
	static get_swipe_user(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.body.distance || !req.body.range_age || !req.body.interests || req.body.fame === undefined)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.distance !== 'number' || !Array.isArray(req.body.range_age)
			|| typeof req.body.range_age[0] !== 'number' || typeof req.body.range_age[0] !== 'number'
			|| !Array.isArray(req.body.interests) || typeof req.body.fame !== 'number')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		if (req.body.range_age[0] < 18 || req.body.range_age[0] > 100 || req.body.range_age[1] < 18 || req.body.range_age[1] > 100)
			return (res.send(JSON.stringify({error: "Invalid age range"})));
		if (req.body.range_age[0] > req.body.range_age[1])
			return (res.send(JSON.stringify({error: "Invalid age range"})));
		if (req.body.distance < 0 || req.body.distance > 100)
			return (res.send(JSON.stringify({error: "Invalid distance"})));
		if (req.body.interests.length > 5)
			return (res.send(JSON.stringify({error: "Invalid interests"})));
		if (req.body.fame < 0 || req.body.fame > 100)
			return (res.send(JSON.stringify({error: "Invalid fame"})));		
		db.getNeverSeenUser(req.session.info.id, req.body).then((ret) => {res.send(ret)});
	}

	// Request when user swipe left or right
	// {liked: boolean}
	static react_to_user(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (req.body.liked === undefined)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.liked !== 'boolean')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		db.reactToUser(req.session.info.id, req.body.liked).then((ret) => {res.send(ret)});
	}

	////// CHAT ZONE //////
	// Request to get chat list (user list with their last message)
	static get_chat_list(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.getChatList(req.session.info.id).then((ret) => {res.send(ret)});
	}

	// Request to get chat with a specific user
	static get_chat(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (req.body.id === undefined)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.id !== 'number')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		db.getChat(req.session.info.id, req.body.id).then((ret) => {res.send(ret)});
	}

	////// NOTIFICATIONS //////
	static get_notifications(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.getNotifications(req.session.info.id).then((ret) => {res.send(ret)});
	}

	////// SETTINGS //////
	static change_info(req, res, db)
	{
		const	authorizedCharsNickname = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
		const	authorizedCharsNames = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ- ";

		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.body.first_name || !req.body.last_name || !req.body.nickname || !req.body.date_of_birth || !req.body.location || !req.body.mail)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.first_name != 'string' || typeof req.body.last_name != 'string'
			|| typeof req.body.nickname != 'string' || typeof req.body.date_of_birth != 'string'
			|| typeof req.body.password != 'string' || typeof req.body.mail != 'string' ||(typeof req.body.location != 'object'
			&& typeof req.body.location.lon == 'number' && typeof req.body.location.lat == 'number'))
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		if (req.body.date_of_birth.length !== 10 || req.body.date_of_birth[4] !== '-' || req.body.date_of_birth[7] !== '-' ||
			isNaN(parseInt(req.body.date_of_birth.substr(0, 4))) || isNaN(parseInt(req.body.date_of_birth.substr(5, 2))) ||
			isNaN(parseInt(req.body.date_of_birth.substr(8, 2)))
		)
			return (res.send(JSON.stringify({error: "Invalid date of birth"})));
		if (req.body.first_name.length < 2 || req.body.first_name.length > 50)
			return (res.send(JSON.stringify({error: "First name must be between 2 and 50 characters"})));
		if (req.body.last_name.length < 2 || req.body.last_name.length > 50)
			return (res.send(JSON.stringify({error: "Last name must be between 2 and 50 characters"})));
		if (req.body.first_name.split('').some((c) => !authorizedCharsNames.includes(c)))
			return (res.send(JSON.stringify({error: "First name contains unauthorized characters"})));
		if (req.body.last_name.split('').some((c) => !authorizedCharsNames.includes(c)))
			return (res.send(JSON.stringify({error: "Last name contains unauthorized characters"})));
		if (req.body.password.length > 0 && isPasswordStrong(req.body.password) === false)
			return (res.send(JSON.stringify({error: "Password must be between 8 and 50 characters and contain at least one uppercase, one lowercase, one number and one special character"})));
		if (req.body.nickname.length < 2 || req.body.nickname.length > 50)
			return (res.send(JSON.stringify({error: "Nickname must be between 2 and 50 characters"})));
		if (req.body.nickname.split('').some((c) => !authorizedCharsNickname.includes(c)))
			return (res.send(JSON.stringify({error: "Nickname contains unauthorized characters"})));
		if (req.body.location.lat < -90 || req.body.location.lat > 90 || req.body.location.lon < -180 || req.body.location.lon > 180)
			return (res.send(JSON.stringify({error: "Invalid location"})));
		if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.mail)))
			return (res.send(JSON.stringify({error: "Invalid mail"})))
		db.changeMailConfirm(req.session.info.id, req.body.mail);
		db.changeInfo(req.session.info.id, req.body);
		res.send(JSON.stringify({success: "Info changed"}));
	}

	static confirm_change_mail(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.body.password || !req.body.code)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.password !== 'string' || typeof req.body.code !== 'string')
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		if (req.body.code.length !== 4)
			return (res.send(JSON.stringify({error: "Code must be 4 numbers"})));
		const resCode = checkIfCodeIsValidChangeMail(req.body.code, req.session.info.id);
		if (resCode.valid)
		{
			db.isCorrectPassword(req.session.info.id, req.body.password).then((correct) => {
				if (correct)
				{
					db.changeMail(req.session.info.id, resCode.mail, req.body.password);
					res.send(JSON.stringify({success: "Mail changed"}));
				}
				else
					res.send(JSON.stringify({error: "Password invalid"}));
			});
		}
		else
			res.send(JSON.stringify({error: "Code invalid"}));
	}

	static get_info(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.getInfo(req.session.info.id).then((data) => res.send(data));
	}

	static get_all_locations(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.getAllLocations(req.session.info.id).then((data) => res.send(data));
	}

	////// PROFILE //////
	static get_self_info(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		db.getSelfInfo(req.session.info.id).then((data) => res.send(data));
	}

	static update_profile(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (req.body.bio == undefined || !req.body.tags)
			return (res.send(JSON.stringify({error: missing})));
		if (typeof req.body.bio !== 'string' || !Array.isArray(req.body.tags))
			return (res.send(JSON.stringify({error: "Invalid parameters"})));
		if (req.body.bio.length < 10 || req.body.bio.length > 500)
			return (res.send(JSON.stringify({error: "Bio must be between 10 and 500 characters"})));
		if (req.body.tags.length < 1 || req.body.tags.length > 5)
			return (res.send(JSON.stringify({error: "Tags must be between 1 and 5"})));
		req.body.tags.forEach((tag) => {
			if (typeof tag !== 'number')
				return (res.send(JSON.stringify({error: "Invalid parameters"})));
		});
		db.updateProfile(req.session.info.id, req.body.bio, req.body.tags).then((data) => res.send(data));
	}

	////// AUTH42 //////
	static auth42(req, res, db)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.query.code)
			return (res.send(JSON.stringify({error: missing})));
		db.auth42(req.query.code).then((data) => {
			if (data.error)
				return (res.send(data));
			req.session.info = {logged: true, id: data.id};
			res.send(JSON.stringify({success: "Connected", 'info': 'Ce mode de connexion n\'est pas encore disponible en navigation privée'}));
		});
	}

	static link42(req, res, db)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		if (!req.query.code)
			return (res.send(JSON.stringify({error: missing})));
		db.link42(req.session.info.id, req.query.code).then((data) => res.send(data));
	}
}

module.exports = PostRequest;