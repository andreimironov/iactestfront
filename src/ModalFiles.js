import React, {Component} from 'react';
import { connect } from 'react-redux';
import { createAction, ActionTypes } from './store';
import { formatBytes } from './util';

class ModalFiles extends Component {
    render() {
        return (
            <div id='modal_files' className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4>{this.props.dir.path}</h4>
                    <div className='row'>
                        <div className='col s12'>
                            <div className="card">
                                <div className="card-content">
                                    <table className='striped highlight'>
                                        <thead>
                                            <tr>
                                                <th>Файл</th>
                                                <th>Размер</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.props.dir.subDirs.map(
                                                    subDir => {
                                                        return (
                                                            <tr key={subDir.id}>
                                                                <td>{subDir.name}</td>
                                                                <td>{subDir.size === null ? '<DIR>' : formatBytes(subDir.size)}</td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
        let elementsModal = document.querySelectorAll('#modal_files');
        window.M.Modal.init(
            elementsModal, 
            {
                onCloseEnd: () => this.props.setModalFilesState({
                    opened: false, 
                    dir: {
                        path: '', 
                        subDirs: []
                    }
                })
            }
        );
        this.instanceModal = window.M.Modal.getInstance(elementsModal[0]);
    }
}

const mapStateToProps = state => ({
    modalFilesState: state.modalFilesState,
    opened: state.modalFilesState.opened,
    dir: state.modalFilesState.dir
});

const mapDispatchToProps = dispatch => ({
    setModalFilesState: modalFilesState => dispatch(createAction(
        ActionTypes.SET_MODALFILES_STATE,
        modalFilesState
    )),
});

export const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalFiles);