import React, { useState } from "react";

function KnittingAI() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [refineLoading, setRefineLoading] = useState(false);

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
            messages: [
                {
                    role: "system",
                    content: "You are an expert knitting instructor with deep knowledge of knitting techniques, patterns, materials, and troubleshooting. Your goal is to answer questions thoroughly, like a professor teaching a student. Provide step-by-step instructions when needed. Suggest improvements, alternatives, and ways to make the user's knitting experience better. Make sure to check if the user is satisfied with their results and offer guidance if needed."
                },
                { role: "user", content: question }
            ],
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

    const refineAnswer = async () => {
        if (!response) return;

        setRefineLoading(true);
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

        try {
            const refineResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a highly skilled knitting instructor. The user has requested additional clarification or a refined version of your previous response. Rephrase or expand on your answer to be clearer and more useful."
                        },
                        { role: "assistant", content: response }
                    ],
                    max_tokens: 150,
                }),
            });

            const data = await refineResponse.json();
            if (data.choices && data.choices.length > 0) {
                setResponse(data.choices[0].message.content);
            } else {
                setResponse("Couldn't refine the answer. Try again.");
            }
        } catch (error) {
            console.error("Error refining response:", error);
            setResponse("An error occurred while refining the answer.");
        } finally {
            setRefineLoading(false);
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

            {/* "Refine Answer" Button - Only Shows If There’s a Response */}
            {response && (
                <button 
                    onClick={refineAnswer} 
                    disabled={refineLoading} 
                    style={{ marginTop: "10px", padding: "8px 15px", fontSize: "16px" }}
                >
                    {refineLoading ? "Refining..." : "Refine Answer"}
                </button>
            )}
        </div>
    );
}

export default KnittingAI;