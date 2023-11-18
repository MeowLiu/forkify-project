import { TIMEOUT_SECOND } from "./config.js";

const timeout = (seconds) => {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(
				new Error(
					`Request took too long! Timeout after ${seconds} second`
				)
			);
		}, seconds * 1000);
	});
};

const getRquestData = async function (url) {
	try {
		const fecthPro = fetch(url);
		// const res = await fetch(url);
		const res = await Promise.race([fecthPro, timeout(TIMEOUT_SECOND)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} ${res.status}`);

		return data;
	} catch (err) {
		throw err;
	}
};

export { getRquestData };
