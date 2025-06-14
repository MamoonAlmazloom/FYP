import clientAPI from "./clientAPI";

export const getPendingProposals = async (moderatorId) => {
  try {
    const response = await clientAPI.get(`/api/moderators/${moderatorId}/pending-proposals`);
    return response.data.proposals;
  } catch (error) {
    console.error("Error fetching pending proposals:", error);
    throw error;
  }
};
