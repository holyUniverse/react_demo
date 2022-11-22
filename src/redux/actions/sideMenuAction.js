export const setCollapsed = (data) => {
  return (dispatch) => {
    dispatch({
      type: "CHANGE_COLLAPSED",
      payload: data,
    });
  };
};
