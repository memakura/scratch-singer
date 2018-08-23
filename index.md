[(English)](index-en.md)

# スクラッチのプロジェクトファイルを歌声合成の入力ファイルに変換する

スクラッチプロジェクト(.sb2)をアップロード <svg style="width:1em; height:1em"><use xlink:href="symbol-defs.svg#icon-upload"></use></svg>

<a name="uploadfile">
<input type="file" id="infile" name="f">
<div id="result" style="display:none;">
    <p id="result-succeed"><b>変換成功！</b></p>
    <ol>
        <li><a href="#" id="dl">MusicXMLファイルのダウンロード (song.xml) <svg style="width:1em; height:1em"><use xlink:href="symbol-defs.svg#icon-download"></use></svg></a></li>
        <li><a href="http://www.sinsy.jp/" target="_blank">Sinsyのページを開く</a></li>
    </ol>
</div>
<script type="text/javascript" src="jszip.min.js"></script>
<script type="text/javascript" src="sb2musicxml.js"></script>


## なにをするスクリプト？

- スクラッチのプロジェクトファイル (.sb2) を MusicXML (song.xml) へ変換します。
- 変換された MusicXML ファイルは [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/) などの歌声合成ツールの入力に使えます。
- デモ
    1. [元のスクラッチプロジェクト (song-furusato.sb2)](sb2/song-furusato.sb2) <a href="https://scratch.mit.edu/projects/239680094/" target="_blank">（スクラッチオンラインエディタで確認）</a>
    1. [変換して出来た MusicXML (song.xml)](test/song.xml)
    1. [Sinsyによる歌声合成結果のWAVファイル (song-furusato.wav) <svg style="width:1em; height:1em"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-furusato.wav)（実際に聴けます）
    
## 使い方

「大きな栗の木の下で」のボーカルを作ってみます。

1. まずスクラッチで歌詞とメロディをプログラムします。 [このリンクにあるスクラッチプロジェクト](https://scratch.mit.edu/projects/240260846/)をもとに作ってみてください。
    - 「・・と言う」と「・・の音符を・・拍鳴らす」のブロックをセットにして使います。「・・拍休む」が休符になります。
    - 歌詞はひらがな、音符の長さはすでにある変数（1/4など）を使います。
    - 詳しくはプロジェクトの「使い方」を見てください。
    - **「song」という名前のスプライトにプログラムを書いていきます。**
    - sb2ファイルをダウンロード後にスクラッチのオフラインエディタを使うこともできます。
1. [ファイル] > [手元のコンピュータにダウンロード] からスクラッチのプロジェクトをsb2ファイルとしてダウンロードします。
1. [このページの上のほうにあるボタン](#uploadfile)を押して、作成したスクラッチのプロジェクトファイル（sb2という拡張子）をアップロードします。
1. うまくいくとダウンロードリンクが表示されるので、そこから変換されて出来たMusicXMLファイル（song.xml）をダウンロードします。
1. ダウンロードしたsong.xmlファイルを[Sinsy (Singing Voice Synthesis)
](http://www.sinsy.jp/)にアップロードします。「楽譜 (.xml)」にあるボタンを押すとアップロード画面が開きます。
1. 歌声をWAVファイルなどで聞いたりダウンロードできます。

![flow_JP.png](images/flow_JP.png)

## Sinsyと組み合わせた合成例

- [test/song-homesweethome.wav <svg style="width:1em; height:1em"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-homesweethome.wav)
    - [元のスクラッチプロジェクト（オンライン）](https://scratch.mit.edu/projects/239680350/)
    - [元のスクラッチプロジェクト（sb2ファイル）](sb2/song-homesweethome.sb2)
- [test/song-furusato.wav <svg style="width:1em; height:1em"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-furusato.wav)
    - [元のスクラッチプロジェクト（オンライン）](https://scratch.mit.edu/projects/239680094/)
    - [元のスクラッチプロジェクト（sb2ファイル）](sb2/song-furusato.sb2)
- [test/timing-test-homesweethome.sb2](test/timing-test-homesweethome.sb2) では曲を作った時のスクラッチプロジェクトに、合成された歌声を合わせて同時に再生しています。スクラッチのスクリプトの方が遅れてくるため、同期させるのであればおそらくスクラッチスクリプト内でタイマーを使ったほうがよいでしょう。

## TODO

- 音符の種類を増やす
- スクラッチ3のプロジェクトファイル (sb3) のサポート
- タイミングリストの出力（スクラッチで再度利用するため）

## ローカルで動かすのに必要なファイル

ネットワークにつながっていないときに使うには、[Download Zip](https://github.com/memakura/scratch-singer/zipball/master)から Zipをダウンロード、展開し、以下のファイルを同じフォルダに入れておきます．

- sb2musicxml.html
- sb2musicxml.js
- jszip.min.js

## ライセンス

- MITライセンス
- jszip.min.js は https://stuk.github.io/jszip/ を利用しています。

<script defer src="svgxuse.js"></script>
