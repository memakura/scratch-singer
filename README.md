[(English)](#English)

# スクラッチ2のプロジェクトファイルを歌声合成の入力ファイルに変換する

- スクラッチのプロジェクトファイル (sb2) を MusicXML へ変換します．
- 変換されたXMLファイルは [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/) の入力に使えます．

## 必要なファイル（同じフォルダに入れておきます）
- sb2sing.html
- sb2sing.js
- jszip.min.js

## 使い方

1. [sb2/song-umi.sb2](sb2/song-umi.sb2)を参考にスクラッチで曲を作り，プロジェクトファイルを保存しておきます．
1. sb2sing.html をブラウザで開きます．
1. ボタンを押して作成したスクラッチのプロジェクトファイル (sb2という拡張子)をアップロードします．
1. 変換されたXMLファイルをダウンロードします．
1. ダウンロードしたXMLファイルを[Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/)にアップロードします．

## デモ

[test/test-timing.sb2](test/test-timing.sb2)では，曲を作った時のスクラッチプロジェクトに，合成された歌声を合わせて同時に再生しています．

## ライセンス

- MITライセンス
- jszip.min.js は https://stuk.github.io/jszip/ を利用しています．

<a name="English">

# Convert Scratch 2 Project File to a MusicXML for Singing Voice Synthesis

- This script convert a scratch project file (sb2) to a MusicXML file (song.xml).
- The generated xml file can be used as an input to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).

## Required files (download the following files to the same folder)
- sb2sing.html
- sb2sing.js
- jszip.min.js

## How to use

1. Create a scratch project (Example: [sb2/song-umi.sb2](sb2/song-umi.sb2)).
1. Open sb2sing.html by a browser.
1. Click the button and upload your scratch project (sb2) file.
1. Download a generated XML file (song.xml).
1. Upload the xml file to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).

## Demo

[test/test-timing.sb2](test/test-timing.sb2) combines a generated wave file and the original scratch project and plays simultaneously.

## License

- MIT License
- jszip.min.js is from https://stuk.github.io/jszip/.