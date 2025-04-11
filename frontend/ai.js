async function getTravelRecommendation(userInput) {
    try {
        const response = await fetch("http://localhost:5000/api/chatbot/ask", {  
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userMessage: userInput })
        });


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get AI response');
        }


        // Remove markdown symbols and format the response
        const data = await response.json();
        console.log("API Response:", data); // Debugging

        if (!data || !data.aiMessage) {
            throw new Error("Invalid response from AI.");
        }

        let cleanResponse = data.aiMessage
    .replace(/\*\*/g, '')  // Remove bold markdown (**)
    .replace(/\*/g, '')    // Remove italic markdown (*)
    .replace(/^##\*/gm, '')
    .replace(/([.:!?])\s+([A-Z])/g, '$1\n\n$2') // Add line breaks between sentences
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove extra blank lines
    .replace(/^(\*|-)\s/gm, '• ') // Convert * or - lists to bullet points
    .replace(/~\((\d+)\s*km\s*.*?\)/g, '($1 km)'); // Format distance neatly

        return cleanResponse.trim();
    } catch (error) {
        console.error("Detailed error:", error);
        return `Error: ${error.message}`;
    }
}

async function handleAskAI() {
    const userInput = document.getElementById("userQuery").value;
    const chatMessages = document.querySelector(".chat-messages");

    if (!userInput.trim()) {
        alert("Please enter a question.");
        return;
    }

    // Add user message
    const userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message user-message";
    userMessageDiv.textContent = userInput;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    document.getElementById("userQuery").value = "";

    // Add AI thinking message
    const aiMessageDiv = document.createElement("div");
    aiMessageDiv.className = "message ai-message";
    aiMessageDiv.textContent = "Thinking...";
    chatMessages.appendChild(aiMessageDiv);

    try {
        const aiResult = await getTravelRecommendation(userInput);
        // Use innerHTML to preserve line breaks
        aiMessageDiv.innerHTML = aiResult.replace(/\n/g, '<br>');

        // Add some styling to bullet points
        aiMessageDiv.innerHTML = aiMessageDiv.innerHTML.replace(/•/g, '<span style="color: #0fa3b1; margin-right: 5px">•</span>');
    } catch (error) {
        aiMessageDiv.textContent = "Sorry, I couldn't process that request.";
        console.error("Handler error:", error);
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add minimize/maximize functionality
document.addEventListener('DOMContentLoaded', function () {
    const chatWidget = document.querySelector('.ai-chat-widget');
    const minimizeBtn = document.querySelector('.minimize-btn');
    const chatHeader = document.querySelector('.chat-header');

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatWidget.classList.toggle('minimized');
        minimizeBtn.textContent = chatWidget.classList.contains('minimized') ? '-' : '+';
    });

    // chatHeader.addEventListener('click', () => {
    //     chatWidget.classList.toggle('minimized');
    //     minimizeBtn.textContent = chatWidget.classList.contains('minimized') ? '-' : '+';
    // });

    // Add enter key support for input
    const inputField = document.getElementById('userQuery');
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAskAI();
        }
    });
});
