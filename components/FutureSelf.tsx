'use client';

import { useState } from 'react';
import { UserData } from '@/lib/types';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import styles from './FutureSelf.module.css';

interface FutureSelfProps {
    userData: UserData;
}

export default function FutureSelf({ userData }: FutureSelfProps) {
    const [story, setStory] = useState('');
    const [imageData, setImageData] = useState('');
    const [isLoadingStory, setIsLoadingStory] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [error, setError] = useState('');

    const generateStory = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('APIキーが設定されていません。トップページの設定で設定してください。');
            return;
        }

        setIsLoadingStory(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'future',
                    data: userData,
                    apiKey
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Generation failed');
            }

            setStory(result.result);
        } catch (err) {
            console.error('Story Generation Error:', err);
            setError('ストーリーの生成に失敗しました。もう一度試してください。');
        } finally {
            setIsLoadingStory(false);
        }
    };

    const generateImage = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('APIキーが設定されていません。トップページの設定で設定してください。');
            return;
        }

        setIsLoadingImage(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'future-image',
                    data: userData,
                    apiKey
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Generation failed');
            }

            if (result.isImage && result.result) {
                setImageData(result.result);
            } else {
                throw new Error('No image data received');
            }
        } catch (err) {
            console.error('Image Generation Error:', err);
            setError('未来予想図の生成に失敗しました。もう一度試してください。');
        } finally {
            setIsLoadingImage(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>未来シミュレーター</h3>
                <p>あなたの価値観を大切にして生きた、10年後の未来を覗いてみましょう。</p>
            </div>

            {/* 最初は「未来を創造する」ボタンのみ表示 */}
            {!story && !isLoadingStory && (
                <div className={styles.actionArea}>
                    <button onClick={generateStory} className={styles.generateButton}>
                        未来を創造する
                    </button>
                </div>
            )}

            {error && <div className={styles.error}>{error}</div>}

            {isLoadingStory && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>AIが未来のシナリオを描いています...</p>
                </div>
            )}

            {/* テキストストーリー表示 + 2つのボタン並列 */}
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
                    <div className={styles.buttonGroup}>
                        <button onClick={generateStory} className={styles.regenerateButton}>
                            別の未来も見てみる
                        </button>
                        <button
                            onClick={generateImage}
                            className={styles.imageButton}
                            disabled={isLoadingImage}
                        >
                            {isLoadingImage ? '描画中...' : '未来予想図'}
                        </button>
                    </div>
                </motion.div>
            )}

            {isLoadingImage && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>AIが未来のビジョンを描いています...</p>
                </div>
            )}

            {imageData && (
                <motion.div
                    className={styles.imageCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="未来予想図"
                        className={styles.futureImage}
                    />
                    <button onClick={generateImage} className={styles.regenerateButton}>
                        別の未来予想図も見てみる
                    </button>
                </motion.div>
            )}
        </div>
    );
}
