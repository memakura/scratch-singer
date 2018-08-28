# -*- coding: utf-8 -*-
# %%
from pyquery import PyQuery as pq

debug = True

# 入力元
# xmlfname = 'xml/song070_f00001_063.xml'
xmlfname = 'song.xml'
try:
    fin = open(xmlfname, 'r', encoding='utf-8')
except IOError:
    print("Cannot open input file: " + xmlfname)
    quit()
else:
    xml = fin.read()
    fin.close()
print("Open " + xmlfname)

# 出力先
listfname = 'mouth_shape.txt'
try:
    fout = open(listfname, 'w', encoding='utf-8')
except IOError:
    print("Cannot open output file: " + listfname)
    quit()

dom = pq(xml.encode('utf-8'))
print("credit-words: " + dom("credit-words").text())

# measure_list = dom("part#P1").find("measure")
measure_list = dom("measure")
# print(measure_list.eq(0))
cur_time = 0  # current time [sec]
for ms in measure_list:
    attrib = dom(ms).find("attributes")
    if attrib:  # update time scales
        # divisions : how many divisions per quater notes
        # duratino is prepresented by this divisions
        divisions = int(attrib.find("divisions").text())
        # beats
        beats = int(attrib.find("beats").text())
        # beats-type
        beat_type = int(attrib.find("beat-type").text())
        # tempo : quarter notes per minutes
        tempo = int(dom(ms).find("sound").attr("tempo"))
        # sec_per_division = sec_per_quaternote / divisions
        sec_per_division = 60 / tempo / divisions
        if debug:
            print("divisions: {}".format(divisions))
            print("beats:     {}".format(beats))
            print("beat-type: {}".format(beat_type))
            print("tempo: {}".format(tempo))
            print("sec_per_divisions: {}".format(sec_per_division))

    note_list = dom(ms).find("note")
    for note in note_list:
        duration_div = int(dom(note).find("duration").text())
        duration_sec = sec_per_division * duration_div
        lyric = dom(note).find("text").text()
        if debug:
            print("cur_time: {:.4f} [sec]  duration: {} ({:.4f} [sec])"
                  "".format(cur_time, duration_div, duration_sec))
            print("lyric: " + lyric)
        cur_time += duration_sec

        # TODO: backup

fout.close()
