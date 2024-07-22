import { useReducer, createContext } from "react";

export const AddDataContext = createContext();

const addDatareducer = (state, action) => {
  switch (action.type) {
    case "Set_data":
      return {
        Data: action.payload,
      };
    case "Create_data":
      return {
        Data: [action.payload, ...state.Data],
      };
    case "Delete_data":
      return {
        Data: state.Data.filter((u) => u.id !== action.payload.id),
      };
    case "Update_data":
      return {
        Data: state.Data.map((u) => {
          return u.id !== action.payload.id ? u : action.payload;
        }),
      };

    default:
      return {
        state,
      };
  }
};

export const AddDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(addDatareducer, {
    Data: [],
  });

  return (
    <AddDataContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AddDataContext.Provider>
  );
};
