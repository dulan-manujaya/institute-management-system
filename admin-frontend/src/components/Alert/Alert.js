import React from "react";

function Alert({ type, message }) {
  if (type === "error") {
    return (
      <div className="overflow-hidden leading-normal rounded-lg" role="alert">
        <p className="px-4 py-3 font-bold text-white bg-red-600">Error</p>
        <p className="px-4 py-3 text-red-800 bg-red-100 ">{message}</p>
      </div>
    );
  } else if (type === "success") {
    return (
      <div className="overflow-hidden leading-normal rounded-lg" role="alert">
        <p className="px-4 py-3 font-bold text-white bg-green-600">Success</p>
        <p className="px-4 py-3 text-green-800 bg-green-100 ">{message}</p>
      </div>
    );
  } else if (type === "info") {
    return (
      <div className="overflow-hidden leading-normal rounded-lg" role="alert">
        <p className="px-4 py-3 font-bold text-white bg-blue-600">Info</p>
        <p className="px-4 py-3 text-blue-800 bg-blue-100 ">{message}</p>
      </div>
    );
  }
}

export default Alert;
