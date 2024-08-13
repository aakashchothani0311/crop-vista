import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css'; 
import { IconButton, Dialog, DialogContent } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

const responses: { [key: string]: string } = {
    'hi': 'Hello! How can I assist you today?',
    'hello': 'Hi there! What can I do for you?',
    'how are you': 'I am just a bot, but I am doing great! How can I help you?',
    'bye': 'Goodbye! Have a great day!',
    'how can i sell my crops': 'You can list your crops by creating supply or by committing to a particular demand in the market on our platform.',
    'what is the current market demand': 'You can view the current market demand for a particular crop in the Market View section.',
    'what is the current market supply': 'You can view the current market supply for a particular crop in the Market View section.',
    'how do i update my profile': 'You can update your profile information in the Profile View section.',
    'where can i see my previous and current offers': 'You can check the Offers section to view your past and current offers.',
    'how do i reset my password': 'You can reset your password through the Password Reset page.',
    'can i negotiate prices': 'Yes, you can negotiate prices with distributors through the Negotiations section.',
    'what are the benefits of using your platform': 'Our platform connects farmers, distributors, and companies, providing transparency and efficiency in the supply chain. It helps reduce crop wastage and improves market access.',
    'what is market view': 'The Market View displays the overall supply and demand for specific crops over time. It also includes a "Commit to Demand" link, allowing farmers to pledge their crops to a particular demand.',
    'market view': 'The Market View displays the overall supply and demand for specific crops over time. It also includes a "Commit to Demand" link, allowing farmers to pledge their crops to a particular demand.',
    'what is my supplies': 'My Supplies displays the list of crops you have committed to supply, including details such as the crop name, quantity, the date they were created, the timeline for their fulfillment, and the remaining days until fulfillment. This overview helps track and manage your supplies effectively.',
    'my supplies': 'My Supplies displays the list of crops you have committed to supply, including details such as the crop name, quantity, the date they were created, the timeline for their fulfillment, and the remaining days until fulfillment. This overview helps track and manage your supplies effectively.',
    'supplies': 'My Supplies displays the list of crops you have committed to supply, including details such as the crop name, quantity, the date they were created, the timeline for their fulfillment, and the remaining days until fulfillment. This overview helps track and manage your supplies effectively.',
    'what is my negotiations': 'My negotiations involve the buying and selling stages where the parties work together to finalize a contract',
    'my negotiations': 'My negotiations involve the buying and selling stages where the parties work together to finalize a contract',
    'negotiations': 'My negotiations involve the buying and selling stages where the parties work together to finalize a contract',
    'what is my contract': 'The contracts section displays the finalized contracts, which are also available for download in PDF format.',
    'my contract': 'The contracts section displays the finalized contracts, which are also available for download in PDF format.',
    'contract': 'The contracts section displays the finalized contracts, which are also available for download in PDF format.',
    'what is my demands': 'My Demands presents a list of crop demands in the market that the company generates along with the timeline.',
    'demand': 'To create a demand in the market, click the "Create Demand" button in My Demands and fill in the required details.',
    'my demands': 'My Demands presents a list of crop demands in the market that the company generates along with the timeline.',
    'what is my procurements': 'My Procurements displays a list of procurement offers made by the distributor to farmers, including details of each offer.',
    'my procurements': 'My Procurements displays a list of procurement offers made by the distributor to farmers, including details of each offer.',
    'procurements': 'My Procurements displays a list of procurement offers made by the distributor to farmers, including details of each offer.',
    'what is my offers': 'My Offers shows a list of offers made by the distributor to the company, along with their details.',
    'my offers': 'My Offers shows a list of offers made by the distributor to the company, along with their details.',
    "offers": 'My Offers shows a list of offers made by the distributor to the company, along with their details.',
    'supply': 'To create a supply, click the "Create Supply" button in My Supplies and enter the necessary details. Also, you can commit to a particular demand in the Market View to generate a supply.'
};

const normalizeInput = (input: string) => {
    let normalized = input.toLowerCase();
    normalized = normalized.replace(/[^\w\s]/g, '').trim();
    return normalized;
};

const Chatbox = () => {
    const [showChat, setShowChat] = useState<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            const formattedInput = normalizeInput(input);
            setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
            const response = responses[formattedInput] || 'Sorry, I do not understand that.';
            setMessages((prevMessages) => [...prevMessages, `Bot: ${response}`]);
            setInput('');
            if ('virtualKeyboard' in navigator) {
                (navigator as any).virtualKeyboard.show();
            }
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <IconButton
                sx={{ 
                    position: "fixed", 
                    bottom: "3rem", 
                    right: "3rem", 
                    zIndex: 1000, 
                    fontSize: "2rem", // Increase the icon size
                    border: "2px solid black",
                    padding: "1rem"
                }}
                color="primary"
                onClick={() => setShowChat(true)}
            >
                <ChatIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
            <Dialog open={showChat} onClose={() => setShowChat(false)}>
                <DialogContent sx={{ height: "30%" }}>
                    <div className="chatbox">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.startsWith('You:') ? 'message me' : 'message them'}>
                                    {msg}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="compose">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <button type="submit">
                                    <SendIcon sx={{ verticalAlign: 'middle', marginRight: 1 }} />
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Chatbox;
