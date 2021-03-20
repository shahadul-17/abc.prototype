import { combineReducers } from 'redux';
import { csvData } from './CSVData';

const reducers = combineReducers({
    csvData: csvData
});

export default reducers;
