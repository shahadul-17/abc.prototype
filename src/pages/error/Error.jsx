import React from "react";

import styles from "./Error.module.css";

class Error extends React.Component {

    render() {
        return (
            <div className={styles.container}>
                <h1 className={styles.heading}>Oops!</h1>
                { this.props.statusCode && <p className={styles.statusCode}>{this.props.statusCode}</p> }
                <p className={styles.message}>{this.props.message ?? "An unexpected error occurred."}</p>
            </div>
        );
    }
}

export default Error;
