'use client';

import { useState, useEffect, useRef } from 'react';
import { UserData } from '@/lib/types';
import { generateAIResponse } from '@/lib/ai';
import { motion } from 'framer-motion';
import styles from './ValueMap.module.css';

interface Node {
    id: string;
    label: string;
    color: string;
    size: number;
    x?: number;
    y?: number;
}

interface Link {
    source: string;
    target: string;
    reason: string;
}

interface MapData {
    nodes: Node[];
    links: Link[];
}

interface ValueMapProps {
    userData: UserData;
}

export default function ValueMap({ userData }: ValueMapProps) {
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const generateMap = async () => {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            setError('APIキーが設定されていません。AIチャットで設定してください。');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await generateAIResponse({
                type: 'map',
                data: userData,
                apiKey
            });

            const parsedData: MapData = JSON.parse(response);

            // Simple force-directed layout simulation (or just random/circular for now)
            // Assign random positions initially
            const width = containerRef.current?.clientWidth || 600;
            const height = 400;

            const nodesWithPos = parsedData.nodes.map((node, i) => {
                const angle = (i / parsedData.nodes.length) * 2 * Math.PI;
                const radius = 120;
                return {
                    ...node,
                    x: width / 2 + Math.cos(angle) * radius,
                    y: height / 2 + Math.sin(angle) * radius
                };
            });

            setMapData({ ...parsedData, nodes: nodesWithPos });

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
                {!mapData && !isLoading && (
                    <button onClick={generateMap} className={styles.generateButton}>
                        マップを生成する
                    </button>
                )}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>価値観のつながりを分析中...</p>
                </div>
            )}

            {mapData && (
                <div className={styles.mapArea}>
                    <svg width="100%" height="400">
                        {/* Links */}
                        {mapData.links.map((link, i) => {
                            const source = mapData.nodes.find(n => n.id === link.source);
                            const target = mapData.nodes.find(n => n.id === link.target);
                            if (!source || !target || !source.x || !source.y || !target.x || !target.y) return null;

                            return (
                                <g key={i}>
                                    <line
                                        x1={source.x}
                                        y1={source.y}
                                        x2={target.x}
                                        y2={target.y}
                                        stroke="#cbd5e1"
                                        strokeWidth="2"
                                    />
                                </g>
                            );
                        })}

                        {/* Nodes */}
                        {mapData.nodes.map((node, i) => (
                            <g key={node.id}>
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={node.size * 5 + 20}
                                    fill={node.color}
                                    opacity="0.9"
                                />
                                <text
                                    x={node.x}
                                    y={node.y}
                                    dy=".3em"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="12"
                                    fontWeight="bold"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {node.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                    <div className={styles.legend}>
                        <p>※ AIが価値観同士の関連性を分析してつなげています</p>
                    </div>
                </div>
            )}
        </div>
    );
}
