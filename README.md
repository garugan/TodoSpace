# TodoSpace

優先度は低いけれど、いつかはやっておきたいこと——そんなタスクを宇宙空間に漂わせておくアプリです。

急がなくていい、でも忘れたくないタスクを書いて宇宙へ漂流させましょう。ふとした瞬間に目に入って、やるべきことを思い出せます。

- 公開URL：https://todospace.net/

## 使い方

1. 右上の `+` ボタンからタスクを追加
2. タスクが宇宙空間に浮かんで漂流し始める
3. 完了したタスクはチェックボタンで完了にする
4. 左上のメニューからタスク一覧を確認

## 開発

```bash
npm i
npm run dev

ビルド
npm run build
デプロイ
npx wrangler pages deploy dist --project-name todospace
```

## 技術スタック

- React 18 + TypeScript
- Vite 6
- Tailwind CSS v4
- shadcn/ui
- motion/react
