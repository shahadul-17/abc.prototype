const DEFAULT_ACTION = {
    type: "",
    payload: {}
};

const csvData = (state = [], action = DEFAULT_ACTION) => {
    switch (action.type) {
        case "CSV_DATA":
            return action.payload;
        default:
            return state;
    }
};

export { csvData };
