/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   isPasswordStrong.js                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/04 20:33:51 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/04 20:42:05 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

function isPasswordStrong(password)
{
	if (password.length < 8)
		return (false);
	if (!/[A-Z]/.test(password))
		return (false);
	if (!/[a-z]/.test(password))
		return (false);
	if (!/[0-9]/.test(password))
		return (false);
	if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
		return (false);
	return (true);
}

module.exports = isPasswordStrong
