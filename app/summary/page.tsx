'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadData, saveData } from '@/lib/storage';
import { UserData, Group, CATEGORIES } from '@/lib/types';
import FutureSelf from '@/components/FutureSelf';
import styles from './Summary.module.css';

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

export default function SummaryPage() {
    const router = useRouter();
    const [data, setData] = useState<UserData | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Set<number>>(new Set());
    const [groupLabel, setGroupLabel] = useState('');

    useEffect(() => {
        const loaded = loadData();
        console.log('SummaryPage loaded data:', loaded);
        if (!loaded || loaded.answers.length === 0) {
            router.push('/');
            return;
        }
        setData(loaded);
    }, [router]);

    if (!data) return null;

    const handleToggleAnswer = (answerId: number) => {
        const newSelected = new Set(selectedAnswers);
        if (newSelected.has(answerId)) {
            newSelected.delete(answerId);
        } else {
            newSelected.add(answerId);
        }
        setSelectedAnswers(newSelected);
    };

    const handleCreateGroup = () => {
        if (selectedAnswers.size === 0 || !groupLabel.trim()) return;

        const colorIndex = data.groups.length % GROUP_COLORS.length;
        const newGroup: Group = {
            id: `group-${Date.now()}`,
            label: groupLabel,
            color: GROUP_COLORS[colorIndex],
            answerIds: Array.from(selectedAnswers)
        };

        // 選択された回答にグループIDを設定
        const updatedAnswers = data.answers.map(answer => {
            if (selectedAnswers.has(answer.id)) {
                return { ...answer, groupId: newGroup.id };
            }
            return answer;
        });

        const updatedData: UserData = {
            ...data,
            answers: updatedAnswers,
            groups: [...data.groups, newGroup],
            timestamp: Date.now()
        };

        saveData(updatedData);
        setData(updatedData);
        setSelectedAnswers(new Set());
        setGroupLabel('');
    };

    const handleRemoveGroup = (groupId: string) => {
        // グループを削除し、回答からgroupIdを削除
        const updatedAnswers = data.answers.map(answer => {
            if (answer.groupId === groupId) {
                const { groupId: _, ...rest } = answer;
                return rest;
            }
            return answer;
        });

        const updatedData: UserData = {
            ...data,
            answers: updatedAnswers,
            groups: data.groups.filter(g => g.id !== groupId),
            insights: data.insights.filter(i => i.groupId !== groupId),
            timestamp: Date.now()
        };

        saveData(updatedData);
        setData(updatedData);
    };

    // カテゴリーごとに回答を整理
    const answersByCategory = CATEGORIES.map(category => ({
        category,
        answers: data.answers.filter(a => a.category === category.id).sort((a, b) => a.index - b.index)
    }));

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>回答のまとめ</h1>
                    <p>似たような回答をグループ化して、あなたの価値観を整理しましょう</p>
                </div>

                {/* グループ作成エリア */}
                <div className={styles.groupCreator}>
                    <h2>グループを作成</h2>
                    <p>似ている回答を選択してグループ化してください</p>
                    <div className={styles.groupForm}>
                        <input
                            type="text"
                            placeholder="グループ名（例：健康、学習、家族）"
                            value={groupLabel}
                            onChange={(e) => setGroupLabel(e.target.value)}
                        />
                        <button
                            onClick={handleCreateGroup}
                            disabled={selectedAnswers.size === 0 || !groupLabel.trim()}
                        >
                            グループ作成 ({selectedAnswers.size}個選択中)
                        </button>
                    </div>
                </div>

                {/* 既存のグループ表示 */}
                {data.groups.length > 0 && (
                    <div className={styles.existingGroups}>
                        <h2>作成済みグループ</h2>
                        <div className={styles.groupList}>
                            {data.groups.map(group => (
                                <div
                                    key={group.id}
                                    className={styles.groupCard}
                                    style={{ borderLeftColor: group.color }}
                                >
                                    <div className={styles.groupHeader}>
                                        <h3>{group.label}</h3>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleRemoveGroup(group.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <ul>
                                        {data.answers
                                            .filter(a => group.answerIds.includes(a.id))
                                            .map(answer => (
                                                <li key={answer.id}>{answer.text}</li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 全回答の一覧 */}
                <div className={styles.allAnswers}>
                    <h2>全ての回答</h2>
                    <div className={styles.answerGrid}>
                        {answersByCategory.map(({ category, answers }) => (
                            <div key={category.id} className={styles.categorySection}>
                                <h3>{category.title}</h3>
                                <div className={styles.answerList}>
                                    {answers.map(answer => {
                                        const isSelected = selectedAnswers.has(answer.id);
                                        const group = data.groups.find(g => g.id === answer.groupId);

                                        return (
                                            <div
                                                key={answer.id}
                                                className={`${styles.answerItem} ${isSelected ? styles.selected : ''}`}
                                                style={{
                                                    borderLeftColor: group?.color,
                                                    borderLeftWidth: group ? '4px' : '2px'
                                                }}
                                                onClick={() => handleToggleAnswer(answer.id)}
                                            >
                                                <div className={styles.answerText}>{answer.text}</div>
                                                {answer.purpose && (
                                                    <div className={styles.answerPurpose}>
                                                        目的: {answer.purpose}
                                                    </div>
                                                )}
                                                {group && (
                                                    <div className={styles.answerGroup}>
                                                        🏷️ {group.label}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI 未来シミュレーター */}
                {data.groups.length > 0 && (
                    <FutureSelf userData={data} />
                )}

                <div className={styles.navigation}>
                    <button
                        className={styles.backButton}
                        onClick={() => router.push('/question/8')}
                    >
                        ← 質問に戻る
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={() => router.push('/analysis')}
                    >
                        分析へ進む →
                    </button>
                </div>
            </div>
        </div>
    );
}
