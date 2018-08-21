[(Japanese)](index.md)

# Convert Scratch 2 Project File to a MusicXML for Singing Voice Synthesis

- This script convert a scratch project file (sb2) to a MusicXML file (song.xml).
- The generated xml file can be used as an input to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).
- Demo
    - [Original scratch project file (song-furusato.sb2)](sb2/song-furusato.sb2) / [Check with online editor](https://scratch.mit.edu/projects/239680094/)
    - [Converted MusicXML (song.xml)](test/song.xml)
    - [Synthesized singing voice by Sinsy (song-furusato.wav)](test/song-furusato.wav)

![flow_JP.png](image/flow_JP.png)

## Required files (download the following files to the same folder)
- sb2sing.html
- sb2sing.js
- jszip.min.js

## How to use

1. Create a scratch project (See [sb2/song-homesweethome.sb2](sb2/song-homesweethome.sb2) and [sb2/song-furusato.sb2](sb2/song-furusato.sb2) for example). **Note that the name of the sprite needs to be "song".**
1. Open sb2sing.html by a browser.
1. Click the button and upload your scratch project (sb2) file.
1. Download a generated XML file (song.xml).
1. Upload the xml file to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).

## Synthesized examples by Sinsy

- [test/song-homesweethome.wav](test/song-homesweethome.wav)
- [test/song-furusato.wav](test/song-furusato.wav)
- [test/timing-test-homesweethome.sb2](test/timing-test-homesweethome.sb2) combines a generated wave file and the original scratch project and plays simultaneously. You can find that scratch script is slower than wave file. To synchronize precisely, it might be better to use timer in scratch script.

## TODO

- Increase the type of notes (duration).
- Support sb3 (Scratch 3 project file).

## License

- MIT License
- jszip.min.js is from https://stuk.github.io/jszip/.