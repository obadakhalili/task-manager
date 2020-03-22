async function sendRequest(url, method, body, headers) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    if (headers) {
        Object.assign(options.headers, headers);
    }
    const response = await fetch(url, options);
    return response.json();
}