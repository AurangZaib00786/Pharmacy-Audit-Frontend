import { useContext } from "react";
import { AddDataContext } from "../Context/adddataContext";

export const UseaddDataContext = () => {
  const context = useContext(AddDataContext);
  if (!context) {
    throw Error(
      "useaddVoucherContext must be used inside an adddataContextProvider"
    );
  }

  return context;
};
