import React from "react";
import { ERROR, SOMETHING_WENT_WRONG } from "../constants/appConstants";

export const lazyImport = (factory, name) => {
  return Object.create({
    [name]: React.lazy(() =>
      factory().then((module) => ({ default: module[name] }))
    ),
  });
};

export const handleError = (
  error,
  dispatch,
  errorMessage = SOMETHING_WENT_WRONG
) => {
  console.log(error);
  dispatch({
    type: ERROR,
    message: errorMessage,
    position: "topR",
    title: "Error Occured",
  });
};
