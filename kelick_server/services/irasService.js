import axios from "axios";

export const irasService = async () => {
  try {
    const response = await axios.post(
      process.env.IRAS_API_URL,
      {},
      {
        headers: { Authorization: `Bearer ${process.env.IRAS_API_KEY}` },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Error fetching data from IRAS API");
  }
};
