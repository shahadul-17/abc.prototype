import { Utility } from ".";

const TIMEOUT = 250;        // in milliseconds...

class CSVSerializer {

    /**
     * Initializes CSVSerializer with provided csv file.
     * @param {Blob} csvFile CSV file that needs to be read.
     */
    constructor(csvFile) {
        this._status = "NONE";
        this._csvFile = csvFile;
        this._csvData = {};

        this.fileReader = new FileReader();
        this.fileReader.addEventListener("loadstart", this.onFileLoadStarted.bind(this));
        this.fileReader.addEventListener("abort", this.onFileLoadAborted.bind(this));
        this.fileReader.addEventListener("load", this.onFileLoaded.bind(this));
        this.fileReader.addEventListener("error", this.onFileLoadError.bind(this));
    }

    /**
     * Asynchronously reads the CSV file.
     * @returns {Object} Returns deserialized CSV data.
     */
    async readAsync() {
        // reads file as text...
        this.fileReader.readAsText(this._csvFile);

        // waiting till data is read...
        while (this._status === "NONE" || this._status === "LOADING") {
            await Utility.sleepAsync(TIMEOUT);
        }

        return this._csvData;
    }

    onFileLoaded(event) {
        const csvText = this.fileReader.result;

        // deserializing CSV...
        this._csvData = CSVSerializer.deserializeCSV(csvText);
        // changing status to 'LOADED'...
        this._status = "LOADED";
    }

    onFileLoadStarted(event) { this._status = "LOADING"; }
    onFileLoadAborted(event) { this._status = "ABORTED"; }
    onFileLoadError(event) { this._status = "ERROR"; }

    /**
     * Deserializes textual CSV data into a list/array. Each
     * index of list contains data from individual lines.
     * @param {String} text Text data containing comma separated values.
     * @returns {Object} Returns an parsed CSV data.
     */
    static deserializeCSV(text) {
        // to get all the lines, we need to split the
        // entire text on new-line ('\n') character...
        const lines = Utility.sanitizeStringArray(text.split("\n"));
        let columnTitles = [];
        const csvData = [];

        for (let i = 0; i < lines.length; i++) {
            // we separate the columns of a row/line
            // by splitting that on comma...
            const columns = Utility.sanitizeStringArray(lines[i].split(","));

            if (i === 0) {
                // the columns of first line (i == 0)
                // contains titles...
                columnTitles = columns;

                continue;
            }

            const rowData = {};         // contains data of a single row...

            for (let j = 0; j < columns.length; j++) {
                // checking if column title is available.
                // if not, we place [<row>, <column>] as the title... 
                const columnTitle = columnTitles[j] ?? `[${i + 1}][${j + 1}]`;

                if (columns[j] === "true" || columns[j] === "false") {
                    // if value is "true" or "false", we convert that to boolean type...
                    columns[j] = columns[j] === "true";
                } else if (typeof(columns[j]) === "string" && !isNaN(columns[j])) {
                    // if value is a number (either integer or floating point),
                    // we convert that to number type...
                    columns[j] = Number(columns[j]);
                }

                rowData[columnTitle] = columns[j];
            }

            csvData.push(rowData);
        }

        return csvData;
    }
}

export { CSVSerializer };
