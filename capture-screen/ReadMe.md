# Capture Screen
試験エビデンス取得向け Extension。

表示しているページ全体またはウィンドウ内のスクリーンショットを取得する。

## インストール方法

[Chrome Extension置き場 > インストール手順(例)](../ReadMe.md#インストール手順例)参照

## 操作

![画面](./images/ss.png)

|機能   |説明   |
|---|---|
|extension icon | Capture Screen ポップアップ表示
|[Take]ボタン   |スクリーンショットを取得し、ダウンロードフォルダに保存<br />ショートカットキー : Alt+Shift+S   |
|ファイル名設定| 出力ファイル名設定 : `{prefix}_{no1}_{no2}_{file}(_{URL Host})(_{URL Path}).png` |
|prefix| ファイル名の prefix |
|no1| 連番1 |
|no2| 連番2<br />スクリーンショットを取得すると自動で 1 ずつ増加する。 |
|file| ファイル名 |
|URL Host| URL Host をファイル名に含めるか。Host例) example.co.jp/sample -> example_co_jp |
|URL Path| URL Path をファイル名に含めるか。Path例) example.co.jp/sample -> _sample |
|スクリーンショット種別||
|ページ| ページ全体のスクリーンショットを取得 |
|ウィンドウ| 表示中のウィンドウ内のスクリーンショットを取得<br />※ヘッダやフッタを固定しているページでは正しく動作しないことがある模様 |
|リサイズ||
|W|ウィンドウ幅|
|H|ウィンドウ高さ
|[Resize]ボタン|ウィンドウリサイズを実行|

### ショートカットキー

|キー   |説明   |
|---|---|
|Alt+Shift+1 | ページキャプチャ
|Alt+Shift+2 | ウィンドウキャプチャ


## 補足
### キャプチャ処理について
初期バージョンでは、[html2canvas](https://html2canvas.hertzen.com/) を利用してキャプチャ画像を生成していたが、ヘッダ固定ページなど、キャプチャを正しく取得出来ないページが多かった。

chrome のデバッガのキャプチャ機能を利用してキャプチャを撮る様に修正した。
