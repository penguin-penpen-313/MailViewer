# MailFocus PWA — セットアップ手順

## ファイル構成
```
gmail-pwa/
├── index.html   ← メインアプリ
├── manifest.json ← PWAマニフェスト
├── sw.js        ← Service Worker（オフライン対応）
└── README.md
```

## 動作要件
- Claude.ai のアカウント（Gmailコネクター接続済み）
- HTTPS サーバーまたはローカルホスト

---

## ローカルで試す方法

### 方法A: Python（最速）
```bash
cd gmail-pwa
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

### 方法B: Node.js
```bash
npx serve gmail-pwa
```

---

## 本番デプロイ（無料）

### GitHub Pages
1. GitHubリポジトリを作成
2. 3ファイルをアップロード
3. Settings → Pages → main ブランチを選択
4. `https://yourid.github.io/repo-name/` で公開完了

### Netlify
1. https://netlify.com → "Add new site"
2. フォルダをドラッグ＆ドロップするだけ

---

## PWAとしてインストール

### スマートフォン (iOS/Android)
1. Chromeまたはサファリでサイトを開く
2. 「ホーム画面に追加」を選択
3. アプリとして起動できます

### デスクトップ (Chrome)
1. アドレスバーの右端 ＋ アイコンをクリック
2. 「インストール」

---

## 機能まとめ

| 機能 | 詳細 |
|------|------|
| 未読メール | Gmail label:unread を最大20件取得 |
| スターメール | Gmail label:starred を最大20件取得 |
| 既読にする | Claude API → Gmail MCP で自動処理 |
| 未読に戻す | 同上 |
| 返信 | Gmail Web（新規タブ）で返信画面を開く |
| ToDoリスト | ブラウザのlocalStorageに永続保存 |
| オフライン | Service Workerでシェルをキャッシュ |

---

## 注意事項

- Claude API の呼び出しには Claude.ai にログインしている必要があります
- メール取得ごとに API を呼び出すため、大量リフレッシュは避けてください
- ToDoデータはブラウザ内に保存されます（デバイスをまたいで同期は不可）
