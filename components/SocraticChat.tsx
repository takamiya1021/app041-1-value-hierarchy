'use client';

import { useState, useEffect, useRef } from 'react';
import { UserData } from '@/lib/types';
import { generateAIResponse } from '@/lib/ai';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SocraticChat.module.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface SocraticChatProps {
    userData: UserData;
}

export default function SocraticChat({ userData }: SocraticChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        } else {
            setShowKeyInput(true);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            setShowKeyInput(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await generateAIResponse({
                type: 'chat',
                data: userData,
                prompt: input,
                apiKey
            });

            const aiMessage: Message = { role: 'assistant', content: response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'すみません、エラーが発生しました。APIキーを確認してください。' }]);
            setShowKeyInput(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>AI壁打ちパートナー</h3>
                <button
                    className={styles.settingsButton}
                    onClick={() => setShowKeyInput(!showKeyInput)}
                >
                    ⚙️
                </button>
            </div>

            <AnimatePresence>
                {showKeyInput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.keyInputArea}
                    >
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Gemini API Key"
                            className={styles.keyInput}
                        />
                        <button onClick={handleSaveKey} className={styles.saveKeyButton}>保存</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.chatWindow}>
                {messages.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>あなたの価値観について、深掘りしてみましょう。</p>
                        <p>「なぜこの価値観が大切なの？」と聞いてみてください。</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.message} ${msg.role === 'user' ? styles.user : styles.assistant}`}
                    >
                        <div className={styles.messageContent}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className={styles.loading}>
                        <span>AIが考え中...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
                    placeholder="メッセージを入力..."
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    送信
                </button>
            </div>
        </div>
    );
}
