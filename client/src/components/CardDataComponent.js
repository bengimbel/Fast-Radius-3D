import React, { Component } from 'react';

class CardDataComponent extends Component {

    //Displaying the data passed in as props
    render(){
        const { mesh } = this.props
        return (
            <div style={styles.container} className="container">
                {mesh &&
                <div className="moon-details" style={styles.moonDetails}>
                    <div style={styles.moonDetails}>
                        <h2>Number of Faces: {mesh.geometry.faces.length}</h2>
                    </div>
                    <div style={styles.moonDetails}>
                        <h2>Surface Area: {mesh.geometry.surfaceArea.toFixed(4)}</h2>
                    </div>
                    <div className="bounding-box" style={styles.boundingBox}>
                        <h2>Bounding Box: &#123;</h2>
                        <h3 style={styles.maxMinIndent}>Minimum: &#123; X:{mesh.geometry.boundingBox.min.x.toFixed(3)}, Y:{mesh.geometry.boundingBox.min.y.toFixed(3)}, Z:{mesh.geometry.boundingBox.min.z.toFixed(3)} &#125;,</h3>
                        <h3 style={styles.maxMinIndent}>Maximum: &#123; X:{mesh.geometry.boundingBox.max.x.toFixed(3)}, Y:{mesh.geometry.boundingBox.max.y.toFixed(3)}, Z:{mesh.geometry.boundingBox.max.z.toFixed(3)} &#125;</h3>
                        <h2>&#125;</h2>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default CardDataComponent;

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        width: '50%',
        marginLeft: '100px'
        
    },
    moonDetails: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingLeft: '20px',
        paddingRight: '20px',
        justifyContent: 'center'
    },
    boundingBox: {
        paddingLeft: '20px',
        paddingRight: '20px'
    },
    maxMinIndent: {
        marginLeft: '40px'
    },
    title: {
        display: 'block',
        alignSelf: 'center'
    }
}