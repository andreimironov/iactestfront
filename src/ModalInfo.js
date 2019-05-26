import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createAction, ActionTypes } from './store';

class ModalInfo extends Component {
    render() {
        return (
            <div id='modal_404' className="modal modal-fixed-footer">
                <div className="modal-content">
                    <div className='row'>
                        <div className='col s12'>
                            <p>{this.props.message}</p>
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
                onCloseEnd: () => this.props.setModalInfoState({ opened: false, message: '' })
            }
        );
        this.instanceModal = window.M.Modal.getInstance(elementsModal[0]);
    }
}

const mapStateToProps = state => ({
    opened: state.modalInfoState.opened,
    message: state.modalInfoState.message
});

const mapDispatchToProps = dispatch => ({
    setModalInfoState: modalInfoState => dispatch(createAction(
        ActionTypes.SET_MODALINFO_STATE,
        modalInfoState
    )),
});

export const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalInfo);