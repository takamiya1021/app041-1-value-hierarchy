'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { loadData, saveData, exportDataAsJSON, exportDataAsText } from '@/lib/storage';
import { UserData, Insight } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SocraticChat from '@/components/SocraticChat';
import ValueMap from '@/components/ValueMap';
import styles from './Analysis.module.css';

const GROUP_COLORS = [
    'hsl(0, 70%, 60%)',
    'hsl(30, 70%, 60%)',
    'hsl(60, 70%, 60%)',
    'hsl(120, 70%, 60%)',
    'hsl(180, 70%, 60%)',
    'hsl(240, 70%, 60%)',
    'hsl(280, 70%, 60%)',
    'hsl(320, 70%, 60%)',
];

type ExportConfig = {
    type: 'json' | 'text';
    content: string;
    filename: string;
};

export default function AnalysisPage() {
    const router = useRouter();
    const [data, setData] = useState<UserData | null>(null);
    const [insights, setInsights] = useState<Map<string, string>>(new Map());

    // モーダル用state
    const [showModal, setShowModal] = useState(false);
    const [exportConfig, setExportConfig] = useState<ExportConfig | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loaded = loadData();
        if (!loaded || loaded.answers.length === 0) {
            router.push('/');
            return;
        }
        setData(loaded);

        // 既存のinsightsを読み込み
        const insightMap = new Map<string, string>();
        loaded.insights.forEach(insight => {
            insightMap.set(insight.groupId, insight.reflection);
        });
        setInsights(insightMap);
    }, [router]);

    if (!data) return null;

    const handleInsightChange = (groupId: string, reflection: string) => {
        const newInsights = new Map(insights);
        newInsights.set(groupId, reflection);
        setInsights(newInsights);
    };

    const handleSaveInsights = () => {
        const insightArray: Insight[] = Array.from(insights.entries()).map(([groupId, reflection]) => ({
            groupId,
            reflection
        }));

        const updatedData: UserData = {
            ...data,
            insights: insightArray,
            timestamp: Date.now()
        };

        saveData(updatedData);
        setData(updatedData);
    };

    // エクスポートボタンクリック時の処理（モーダル表示）
    const handleExportClick = (type: 'json' | 'text') => {
        const date = new Date().toISOString().split('T')[0];
        let content = '';
        let filename = '';

        if (type === 'json') {
            content = exportDataAsJSON(data);
            filename = `value-hierarchy-${date}.json`;
        } else {
            content = exportDataAsText(data);
            filename = `value-hierarchy-${date}.txt`;
        }

        setExportConfig({ type, content, filename });
        setShowModal(true);
    };

    // ダウンロード実行処理
    const executeDownload = () => {
        if (!exportConfig) return;

        const { type, content, filename } = exportConfig;
        let url = '';

        try {
            if (type === 'json') {
                url = `data:application/json;charset=utf-8,${encodeURIComponent(content)}`;
            } else {
                url = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
            }

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setShowModal(false);
            setExportConfig(null);
        } catch (error) {
            console.error('Download failed:', error);
            alert('ダウンロードに失敗しました。');
        }
    };

    // グループごとの回答数を集計
    const groupData = data.groups.map(group => ({
        name: group.label,
        count: group.answerIds.length,
        color: group.color
    }));

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>価値観の分析</h1>
                    <p>グループごとに深掘りして、あなたの価値観を明確にしましょう</p>
                </div>

                {/* 可視化セクション */}
                {data.groups.length > 0 && (
                    <div className={styles.visualization}>
                        <h2>価値観の分布</h2>
                        <div className={styles.charts}>
                            <div className={styles.chartCard}>
                                <h3>グループ別回答数</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={groupData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count">
                                            {groupData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>価値観の割合</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={groupData}
                                            dataKey="count"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {groupData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* 深掘り質問セクション */}
                {data.groups.length > 0 ? (
                    <div className={styles.insights}>
                        <h2>深掘り分析</h2>
                        <p>各グループについて「なぜそれをやるのか？」を考えてみましょう</p>

                        <div className={styles.insightList}>
                            {data.groups.map(group => (
                                <div
                                    key={group.id}
                                    className={styles.insightCard}
                                    style={{ borderLeftColor: group.color }}
                                >
                                    <h3>{group.label}</h3>
                                    <div className={styles.groupItems}>
                                        {data.answers
                                            .filter(a => group.answerIds.includes(a.id))
                                            .map(answer => (
                                                <div key={answer.id} className={styles.groupItem}>
                                                    • {answer.text}
                                                </div>
                                            ))}
                                    </div>
                                    <div className={styles.reflectionField}>
                                        <label>なぜこれらのことをやるのか？</label>
                                        <textarea
                                            value={insights.get(group.id) || ''}
                                            onChange={(e) => handleInsightChange(group.id, e.target.value)}
                                            placeholder="このグループに共通する目的や価値観を書いてください"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.saveButton}>
                            <button onClick={handleSaveInsights}>
                                分析を保存
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.noGroups}>
                        <p>まだグループが作成されていません。</p>
                        <button onClick={() => router.push('/summary')}>
                            まとめ画面に戻る
                        </button>
                    </div>
                )}

                {/* AIチャットセクション */}
                {data.groups.length > 0 && (
                    <>
                        <SocraticChat userData={data} />
                        <ValueMap userData={data} />
                    </>
                )}

                {/* エクスポートセクション */}
                <div className={styles.export}>
                    <h2>結果のエクスポート</h2>
                    <div className={styles.exportButtons}>
                        <button type="button" onClick={() => handleExportClick('json')}>
                            📄 JSONでダウンロード
                        </button>
                        <button type="button" onClick={() => handleExportClick('text')}>
                            📝 テキストでダウンロード
                        </button>
                    </div>
                </div>

                <div className={styles.navigation}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/summary')}
                    >
                        ← まとめに戻る
                    </button>
                    <button
                        className={styles.homeButton}
                        onClick={() => router.push('/')}
                    >
                        🏠 最初に戻る
                    </button>
                </div>

                {/* 確認モーダル（Portalでbody直下に描画） */}
                {showModal && exportConfig && mounted && createPortal(
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <h2>ダウンロードの確認</h2>
                            <p>以下の内容でファイルを保存しますか？</p>

                            <div className={styles.previewContainer}>
                                <label>ファイル名:</label>
                                <div className={styles.fileName}>{exportConfig.filename}</div>

                                <label>内容プレビュー:</label>
                                <div className={styles.previewArea}>
                                    {exportConfig.content}
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowModal(false)}
                                >
                                    キャンセル
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={executeDownload}
                                >
                                    ダウンロード実行
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
}
