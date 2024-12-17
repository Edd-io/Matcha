/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PostRequest.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:02:40 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/17 16:28:52 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('./Debug');
const {sendVerificationMail, checkIfCodeIsValid} = require('./utils/verificationMail');

const missing = "Missing parameters";

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
	static confirm_register(req, res)
	{
		Debug.log(req);
		if (!req.body.token || !req.body.code)
			return (res.send(JSON.stringify({error: missing})));
		if (checkIfCodeIsValid(req.body.token, req.body.code).valid)
			res.send(JSON.stringify({success: "Mail confirmed"}));
		else
			res.send(JSON.stringify({error: "Code invalid"}));
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