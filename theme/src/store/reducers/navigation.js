const initialState = {
    open: false
};

const handlers = {
    TOGGLE_NAVIGATION(state, { payload }) {
        const nextOpen = payload != null ? !!payload : !state.open;

        return {
            ...state,
            open: nextOpen
        };
    }
};

const reducer = (state = initialState, action) => {
    if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
    }

    return state;
};

export default reducer;
