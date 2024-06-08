exports.validateAgainstModel = function (obj, model) {
    return new Promise((resolve, reject) => {
        if (obj && model) {
            for (const key in model.schema.paths) {
                if (model.schema.paths[key].isRequired && !obj[key]) {
                reject({ error: 'Missing required field: ' + key });
                }
            }
            resolve();
        } else {
        reject({ error: 'Invalid arguments' });
        }
    });
}

