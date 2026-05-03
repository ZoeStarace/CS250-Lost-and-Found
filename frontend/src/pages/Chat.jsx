import { useState, useEffect, useRef, useContext } from "react";
import { clientAuth } from "../firebase";
import axios from "axios";
import { UserContext } from "../userState";
import "./chat.css";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const { loginState } = useContext(UserContext);

    async function fetchMessages() {
        try {
            const token = await clientAuth.currentUser.getIdToken();
            const res = await axios.get("/api/chat", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch {
            alert("Error fetching chat");
        }
    }

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function sendMessage(e) {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed || sending) return;
        setSending(true);
        try {
            const token = await clientAuth.currentUser.getIdToken();
            await axios.post(
                "/api/chat",
                { text: trimmed },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setText("");
            await fetchMessages();
        } catch {
            alert("Failed to send message.");
        } finally {
            setSending(false);
        }
    }

    const currentUid = clientAuth.currentUser?.uid;

    return (
        <div className="chat-page">
            <div className="chat-header">
                <h2>Global Chat</h2>
                <p>Chat with the SDSU Lost &amp; Found community</p>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-empty">No messages yet. Say hello!</div>
                )}
                {messages.map((msg) => {
                    const isOwn = msg.uid === currentUid;
                    return (
                        <div key={msg.id} className={`chat-bubble-row ${isOwn ? "own" : "other"}`}>
                            {!isOwn && (
                                <div className="chat-avatar">{(msg.displayName || "?")[0].toUpperCase()}</div>
                            )}
                            <div className="chat-bubble-group">
                                {!isOwn && <span className="chat-name">{msg.displayName || "Anonymous"}</span>}
                                <div className={`chat-bubble ${isOwn ? "bubble-own" : "bubble-other"}`}>
                                    {msg.text}
                                </div>
                                <span className="chat-time">
                  {msg.sentAt
                      ? new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}
                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form className="chat-input-row" onSubmit={sendMessage}>
                <input
                    className="chat-input"
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={500}
                    disabled={!loginState}
                />
                <button className="chat-send-btn" type="submit" disabled={!text.trim() || sending}>
                    {sending ? "..." : "Send"}
                </button>
            </form>
        </div>
    );
}
