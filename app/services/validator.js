class Validator {

    constructor() {
        this.registerValidators();
    }

    registerValidators() {
        this.validators = {
            'required': this.requiredValueIsPresent
        };
    }

    validate(data, constraints) {

        let violations = [];
        const attributes = Object.keys(constraints);

        attributes.forEach(attribute => {
            let validators = constraints[attribute].split('|');
            let attributeViolations = {attribute, violations: []};

            validators.forEach(validator => {
                if (this.validators[validator]) {
                    let verdict = this.validators[validator](attribute, data);
                    if (verdict === false) {
                        attributeViolations.violations.push(validator);
                    }
                }
            });

            if (attributeViolations.violations.length > 0) {
                violations.push(attributeViolations);
            }
        });
    
        return violations;
    }

    requiredValueIsPresent(attribute, data) {
        return (typeof data[attribute] !== 'undefined')
    }

};

module.exports = new Validator();