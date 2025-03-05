/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   resetPasswordMail.js                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/04 21:47:16 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/05 18:24:01 by edbernar         ###   ########.fr       */
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

const template_page = `
	<!DOCTYPE html>
	<html lang="fr">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Réinitialisation du mot de passe</title>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,500;1,500&display=swap" rel="stylesheet">
	</head>
	<body style="height: 100%; margin: 0; padding: 0; font-family: 'Red Hat Display'; width: 100%;">
		<div style="background: linear-gradient(-45deg, #1CE346 0%, #158B2E 100%); width: 100vw; height: 100vh;"></div>
		<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2); padding: 30px; border-radius: 30px; background-color: white; display: flex; align-items: center; justify-content: center; flex-direction: column; height: 45%;">
			<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc0IiBoZWlnaHQ9IjE3NCIgdmlld0JveD0iMCAwIDE3NCAxNzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01Mi4zMzYgMzEuNjA1NUMzOC42MDYzIDM0LjY2NDEgMjguMjc1IDQ0Ljc5MTQgMjQuNzQwNyA1OC41ODkxQzIyLjU2NTcgNjcuMDE3MiAyNC4zMzI4IDc3Ljc1NjMgMjkuMjI2NiA4NS44NDQ1QzMyLjI4NTIgOTEuMDEwMiA4NC4wNzc0IDE0Mi44MDIgODIuNjUgMTM5LjMzNkM4MS4wMTg4IDEzNS4zMjYgNzkuNTIzNSAxMjUuOTQ2IDc5LjUyMzUgMTE5LjY5M0M3OS41MjM1IDk0LjY4MDUgOTIuODQ1MyA3NC40OTM4IDExMS42MDUgNzEuMDk1M0wxMTQuMTg4IDcwLjYxOTVMMTEwLjcyMSA3NC4wODU5QzEwNi45ODMgNzcuODI0MiAxMDMuMzEzIDg0Ljc1NyAxMDEuNjEzIDkxLjM1QzEwMC4xMTggOTcuMzk5MiA5OS41NzQyIDEwNi45ODMgMTAwLjU5NCAxMTEuODA5QzEwMS41NDUgMTE2LjQ5OCAxMDUuMjE2IDEyNi40MjIgMTA1Ljk2MyAxMjYuNDIyQzEwNi4yMzUgMTI2LjQyMiAxMTQuODY3IDExNy45MjYgMTI1LjEzIDEwNy41MjdDMTM5LjY3NiA5Mi44NDUzIDE0NC4yMyA4Ny44MTU2IDE0NS45MjkgODQuNjIxMUMxNTMuNjA5IDY5LjkzOTggMTUxLjIzIDUyLjY3NTggMTM5Ljk0OCA0MS4zOTNDMTI2LjI4NiAyNy42NjMzIDEwNC45NDQgMjcuMTE5NSA5MC4yNjI1IDQwLjAzMzZMODcuMDY4IDQyLjg4ODNMODMuNDY1NiAzOS45NjU2QzgxLjQ5NDYgMzguMzM0NCA3OC43NzU4IDM2LjM2MzMgNzcuNDg0NCAzNS41NDc3QzcwLjk1OTQgMzEuNTM3NSA2MC4xNTI0IDI5LjgzODMgNTIuMzM2IDMxLjYwNTVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="logo" style="width: 100px; height: 100px; filter: invert(95%);">
			<h1 style="font-weight: 900;">MATCHA</h1>
			<p>Voici votre nouveau mot de passe :</p>
			<h1 style="color: green;">{{newPassword}}</h1>
			<p>Vous pouvez vous connecter avec ce mot de passe et le modifier dans les paramètres de votre compte.</p>
		</div>
	</body>
	</html>
`

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
			resolve();
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

module.exports = {sendResetPasswordMail, checkIfTokenIsValid, template_page};