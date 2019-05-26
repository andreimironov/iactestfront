import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createAction, ActionTypes } from './store';

class Modal404 extends Component {
    render() {
        return (
            <div id='modal_404' className="modal modal-fixed-footer">
                <div className="modal-content">
                    <div className='row'>
                        <div className='col s12'>
                            <p>Директория {this.props.dirPath} не существует</p>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat">
                        Закрыть
                    </button>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.initMaterialModal();
    }

    componentDidUpdate() {
        if (this.props.opened) {
            this.instanceModal.open();
        }
    }

    initMaterialModal() {
        let elementsModal = document.querySelectorAll('#modal_404');
        window.M.Modal.init(
            elementsModal, 
            {
                onCloseEnd: () => this.props.setModal404State({ opened: false })
            }
        );
        this.instanceModal = window.M.Modal.getInstance(elementsModal[0]);
    }
}

const mapStateToProps = state => ({
    dirPath: state.dirPath,
    opened: state.modal404State.opened
});

const mapDispatchToProps = dispatch => ({
    setModal404State: modal404State => dispatch(createAction(
        ActionTypes.SET_MODAL404_STATE,
        modal404State
    )),
});

export const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal404);