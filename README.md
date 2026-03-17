# MailFocus PWA — セットアップガイド

## 概要
Gmail OAuth2 + Gmail API を使った完全スタンドアロンPWAです。
Claude APIへの依存はなく、Googleアカウントで直接ログインして使えます。

---

## ファイル構成
```
gmail-pwa-oauth/
├── index.html    ← メインアプリ
├── manifest.json ← PWAマニフェスト
├── sw.js         ← Service Worker
└── README.md
```

---

## ステップ1: Google Cloud で Client ID を取得

### 1-1. Google Cloud Console を開く
https://console.cloud.google.com/

### 1-2. 新しいプロジェクトを作成
- 左上のプロジェクト選択 → 「新しいプロジェクト」
- 名前: `MailFocus`（任意）

### 1-3. Gmail API を有効化
- 左メニュー → **APIとサービス** → **ライブラリ**
- 検索欄に「Gmail API」と入力
- **Gmail API** → **有効にする**

### 1-4. OAuth同意画面を設定
- 左メニュー → **APIとサービス** → **OAuth同意画面**
- ユーザーの種類: **外部**
- アプリ名: `MailFocus`
- サポートメール: 自分のメールアドレス
- デベロッパーの連絡先: 自分のメールアドレス
- **保存して次へ** → スコープは何も追加せず **保存して次へ**
- テストユーザーに自分のGmailアドレスを追加

### 1-5. OAuthクライアントIDを作成
- 左メニュー → **APIとサービス** → **認証情報**
- **認証情報を作成** → **OAuthクライアントID**
- アプリの種類: **ウェブアプリケーション**
- 名前: `MailFocus Web`
- **承認済みのJavaScript生成元** に以下を追加:
  - ローカルで使う場合: `http://localhost:8080`
  - 本番URL（Netlify等）: `https://your-site.netlify.app`
- **作成** → Client IDをコピー

---

## ステップ2: アプリを起動

### ローカルで試す
```bash
cd gmail-pwa-oauth
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

### 本番デプロイ（推奨: Netlify）
1. https://netlify.com → **Add new site** → **Deploy manually**
2. `gmail-pwa-oauth` フォルダをドラッグ＆ドロップ
3. 発行されたURLをGoogle CloudのJavaScript生成元に追加

### GitHub Pages でも可
1. リポジトリを作成して3ファイルをアップロード
2. Settings → Pages → main ブランチを選択
3. `https://yourid.github.io/repo-name/` で公開

---

## ステップ3: ログイン

1. アプリを開く
2. ログイン画面にClient IDを貼り付ける
3. 「Googleアカウントでログイン」をクリック
4. Google認証画面でアカウントを選択・許可

⚠️ 初回は「このアプリはGoogleで確認されていません」と表示されることがあります。
→「詳細」→「MailFocusに移動（安全でない）」をクリックして続行してください
（自分で作ったアプリなので安全です）

---

## PWAとしてインストール

### iPhone/iPad (Safari)
1. Safariでアプリを開く
2. 共有ボタン →「ホーム画面に追加」

### Android (Chrome)
1. Chromeで開く
2. メニュー →「ホーム画面に追加」またはアドレスバーのインストールアイコン

### デスクトップ (Chrome/Edge)
1. アドレスバー右端の「＋」アイコン
2. 「インストール」

---

## 機能一覧

| 機能 | 詳細 |
|------|------|
| Googleログイン | OAuth2（パスワード不要） |
| 未読メール | Gmail label:unread 最大25件 |
| スターメール | Gmail label:starred 最大25件 |
| 既読にする | Gmail API で直接変更 |
| 未読に戻す | Gmail API で直接変更 |
| 返信 | Gmail API でアプリ内送信 |
| 引用挿入 | 返信時に元本文を自動引用 |
| 下書き保存 | 入力中に自動保存・復元 |
| 署名設定 | ⚙️ から登録・自動挿入 |
| ToDoリスト | localStorageに永続保存 |
| オフライン | Service Workerでシェルキャッシュ |

---

## トークンについて
- アクセストークンは `sessionStorage` に保存されます（タブを閉じると消去）
- Client IDは `localStorage` に保存（次回起動時に自動入力）
- メールデータはブラウザ外に送信されません
