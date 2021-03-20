class Utility {

    /**
     * Suspends the current thread for the specified amount of time.
     * @param {Number} millisecondsTimeout The number of milliseconds
     * for which the thread is suspended.
     * @returns {Promise} Returns promise to asynchronous task.
     */
    static sleepAsync(millisecondsTimeout) {
        return new Promise(resolve => setTimeout(resolve, millisecondsTimeout));
    }

    /**
     * Prepares query string from provided data.
     * @param {Object} data Data to prepare query string.
     * @returns {String} Returns query string containing data.
     */
    static prepareQueryString(data) {
        if (!data) { return ""; }

        let queryString = "";

        for (const [key, value] of Object.entries(data)) {
            queryString += `${key}=${encodeURIComponent(value)}&`;
        }

        const lastCharacter = queryString[queryString.length - 1];
        // if query string is not empty at this point,
        // the last character must be '&' and we need to remove that...
        lastCharacter && (queryString = queryString.substring(0, queryString.length - 1));

        // prepending question mark ('?')...
        return `?${queryString}`;
    }

    /**
     * Prepares query string from provided data and
     * appends it to the provided url.
     * @param {Object} data Data to prepare query string.
     * @returns {String} Returns url with query string appended.
     */
    static appendQueryString(url, data) {
        return `${url}${Utility.prepareQueryString(data)}`;
    }

    /**
     * Parses query string from the given url.
     * @param {String} url Url of which query string needs to be parsed.
     * @param {Boolean} decode (Optional) If query parameter values shall be decoded. Default value is true.
     * @returns {Object} Returns an object containing query parameters as key value pair.
     */
    static parseQueryString(url, decode = true) {
        if (!url) { return {}; }

        const indexOfQuestionMark = url.indexOf('?');

        if (indexOfQuestionMark === -1) { return {}; }

        const queryString = url.substring(indexOfQuestionMark + 1);
        const queryParameterStrings = queryString.split('&');
        const queryParameters = {};

        for (const queryParameterString of queryParameterStrings) {
            const indexOfEqualSign = queryParameterString.indexOf('=');

            if (indexOfEqualSign === -1) { continue; }

            const key = queryParameterString.substring(0, indexOfEqualSign);
            let value = queryParameterString.substring(indexOfEqualSign + 1);
            decode && (value = decodeURIComponent(value));

            queryParameters[key] = value;
        }

        return queryParameters;
    }

    /**
     * Generates random text of specified length.
     * @param {Number} length Desired length of the random text.
     * @returns {String} Returns random text data.
     */
    static generateRandomText(length) {
        const minimum = 97;
        const maximum = 122;
        const randomNumber = Math.random() * (maximum - minimum) + minimum;
        let randomText = "";

        for (let i = 0; i < length; i++) {
            randomText += String.fromCharCode(randomNumber);
        }

        return randomText;
    }

    /**
     * If the specified string is undefined/null/empty,
     * returns false. Otherwise returns trimmmed string.
     * @param {String} text String that needs to be sanitized.
     * @returns {Boolean|String} Returns false if
     * the specified string is undefined/null/empty.
     * Otherwise returns trimmed version of the string.
     */
    static sanitizeString(text) {
        if (!text) { return false; }

        // text = text.replace("\"", "");          // removes double quotes (usually added by MS Excel on line breaks)...

        text = text.trim();

        if (text.length === 0) { return false; }

        return text;
    }

    /**
     * Removes undefined/null/empty string entries
     * from the specified array.
     * @param {Array<String>} array Array of string
     * that needs to be sanitized.
     * @returns {Array<String>} Returns the sanitized
     * string array.
     */
    static sanitizeStringArray(array) {
        const sanitizedArray = [];

        for (const text of array) {
            const sanitizedText = Utility.sanitizeString(text);

            if (!sanitizedText) { continue; }

            sanitizedArray.push(sanitizedText);
        }

        return sanitizedArray;
    }
}

export { Utility };
