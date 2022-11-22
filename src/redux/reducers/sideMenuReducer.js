const sideMenuState = {
  isCollapsed: false,
};

const SideMenuReducer = (state = sideMenuState, action) => {
  switch (action.type) {
    case "CHANGE_COLLAPSED":
      return {
        ...state,
        isCollapsed: action.payload,
      };

    default:
      return state;
  }
};

export default SideMenuReducer;
