// src/app/page.tsx
"use client";

import { useChat, Message } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/solid";

export default function ChatPage() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (chatContainerRef.current) {
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
    <main className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Header */}
      <header className="fixed top-4 left-4 right-4 z-10 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-lg px-4 py-3 flex flex-col items-center justify-center transition-all duration-300 ease-in-out">
        <span className="flex items-center gap-2">
          <Image 
            src="/kitty.png" 
            alt="Kitty Icon" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-full object-cover border-2 border-pink-400 shadow-sm animate-pulse" 
          />
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            desi billi
          </span>
        </span>
        <a
          href="https://www.sarvam.ai/blogs/sarvam-m"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 text-xs md:text-sm text-pink-200/80 font-light tracking-wide hover:text-pink-400 transition-colors flex items-center gap-1"
          style={{ letterSpacing: '0.04em' }}
          title="Learn more about Sarvam-M"
        >
          <span>powered by</span>
          <span className="font-medium">Sarvam-M</span>
          <SparklesIcon className="w-3 h-3 text-pink-300" />
        </a>
      </header>
      
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="pt-24 pb-24 px-4 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500/30 scrollbar-track-transparent z-1 relative"
      >
        {/* Welcome Screen */}
        {showWelcome && messages.length === 0 && input.trim() === "" ? (
          <div className="flex flex-col items-center justify-center w-full h-[80vh] fade-in-welcome animate-fade-in">
            <div className="relative">
              <Image 
                src="/welcome.png" 
                alt="Welcome Kitty" 
                width={288} 
                height={384} 
                className="w-56 md:w-72 mb-6 drop-shadow-2xl animate-float" 
              />
              <div className="absolute -bottom-4 w-full h-12 bg-gradient-to-t from-purple-900/50 to-transparent rounded-full blur-lg"></div>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 text-2xl md:text-3xl font-bold text-center mb-4 animate-fade-in-up">
              hey 😺 kya scene hai?
            </div>
            <div className="text-zinc-300/80 text-base md:text-lg text-center max-w-md animate-fade-in-up delay-100">
              I&apos;m all ears (and tail), and a prompt. Ask desi billi anything on your mind…
            </div>
          </div>
        ) : (
          <>
            {messages.length === 0 && !isLoading && (
              <div className="text-zinc-400 text-center mt-20 text-lg animate-pulse">
                Start chatting with desi billi…
              </div>
            )}
            {isLoading && messages.length === 0 && (
              <div className="text-zinc-300 text-center mt-20 text-lg flex flex-col items-center justify-center">
                <div className="flex space-x-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                desi billi is thinking...
              </div>
            )}
            {messages.map((m: Message, index: number) => (
              <div
                key={m.id || `message-${index}`}
                className={`flex w-full ${
                  m.role === "user" ? "justify-end" : "justify-start"
                } mb-4 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm text-base font-medium break-words transition-all max-w-[85vw] sm:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%]
                    ${m.role === "user"
                      ? "bg-gradient-to-br from-blue-500/80 to-blue-600/80 text-white border border-blue-400/30"
                      : "bg-gradient-to-br from-pink-500/80 to-pink-600/80 text-white assistant-bubble border border-pink-400/30"
                    }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-invert prose-pink max-w-none">
                      <ReactMarkdown>
                        {typeof m.content === "string" ? m.content : "Error: Content not a string"}
                      </ReactMarkdown>
                    </div>
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
      </div>
      
      {/* Floating Input */}
      <div className="fixed bottom-4 left-4 right-4 z-10">
        <form
          onSubmit={handleFormSubmit}
          className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-3 flex gap-2 transition-all duration-300 hover:bg-white/15"
        >
          <Input
            className="flex-1 bg-white/10 text-white border-0 focus:ring-2 focus:ring-pink-400/50 placeholder:text-zinc-400 rounded-xl h-12"
            value={input}
            onChange={handleInputChangeWithWelcome}
            placeholder="Ask desi billi anything..."
            autoFocus
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-xl h-12 px-5 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">Thinking</span>
                <span className="flex space-x-1">
                  <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
              </span>
            ) : (
              <>
                <span>Send</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
      
      {error && (
        <div className="fixed bottom-20 left-4 right-4 p-3 text-center text-sm text-red-400 bg-red-950/50 border border-red-800/50 rounded-xl backdrop-blur-md">
          App Error: {error.message}
        </div>
      )}
    </main>
  );
}
