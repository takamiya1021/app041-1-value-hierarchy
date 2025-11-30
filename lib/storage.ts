import { UserData, Answer, Group, Insight } from './types';

const STORAGE_KEY = 'value-hierarchy-data';

// データの保存
export function saveData(data: UserData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save data:', error);
    }
}

// データの読み込み
export function loadData(): UserData | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as UserData;
    } catch (error) {
        console.error('Failed to load data:', error);
        return null;
    }
}

// 初期データの作成
export function createInitialData(): UserData {
    return {
        answers: [],
        groups: [],
        insights: [],
        timestamp: Date.now()
    };
}

// 回答の更新
export function updateAnswer(
    data: UserData,
    categoryId: number,
    index: number,
    text: string,
    purpose?: string
): UserData {
    const answerId = (categoryId - 1) * 3 + index;
    const existingIndex = data.answers.findIndex(a => a.id === answerId);

    const newAnswer: Answer = {
        id: answerId,
        category: categoryId,
        index,
        text,
        purpose
    };

    const newAnswers = existingIndex >= 0
        ? data.answers.map((a, i) => i === existingIndex ? newAnswer : a)
        : [...data.answers, newAnswer];

    return {
        ...data,
        answers: newAnswers,
        timestamp: Date.now()
    };
}

// データのリセット
export function resetData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to reset data:', error);
    }
}

// データのエクスポート（JSON）
export function exportDataAsJSON(data: UserData): string {
    return JSON.stringify(data, null, 2);
}

// データのエクスポート（テキスト）
export function exportDataAsText(data: UserData): string {
    let text = '価値の序列 - 自己分析結果\n';
    text += '='.repeat(50) + '\n\n';

    // 回答を表示
    for (let cat = 1; cat <= 8; cat++) {
        const categoryAnswers = data.answers.filter(a => a.category === cat);
        if (categoryAnswers.length === 0) continue;

        text += `カテゴリー ${cat}\n`;
        text += '-'.repeat(50) + '\n';

        categoryAnswers.forEach(answer => {
            text += `${answer.index}. ${answer.text}\n`;
            if (answer.purpose) {
                text += `   目的: ${answer.purpose}\n`;
            }
        });
        text += '\n';
    }

    // グループを表示
    if (data.groups.length > 0) {
        text += '\n' + '='.repeat(50) + '\n';
        text += 'グループ分析\n';
        text += '='.repeat(50) + '\n\n';

        data.groups.forEach(group => {
            text += `【${group.label}】\n`;
            const groupAnswers = data.answers.filter(a =>
                group.answerIds.includes(a.id)
            );
            groupAnswers.forEach(answer => {
                text += `  - ${answer.text}\n`;
            });

            const insight = data.insights.find(i => i.groupId === group.id);
            if (insight) {
                text += `  なぜ？: ${insight.reflection}\n`;
            }
            text += '\n';
        });
    }

    return text;
}
