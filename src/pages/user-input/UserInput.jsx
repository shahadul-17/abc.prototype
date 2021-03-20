import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import CSVFile from "../../components/csv-file";
import ImageButton from "../../components/image-button";

import { setCSVData } from "../../redux/actions";
import { Utility, ValidationError } from "../../common";

import styles from "./UserInput.module.css";

import logo from "../../resources/icons/logo.svg";
import next from "../../resources/icons/next.svg";

const DEFAULT_PROJECT_INFORMATION = {
    name: "",
    description: "",
    client: "",
    contractor: ""
}

const DEFAULT_XYZ_RANGE = {
    minimumX: -1,
    maximumX: 0,
    minimumY: -1,
    maximumY: 0,
    minimumZ: -1,
    maximumZ: 0
};

class UserInput extends React.Component {

    constructor(props) {
        super(props);

        // references to form elements...
        this.minimumX = null;
        this.minimumY = null;
        this.minimumZ = null;

        this.state = {
            step: 0,
            csvData: [],
            projectInformation: DEFAULT_PROJECT_INFORMATION,
            xyzRange: DEFAULT_XYZ_RANGE
        };
    }

    getCurrentStep(queryParameters) {
        if (queryParameters.step) {
            let step = queryParameters.step ?? 0;
            !isNaN(step) && (step = Number(step));

            return step;
        }

        return 0;
    }

    getProjectInformation(queryParameters) {
        const projectInformation = DEFAULT_PROJECT_INFORMATION;
        queryParameters.name && (projectInformation.name = queryParameters.name);
        queryParameters.description && (projectInformation.description = queryParameters.description);
        queryParameters.client && (projectInformation.client = queryParameters.client);
        queryParameters.contractor && (projectInformation.contractor = queryParameters.contractor);

        return projectInformation;
    }

    loadDataFromQueryParameters() {
        const queryParameters = Utility.parseQueryString(window.location.href);
        let step = this.getCurrentStep(queryParameters);
        const projectInformation = this.getProjectInformation(queryParameters);
        const { name, description, client, contractor } = projectInformation;

        // if any of the values is empty, we set step to zero...
        if (name === "" || description === "" ||
                client === "" || contractor === "") {
            step = 0;
        }

        return {
            step: step,
            projectInformation: projectInformation
        };
    }

    componentDidMount() {
        const data = this.loadDataFromQueryParameters();

        this.setState(data);
    }

    /**
     * Clears any previously set custom
     * validation error messages.
     */
    clearCustomValidationErrors() {
        this.minimumX?.setCustomValidity("");
        this.minimumY?.setCustomValidity("");
        this.minimumZ?.setCustomValidity("");
    }

    /**
     * Checks if the ranges of X, Y and Z is valid.
     * @param {Object} xyzRange Object containing minimum
     * and maximum values of X, Y and Z.
     * @throws {ValidationError} ValidationError is thrown if
     * minimum value is greater than or equal to maximum value.
     */
    validateXYZRange(xyzRange) {
        const {
            minimumX, maximumX,
            minimumY, maximumY,
            minimumZ, maximumZ
        } = xyzRange;

        if (Number(maximumX) <= Number(minimumX)) { throw new ValidationError("minimumX", "Minimum value must be less than the maximum value."); }
        else if (Number(maximumY) <= Number(minimumY)) { throw new ValidationError("minimumY", "Minimum value must be less than the maximum value."); }
        else if (Number(maximumZ) <= Number(minimumZ)) { throw new ValidationError("minimumZ", "Minimum value must be less than the maximum value."); }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        // clears previously set validation error messages...
        this.clearCustomValidationErrors();

        try {
            // checks if range values are valid...
            this.validateXYZRange(this.state.xyzRange);            
        } catch (error) {
            // calls form validation...
            this[error.propertyName]?.setCustomValidity(error.message);
        }

        const data = this.loadDataFromQueryParameters();

        if (data.step === this.state.step) { return null; }

        return data;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setState(snapshot);
    }

    onFormSubmitted(event) {
        event.preventDefault();

        let queryString = "";

        // proceeds to second step... 
        if (this.state.step === 0) {
            queryString = Utility.prepareQueryString({
                ...this.state.projectInformation,
                step: 1
            });

            this.props.history.push(`/${queryString}`);

            return;
        }

        // proceeds to results page...
        queryString = Utility.prepareQueryString({
            ...this.state.projectInformation,
            ...this.state.xyzRange
        });

        // setting CSV data to redux store. this
        // is required by graph...
        this.props.setCSVData(this.state.csvData);
        this.props.history.push(`/result${queryString}`);
    }

    /**
     * Finds minimum and maximum values of X, Y and Z
     * from CSV data.
     * @param {Object} csvData CSV data from which minimum and
     * maximum values of X, Y and Z needs to be found.
     * @returns {Object} Returns an object containing minimum and
     * maximum values of X, Y and Z.
     */
    findXYZRange(csvData) {
        if (csvData.length === 0) { return DEFAULT_XYZ_RANGE; }

        // initializing all minimum and maximum...
        const xyzRange = {
            minimumX: csvData[0].X,
            maximumX: csvData[0].X,
            minimumY: csvData[0].Y,
            maximumY: csvData[0].Y,
            minimumZ: csvData[0].Z,
            maximumZ: csvData[0].Z
        };

        for (const rowData of csvData) {
            if (rowData.X < xyzRange.minimumX) { xyzRange.minimumX = rowData.X; }
            if (rowData.X > xyzRange.maximumX) { xyzRange.maximumX = rowData.X; }

            if (rowData.Y < xyzRange.minimumY) { xyzRange.minimumY = rowData.Y; }
            if (rowData.Y > xyzRange.maximumY) { xyzRange.maximumY = rowData.Y; }

            if (rowData.Z < xyzRange.minimumZ) { xyzRange.minimumZ = rowData.Z; }
            if (rowData.Z > xyzRange.maximumZ) { xyzRange.maximumZ = rowData.Z; }
        }

        return xyzRange;
    }

    onCSVFileChanged(event, csvData) {
        const xyzRange = this.findXYZRange(csvData);

        this.setState({
            csvData: csvData,
            xyzRange: xyzRange
        });
    }

    /**
     * This event gets fired whenever input value is
     * changed on any of the input fields of step 1...
     * @param {React.ChangeEventHandler} event 
     */
    onProjectInformationInputValueChanged(event) {
        const value = event.target.value;

        this.setState(prevState => ({
            projectInformation: {                           // object that we want to update
                ...prevState.projectInformation,            // keep all other key-value pairs
                [event.target.name]: value                  // update the value of specific key
            }
        }));
    }

    /**
     * This event gets fired whenever input value is
     * changed on any of the input fields of step 2...
     * @param {React.ChangeEventHandler} 
     */
    onXYZRangeInputValueChanged(event) {
        const { name, value } = event.target;

        this.setState(prevState => ({
            xyzRange: {                             // object that we want to update
                ...prevState.xyzRange,              // keep all other key-value pairs
                [name]: value                       // update the value of specific key
            }
        }));
    }

    render() {
        const {
            maximumX, minimumX,
            maximumY, minimumY,
            maximumZ, minimumZ
        } = this.state.xyzRange;

        const {
            name,
            description,
            client,
            contractor,
        } = this.state.projectInformation;

        let stepsContainerStyle = styles.stepsContainer;
        this.state.step === 1 && (stepsContainerStyle += ` ${styles.stepsContainerLarge}`);

        let firstStepIndicatorStyle = styles.step;

        if (this.state.step === 0) {
            firstStepIndicatorStyle += ` ${styles.currentStep}`;
        } else {
            firstStepIndicatorStyle = ` ${styles.completedStep}`;
        }

        return (
            <div className={`${styles.outerContainer} ${styles.selectionDisabled}`}>
                <form autoComplete="off" className={styles.form}
                    onSubmit={this.onFormSubmitted.bind(this)}>
                    <img className={styles.logo} src={logo} alt="Logo" />

                    <div className={stepsContainerStyle}>
                        { this.state.step === 1 && <div className={styles.secondStepContainer}>
                            <div className={styles.inputGroupContainer}>
                                <div className={styles.columnLeft}>
                                    <label htmlFor="maximumX" className={styles.label}>Maximum X</label>
                                    <input type="number" id="maximumX" name="maximumX"
                                        placeholder="Maximum value of X" className={styles.textInput}
                                        value={maximumX}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        required />
                                </div>

                                <div className={styles.columnRight}>
                                    <label htmlFor="minimumX" className={styles.label}>Minimum X</label>
                                    <input type="number" id="minimumX" name="minimumX"
                                        placeholder="Minimum value of X" className={styles.textInput}
                                        value={minimumX}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        ref={minimumX => this.minimumX = minimumX}
                                        required />
                                </div>
                            </div>

                            <div className={styles.inputGroupContainer}>
                                <div className={styles.columnLeft}>
                                    <label htmlFor="maximumY" className={styles.label}>Maximum Y</label>
                                    <input type="number" id="maximumY" name="maximumY"
                                        placeholder="Maximum value of Y" className={styles.textInput}
                                        value={maximumY}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        required />
                                </div>

                                <div className={styles.columnRight}>
                                    <label htmlFor="minimumY" className={styles.label}>Minimum Y</label>
                                    <input type="number" id="minimumY" name="minimumY"
                                        placeholder="Minimum value of Y" className={styles.textInput}
                                        value={minimumY}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        ref={minimumY => this.minimumY = minimumY}
                                        required />
                                </div>
                            </div>

                            <div className={styles.inputGroupContainer}>
                                <div className={styles.columnLeft}>
                                    <label htmlFor="maximumZ" className={styles.label}>Maximum Z</label>
                                    <input type="number" id="maximumZ" name="maximumZ"
                                        placeholder="Maximum value of Z" className={styles.textInput}
                                        value={maximumZ}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        required />
                                </div>

                                <div className={styles.columnRight}>
                                    <label htmlFor="minimumZ" className={styles.label}>Minimum Z</label>
                                    <input type="number" id="minimumZ" name="minimumZ"
                                        placeholder="Minimum value of Z" className={styles.textInput}
                                        value={minimumZ}
                                        onChange={this.onXYZRangeInputValueChanged.bind(this)}
                                        ref={minimumZ => this.minimumZ = minimumZ}
                                        required />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="csvFile" className={styles.label}>File selection (Optional)</label>
                                <CSVFile id="csvFile" onFileChange={this.onCSVFileChanged.bind(this)} />
                            </div>
                        </div> }

                        <div className={styles.firstStepContainer}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name" className={styles.label}>Project name</label>
                                <input type="text" id="name" name="name"
                                    placeholder="Type a project name" className={styles.textInput}
                                    value={name}
                                    onChange={this.onProjectInformationInputValueChanged.bind(this)}
                                    readOnly={this.state.step > 0} required />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="description" className={styles.label}>Project description</label>
                                <input type="text" id="description" name="description"
                                    placeholder="A simple description for your project"
                                    className={styles.textInput}
                                    value={description}
                                    onChange={this.onProjectInformationInputValueChanged.bind(this)}
                                    readOnly={this.state.step > 0} required />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="client" className={styles.label}>Client</label>
                                <input type="text" id="client" name="client"
                                    placeholder="Enter your client"
                                    className={styles.textInput}
                                    value={client}
                                    onChange={this.onProjectInformationInputValueChanged.bind(this)}
                                    readOnly={this.state.step > 0} required />
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="contractor" className={styles.label}>Contractor</label>
                                <input type="text" id="contractor" name="contractor"
                                    placeholder="Enter your contractor"
                                    className={styles.textInput}
                                    value={contractor}
                                    onChange={this.onProjectInformationInputValueChanged.bind(this)}
                                    readOnly={this.state.step > 0} required />
                            </div>
                        </div>
                    </div>

                    <ImageButton type="submit"
                        glowOnFocus={true}
                        className={styles.imageButton}
                        title="Next" imageSource={next} />

                    <div className={styles.stepIndicator}>
                        <span className={`${styles.step} ${firstStepIndicatorStyle}`}></span>
                        <span className={styles.step}></span>
                    </div>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            setCSVData: setCSVData
        },
        dispatch
    );
};

export default connect(null, mapDispatchToProps)(UserInput);
