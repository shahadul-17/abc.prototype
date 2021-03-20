const setCSVData = (csvData = []) => {
    return {
        type: "CSV_DATA",
        payload: csvData
    };
};

export { setCSVData };
