export const setLoading = (data) => {
    return (dispatch) => {
      dispatch({
        type: "CHANGE_LOADING",
        payload: data,
      });
    };
  };
  