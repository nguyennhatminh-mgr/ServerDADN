const { v1: uuidv1 } = require('uuid');

const createUniqueId = () => {
    return uuidv1().substr(0,12);
}

module.exports = {
    createUniqueId
}