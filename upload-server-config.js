const PORT = 4001;
const ROUTE = '/upload';

const url = () => `http://localhost:${PORT}${ROUTE}`;

module.exports = { url, PORT, ROUTE };
