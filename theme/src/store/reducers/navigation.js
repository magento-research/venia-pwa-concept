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
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
        return handlers[action.type](state, action);
    }

    return state;
};

const selectNavigation = ({ navigation }) => navigation || initialState;

export default reducer;

export { selectNavigation };
