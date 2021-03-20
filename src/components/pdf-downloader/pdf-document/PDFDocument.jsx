import React from "react";
import { Document, Page, Text } from '@react-pdf/renderer';

import { styles } from "./PDFDocument.styles";

class PDFDocument extends React.Component {
    
    render() {
        const { data } = this.props;

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Text style={styles.heading}>Result</Text>
                    <Text style={styles.text}>Project Name: {data.name}</Text>
                    <Text style={styles.text}>Description: {data.description}</Text>
                    <Text style={styles.text}>Client: {data.client}</Text>
                    <Text style={styles.text}>Contractor: {data.contractor}</Text>
                    <Text style={styles.text}>Maximum X: {data.maximumX}</Text>
                    <Text style={styles.text}>Minimum X: {data.minimumX}</Text>
                    <Text style={styles.text}>Maximum Y: {data.maximumY}</Text>
                    <Text style={styles.text}>Minimum Y: {data.minimumY}</Text>
                    <Text style={styles.text}>Maximum Z: {data.maximumZ}</Text>
                    <Text style={styles.text}>Minimum Z: {data.minimumZ}</Text>
                </Page>
            </Document>
        );
    }
}

export default PDFDocument;
