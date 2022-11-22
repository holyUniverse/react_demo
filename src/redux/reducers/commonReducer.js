const commonState = {
  isLoading: false,
};

const CommonReducer = (state = commonState, action) => {
  switch (action.type) {
    case "CHANGE_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

export default CommonReducer;
