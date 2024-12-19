/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PostRequest.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:02:40 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/19 21:30:58 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('./Debug');
const {sendVerificationMail, checkIfCodeIsValid} = require('./utils/verificationMail');

const	missing = "Missing parameters";
let		userCreatingAccount = [];

class PostRequest
{
	// Request to login
	static login(req, res)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		res.send("Login request");
	}

	// Request to register
	// {email: string}
	static register(req, res)
	{
		Debug.log(req);
		if (req.session.info && req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are already logged in"})));
		if (!req.body.email)
			return (res.send(JSON.stringify({error: missing})));
		sendVerificationMail(req.body.email).then((token) => {
			res.send(JSON.stringify({success: "Mail sent", token}));
		}).catch(() => {
			res.send(JSON.stringify({error: "Error sending mail"}));
		});
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
		if (req.body.password.length < 8 || req.body.password.length > 50)
			return (res.send(JSON.stringify({error: "Password must be between 8 and 50 characters"})));
		if (req.body.nickname.length < 2 || req.body.nickname.length > 50)
			return (res.send(JSON.stringify({error: "Nickname must be between 2 and 50 characters"})));
		if (req.body.nickname.split('').some((c) => !authorizedCharsNickname.includes(c)))
			return (res.send(JSON.stringify({error: "Nickname contains unauthorized characters"})));

		for (index = 0; index < userCreatingAccount.length; index++)
		{
			if (userCreatingAccount[index].token === req.body.token)
				break;
		}
		if (index === userCreatingAccount.length)
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

		for (index = 0; index < userCreatingAccount.length; index++)
		{
			if (userCreatingAccount[index].token === req.body.token)
				break;
		}
		if (index === userCreatingAccount.length)
			return (res.send(JSON.stringify({error: "Invalid token"})));

		userCreatingAccount[index].date_of_birth = req.body.date_of_birth;
		userCreatingAccount[index].sexe = req.body.sexe;
		userCreatingAccount[index].orientation = req.body.orientation;
		userCreatingAccount[index].bio = req.body.bio;
		userCreatingAccount[index].tags = req.body.tags;
		res.send(JSON.stringify({success: "Second step register request"}));
	}

	// Request to add picture to register
	static add_picture_register(req, res)
	{
		if (!req.file)
			return (res.send(JSON.stringify({error: "No image sent"})));
		console.log('File received:', req.file);
		res.send(JSON.stringify({success: "Image added"}));
	}

	// Request to delete picture to register
	static delete_picture_register(req, res)
	{

	}

	// Request to finish register
	// {token: string}
	// need to be tested
	static finish_register(req, res, db)
	{
		let	index;

		Debug.log(req);
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
		userCreatingAccount.pop(index);
		res.send(JSON.stringify({success: "Account created"}));
	}

	// Request to logout
	static logout(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Logout request");
	}

	// Request to block a user
	static block_user(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Block user request");
	}

	// Request to report a user
	static report_user(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Report user request");
	}

	////// SWIPE ZONE //////
	// Request to get user profile on page "Swipe zone"
	static get_swipe_user(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Get swipe user request");
	}

	// Request when user swipe left or right
	static react_to_user(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("React to user request");
	}

	////// CHAT ZONE //////
	// Request to get chat list (user list with their last message)
	static get_chat_list(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Get chat list request");
	}

	// Request to get chat with a specific user
	static get_chat(req, res)
	{
		Debug.log(req);
		if (!req.session.info || !req.session.info.logged)
			return (res.send(JSON.stringify({error: "You are not logged in"})));
		res.send("Get chat request");
	}

}

module.exports = PostRequest;