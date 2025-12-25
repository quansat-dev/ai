import fs from 'node:fs';
import path from 'node:path';

import shuffle from 'lodash.shuffle';
import * as v from 'valibot';

import { form, getRequestEvent } from '$app/server';
import CA_DAO from '$data/ca-dao.txt?raw';
import DAP from '$data/dap.txt?raw';
import { VITE_PRIVATE_DATA_PATH } from '$env/static/private';

function segmentTextToHtml(text: string): string {
	const segmenter = new Intl.Segmenter('vi', { granularity: 'word' });
	const data = Array.from(segmenter.segment(text));
	let result = '';
	for (const datum of data) {
		if (datum.segment === 'Ai' || datum.segment === 'ai') {
			result += `<em class="text-ai">${datum.segment}</em>`;
		} else {
			result += datum.segment;
		}
	}
	return result;
}

const cadaos: string[] = CA_DAO.split('---').map((cadao) =>
	segmentTextToHtml(cadao.trim().replace('\n', '<br />')),
);
const daps: string[] = DAP.split('---').map((dap) =>
	segmentTextToHtml(dap.trim().replace('\n', '<br />')),
);

const AiSchema = v.object({
	prompt: v.string(),
});

export const ai = form(AiSchema, async (input) => {
	const { prompt } = input;
	const { getClientAddress } = getRequestEvent();

	// log prompt to single line in file
	if (!fs.existsSync(VITE_PRIVATE_DATA_PATH)) {
		await fs.promises.mkdir(VITE_PRIVATE_DATA_PATH, { recursive: true });
	}
	const filepath = path.join(VITE_PRIVATE_DATA_PATH, 'prompts.log');
	const log = `Date: ${new Date().toISOString()}\nPrompt: ${prompt.replace(/\n/g, ' ')}\nIP: ${getClientAddress()}\n---\n`;
	await fs.promises.appendFile(filepath, log);

	return {
		cadao: shuffle(cadaos)[Math.floor(Math.random() * cadaos.length)],
		dap: shuffle(daps)[Math.floor(Math.random() * daps.length)],
	};
});
