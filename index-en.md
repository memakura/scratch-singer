[(Japanese)](index.md)

# Convert Scratch Project File to a MusicXML for Singing Voice Synthesis

<a name="uploadfile"></a>

<label for="infile" class="button">
    Upload a scratch project (.sb2) <svg class="icon"><use xlink:href="symbol-defs.svg#icon-upload"></use></svg>
    <input type="file" id="infile" name="f">
</label>
<input type="text" id="filename" placeholder="" readonly>

<div id="result" style="display:none;">
    <p id="result-succeed"><b>Success!</b></p>
    <ol>
        <li><a href="#" id="dl-xml" class="button">Download MusicXML (song.xml) <svg class="icon"><use xlink:href="symbol-defs.svg#icon-download"></use></svg></a></li>
        <li><a href="http://www.sinsy.jp/" target="_blank">Open Sinsy page <svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg></a></li>
    </ol>
</div>
<script type="text/javascript" src="jszip.min.js"></script>
<script type="text/javascript" src="sb2musicxml.js"></script>

## What is this script?

- This script converts a scratch project file (.sb2) to a MusicXML file (song.xml).
- The generated xml file can be used as an input to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).
- Demo
    1. [Original scratch project file (song-furusato.sb2)](sb2/song-furusato.sb2)  <a href="https://scratch.mit.edu/projects/239680094/" target="_blank">(Open with a scratch online editor <svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg>)</a>(https://scratch.mit.edu/projects/239680094/)
    1. [Converted MusicXML (song.xml)](test/song.xml)
    1. [Synthesized singing voice by Sinsy (song-furusato.wav) <svg class="icon"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-furusato.wav)


## How to use

Let's synthesize vocal part of "Twinkle twinkle little star" using the following score. We code the second measure and after. When the first note is not a rest, an empty measure with a rest will be automatically inserted at the beginning.

![twinkeltwinkle-score.png](images/twinkletwinkle-score.png)

### Step 1. Prepare a scratch project file (.sb2)

1. Create a scratch project with lyrics and a melody line. You can refer to or copy <a href="https://scratch.mit.edu/projects/242023675/" target="_blank">a sample project here<svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg></a>.
    - **Note that the name of the sprite needs to be "song".**
    - Use a pair of "Say ..." and "play note ... for ... beats" for a sound.
    - Use "rest for ... beats" for a rest.
    - Use preset variables for duration.
    - Use hyphen to connect multiple syllables.
        - "twin-" + "kle"
        - "lit-" + "tle"
        - "won-" + "der"
    - One note cannot cross over a bar line between measures.
1. Save/download the scratch project as a sb2 file.
    - Scratch offline editor can also be used after downloading sb2 file.


### Step 2. Convert the scratch project file (.sb2) to MusicXML (.xml)

1. Click [the button at the top of this page](#uploadfile) and upload your scratch project (sb2) file.
1. Download a generated XML file (song.xml).


### Step 3. Input the MusicXML file to Sinsy

1. Upload the xml file to [Sinsy (Singing Voice Synthesis)](http://www.sinsy.jp/).
1. Download or play the generated wave file.

![flow_EN.png](images/flow_EN.png)

## Required files for local use

Download the following files from [Download Zip] and save in the same folder.
- sb2musicxml.html
- sb2musicxml.js
- jszip.min.js

## Synthesized examples by Sinsy

- [test/song-twinkletwinkle.wav <svg class="icon"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-twinkletwinkle.wav)
    - <a href="https://scratch.mit.edu/projects/242023675/" target="_blank">Source scratch project (online <svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg></a>)
    - [Source scratch project (sb2 file)](sb2/song-twinkletwinkle.sb2)
- [test/song-homesweethome.wav <svg class="icon"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-homesweethome.wav)
    - <a href="https://scratch.mit.edu/projects/239680350/" target="_blank">Source scratch project (online <svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg></a>)
    - [Source scratch project (sb2 file)](sb2/song-homesweethome.sb2)
- [test/song-furusato.wav <svg class="icon"><use xlink:href="symbol-defs.svg#icon-music"></use></svg>](test/song-furusato.wav)
    - <a href="https://scratch.mit.edu/projects/239680094/" target="_blank">Source scratch project (online <svg class="icon"><use xlink:href="symbol-defs.svg#icon-new-tab"></use></svg></a>)
    - [Source scratch project (sb2 file)](sb2/song-furusato.sb2)
- [test/timing-test-homesweethome.sb2](test/timing-test-homesweethome.sb2) combines a generated wave file and the original scratch project and plays simultaneously. You can find that scratch script is slower than wave file. To synchronize precisely, it might be better to use timer in scratch script.

## TODO

- Support sb3 (Scratch 3 project file).

## License

- MIT License
- jszip.min.js is from https://stuk.github.io/jszip/.