import httpClient from "./httpClient";

const apiReading = () => {
  const getByUserId = async (userId) => {
    const response = await httpClient.get("/readings", { params: { userId } });
    return response.data;
  };

  const createReading = async (dataReading) => {
    const response = await httpClient.post("/readings", dataReading);
    return response.data;
  };

  const editName = async (id, name) => {
    const response = await httpClient.patch(`/readings/${id}`, { name });
    return response.data;
  };

  const deleteReading = async (id) => {
    const response = await httpClient.delete(`/readings/${id}`);
    return response;
  };

  const deleteAllByUserId = async (userId) => {
    const response = await httpClient.delete("/readings", {
      params: { userId },
    });
    return response;
  };

  const getById = async (id) => {
    const response = await httpClient.get(`/readings/${id}`);
    return response.data;
};

const getByUserIdPaginated = async (userId, page, size = 15) => {
    const response = await httpClient.get("/readings", { params: { userId, page, size } });
    return response.data;
};

return { getByUserId, createReading, editName, deleteReading, deleteAllByUserId, getById, getByUserIdPaginated };
};

export default apiReading;
