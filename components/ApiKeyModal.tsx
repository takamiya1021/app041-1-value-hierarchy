'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ApiKeyModal.module.css';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const [apiKey, setApiKey] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            onClose();
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.backdrop}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className={styles.modal}
                    >
                        <div className={styles.header}>
                            <h2>APIキー設定</h2>
                            <button onClick={onClose} className={styles.closeButton}>✕</button>
                        </div>
                        <div className={styles.content}>
                            <p>AI機能を使用するには、Google Gemini APIキーが必要です。</p>
                            <p className={styles.note}>※ キーはブラウザにのみ保存され、サーバーには送信されません。</p>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Gemini API Key"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.footer}>
                            <button onClick={onClose} className={styles.cancelButton}>キャンセル</button>
                            <button onClick={handleSave} className={styles.saveButton}>保存する</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
