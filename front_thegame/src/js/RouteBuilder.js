function clear(url) {
	return url[0] === '/' ? url.slice(1) : url;
}

function get(url) {
	if (process.env.PUBLIC_URL) {
		return process.env.PUBLIC_URL + '/' + clear(url);
	} else {
		return url;
	}
}

export default { get };