import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Spinner.css';

class Spinner extends Component {
    render() {
        return (
            <div 
                id='spinner' 
                className="preloader-wrapper big active" 
                style={{ display: this.getDisplay() }}
            >
                <div className="spinner-layer spinner-red-only">
                    <div className="circle-clipper left">
                        <div className="circle"></div>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"></div>
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle"></div>
                    </div>
                </div>
            </div>
        );
    }
 
    getDisplay = () => this.props.isLoading ? 'block' : 'none';
}

const mapStateToProps = state => ({
    isLoading: state.isLoading,
    dirs: state.dirs
});

export const container = connect(mapStateToProps, null)(Spinner);