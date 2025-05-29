// src/app/page.tsx
"use client";

import { useChat, Message, CreateMessage } from "@ai-sdk/react"; // Message and CreateMessage might be needed
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, FormEvent, useState } from "react"; // Ensure useRef and useEffect are imported
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
    setMessages,
    reload,
  } = useChat({
    api: "/api/chat",
    onError: (err) => {
      console.error("[ChatPage] useChat onError callback:", err);
    },
    onFinish: (message) => {
      console.log(
        "[ChatPage] useChat onFinish callback - Assistant message:",
        JSON.stringify(message, null, 2)
      );
    },
  });

  const chatContainerRef = useRef<HTMLDivElement>(null); // Correct declaration
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (chatContainerRef.current) { // Correct usage
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    console.log(
      "[ChatPage] messages array updated:",
      JSON.stringify(messages, null, 2)
    );
  }, [messages]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  // Update showWelcome when user types
  const handleInputChangeWithWelcome = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    if (showWelcome && e.target.value.trim() !== "") {
      setShowWelcome(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center px-2 py-4">
      <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-[calc(100vh-3rem)] flex flex-col shadow-2xl bg-zinc-950/80 border-zinc-800 px-0 sm:px-2 md:px-6 lg:px-10 transition-all">
        {/* Minimal Branding/Header */}
        <div className="w-full flex flex-col items-center justify-center py-3 border-b border-zinc-800 mb-2">
          <span className="flex items-center gap-2">
            <img src="/kitty.png" alt="Kitty Icon" className="w-8 h-8 rounded-full object-cover border-2 border-pink-400 shadow-sm" />
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-pink-500">desi billi</span>
          </span>
          <a
            href="https://www.sarvam.ai/blogs/sarvam-m"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs md:text-sm text-pink-200 font-light tracking-wide hover:text-pink-400 underline underline-offset-4 transition-colors"
            style={{ letterSpacing: '0.04em' }}
            title="Learn more about Sarvam-M"
          >
            powered by Sarvam-M
          </a>
        </div>
        <CardContent
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 flex flex-col items-center justify-center"
        >
          {/* Welcome Screen */}
          {showWelcome && messages.length === 0 && input.trim() === "" ? (
            <div className="flex flex-col items-center justify-center w-full h-full fade-in-welcome">
              <img src="/welcome.png" alt="Welcome Kitty" className="w-56 md:w-72 mb-6" />
              <div className="text-pink-200 text-2xl md:text-3xl font-bold text-center mb-2">hey 😺 kya scene hai? I'm all ears (and tail), and a prompt.</div>
              <div className="text-zinc-400 text-base md:text-lg text-center">ask desi billi anything on your mind…</div>
            </div>
          ) : (
            <>
              {messages.length === 0 && !isLoading && (
                <div className="text-zinc-400 text-center mt-20 text-lg">
                  Start chatting with desi billi…
                </div>
              )}
              {isLoading && messages.length === 0 && (
                <div className="text-zinc-400 text-center mt-20 text-lg">
                  desi billi is thinking...
                </div>
              )}
              {messages.map((m: Message, index: number) => (
                <div
                  key={m.id || `message-${index}`}
                  className={`flex w-full ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 shadow-md text-base font-medium break-words transition-all
                      ${m.role === "user"
                        ? "bg-zinc-700 text-zinc-100 max-w-[85vw] sm:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]"
                        : "bg-pink-700 text-white assistant-bubble max-w-[85vw] sm:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%]"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <ReactMarkdown>{typeof m.content === "string" ? m.content : "Error: Content not a string"}</ReactMarkdown>
                    ) : (
                      typeof m.content === "string" ? m.content : "Error: Content not a string"
                    )}
                    {m.role === "assistant" && isLoading && index === messages.length - 1 && (
                      <span className="animate-pulse ml-1">▍</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </CardContent>
        <form
          onSubmit={handleFormSubmit}
          className="flex gap-2 p-4 border-t border-zinc-800 bg-zinc-950/90"
        >
          <Input
            className="flex-1 bg-zinc-900 text-zinc-100 border-zinc-700 focus:ring-2 focus:ring-zinc-400 placeholder:text-zinc-500"
            value={input}
            onChange={handleInputChangeWithWelcome}
            placeholder="Ask desi billi anything..."
            autoFocus
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </form>
        {error && (
          <div className="p-3 text-center text-sm text-red-400 bg-red-950/50 border-t border-zinc-800">
            App Error: {error.message}
          </div>
        )}
      </Card>
    </main>
  );
}
