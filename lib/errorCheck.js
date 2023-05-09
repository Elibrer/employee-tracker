const errorCheck = (array, key, value) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return true;
      }
    }
    return false;
}

module.exports = errorCheck;