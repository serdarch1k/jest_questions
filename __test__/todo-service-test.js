const todoService = require('./todo-service');
const db = require('./db');

jest.mock('./db');

test('get function', async () => {
  db.get.mockResolvedValue({ id: 1, title: 'Test Todo' });

  const todo = await todoService.get(1);

  expect(todo).toEqual({ id: 1, title: 'Test Todo' });
  expect(db.get).toHaveBeenCalledWith(1);
});
