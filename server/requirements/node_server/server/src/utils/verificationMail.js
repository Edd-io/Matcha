/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   verificationMail.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/17 15:13:19 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/17 16:25:43 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const sendMail = require('./mailer');

const	template = `
	<h1>Matcha</h1>
	<p>Merci de vous être inscrit sur Matcha !</p>
	<p>Pour confirmer votre adresse mail, veuillez écrire le code suivant dans le champ prévu à cet effet :</p>
	<p>{{code}}</p>
	<p>Le code est valable 10 minutes.</p>
	<p>Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer ce mail.</p>
`;

let		listMailToConfirm = [];
let		interval;


function sendVerificationMail(mail)
{
	const	chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const	numbers = '0123456789';
	let		token = '';
	let		code;

	for (let i = 0; i < 32; i++)
		token += chars[Math.floor(Math.random() * chars.length)];
	code = '';
	for (let i = 0; i < 4; i++)
		code += numbers[Math.floor(Math.random() * numbers.length)];
	message = template.replace('{{code}}', code);
	return (new Promise((resolve, reject) => {
		sendMail(mail, 'Confirmation de votre adresse mail', '', message).then(() => {
			listMailToConfirm.push({mail, token, code, date: Date.now() + 600000});
			if (!interval)
				interval = setInterval(checkCode, 2000);
			resolve(token);
		}).catch(() => {
			reject();
		});
	}));
}

function checkIfCodeIsValid(token, code)
{
	for (let i = listMailToConfirm.length - 1; i >= 0; i--)
	{
		if (listMailToConfirm[i].token === token && listMailToConfirm[i].code === code)
		{
			const mail = listMailToConfirm[i].mail;
			listMailToConfirm.pop(i);
			return ({valid: true, mail});
		}
	}
	return ({valid: false});
}

function checkCode()
{
	const	now = Date.now();
	let		i;

	while (i >= 0)
	{
		if (now > listMailToConfirm[i].date)
			listMailToConfirm.pop(i);
		i--;
	}
	if (listMailToConfirm.length === 0)
	{
		clearInterval(interval);
		interval = null;
	}
}

module.exports = {sendVerificationMail, checkIfCodeIsValid};