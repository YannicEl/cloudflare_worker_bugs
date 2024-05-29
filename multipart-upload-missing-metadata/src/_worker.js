export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		switch (`${request.method} ${url.pathname}`) {
			case 'POST /upload': {
				const key = `${Date.now()}`;
				const upload = await env.BUCKET.createMultipartUpload(key, {
					customMetadata: {
						hallo: 'zwallo',
					},
				});

				const uploadPart = await upload.uploadPart(1, request.body);

				const r2Object = await upload.complete([uploadPart]);

				const r2Head = await env.BUCKET.head(key);

				return Response.json({
					multipart: r2Object.customMetadata,
					head: r2Head.customMetadata,
				});
			}

			default: {
				return env.ASSETS.fetch(request);
			}
		}
	},
};
