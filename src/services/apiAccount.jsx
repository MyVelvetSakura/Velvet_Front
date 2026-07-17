import httpClient from "./httpClient";

const apiAccount = () => {
  const addAccount = async (dataForm) => {
    const response = await httpClient.post("/accounts", dataForm);
    return response.data;
  };

  const login = async (name, password) => {
    const response = await httpClient.post("/accounts/login", { name, password });
    return response.data;
  };

  const editAccount = async (id, name) => {
    const response = await httpClient.patch(`/accounts/${id}`, { name });
    return response.data;
  };

  const getByName = async (name) => {
    const response = await httpClient.get("/accounts", { params: { name } });
    return response.data;
  };

  const verifyAccount = async (token) => {
    const response = await httpClient.get("/accounts/verify", { params: { token } });
    return response.data;
  };

  const forgotPassword = async (email) => {
    const response = await httpClient.post("/accounts/forgot-password", { email });
    return response.data;
  };

  const resetPassword = async (token, newPassword) => {
    const response = await httpClient.post("/accounts/reset-password", { token, newPassword });
    return response.data;
  };

  return { addAccount, login, editAccount, getByName, verifyAccount, forgotPassword, resetPassword };
};

export default apiAccount;