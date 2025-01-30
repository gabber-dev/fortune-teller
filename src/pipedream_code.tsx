import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    try {
      // Extract session ID from headers
      const session_id = steps.trigger.event.headers?.["x-gabber-realtime-session-id"];
      if (!session_id) throw new Error("Session ID is missing.");

      console.log(`Processing session: ${session_id}`);

      // Fetch messages for the session
      const messageResponse = await axios.get(`https://api.gabber.dev/v1/realtime/${session_id}/messages`, {
        headers: {
          "Accept": "application/json",
          "x-api-key": "7373d3ed-239a-429a-9d2b-f644366f663e",
        },
        maxBodyLength: Infinity,
      });

      let messages = messageResponse.data.values;

      if (!messages || messages.length === 0) {
        throw new Error("No messages found for this session.");
      }

      console.log(`Retrieved ${messages.length} messages.`);

      // Convert messages into the correct format
      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: extractTextContent(msg.content),
      }));

      // Add system prompt at the beginning
      formattedMessages.unshift({
        role: "system",
        content: "This is a conversation a user had with an AI agent who is a psychic. Given what the user has said, please output a psychic reading for the user.",
      });

      console.log("Formatted Messages:", JSON.stringify(formattedMessages, null, 2));

      // Prepare chat completion payload
      const chatPayload = {
        messages: formattedMessages,
        model: "8fd97e5f-113b-4ed3-85ab-8540278eab55", // Ensure this is the correct model
        temperature: 0.7,
        max_tokens: 500,
        stream: false,
      };

      // Get response from the chat API
      const chatResponse = await axios.post("https://api.gabber.dev/v1/chat/completions", chatPayload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-api-key": "7373d3ed-239a-429a-9d2b-f644366f663e",
        },
        maxBodyLength: Infinity,
      });

      const aiResponse = chatResponse?.data?.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error("AI response is empty or undefined.");
      }

      console.log(`AI Response: ${aiResponse}`);

      // Call speak API with the AI's response
      await speakMessage(session_id, aiResponse);
      console.log("Speak request completed successfully.");

      return { success: true, session_id, aiResponse };
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return { success: false, error: error.message };
    }
  }
});

// Helper function to extract text from Gabber's message format
function extractTextContent(content) {
  try {
    const parsedContent = JSON.parse(content); // Parse the JSON string
    if (Array.isArray(parsedContent) && parsedContent.length > 0 && parsedContent[0].text) {
      return parsedContent.map((item) => item.text).join(" "); // Combine text if multiple entries
    }
    return content; // Fallback if unexpected format
  } catch (err) {
    return content; // Return raw content if parsing fails
  }
}

// Function to handle speak API request
async function speakMessage(session_id, text) {
  try {
    if (!text || text.trim() === "") {
      throw new Error("Text for speech synthesis is empty.");
    }

    const speakData = { text };

    const speakResponse = await axios.post(`https://api.gabber.dev/v1/realtime/${session_id}/speak`, speakData, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": "7373d3ed-239a-429a-9d2b-f644366f663e",
      },
      maxBodyLength: Infinity,
    });

    console.log("Speak message sent successfully:", JSON.stringify(speakResponse.data));
    return speakResponse.data;
  } catch (error) {
    console.error("Speak API Request Failed:", error.response?.data || error.message);
    throw error;
  }
}