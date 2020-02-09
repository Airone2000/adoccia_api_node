const mongoose = require('mongoose');

class Validator {

    async validate(data, constraints) {
      return new Promise(async (resolve, reject) => {

        let attrsViolations = [];
        const attrsToValidate = Object.keys(constraints);
        
        await Promise.all(attrsToValidate.map(async (attrToValidate) => {
            let attrViolations = await this.validateAttribute(attrToValidate, data[attrToValidate], constraints[attrToValidate]);
            if (attrViolations.violations.length > 0) attrsViolations.push(attrViolations);
        }));

        resolve(attrsViolations);
      });
    }

    async validateAttribute(attribute, value, constraints) {
        return new Promise(async (resolve, reject) => {
            let violations = [];
            let validators = Object.keys(constraints);
            
            await Promise.all(validators.map(async (validator) => {
                let verdict = await this[validator + 'ValidatorRespected'](attribute, value, constraints[validator]);
                if (verdict === false) violations.push(validator);
            }));

            resolve({
                attribute, value, violations
            });
        });
    }

    requiredValidatorRespected(attribute, data, requiredForm) {
        const type = typeof data; // number, string ....
        switch (requiredForm) {
            case 'notBlank':
                if (type === 'undefined' || data === null) return false;
                let stringifiedData = data + '';
                stringifiedData = stringifiedData.trim();
                if (stringifiedData.length > 0) return true;
                break;
            case 'notNull':
                if (type === 'undefined') return false;
                if (data !== null) return true;
                break;
            case 'notUndefined':
                if (type !== 'undefined') return true;
                break;
        }
        return false;
    }

    async uniqueValidatorRespected(attribute, data, {model: modelName}) {
        return new Promise((resolve, reject) => {
            const model = mongoose.model(modelName);
            const criterias = {}; criterias[attribute] = data;
            model.findOne(criterias, async (err, matchingUser) => {
                resolve(matchingUser === null);
            });
        });
    }

    minLengthValidatorRespected(attribute, data, minLength) {
        let stringifiedData = data + '';
        stringifiedData = stringifiedData.trim();
        if (stringifiedData.length >= minLength) return true;
        return false;
    }


};

module.exports = new Validator();