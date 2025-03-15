const fs = require('fs');
const path = require('path');

function base64ToFile(base64String)
{
	const availableMimeTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
	];
	const availableChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const matches = base64String.match(/^data:(.+);base64,(.+)$/);
	let file_name = "".concat(...Array.from({length: 75}, () => availableChars.charAt(Math.floor(Math.random() * availableChars.length))));

	if (!matches || matches.length !== 3)
		throw new Error('Chaîne Base64 invalide');

	const dirPath = path.join(__dirname, '..', '..', 'user_static_data');
	if (!fs.existsSync(dirPath))
		fs.mkdirSync(dirPath, { recursive: true });
	file_name = path.join(__dirname, '..', '..', 'user_static_data', file_name);
	file_name += '.' + matches[1].split('/')[1];
	const mimeType = matches[1];
	if (!availableMimeTypes.includes(mimeType))
		throw new Error('Invalid MIME type');

	const base64Data = matches[2];
	const fileData = Buffer.from(base64Data, 'base64');

	fs.writeFileSync(file_name, fileData);
	console.log(`File registered : ${file_name} (MIME: ${mimeType})`);
	return (file_name);

}

module.exports = base64ToFile;