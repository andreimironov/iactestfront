import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createAction, ActionTypes } from './store';
import { container as Spinner } from './Spinner';
import { container as Modal404 } from './ModalInfo';
import { container as ModalFiles } from './ModalFiles';
import { formatBytes } from './util';

const serverUrl = 'http://localhost:8080';

class App extends Component {
    render() {
        return (
            <div>
                <div className='row'>
                    <div className='col s12'>
                        <h3>Директории и файлы</h3>
                    </div>
                    <div className='col s3'>
                        <h5>Новая директория</h5>
                    </div>
                    <div className="input-field col s6">
                        <input 
                            type="text" 
                            className="validate" 
                            value={this.props.dirPath}
                            onChange={this.onInputChange.bind(this)}
                        ></input>
                    </div>
                    <div className='col s3'>
                        <button 
                            className="waves-effect waves-light btn" 
                            onClick={this.postDir.bind(this)}
                        >
                            Добавить в список
                        </button>
                    </div>
                    <div className='col s12'>
                        <h4>Список директорий и файлов</h4>
                    </div>
                    <div className='col s12'>
                        <div className="card">
                            <div className="card-content">
                                <table className='striped highlight'>
                                    <thead>
                                        <tr>
                                            <th>Дата (UTC)</th>
                                            <th>Базовая директория</th>
                                            <th>Директорий</th>
                                            <th>Файлов</th>
                                            <th>Суммарный размер файлов</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.dirs.map(
                                                dir => {
                                                    let dirsCount = 0;
                                                    let filesCount = 0;
                                                    let filesSize = 0;
                                                    dir.subDirs.forEach(
                                                        subDir => {
                                                            if (subDir.size === null) {
                                                                dirsCount++;
                                                            } else {
                                                                filesCount++;
                                                                filesSize += subDir.size;
                                                            }
                                                        }
                                                    );
                                                    return (
                                                        <tr key={dir.id}>
                                                            <td>{dir.dateTime}</td>
                                                            <td>{dir.path}</td>
                                                            <td>{dirsCount}</td>
                                                            <td>{filesCount}</td>
                                                            <td>{formatBytes(filesSize)}</td>
                                                            <td>
                                                                <button 
                                                                    className="waves-effect waves-light btn" 
                                                                    onClick={
                                                                        this.props.setModalFilesState.bind(
                                                                            this,
                                                                            { opened: true, dir: dir }
                                                                        )
                                                                    }
                                                                >
                                                                    Файлы
                                                                </button>
                                                            </td>
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
                <Spinner/>
                <Modal404/>
                <ModalFiles/>
            </div>
        );
    }

    componentDidMount() {
        this.getDirs();
    }

    onInputChange(event) {
        this.props.setDirPath(event.target.value);
    }

    postDir() {
        let postDirRequest = new XMLHttpRequest();  
        postDirRequest.onreadystatechange = () => {
            const readyState = postDirRequest.readyState;
            const status = postDirRequest.status;
            console.log('postDirRequest readyState: ' + readyState + ', status: ' + status);
            if (readyState === 4) {
                this.props.setLoading(false);
                switch (status) {
                    case 0:
                        this.props.setModalInfoState({ 
                            opened: true, 
                            message: 'Невозможно подключиться к серверу ' + serverUrl
                        });
                        break;
                    case 200:
                        this.getDirs();
                        break;
                    case 404:
                        this.props.setModalInfoState({ 
                            opened: true, 
                            message: 'Директория '+ this.props.dirPath + ' не существует' 
                        });
                        break;
                    default:
                        this.props.setModalInfoState({ 
                            opened: true, 
                            message: 'Ошибка при добавлении директории, ' + postDirRequest.responseText
                        });
                        break;
                }
                if (status === 200) {
                }
            }
        };
        const url = serverUrl + '/postdir?dirpath=' + this.props.dirPath; 
        postDirRequest.open("POST", url, true);
        postDirRequest.send();
        this.props.setLoading(true);
    }

    getDirs() {
        let dirsRequest = new XMLHttpRequest();            
        dirsRequest.onreadystatechange = () => {
            const readyState = dirsRequest.readyState;
            const status = dirsRequest.status;
            console.log('dirsRequest readyState: ' + readyState + ', status: ' + status);
            if (readyState === 4) {
                this.props.setLoading(false);
                switch (status) {
                    case 0:
                        this.props.setModalInfoState({ 
                            opened: true, 
                            message: 'Невозможно подключиться к серверу ' + serverUrl
                        });
                        break;
                    case 200:
                        let dirs = JSON.parse(dirsRequest.responseText);
                        dirs.forEach(dir => {
                            dir.subDirs.sort((subDir1, subDir2) => {
                                const size1 = subDir1.size === null ? 0 : 1;
                                const size2 = subDir2.size === null ? 0 : 1;
                                if (size1 == size2) {
                                    const name1 = subDir1.name;
                                    const name2 = subDir2.name;
                                    return name1.localeCompare(name2, undefined, { sensitivity: 'accent', numeric: true})
                                }
                                return size1 - size2;
                            });
                        });
                        this.props.setDirs(dirs);
                        break;
                    default:
                        this.props.setModalInfoState({ 
                            opened: true, 
                            message: 'Ошибка при загрузке директорий, ' + dirsRequest.responseText
                        });
                        break;
                }
                
            }
        };
        const dirsRequestUrl = serverUrl + '/dirs'; 
        dirsRequest.open('GET', dirsRequestUrl, true);
        dirsRequest.send();
        this.props.setLoading(true);
    }

    getSpinnerDisplay() {
        return this.props.isLoading ? 'block' : 'none';
    }
}

const mapStateToProps = state => ({
    isLoading: state.isLoading,
    dirPath: state.dirPath,
    dirs: state.dirs
});

const mapDispatchToProps = dispatch => ({
    setLoading: isLoading => dispatch(createAction(
        ActionTypes.SET_LOADING,
        isLoading
    )),
    setDirPath: dirPath => dispatch(createAction(
        ActionTypes.SET_DIRPATH,
        dirPath
    )),    
    setDirs: dirs => dispatch(createAction(
        ActionTypes.SET_DIRS,
        dirs
    )),
    setModalInfoState: modal404State => dispatch(createAction(
        ActionTypes.SET_MODALINFO_STATE,
        modal404State
    )),
    setModalFilesState: modalFilesState => dispatch(createAction(
        ActionTypes.SET_MODALFILES_STATE,
        modalFilesState
    ))
});

export const container = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
