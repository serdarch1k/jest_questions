const mysql = require('mysql2/promise')

async function getConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root', // your user name
    password: '', // your password
    database: ''  // your database name
  })
}

exports.get = async function() {
  try {
    const connection = await getConnection()
    /* results: [ { id: 1, content: 'do the homework' } ] */
    const [results, fields] = await connection.query(
      'SELECT * FROM `todo` WHERE `id` = 1'
    )
    await connection.end()

    return results[0].content
  } catch (err) {
    console.error(err)
    throw err
  }
}

// post
// put
// delete
