import React from "react";

export const handleFormChange = (e, data, setData) => {
  setData({...data, [e.target.name]: e.target.value});
}
