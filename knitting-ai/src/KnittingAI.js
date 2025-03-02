import React, { useState } from "react";

function KnittingAI() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const askAI = async () => {
        if (!question.trim()) {
            setResponse("Please enter a question before asking.");
            return;
        }

        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

        if (!apiKey) {
            setResponse("Error: Missing API key. Please check your .env file.");
            return;
        }

        console.log("API Key:", apiKey);
        setLoading(true);

        const endpoint = "https://api.openai.com/v1/chat/completions";
        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            max_tokens: 100,
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("Too many requests. Please wait and try again.");
                } else if (response.status === 401) {
                    throw new Error("Invalid API Key. Check your .env file.");
                } else {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                setResponse(data.choices[0].message.content);
            } else {
                setResponse("No response from AI. Try again.");
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setResponse(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Knitting AI Assistant</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a knitting question..."
                style={{ width: "60%", padding: "10px", marginBottom: "10px" }}
            />
            <br />
            <button onClick={askAI} disabled={loading} style={{ padding: "10px 20px" }}>
                {loading ? "Thinking..." : "Get Answer"}
            </button>
            <p style={{ marginTop: "20px", fontWeight: "bold" }}>{response}</p>
        </div>
    );
}

export default KnittingAI;