const divisions = 24;
const mapNoteDuration = {
  "1\/8" : (divisions * 4) / 8,
  "1\/4" : (divisions * 4) / 4,
  "1\/2" : (divisions * 4) / 2
}
const chromaticStep = ['C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B'];
const chromaticAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

function handleFileSelect(evt) {
  var files = evt.target.files;
  var f = files[0];
  var musicXml = '';

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
  }).then(function (xml) {
    console.log(xml);
    document.getElementById("result").style = 'display:block';  // show the result
    target = document.getElementById("dl");
    target.href = 'data:text/xml;charset=utf-8,'+encodeURIComponent(xml);
    target.download = 'song.xml';
  }).catch(function (error) {
    alert(error);
  });
}

// extract scratch script array
function extractScratchScript(obj) {
  var scriptArray = [];
  for (var child of obj.children) {
    if (child.objName === undefined || child.objName !== "song") {
      continue;
    }
    console.log(child.objName);

    scriptArray = ['invalid song data'];  // invalid array data with length 1
    for (var script of child.scripts) {
      if (script[2][0][0] !== "whenGreenFlag") {
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
                + '      <software>Scratch - sb2sing</software>'
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
  xml.getElementsByTagName('encoding-date')[0].textContent = date.toLocaleDateString().split('/').join('-');
    
  // Default values
  var tempo = 110;
  var beats = 2;
  var beatType = 4;
  var durationPerMeasure; // duration of a measure
  xml.getElementsByTagName("divisions")[0].textContent = divisions;  // default divisions
  xml.getElementsByTagName("sound")[0].setAttribute("tempo", tempo);  // default tempo
  xml.getElementsByTagName("beats")[0].textContent = beats;  // default beats
  xml.getElementsByTagName("beat-type")[0].textContent = beatType;  // default beat-type
  
  // Start parsing
  var measureNumber = 1;
  var cumSumDuration;  // cumulative duration to check whether a new measure needs to be created or not
  var curMeasureElm = xml.querySelector('measure[number="1"]');  // current measure

  function _updateDurationSettings() {
    durationPerMeasure = divisions * (4 / beatType) * beats;
    cumSumDuration = durationPerMeasure; //  Initial value is set the maximum to create a new measure immediately
    xml.querySelector('measure[number="1"] > note > duration').textContent = durationPerMeasure;  // default duration of measure number=1
  }

  function _createNewMeasureIfNecessary(duration) {
    cumSumDuration += duration;
    if (cumSumDuration > durationPerMeasure) {  // create new measure
      curMeasureElm = xml.createElement("measure");
      curMeasureElm.setAttribute("number", ++measureNumber);  // increment number
      xml.getElementsByTagName("part")[0].appendChild(curMeasureElm);
      cumSumDuration = duration;
    }
  }
  
  _updateDurationSettings();  // update duration settings once using default values
  
  for (var i in scriptArray) {
    if (i==0) continue;  // skip
    // Tempo and beat settings
    if (scriptArray[i][0] === "setTempoTo:") {
      tempo = scriptArray[i][1];
      console.log('tempo: ' + tempo);
      xml.getElementsByTagName("sound")[0].setAttribute("tempo", tempo);  // overwrite default tempo
    }
    if (scriptArray[i][0] === "setVar:to:" && scriptArray[i][1] === "beats") {
      beats = scriptArray[i][2];
      console.log('beats: ' + beats);
      xml.getElementsByTagName("beats")[0].textContent = beats;  // overwrite default beats
      _updateDurationSettings();
    }
    if (scriptArray[i][0] === "setVar:to:" && scriptArray[i][1] === "beat-type") {
      beatType = scriptArray[i][2];
      console.log('beat-type: ' + beatType);
      xml.getElementsByTagName("beat-type")[0].textContent = beatType;  // overwrite default beat-type
      _updateDurationSettings();
    }
    // Add sound note
    if (scriptArray[i][0] === "noteOn:duration:elapsed:from:"){
      if (scriptArray[i][2].length > 0 && scriptArray[i][2][0] === "readVariable") {
        if (scriptArray[i-1][0] === "say:") {
          try {
            var duration = mapNoteDuration[scriptArray[i][2][1]];
            var midipitch = scriptArray[i][1];
            var step = chromaticStep[midipitch % 12];   // chromatic step name ('C', etc.)
            var alter = chromaticAlter[midipitch % 12]; // 
            var octave = Math.floor(midipitch / 12) - 1;
            var lyrictext = scriptArray[i-1][1];
            console.log('midipitch: ' + midipitch + ', duration: ' + duration + ', ' + lyrictext);
            
            // --- Append node ---
            var pitchElm = xml.createElement("pitch"); // pitch {step, alter, octave}
            var stepElm = xml.createElement("step");
            stepElm.textContent = step;
            pitchElm.appendChild(stepElm);
            if (alter != 0) {
              var alterElm = xml.createElement("alter");
              alterElm.textContent = alter;
              pitchElm.appendChild(alterElm);
            }
            var octaveElm = xml.createElement("octave");
            octaveElm.textContent = octave;
            pitchElm.appendChild(octaveElm);

            var durationElm = xml.createElement("duration"); // duration
            durationElm.textContent = duration;

            var lyricElm = xml.createElement("lyric"); // lyric {text}
            var textElm = xml.createElement("text");
            textElm.textContent = lyrictext;
            lyricElm.appendChild(textElm);

            var noteElm = xml.createElement("note"); // note {pitch, duration, lyric}
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
    if (scriptArray[i][0] === "rest:elapsed:from:") {
      if (scriptArray[i][1].length > 0 && scriptArray[i][1][0] === "readVariable") {
        try {
          var duration = mapNoteDuration[scriptArray[i][1][1]];
          console.log(duration);

          // --- Append node ---
          var durationElm = xml.createElement("duration");  // duration
          durationElm.textContent = duration;

          var noteElm = xml.createElement("note");  // note {rest, duration}
          noteElm.appendChild(xml.createElement("rest"));
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
  return (new XMLSerializer()).serializeToString(xml);
}



document.getElementById('infile').addEventListener('change', handleFileSelect, false);
