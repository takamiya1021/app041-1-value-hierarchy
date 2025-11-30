import { UserData } from './types';

export const SAMPLE_DATA: UserData = {
    answers: [
        // 1/8 空間の使い方
        { id: 1, category: 1, index: 1, text: '会社のデスク周りの整理整頓された書類', groupId: 'group-work' },
        { id: 2, category: 1, index: 2, text: '自宅のテーブルにある資格試験のテキスト', purpose: '今のスキルのままでは将来が不安で、何か手に職をつけたいから', groupId: 'group-prep' },
        { id: 3, category: 1, index: 3, text: '部屋の隅にある癒やしの観葉植物', groupId: 'group-healing' },

        // 2/8 時間の使い方
        { id: 4, category: 2, index: 1, text: '会社での事務作業と調整業務', groupId: 'group-work' },
        { id: 5, category: 2, index: 2, text: '寝る前のSNSチェックと将来に関する検索', purpose: '周りの友人の生活が気になったり、自分のキャリアの正解を探してしまうため', groupId: 'group-anxiety' },
        { id: 6, category: 2, index: 3, text: '週末の作り置きと家事', groupId: 'group-life' },

        // 3/8 エネルギーの注ぎ方
        { id: 7, category: 3, index: 1, text: '職場での人間関係への気配り', groupId: 'group-connect' },
        { id: 8, category: 3, index: 2, text: 'ミスなく業務を遂行すること', purpose: '評価を下げたくない、安定した立場を失いたくないという思いがあるため', groupId: 'group-work' },
        { id: 9, category: 3, index: 3, text: '週末の友人とのお茶でのストレス発散', groupId: 'group-healing' },

        // 4/8 お金の使い方
        { id: 10, category: 4, index: 1, text: '毎月の積立NISAとiDeCo', groupId: 'group-prep' },
        { id: 11, category: 4, index: 2, text: '美容院や化粧品などの身だしなみ', purpose: '社会人として最低限のマナーを保ちつつ、少しでも自信を持ちたいため', groupId: 'group-life' },
        { id: 12, category: 4, index: 3, text: 'たまの自分へのご褒美（スイーツやランチ）', groupId: 'group-healing' },

        // 5/8 思考の傾向
        { id: 13, category: 5, index: 1, text: '「このまま会社にいていいのか」という漠然とした不安', groupId: 'group-anxiety' },
        { id: 14, category: 5, index: 2, text: '結婚や出産とキャリアの両立への焦り', purpose: '年齢的なリミットや、ロールモデルが近くにいないことで悩んでいるため', groupId: 'group-anxiety' },
        { id: 15, category: 5, index: 3, text: '副業や転職で環境を変えるシミュレーション', groupId: 'group-growth' },

        // 6/8 コミュニケーション
        { id: 16, category: 6, index: 1, text: '職場の同僚との業務連絡やランチでの会話', groupId: 'group-work' },
        { id: 17, category: 6, index: 2, text: '学生時代の友人との近況報告会', purpose: 'お互いのライフステージの変化を確認し、自分だけが取り残されていないか安心したいため', groupId: 'group-connect' },
        { id: 18, category: 6, index: 3, text: '実家の親への定期的な連絡', groupId: 'group-connect' },

        // 7/8 学習の方向性
        { id: 19, category: 7, index: 1, text: 'TOEICや英語学習', groupId: 'group-growth' },
        { id: 20, category: 7, index: 2, text: '簿記やFPなどのお金の知識', purpose: '会社の給料だけに頼らず、自分で資産を守れるようになりたいため', groupId: 'group-prep' },
        { id: 21, category: 7, index: 3, text: '転職サイトやキャリア形成の記事', groupId: 'group-growth' },

        // 8/8 自己管理
        { id: 22, category: 8, index: 1, text: '毎日のスキンケアとサプリメント', groupId: 'group-life' },
        { id: 23, category: 8, index: 2, text: '自炊による食費と健康の管理', purpose: '将来のために少しでも貯金をしつつ、体調を崩さないようにするため', groupId: 'group-life' },
        { id: 24, category: 8, index: 3, text: '手帳でのスケジュールとTo Do管理', groupId: 'group-life' }
    ],
    groups: [
        {
            id: 'group-prep',
            label: '将来への備え',
            color: 'hsl(120, 70%, 60%)', // Green
            answerIds: [2, 10, 20]
        },
        {
            id: 'group-work',
            label: '職場での役割遂行',
            color: 'hsl(240, 70%, 60%)', // Blue
            answerIds: [1, 4, 8, 16]
        },
        {
            id: 'group-healing',
            label: '心の安定・リフレッシュ',
            color: 'hsl(320, 70%, 60%)', // Pink
            answerIds: [3, 9, 12]
        },
        {
            id: 'group-connect',
            label: '他者との繋がり',
            color: 'hsl(180, 70%, 60%)', // Cyan
            answerIds: [7, 17, 18]
        },
        {
            id: 'group-anxiety',
            label: '現状への不安・焦り',
            color: 'hsl(280, 70%, 60%)', // Purple
            answerIds: [5, 13, 14]
        },
        {
            id: 'group-growth',
            label: '自己成長・キャリア',
            color: 'hsl(0, 70%, 60%)', // Red
            answerIds: [15, 19, 21]
        },
        {
            id: 'group-life',
            label: '生活規律・健康',
            color: 'hsl(30, 70%, 60%)', // Orange
            answerIds: [6, 11, 22, 23, 24]
        }
    ],
    insights: [],
    timestamp: Date.now()
};
