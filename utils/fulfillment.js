const axios = require("axios");

const callFulfillmentAPI = async (clientId, orderId) => {
  const response = await axios.post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      userId: clientId,
      title: orderId
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.id;
};

module.exports = callFulfillmentAPI;