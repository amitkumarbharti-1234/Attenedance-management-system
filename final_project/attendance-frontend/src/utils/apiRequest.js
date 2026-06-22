const apiRequest = async (method, endpoint, data) => {
  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

export default apiRequest;
