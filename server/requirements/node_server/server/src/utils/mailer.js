/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mailer.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/17 14:44:48 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/17 15:41:56 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const nodemailer = require("nodemailer");
const credentials = require("../../credentials.json");
const Debug = require("../Debug");

async function sendMail(to, subject, text, html)
{
	const transporter = nodemailer.createTransport({
		host: credentials.host,
		port: credentials.port,
		secure: false,
		auth: {
			user: credentials.mail_id,
			pass: credentials.mail_pass,
		},
	});

	const mailOptions = {
		from: `"Matcha" <${credentials.mail_from}>`,
		to, subject, text, html,
	};

	return (new Promise(async (resolve, reject) => {
		try {
			await transporter.sendMail(mailOptions);
			Debug.simpleLog(`Mail sent to ${to}`);
			resolve();
		} catch (err) {
			Debug.logError(err);
			reject();
		}
	}));
}

module.exports = sendMail;
