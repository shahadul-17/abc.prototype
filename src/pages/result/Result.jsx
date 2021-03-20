import React from "react";
import { connect } from "react-redux";
import PDFDownloader from "../../components/pdf-downloader";
import Graph from "../../components/graph";

import { Utility } from "../../common";

import styles from "./Result.module.css";

class Result extends React.Component {

    constructor(props) {
        super(props);

        this.graph = null;
        this.state = {
            isPDFReady: false,
            data: {}
        };
    }

    componentDidMount() {
        const queryParameters = Utility.parseQueryString(window.location.href);

        this.setState({
            isPDFReady: true,
            data: queryParameters
        });
    }

    /**
     * Prepares graph options (such as data set) from CSV data.
     * @param {Array<Object>} csvData CSV data that will be used
     * to prepare options for graph.
     * @returns {Object} Returns data to be used for visualizing graph.
     */
     prepareGraphOptions(csvData = []) {
        const xAxis = [];
        const dataSet = [];

        for (const row of csvData) {
            const kp = row["KP"];           // value of "KP"...
            const x = row["X"];             // value of "X" (not to be confused with x-axis)...

            xAxis.push(kp);
            dataSet.push({ x: kp, y: x });   // point (x, y) => (KP, X) where x = "KP" and y = "X"...
        }

        const graphData = {
            xAxis: xAxis,
            dataSet: dataSet
        };

        return graphData;
    }

    render() {
        const { data } = this.state;

        return (
            <div className={styles.outerContainer}>
                <div className={styles.container}>
                    <div className={styles.sub}>
                        <div className={styles.titleBar}>
                            <p className={styles.title}>Result</p>
                            <PDFDownloader fileName={`${data.name}_result.pdf`} data={data} />
                        </div>
                        <div className={styles.tableContainer}>
                            <table>
                            <tbody>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Description</th>
                                    <th>Client</th>
                                    <th>Contractor</th>
                                    <th>Maximum X</th>
                                    <th>Minimum X</th>
                                    <th>Maximum Y</th>
                                    <th>Minimum Y</th>
                                    <th>Maximum Z</th>
                                    <th>Minimum Z</th>
                                </tr>
                                <tr>
                                    <td>{data.name}</td>
                                    <td>{data.description}</td>
                                    <td>{data.client}</td>
                                    <td>{data.contractor}</td>
                                    <td>{data.maximumX}</td>
                                    <td>{data.minimumX}</td>
                                    <td>{data.maximumY}</td>
                                    <td>{data.minimumY}</td>
                                    <td>{data.maximumZ}</td>
                                    <td>{data.minimumZ}</td>
                                </tr>
                            </tbody>
                            </table>
                        </div>

                        {/* if CSV data is available, we render the graph */}
                        <div className={styles.graphContainer}>
                            {
                                this.props?.csvData?.length !== 0 &&
                                <Graph options={this.prepareGraphOptions(this.props.csvData)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        csvData: state.csvData
    };
};

export default connect(mapStateToProps)(Result);
