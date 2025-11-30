'use client';

import { useState } from 'react';
import { UserData } from '@/lib/types';
import { generateAIResponse } from '@/lib/ai';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import styles from './FutureSelf.module.css';

interface FutureSelfProps {
    userData: UserData;
}

export default function FutureSelf({ userData }: FutureSelfProps) {
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateStory = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('APIキーが設定されていません。分析画面のAIチャットで設定してください。');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await generateAIResponse({
                type: 'future',
                data: userData,
                apiKey
            });

            setStory(response);
        } catch (err) {
            console.error('Future Generation Error:', err);
            setError('ストーリーの生成に失敗しました。もう一度試してください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>未来シミュレーター</h3>
                <p>あなたの価値観を大切にして生きた、10年後の未来を覗いてみましょう。</p>
            </div>

            {!story && !isLoading && (
                <div className={styles.actionArea}>
                    <button onClick={generateStory} className={styles.generateButton}>
                        未来を想像する
                    </button>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>AIが未来のシナリオを描いています...</p>
                </div>
            )}

            {story && (
                <motion.div
                    className={styles.storyCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.storyContent}>
                        <ReactMarkdown>{story}</ReactMarkdown>
                    </div>
                    <button onClick={generateStory} className={styles.regenerateButton}>
                        別の未来も見てみる
                    </button>
                </motion.div>
            )}
        </div>
    );
}
