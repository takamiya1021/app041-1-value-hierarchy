'use client';

import { useState, useRef } from 'react';
import { UserData } from '@/lib/types';
import { motion } from 'framer-motion';
import styles from './ValueMap.module.css';

interface ValueMapProps {
    userData: UserData;
}

export default function ValueMap({ userData }: ValueMapProps) {
    const [imageData, setImageData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const generateMap = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('APIキーが設定されていません。トップページの設定で設定してください。');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'map',
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
            console.error('Map Generation Error:', err);
            setError('マップの生成に失敗しました。もう一度試してください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.header}>
                <h3>価値観の地図</h3>
                <p>AIがあなたの価値観のつながりを可視化します</p>
                {!imageData && !isLoading && (
                    <button onClick={generateMap} className={styles.generateButton}>
                        マップを生成する
                    </button>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>AIが価値観のつながりを描いています...</p>
                </div>
            )}

            {imageData && (
                <motion.div
                    className={styles.mapArea}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="価値観の地図"
                        className={styles.mapImage}
                    />
                    <div className={styles.legend}>
                        <p>※ AIが生成したイメージ図です</p>
                        <button onClick={generateMap} className={styles.regenerateButton}>
                            再生成する
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
