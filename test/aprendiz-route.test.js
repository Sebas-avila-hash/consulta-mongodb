const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

test('GET /api/v1/aprendices returns 503 when MongoDB is unavailable', async () => {
  const server = app.listen(0);

  await new Promise((resolve) => server.once('listening', resolve));

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/aprendices`);
    const body = await response.json();

    assert.equal(response.status, 503);
    assert.match(body.error, /MongoDB/i);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
});
