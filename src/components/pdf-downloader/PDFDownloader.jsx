import React from "react";
import ReactDOM from 'react-dom';
import { PDFDownloadLink } from "@react-pdf/renderer";

import ImageButton from "../image-button";
import PDFDocument from "./pdf-document";

import styles from "./PDFDownloader.module.css";

import pdf from "../../resources/icons/pdf.svg";

const TIMEOUT = 250;        // in milliseconds...

class PDFDownloader extends React.Component {

    constructor(props) {
        super(props);

        this._intervalId = -1;
        this._status = "NONE";

        // references to elements...
        this.downloadLink = null;
        this.downloadLinkContainer = null;
    }

    onDownloadLinkGenerated(blob, url, loading, error) {
        // we cannot download using the link if react dom
        // is still rendering...
        if (loading || this._status !== "RENDERED") { return; }

        // loading is complete but link is still not ready to be downloaded.
        // because, react dom has not finished rendering yet...
        this.downloadLink = this.downloadLinkContainer.getElementsByTagName("a")[0];
        this._status = "READY";
    }

    onDownloadLinkRendered() {
        // react dom has finished rendering. which indicates
        // that the PDF file is ready to be downloaded...
        this._status = "RENDERED";
    }

    onTimeElapsed() {
        if (this._status !== "READY") { return; }

        // clears the interval...
        clearInterval(this._intervalId);

        // resets interval id...
        this._intervalId = -1;

        // starts downloading...
        this.downloadLink.click();
    }

    renderDownloadLink() {
        const document = <PDFDocument data={this.props.data} />;
        const downloadLink = (
            <PDFDownloadLink
                document={document} fileName={this.props.fileName}>
                { this.onDownloadLinkGenerated.bind(this) }
            </PDFDownloadLink>
        );

        // rendering download link to the temporary div...
        ReactDOM.render(downloadLink,
            this.downloadLinkContainer,
            this.onDownloadLinkRendered.bind(this));
    }

    onDownloadButtonClicked(event) {
        if (this._status === "NONE") {
            // changing status to loading...
            this._status = "LOADING";

            // renders download link to temporary div...
            this.renderDownloadLink();

            // setting interval so that download can be
            // started as soon as the link is generated...
            this._intervalId = setInterval(
                this.onTimeElapsed.bind(this), TIMEOUT);
        } else if (this._status === "READY") {
            // we have already generated the download link...
            this.downloadLink.click();
        }
    }

    render() {
        return (
            <>
                {/* this container is a temporary container which holds <PDFDownloadLink /> */}
                <div className="hidden"
                    ref={downloadLinkContainer => this.downloadLinkContainer = downloadLinkContainer} />

                <ImageButton className={styles.imageButton}
                    title="Download as PDF" imageSource={pdf}
                    onClick={this.onDownloadButtonClicked.bind(this)} />
            </>
        );
    }
}

export default PDFDownloader;
