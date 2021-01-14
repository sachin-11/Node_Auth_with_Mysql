// DECODE IMAGE
async function decodeBase64Data (dataString) {
	try {
		 var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

		 var response = {};

		 if (matches.length !== 3) {
			  return new Error('Invalid input string');
		 }

		 response.type = matches[1];
		 response.data = new Buffer.from(matches[2], 'base64');

		 return response;

	} catch (e) {
		 // Log Errors
		 throw Error('Error while decoding worker' + e)
	}
}
// UPLOAD IMAGE
async function uploadImage(data) {
	try {
		 
		 var imageTypeRegularExpression = /\/(.*?)$/;
		 // var fileName =data.userId + '_' + timestamp + '.' + type;
		 var base64Data = data.image;
		 var dataBuffer = await decodeBase64Data(base64Data);
		 var timestamp = Date.now();
		 var userUploadedFeedMessagesLocation = data.uploadPath;
		 var uniqueRandomfileName = data.userId + '_' + timestamp;
		 var imageTypeDetected = dataBuffer
			  .type
			  .match(imageTypeRegularExpression);

		 var userUploadedFilePath = userUploadedFeedMessagesLocation +
			  uniqueRandomfileName +
			  '.' +
			  imageTypeDetected[1];
		console.log("path",userUploadedFilePath);
		 try {
			  require('fs').writeFile(userUploadedFilePath, dataBuffer.data,
					function (err, res) {
						 if (err) {
							  console.log(err);
						 }
					});
		 }
		 catch (error) {
			  return error;
		 }
		 return  uniqueRandomfileName +
		 '.' +
		 imageTypeDetected[1];
	} catch (err) {
		 return err;
	}
}

module.exports = {
	uploadImage
}