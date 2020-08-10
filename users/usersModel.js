
const db = require('../data/db-config');

module.exports = {
    add,
    find, 
    findBy,
    findById,
    isValid
}

function find() {
    return db('users').select('id', 'username', 'department').orderBy('id');
}

function findBy(filter) {
    return db('users').where(filter).orderBy('id');
}

function findById(id) {
    return db('users').where({id}).first();
}

async function add(user) {
    try {
        const [id] = await db('users').insert(user, 'id');

        return findById(id)
    } catch (err) {
        throw err
    }
}

function isValid(user) {
    return Boolean(user.username && user.password && typeof user.password === 'string');
}