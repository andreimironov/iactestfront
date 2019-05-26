import { createStore } from 'redux';

// <-- define state -->
const initialState = {
    isLoading: false,
    dirPath: '',
    dirs: [],
    modalInfoState: {
        opened: false,
        message: ''
    },
    modalFilesState: {
        opened: false,
        dir: {
            path: '',
            subDirs: []
        },
    }
};
// </- define state -->

// <-- define actions -->
export const ActionTypes = Object.freeze({
    'SET_LOADING': 0,
    'SET_DIRPATH': 3,
    'SET_DIRS': 4,
    'SET_MODALINFO_STATE': 5,
    'SET_MODALFILES_STATE': 6,    
}); 
export const createAction = (actionType, newState) => {
    return {
        type: actionType,
        newState: newState
    }
}
// </- define actions -->

// <-- define reducers -->
const reducer = (state = {}, action, actionType) => {
    if (action.type !== actionType) {
        return state;
    }
    return action.newState;
};
const rootReducer = (state = {}, action) => {
    return {
        isLoading: reducer(state.isLoading, action, ActionTypes.SET_LOADING),
        dirPath: reducer(state.dirPath, action, ActionTypes.SET_DIRPATH),
        dirs: reducer(state.dirs, action, ActionTypes.SET_DIRS),
        modalInfoState: reducer(state.modalInfoState, action, ActionTypes.SET_MODALINFO_STATE),
        modalFilesState: reducer(state.modalFilesState, action, ActionTypes.SET_MODALFILES_STATE)
    };
};
// </- define reducers -->

// <-- define store -->
export const store = createStore(rootReducer, initialState);
store.subscribe(() => {
    console.log('State', store.getState());
});
// </- define store -->