import { json } from '@sveltejs/kit';

import { version } from '$app/environment';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({ version });
};
