/**
 * 特徴デモ: 細粒度更新 (Solid が公式に掲げる売り)。
 *
 * 400 セルの一覧の中で、1 セルの値だけを 100ms ごとに更新し続ける。
 * ポイントは上の行に出す「コンポーネント関数の実行回数」— Solid では**ずっと 1 回のまま**。
 * 仮想 DOM の差分計算をせず、シグナルを使っている DOM のその場所だけを直接書き換えるため、
 * 値が毎秒 10 回動いても、コンポーネントを再実行する必要がない。
 */
import { render } from 'solid-js/web';
import { createSignal, For } from 'solid-js';
import '../../shared/app.css';

let componentRuns = 0;

const LIVE_INDEX = 210; // 動かすのはこの1セルだけ
const cells = Array.from({ length: 400 }, (_, i) => i);

const App = () => {
  componentRuns += 1; // 再実行されればここが増える — Solid では増えない
  const [tick, setTick] = createSignal(0);
  setInterval(() => setTick((t) => t + 1), 100);

  return (
    <div class="app">
      <h1>
        細粒度更新 <span class="tag">動くのは1セルだけ</span>
      </h1>
      <p class="summary">
        コンポーネント関数の実行回数: {componentRuns} 回 ／ 青いセルは毎秒10回更新中
      </p>
      <div class="cellgrid">
        <For each={cells}>
          {(i) =>
            i === LIVE_INDEX ? (
              <span class="cell live">{tick()}</span>
            ) : (
              <span class="cell">・</span>
            )
          }
        </For>
      </div>
    </div>
  );
};

render(() => <App />, document.getElementById('root')!);
