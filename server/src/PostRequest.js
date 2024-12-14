/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PostRequest.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/14 23:02:40 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/14 23:32:13 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const Debug = require('./Debug');

class PostRequest
{
	// Request to login
	static login(req, res)
	{
		Debug.log(req);
		res.send("Login request");
	}

	// Request to register
	static register(req, res)
	{
		Debug.log(req);
		res.send("Register request");
	}

	// Request to logout
	static logout(req, res)
	{
		Debug.log(req);
		res.send("Logout request");
	}

	// Request to block a user
	static block_user(req, res)
	{
		Debug.log(req);
		res.send("Block user request");
	}

	// Request to report a user
	static report_user(req, res)
	{
		Debug.log(req);
		res.send("Report user request");
	}

	////// SWIPE ZONE //////
	// Request to get user profile on page "Swipe zone"
	static get_swipe_user(req, res)
	{
		Debug.log(req);
		res.send("Get swipe user request");
	}

	// Request when user swipe left or right
	static react_to_user(req, res)
	{
		Debug.log(req);
		res.send("React to user request");
	}

	////// CHAT ZONE //////
	// Request to get chat list (user list with their last message)
	static get_chat_list(req, res)
	{
		Debug.log(req);
		res.send("Get chat list request");
	}

	// Request to get chat with a specific user
	static get_chat(req, res)
	{
		Debug.log(req);
		res.send("Get chat request");
	}

}

module.exports = PostRequest;