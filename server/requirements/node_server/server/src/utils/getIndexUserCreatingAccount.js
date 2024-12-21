/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   getIndexUserCreatingAccount.js                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/12/20 09:36:33 by edbernar          #+#    #+#             */
/*   Updated: 2024/12/20 09:40:51 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function getIndexUserCreatingAccount(userCreatingAccount, token)
{
	for (index = 0; index < userCreatingAccount.length; index++)
	{
		if (userCreatingAccount[index].token === token)
			return (index);
	}
	return (-1);
}

module.exports = getIndexUserCreatingAccount;