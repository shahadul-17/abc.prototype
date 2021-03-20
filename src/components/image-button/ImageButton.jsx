import React from "react";

import styles from "./ImageButton.module.css";

class ImageButton extends React.Component {

    render() {
        const glowStyle = this.props.glowOnFocus ? styles.glow : "";

        return (
            <button className={`${styles.button} ${this.props.className} ${glowStyle}`}
                type={this.props.type ?? "button"}
                title={this.props.title}
                onClick={this.props.onClick}>
                <img src={this.props.imageSource} alt={this.props.title} />
            </button>
        );
    }
}

export default ImageButton;
