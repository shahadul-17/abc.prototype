import React from "react";
import { CSVSerializer } from "../../common";

import styles from "./CSVFile.module.css";

const DEFAULT_LABEL = "Choose a CSV file";

class CSVFile extends React.Component {

    constructor(props) {
        super(props);

        this.inputFile = null;
        this.state = {
            label: DEFAULT_LABEL
        };
    }

    openFileSelectionDialog(event) {
        // this opens file selection dialog...
        this.inputFile.click();
    }

    async onFileChangedAsync(event) {
        const selectedFiles = event.target.files;

        // handles the scenario when no file is selected...
        if (selectedFiles.length === 0) {
            // if event listener callback is available,
            // we call the callback function...
            this.props.onFileChange && this.props.onFileChange(event, []);

            this.setState({ label: DEFAULT_LABEL });

            return;
        }

        const selectedFile = selectedFiles[0];
        const csvSerializer = new CSVSerializer(selectedFile);
        const csvData = await csvSerializer.readAsync();

        // if event listener callback is available,
        // we call the callback function...
        this.props.onFileChange && this.props.onFileChange(event, csvData);

        this.setState({ label: selectedFile.name });
    }

    render() {
        return (
            <div id={this.props.id} className={styles.container}
                    onClick={this.openFileSelectionDialog.bind(this)}>
                <label>{this.state.label}</label>
                <input type="file" className="hidden" accept=".csv"
                    ref={inputFile => { this.inputFile = inputFile; }}
                    onChange={this.onFileChangedAsync.bind(this)} />
            </div>
        );
    }
}

export default CSVFile;
