const request = require('supertest');
const app = require('./app');

test('GET /todo', async () => {
  const res = await request(app)
    .get('/todo')
    .expect(200);

  expect(res.body).toEqual([
    { id: 1, title: 'Test Todo' },
  ]);
});
