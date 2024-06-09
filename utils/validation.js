```
Validation Functions:
Used by various services to ensure data is as expected
```
const { ValidationError } = require('../utils/error.js');

module.exports.validateAgainstModel = function (obj, model) {
    return new Promise((resolve, reject) => {
        if (obj && model) {
            for (const key in model.schema.paths) {
                if (model.schema.paths[key].isRequired && !obj[key]) {
                    return reject(new ValidationError('Missing required field: ' + key));
                }
            }
            return resolve();
        } else {
        return reject(new ValidationError('Object not defined.'));
        }
    });
}

module.exports.extractValidFields = function (obj, model) {
    const returnObj = {};
    for (const key in obj) {
        if (model.schema.paths[key]) {
            returnObj[key] = obj[key];
        }
    }
    return returnObj;
}
