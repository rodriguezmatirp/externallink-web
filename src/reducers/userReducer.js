const reducer = (state, action) => {
  switch (action.type) {
    case "IN":
      return { user: action.user, token: action.token };
    case "ADD":
      return { user: action.user, token: action.token };
    case "OUT":
      return { user: "", token: "" };
    default:
      return state;
  }
};
export default reducer;
