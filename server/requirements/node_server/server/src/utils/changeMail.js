/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   changeMail.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/05 15:31:56 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/05 18:19:23 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const sendMail = require('./mailer');

const	template = `
	<h1>Matcha</h1>
	<p>Il semblerait que vous ayez demandé à changer votre adresse mail.</p>
	<p>Pour confirmer votre adresse mail, veuillez écrire le code suivant dans le champ prévu à cet effet :</p>
	<p>{{code}}</p>
	<p>Le code est valable 10 minutes.</p>
	<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
	<p>L'équipe Matcha</p>
`;

const	templateAlreadyUsed = `
	<h1>Matcha</h1>
	<p>Il semblerait que vous ayez demandé à changer votre adresse mail mais ce mail a déjà été utilisé.</p>
	<p>Si vous êtes à l'origine de cette demande, veuillez actualiser la page Matcha et recommencer la procédure avec une autre adresse mail.</p>
	<p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce mail.</p>
	<p>L'équipe Matcha</p>
`;

let		listMailToConfirm = [];
let		interval;


function sendChangeMail(mail, alreadyUsed, user_id)
{
	const	numbers = '0123456789';
	let		message = '';
	let		code = '';
	let		object;

	for (let i = 0; i < 4; i++)
		code += numbers[Math.floor(Math.random() * numbers.length)];
	if (alreadyUsed)
	{
		object = 'Oups... Problème';
		message = templateAlreadyUsed;
	}
	else
	{
		object = 'Changement d\'adresse mail';
		message = template.replace('{{code}}', code);
	}
	return (new Promise((resolve, reject) => {
		sendMail(mail, object, '', message).then(() => {
			if (!alreadyUsed)
			{
				if (listMailToConfirm.find(e => e.user_id === user_id))
					listMailToConfirm.pop(listMailToConfirm.findIndex(e => e.mail === mail));
				listMailToConfirm.push({mail, date: Date.now() + 600000, code, user_id});
			}
			if (!interval)
				interval = setInterval(checkCode, 2000);
			resolve();
		}).catch(() => {
			reject();
		});
	}));
}

function checkIfCodeIsValidChangeMail(code, user_id)
{
	for (let i = listMailToConfirm.length - 1; i >= 0; i--)
	{
		if (listMailToConfirm[i].user_id === user_id && listMailToConfirm[i].code === code)
		{
			const mail = listMailToConfirm[i].mail;
			return ({valid: true, mail});
		}
	}
	return ({valid: false});
}

function checkCode()
{
	const	now = Date.now();
	let		i;

	i = listMailToConfirm.length - 1;
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

module.exports = {sendChangeMail, checkIfCodeIsValidChangeMail};
