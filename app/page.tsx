'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Welcome.module.css';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>価値の序列</h1>
        <p className={styles.subtitle}>あなたの本当の価値観を発見する</p>

        <div className={styles.card}>
          <h2>このアプリについて</h2>
          <p>
            日常の具体的な事実から、あなたが本当に大切にしているものを見つけ出します。
          </p>
          <p>
            8つの観点から自分の行動を振り返り、価値観を可視化していきましょう。
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Image
                  src="/images/feature-perspectives.png"
                  alt="8つの観点"
                  width={120}
                  height={120}
                  className={styles.iconImage}
                />
              </div>
              <h3>8つの観点</h3>
              <p>空間、時間、エネルギー、お金など、多角的に分析</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Image
                  src="/images/feature-insights.png"
                  alt="深い洞察"
                  width={120}
                  height={120}
                  className={styles.iconImage}
                />
              </div>
              <h3>深い洞察</h3>
              <p>回答をグループ化し、価値観の本質を探る</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Image
                  src="/images/feature-visualization.png"
                  alt="可視化"
                  width={120}
                  height={120}
                  className={styles.iconImage}
                />
              </div>
              <h3>可視化</h3>
              <p>チャートやグラフで価値観を視覚的に理解</p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.startButton}
              onClick={() => router.push('/question/1')}
            >
              始める
            </button>
          </div>

          <div className={styles.info}>
            <p>所要時間：約15〜20分 • 回答数：24項目 • データはブラウザに保存されます</p>
          </div>
        </div>
      </div>
    </div>
  );
}
