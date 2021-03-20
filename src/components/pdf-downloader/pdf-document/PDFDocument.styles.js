import { StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        backgroundColor: "#ffffff"
    },
    heading: {
        margin: 5,
        fontWeight: "extrabold",
        fontSize: 18,
        paddingBottom: 30
    },
    text: {
        margin: 5,
        fontSize: 13
    }
});

export { styles };
