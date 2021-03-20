class ValidationError extends Error {

    /**
     * Creates instance of ValidationError using
     * a property name and an error message'.
     * @param {String} propertyName Name of the property
     * that couldn't be validated.
     * @param {String} message Error message.
     */
    constructor(propertyName, message) {
        super(message)

        this.propertyName = propertyName;
    }
}

export { ValidationError };
