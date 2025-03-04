/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   resetPasswordMail.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/04 21:47:16 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/04 22:51:33 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const sendMail = require('./mailer');
const credientials = require('../../credentials.json');

const	template = `
	<h1>Matcha</h1>
	<p>Bonjour,</p>
	<p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Matcha.</p>
	<p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
	<p><a href="{{resetPasswordLink}}">Réinitialiser mon mot de passe</a></p>
	<p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
	<p>{{resetPasswordLink}}</p>
	<p>Ce lien est valable 10 minutes.</p>
	<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
	<p>L'équipe Matcha</p>
`;

let		token_reset_password = [];
let		interval;

function sendResetPasswordMail(mail)
{
	const	chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let		token = '';
	let		link_reset_password = credientials.website_url + '/reset_password_mail?token=';
	let		message = '';

	while (true)
	{
		for (let i = 0; i < 32; i++)
			token += chars[Math.floor(Math.random() * chars.length)];
		if (!token_reset_password.find(e => e.token === token))
			break;
		token = '';
	}
	link_reset_password += token;
	message = template.replace('{{resetPasswordLink}}', link_reset_password);
	message = message.replace('{{resetPasswordLink}}', link_reset_password);
	return (new Promise((resolve, reject) => {
		sendMail(mail, 'Mot de passe oublié ?', '', message).then(() => {
			token_reset_password.push({token, mail, date: Date.now() + 600000});
			if (!interval)
				interval = setInterval(checkToken, 2000);
			resolve(token);
		}).catch(() => {
			reject();
		});
	}));
}

function checkIfTokenIsValid(token)
{
	for (let i = token_reset_password.length - 1; i >= 0; i--)
	{
		if (token_reset_password[i].token === token)
		{
			const mail = token_reset_password[i].mail;
			token_reset_password.pop(i);
			return ({valid: true, mail});
		}
	}
	return ({valid: false});
}

function checkToken()
{
	const	now = Date.now();
	let		i;

	i = token_reset_password.length - 1;
	while (i >= 0)
	{
		if (now > token_reset_password[i].date)
			token_reset_password.pop(i);
		i--;
	}
	if (token_reset_password.length === 0)
	{
		clearInterval(interval);
		interval = null;
	}
}

module.exports = {sendResetPasswordMail, checkIfTokenIsValid};