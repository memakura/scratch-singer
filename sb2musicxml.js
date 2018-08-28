/**
  sb2musicxml.js Convert scratch project to MusicXML for singing voice synthesis

  MIT License

  Copyright (c) 2018 Hiroaki Kawashima

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

const divisions = 24;
const mapNoteDuration = {
  '4' : divisions * 4,
  '3' : divisions * 3,
  '2' : divisions * 2,
  '1+1\/2' : divisions * 3 / 2,
  '1' : divisions,
  '1\/2+1\/4' : divisions * 3 / 4,
  '2\/3' : divisions * 2 / 3,
  '1\/2' : divisions / 2,
  '1\/3' : divisions / 3,
  '1\/4' : divisions / 4,
  '1\/6' : divisions / 6
}
const chromaticStep = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
const chromaticAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
const resultSuffix = 'song';

const restSymbolForLyric = '_';  // Symbol used for 'rest (pause)' in lyric

const mouth2soundMapJP = {
  a: ['あ', 'か', 'さ', 'た', 'な', 'は', 'や', 'ら', 'が', 'ざ', 'だ', 'ゃ'],
  ma: ['ま', 'ば', 'ぱ'],
  ua: ['わ'],
  i: ['い', 'き', 'し', 'ち', 'に', 'ひ', 'り', 'ぎ', 'じ', 'ぢ'],
  mi: ['み', 'び', 'ぴ'],
  u: ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'ゆ', 'る', 'ぐ', 'ず', 'づ', 'ゅ'],
  mu: ['む', 'ぶ', 'ぷ'],
  e: ['え', 'け', 'せ', 'て', 'ね', 'へ', 'れ', 'げ', 'ぜ', 'で'],
  me: ['め', 'べ', 'ぺ'],
  o: ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'よ', 'ろ', 'ご', 'ぞ', 'ど', 'ょ'],
  mo: ['も', 'ぼ', 'ぽ'],
  uo: ['を'],
  n: ['ん']
};

// Manage mapping from lyric to mouth shape symbol
// Constructor (arg: mouth2sound map)
Lyric2Mouth = function (m2sMap) {
  this.mouth2sound = m2sMap;

  // Create sound2mouth mapping
  this.sound2mouth = {};
  this.sound2mouth[restSymbolForLyric] = restSymbolForLyric;

  Object.keys(this.mouth2sound).forEach(function (key) {
    this.mouth2sound[key].forEach(function (val) {
      this.sound2mouth[val] = key;
    }.bind(this));  // or use var _this = this;
  }.bind(this));

  this.prevMouthChar = restSymbolForLyric;
}
// Convert lyric to mouth shape symbol
Lyric2Mouth.prototype.convert = function (lyric) {
  var mouthChar = '';
  var tmpArray = [];
  lyric.split('').forEach(function (mchar) {
    if (mchar == 'ー' || mchar == 'っ') {
      // if prev is consonant + vowel (such as 'ma'), extract only the vowel ('a')
      mouthChar = prevMouthChar.split('').slice(-1)[0];
    } else {
      if (this.sound2mouth[mchar] === undefined) {
        mouthChar = restSymbolForLyric;
      } else {
        mouthChar = this.sound2mouth[mchar];
      }
    }
    if (mchar == 'ゃ' || mchar == 'ゅ' || mchar == 'ょ') {
      // console.log('overwrite ' + tmpArray.slice(-1)[0]);  // this is only a view
      tmpArray[tmpArray.length - 1] = mouthChar; // overwrite the previousMouthChar
    } else {
      tmpArray.push(mouthChar);
    }
    prevMouthChar = mouthChar;
  }.bind(this));
  return tmpArray.join('-');
}


// -----------------------------------------------------------------------

function handleFileSelect(evt) {
  var files = evt.target.files;
  var f = files[0];

  filenameElm = document.getElementById('filename');
  if (filenameElm != null) {
    if (f == null) {
      filenameElm.value = 'File is not selected';
      return;
    } else {
      filenameElm.value = f.name;
    }
  }

  JSZip.loadAsync(f)  // Load zip file and extract json file
  .then(function (loadfile) {
    console.log('Loaded ZIP file. Extract JSON...');
    return loadfile.file('project.json').async('string');
  }).then(function (json) {
    console.log('Loaded JSON. Extract scratch script...');
    var obj = JSON.parse(json);
    scriptArray = extractScratchScript(obj);  // Find script part

    if (scriptArray.length > 1) {
      return convertSongScript2XML(scriptArray);  // Convert to MusicXML
    } else if (scriptArray.length == 0) {
      throw new Error('Cannot find valid sprite. Sprite name needs to be "song".');
    } else {
      throw new Error('Cannot find valid sprite. Sprite needs to start with "when Green Flag clicked" followed by song data.');
    }
  }).then(function (xml) {   // Convert xml object and output results
    // Show the result area
    var resultElm = document.getElementById('result');
    if (resultElm == null) {
      throw new Error('Cannot find div#result');
    }
    resultElm.style.display = 'block';

    // Prepare xml file for download
    var xmlString = (new XMLSerializer()).serializeToString(xml);
    console.log(xmlString);  // for debug

    var dlXmlElm = document.getElementById('dl-xml');
    if (dlXmlElm == null) {
      throw new Error('Cannot find a#dl');
    }
    createXMLDownloadLink(dlXmlElm, xmlString, resultSuffix + '.xml');

    // Prepare text files for download (timing, lyrics, mouth shape)
    var typeList = ['timing', 'lyric', 'mouth'];
    var dlElm = {};
    var retJson = {};
    for (var i in typeList) {
      type = typeList[i];
      dlElm[type] = document.getElementById('dl-' + type);
      if (dlElm[type] != null) {
        console.log('list type: ' + type);
        if (Object.keys(retJson).length==0) {  // create a list when required first time
          retJson = convertXML2TimingList(xml);
          console.log(retJson);  
        }
        createTextDownloadLink(dlElm[type], retJson[type].join('\n'), resultSuffix + '-' + type + '.txt');
      }
    }
  }).catch(function (error) {
    alert(error);
  });
}

//-----------------------------------------------------------------
// Create download link for XML
function createXMLDownloadLink(dlXmlElm, xmlString, resultFilename) {
  if (window.navigator && window.navigator.msSaveBlob) {  // for IE and Edge
    dlXmlElm.addEventListener('click', function(e) {
      e.preventDefault();
      navigator.msSaveBlob( new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + xmlString], {type:'text/xml'}), resultFilename );
    }, false);
  } else {
    dlXmlElm.href = 'data:text/xml;charset=utf-8,' + encodeURIComponent(xmlString);
    dlXmlElm.download = resultFilename;
  }
}

// Create download link for text
function createTextDownloadLink(dlTextElm, textString, resultFilename) {
  if (window.navigator && window.navigator.msSaveBlob) {  // for IE and Edge
    dlTextElm.addEventListener('click', function(e) {
      e.preventDefault();
      navigator.msSaveBlob( new Blob([textString], {type:'text/plain'}), resultFilename );
    }, false);
  } else {
    dlTextElm.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textString);
    dlTextElm.download = resultFilename;
  }
}

// Extract scratch script array
function extractScratchScript(obj) {
  var scriptArray = [];
  // for (var child of obj.children) {  // cannot use for-of in IE
  for (var i in obj.children) {  // 
    child = obj.children[i];
    if (child.objName === undefined || child.objName !== 'song') {
      continue;
    }
    console.log(child.objName);

    scriptArray = ['invalid song data'];  // invalid array data with length 1
    // for (var script of child.scripts) {  // cannot use for-of in IE
    for (var j in child.scripts) {
      script = child.scripts[j];
      if (script[2][0][0] !== 'whenGreenFlag') {
        continue;
      }
      console.log(script[2][0][0]);
      scriptArray = script[2];
    }
  }
  return scriptArray;
}

// convert song data to xml
function convertSongScript2XML(scriptArray) {
  var xmlSource = '<?xml version="1.0" encoding="UTF-8"?>'
                + '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN"'
                + '                                "http://www.musicxml.org/dtds/partwise.dtd">'
                + '<score-partwise>'
                + '  <identification>'
                + '    <encoding>'
                + '      <software>Scratch - sb2musicxml</software>'
                + '      <encoding-date></encoding-date>'
                + '    </encoding>'
                + '  </identification>'
                + '  <part-list>'
                + '    <score-part id="P1">'
                + '      <part-name>MusicXML Part</part-name>'
                + '    </score-part>'
                + '  </part-list>'
                + '  <part id="P1">'
                + '    <measure number="1">'
                + '      <attributes>'
                + '        <divisions></divisions>'
                + '        <time>'
                + '          <beats></beats>'
                + '          <beat-type></beat-type>'
                + '        </time>'
                + '      </attributes>'
                + '      <sound/>'
                + '      <note>'
                + '        <rest/>'
                + '        <duration></duration>'
                + '      </note>'
                + '    </measure>'
                + '  </part>'
                + '</score-partwise>'
  
  var xml = (new DOMParser()).parseFromString(xmlSource, 'text/xml');
  
  // Insert date
  var date = new Date();
  //xml.getElementsByTagName('encoding-date')[0].textContent = date.toLocaleDateString().split('/').join('-');
  xml.querySelector('encoding-date').textContent = [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)].join('-');

  // Default values (may be overwritten later)
  var tempo = 110;
  var beats = 2;
  var beatType = 4;
  var durationPerMeasure; // duration of a measure
  xml.querySelector('divisions').textContent = divisions;  // default divisions
  xml.querySelector('sound').setAttribute('tempo', tempo);  // default tempo
  xml.querySelector('beats').textContent = beats;  // default beats
  xml.querySelector('beat-type').textContent = beatType;  // default beat-type
  
  // Start parsing
  var measureNumber = 1;
  var cumSumDuration;  // cumulative duration to check whether a new measure needs to be created or not
  var curMeasureElm = xml.querySelector('measure[number="1"]');  // current measure

  // Overwrite duration-related variables (this needs to be called when 'beatType' or 'beats' is updated)
  function _updateDurationSettings() {
    durationPerMeasure = divisions * (4 / beatType) * beats;
    cumSumDuration = durationPerMeasure; //  Initial value is set the maximum to create a new measure immediately
    xml.querySelector('measure[number="1"] > note > duration').textContent = durationPerMeasure;  // duration of measure number=1
  }

  // Check the duration of current measure, and create new measure if necessary
  function _createNewMeasureIfNecessary(duration) {
    cumSumDuration += duration;
    if (cumSumDuration > durationPerMeasure) {  // create new measure
      curMeasureElm = xml.createElement('measure');
      curMeasureElm.setAttribute('number', ++measureNumber);  // increment number
      xml.querySelector('part').appendChild(curMeasureElm);
      cumSumDuration = duration;
    }
  }
  
  _updateDurationSettings();  // update duration settings using default values
  
  for (var i=0; i < scriptArray.length; i++) {  // for (var i in scriptArray) {
    if (i==0) continue;  // skip
    // Tempo and beat settings
    if (scriptArray[i][0] === 'setTempoTo:') {
      tempo = scriptArray[i][1];
      console.log('tempo: ' + tempo);
      xml.querySelector('sound').setAttribute('tempo', tempo);  // overwrite default tempo
    }
    if (scriptArray[i][0] === 'setVar:to:' && scriptArray[i][1] === 'beats') {
      beats = scriptArray[i][2];
      console.log('beats: ' + beats);
      xml.querySelector('beats').textContent = beats;  // overwrite default beats
      _updateDurationSettings();
    }
    if (scriptArray[i][0] === 'setVar:to:' && scriptArray[i][1] === 'beat-type') {
      beatType = scriptArray[i][2];
      console.log('beat-type: ' + beatType);
      xml.querySelector('beat-type').textContent = beatType;  // overwrite default beat-type
      _updateDurationSettings();
    }
    // Add sound note
    if (scriptArray[i][0] === 'noteOn:duration:elapsed:from:'){
      var duration = 0;
      if (Array.isArray(scriptArray[i][2]) && scriptArray[i][2].length > 0 && scriptArray[i][2][0] === 'readVariable') {  // variable
        duration = mapNoteDuration[scriptArray[i][2][1]];
      } else if (scriptArray[i][2] > 0) {  // varlue
        duration = scriptArray[i][2] * divisions;
      }
      if (duration > 0) {
        if (scriptArray[i-1][0] === 'say:') {
          try {
            var midipitch = scriptArray[i][1];
            var step = chromaticStep[midipitch % 12];   // chromatic step name ('C', etc.)
            var alter = chromaticAlter[midipitch % 12]; // -1, 0, 1
            var octave = Math.floor(midipitch / 12) - 1;
            var lyrictext = scriptArray[i-1][1];
            console.log('midipitch: ' + midipitch + ', duration: ' + duration + ', ' + lyrictext);
            
            // --- Append node ---
            var pitchElm = xml.createElement('pitch'); // pitch {step, alter, octave}
            var stepElm = xml.createElement('step');
            stepElm.textContent = step;
            pitchElm.appendChild(stepElm);
            if (alter != 0) {
              var alterElm = xml.createElement('alter');
              alterElm.textContent = alter;
              pitchElm.appendChild(alterElm);
            }
            var octaveElm = xml.createElement('octave');
            octaveElm.textContent = octave;
            pitchElm.appendChild(octaveElm);

            var durationElm = xml.createElement('duration'); // duration
            durationElm.textContent = duration;

            var lyricElm = xml.createElement('lyric'); // lyric {text}
            var textElm = xml.createElement('text');
            textElm.textContent = lyrictext;
            lyricElm.appendChild(textElm);

            var noteElm = xml.createElement('note'); // note {pitch, duration, lyric}
            noteElm.appendChild(pitchElm);
            noteElm.appendChild(durationElm);
            noteElm.appendChild(lyricElm);

            _createNewMeasureIfNecessary(duration);
            curMeasureElm.appendChild(noteElm);
          } catch (e) {
            alert(e);
          }
        } else {
          console.log('No "say" block at i= ' + i);
        }
      } else {
        console.log('No variable at i= ' + i);
      }
    }
    // Add rest
    if (scriptArray[i][0] === 'rest:elapsed:from:') {
      var duration = 0;
      if (Array.isArray(scriptArray[i][1]) && scriptArray[i][1].length > 0 && scriptArray[i][1][0] === 'readVariable') {  // variable
        duration = mapNoteDuration[scriptArray[i][1][1]];
      } else if (scriptArray[i][1] > 0) {
        duration = scriptArray[i][1] * divisions;  // value
      }
      if (duration > 0) {
        try {
          console.log('rest, duration: ' + duration);

          // --- Append node ---
          var durationElm = xml.createElement('duration');  // duration
          durationElm.textContent = duration;

          var noteElm = xml.createElement('note');  // note {rest, duration}
          noteElm.appendChild(xml.createElement('rest'));
          noteElm.appendChild(durationElm);

          _createNewMeasureIfNecessary(duration);
          curMeasureElm.appendChild(noteElm);
        } catch (e) {
          alert(e);
        }
      } else {
        console.log('No variable at i= ' + i);
      }
    }
  }
  //encodeURIComponent(
  return xml;
}

// Convert MusicXML to timing, lyric, and mouth shape data
function convertXML2TimingList(xml) {
  var timingList = [];
  var lyricList = [];
  var mouthList = [];
  var curTimeSec = 0;  // physical time in sec
  var tempo = 110;  // default tempo
  var secPerDivision;
  var durationDiv;  // duration of a note in division unit
  var durationSec;  // duration of a note in sec unit

  console.log('lyric2mouth');
  var lyric2mouth = new Lyric2Mouth(mouth2soundMapJP);

  try {
    // Parse measures in a document
    var measureList = xml.getElementsByTagName('measure');  // querySelectorAll... which is faster?
    for (var i=0; i < measureList.length; i++) {
      var measureElm = measureList[i];
      var soundElm = measureElm.querySelector('sound');
      if (soundElm != null) {
        var tempoAttr = soundElm.getAttribute('tempo');
        if (tempoAttr != null) {
          tempo = tempoAttr;
          secPerDivision = 60 / tempo / divisions;  // physical sec per tick (division)
          console.log('tempo: ' + tempo + ', secPerDivision: ' + secPerDivision);
        }
      }
      // Parse notes in a measure
      var noteList = measureElm.getElementsByTagName('note');
      for (var j=0; j < noteList.length; j++) {
        var noteElm = noteList[j];
        var durationElm = noteElm.querySelector('duration');
        if (durationElm != null) {
          // Duration
          durationDiv = durationElm.textContent;
          durationSec = secPerDivision * durationDiv;
          timingList.push(curTimeSec);  // start time of this note

          // Lyrics
          var textElm = noteElm.querySelector('lyric > text');
          var lyric = (textElm != null ? textElm.textContent : restSymbolForLyric);
          lyricList.push(lyric);

          // Mouth shape
          mouthList.push(lyric2mouth.convert(lyric));

          curTimeSec += durationSec;
        }
      }
    }
  } catch (e){
    alert(e);
  }
  return {timing: timingList, lyric: lyricList, mouth: mouthList};
}

document.getElementById('infile').addEventListener('change', handleFileSelect, false);

