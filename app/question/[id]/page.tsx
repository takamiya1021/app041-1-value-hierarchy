'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';
import { loadData, saveData, createInitialData, updateAnswer } from '@/lib/storage';
import styles from './Question.module.css';

export default function QuestionPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = parseInt(params.id as string);

    const [answers, setAnswers] = useState<string[]>(['', '', '']);
    const [purpose, setPurpose] = useState('');
    const [showGuidance, setShowGuidance] = useState(false);

    const category = CATEGORIES.find(c => c.id === categoryId);

    useEffect(() => {
        // 既存データの読み込み
        const data = loadData();
        console.log('Loaded data for category', categoryId, ':', data);
        if (data) {
            const existingAnswers = data.answers.filter(a => a.category === categoryId);
            const newAnswers = ['', '', ''];
            let newPurpose = '';

            existingAnswers.forEach(answer => {
                newAnswers[answer.index - 1] = answer.text;
                if (answer.index === 2 && answer.purpose) {
                    newPurpose = answer.purpose;
                }
            });

            setAnswers(newAnswers);
            setPurpose(newPurpose);
        }
    }, [categoryId]);

    const handleSave = () => {
        let data = loadData() || createInitialData();

        // 各回答を保存
        answers.forEach((text, index) => {
            if (text.trim()) {
                const purposeText = index === 1 ? purpose : undefined;
                data = updateAnswer(data, categoryId, index + 1, text, purposeText);
            }
        });

        console.log('Saving data:', data);
        saveData(data);
    };

    const handleNext = () => {
        handleSave();

        if (categoryId < 8) {
            router.push(`/question/${categoryId + 1}`);
        } else {
            router.push('/summary');
        }
    };

    const handleBack = () => {
        handleSave();

        if (categoryId > 1) {
            router.push(`/question/${categoryId - 1}`);
        } else {
            router.push('/');
        }
    };

    if (!category) {
        return <div>カテゴリーが見つかりません</div>;
    }

    const progress = (categoryId / 8) * 100;
    const canProceed = answers.some(a => a.trim().length > 0);

    return (
        <div className={styles.container}>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className={styles.content} key={categoryId}>
                <div className={styles.header}>
                    <span className={styles.categoryNumber}>カテゴリー {categoryId} / 8</span>
                    <h1 className={styles.title}>{category.title}</h1>
                    <p className={styles.description}>{category.description}</p>
                </div>

                <div className={styles.card}>
                    <button
                        className={styles.guidanceToggle}
                        onClick={() => setShowGuidance(!showGuidance)}
                    >
                        {showGuidance ? '▼' : '▶'} ガイダンス・具体例を見る
                    </button>

                    {showGuidance && (
                        <div className={styles.guidance}>
                            <p className={styles.guidanceText}>{category.guidance}</p>
                            <div className={styles.examples}>
                                <strong>具体例：</strong>
                                <ul>
                                    {category.examples.map((example, i) => (
                                        <li key={i}>{example}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className={styles.questions}>
                        <div className={styles.question}>
                            <label>1番目に多いもの・費やしているものは？</label>
                            <input
                                type="text"
                                value={answers[0]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[0] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                placeholder="具体的な事実を書いてください"
                            />
                        </div>

                        <div className={styles.question}>
                            <label>2番目に多いもの・費やしているものは？</label>
                            <input
                                type="text"
                                value={answers[1]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[1] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                placeholder="具体的な事実を書いてください"
                            />
                            <div className={styles.purposeField}>
                                <label>それは何のため？</label>
                                <input
                                    type="text"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="目的や理由を書いてください"
                                />
                            </div>
                        </div>

                        <div className={styles.question}>
                            <label>3番目に多いもの・費やしているものは？</label>
                            <input
                                type="text"
                                value={answers[2]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[2] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                placeholder="具体的な事実を書いてください"
                            />
                        </div>
                    </div>

                    <div className={styles.note}>
                        💡 想像ではなく、具体的な事実を書きましょう
                    </div>
                </div>

                <div className={styles.navigation}>
                    <button
                        className={styles.backButton}
                        onClick={handleBack}
                    >
                        ← 戻る
                    </button>
                    <button
                        className={styles.nextButton}
                        onClick={handleNext}
                        disabled={!canProceed}
                    >
                        {categoryId < 8 ? '次へ →' : 'まとめへ →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
