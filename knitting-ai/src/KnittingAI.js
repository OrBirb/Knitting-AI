import React, { useState } from "react";

function KnittingAI() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const askAI = async () => {
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY || "API_KEY_NOT_FOUND";
        console.log("API Key:", apiKey);
        const endpoint = "https://api.openai.com/v1/completions";

        const requestBody = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
            max_tokens: 100,
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        setResponse(data.choices[0].message.content);
    };

    return (
        <div>
            <h2>Knitting AI Assistant</h2>
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a knitting question..."
            />
            <button onClick={askAI}>Get Answer</button>
            <p>{response}</p>
        </div>
    );
}

export default KnittingAI;