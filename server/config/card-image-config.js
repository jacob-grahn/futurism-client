module.exports = {
	variants: {
		cardImage: {
			resize: {
				small: "65x45",
				medium: "130x90",
				large: "260x180"
			},
			keepNames: true
		}
	},

	storage: {
		S3: {
			key: process.env.S3_KEY,
			secret: process.env.S3_SECRET_KEY,
			bucket: 'futurism-' + process.env.NODE_ENV,
			storageClass: 'REDUCED_REDUNDANCY'
		},
		uploadDirectory: 'images/cards/'
	},

	debug: true
};