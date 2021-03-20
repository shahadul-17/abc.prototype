import Chart from "chart.js";
import React from "react";

import styles from "./Graph.module.css";

class Graph extends React.Component {

    constructor(props) {
        super(props);

        this.graphCanvas = null;
    }

    createBorderColor(color, count) {
        const borderColor = [];

        for (let i = 0; i < count; i++) {
            borderColor.push(color);
        }

        return borderColor;
    }

    componentDidMount() {
        const { options } = this.props;
        const context = this.graphCanvas.getContext("2d");

        new Chart(context, {
            type: "line",
            data: {
                labels: options.xAxis,
                datasets: [{
                    label: "X",
                    data: options.dataSet,
                    backgroundColor: "rgba(16, 16, 16, 0.85)",
                    borderColor: "rgba(30, 144, 255, 0.5)",
                    borderWidth: 1
                }]
            }
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <canvas ref={graphCanvas => this.graphCanvas = graphCanvas}></canvas>
            </div>
        );
    }
}

export default Graph;
