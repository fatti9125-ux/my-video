import csv
D='/home/user/my-video/reference_analysis/01'
N=1020
shots=[('S01',0,54),('S02',55,126),('S03',127,260),('S04',261,608),('S05',609,708),('S06',709,896),('S07',897,1019)]
states=[ # id, first,last
('S01_hold',0,54),
('S02_farmer_slowpull',55,83),('S02_quickpull_bottle_in',84,86),('S02_bottle_caption_hold',87,126),
('S03_smug_ecu',127,179),('S03_mascot_rise',180,183),('S03_smug_with_mascot',184,192),('S03_worried_sweat',193,260),
('S04_field_slowpull',261,283),('S04_dim_namecard',284,327),('S04_undim_nocaption',328,331),('S04_caption_militia',332,392),
('S04_field_slowpull_nocap',393,439),('S04_big_pullback',440,491),('S04_extreme_wide_hold',492,608),
('S05_road_pan_entry',609,631),('S05_road_question_entry',632,671),('S05_road_treadmill_hold',672,708),
('S06_formation_pull',709,839),('S06_rider_fadeout',840,875),('S06_formation_no_rider',876,896),
('S07_cu_smug',897,941),('S07_reframe_pullpan',942,946),('S07_stamp_slam',947,951),('S07_stamp_landed_smug',952,955),('S07_worried_hold',956,1019),
]
E=[ # id, shot, a,b, layer, type, change, values, conf, evidence
('E01','S01',0,54,'camera','static hold','cabin interior, tarred-and-feathered figure in navy/yellow bicorne seated, no visible motion','ORB similarity F0->F54 scale 0.998, ty +2.4px; mean_absdiff ~1.5 (compression)','observed','crops/feather_0_54.png; crops/m_0000.png'),
('E02','S01',54,55,'edit','hard cut','cabin -> farmer close-up','mean_absdiff 53.8 at F55','observed','crops/cut055_bottle.png'),
('E03','S02',55,83,'camera','slow pull-back','farmer face shrinks slowly','cum scale 0.948 over 28f (~-0.19%/f), drift +11px x, +10px y','estimated','crops/m_0000.png'),
('E04','S02',84,86,'camera','quick pull-back reveal','3-frame pull widens frame as bottle enters','per-frame scale 0.955,0.905,0.948 -> cum 0.82; tx +30px','estimated','crops/cut055_bottle.png'),
('E05','S02',85,126,'prop','pop-in','whiskey bottle with black hose/still coil appears at right (x~0.63-0.80, y~0.12-0.85) fully formed on F85, no slide','1-frame appearance','observed','crops/cut055_bottle.png'),
('E06','S02',85,126,'text','caption on','WHISKEY REBELLION, white bold caps, thin dark outline/soft shadow, lower third','box x0.13-0.885 y0.81-0.90; cap height ~0.08H; pop on in 1f, holds 42f to cut','observed','crops/caption_native.png'),
('E07','S02',126,127,'edit','hard cut','farmer -> Washington ECU over flag + bushes','mean_absdiff 80.2','observed','crops/cut055_bottle.png'),
('E08','S03',127,260,'camera','slow pull-back','very slow zoom-out on ECU','cum scale 0.968 over 133f; tx +6.6 ty +3.2px','estimated','crops/m_0096.png'),
('E09','S03',180,183,'mascot','rise-in from bottom edge','bald-eagle mascot in black suit rises from below frame bottom-left, worried brows, both arms raised','4 frames (F180 head tip, F183 full); settles F184; box ~x0.08-0.24 y0.69-1.0; travel ~0.3H','observed','crops/mascot180.png'),
('E10','S03',184,260,'mascot','held listener pose','eagle holds worried look, arms raised, tiny arm settle F184-189 then static','no beak motion','observed','crops/mascot180.png'),
('E11','S03',193,193,'face','expression swap','Washington smug (angled brows, pupils right, smile) -> worried (high arched brows, dot eyes, flat mouth, light-blue sweat drop on right cheek); 1-frame swap, no in-between','swap between F192 and F193; head/hat/hair unchanged','observed','crops/face192.png'),
('E12','S03',260,261,'edit','hard cut','ECU -> wide field with horse + militia','mean_absdiff 93.1','observed','crops/m_0192.png'),
('E13','S04',261,283,'camera','slow pull-back','field shot opens with slow zoom-out','cum scale 0.961 over 22f','estimated','crops/m_0192.png'),
('E14','S04',284,327,'grade','scene dim (name card)','whole frame darkens in 1 frame, underlying animation continues','brightness 130.4 -> 37.5 (x0.29, ~71% dim); 44f = 1.467s; hard on/off','observed','crops/namecard_native.png; metrics.csv'),
('E15','S04',284,327,'text','name card','GEORGE WASHINGTON, white bold caps, centred, no visible outline','box x0.123-0.88 y0.467-0.571; pops with dim','observed','crops/namecard_native.png'),
('E16','S04',332,392,'text','caption on','13,000 MILITIA, white bold caps with thin dark outline, lower centre','box x0.246-0.786 y0.80-0.90; on 1f at F332, off 1f at F393; 61f = 2.03s','observed','crops/caption_native.png'),
('E17','S04',261,608,'character','ride-in-place cycle','W on white horse faces left; horse legs change every frame (on 1s); militia cluster (duplicated soldiers, muskets) bob','legs on 1s; rider head stable','observed','crops/horse_walk_328.png'),
('E18','S04',328,439,'camera','slow pull-back','slow zoom-out continues after name card','cum scale ~0.87 over 112f','estimated','crops/m_0384.png'),
('E19','S04',440,491,'camera','big pull-back reveal','camera pulls ~8x out to reveal treeline, river gap, mountains and sky; army becomes tiny block lower right','cum scale 0.86 -> 0.12; per-4f scale 0.985,0.975,0.962,0.941,0.904,0.827,0.696,0.658(F468-472 peak),0.731,0.809,0.871,0.931,0.984; ease-in-out; fixed point ~ (0.50,0.85)','estimated','crops/m_0384.png; crops/m_0480.png'),
('E20','S04',492,608,'camera','extreme-wide hold','painted landscape hold, army block x~0.53-0.98 y~0.75-0.92 marching in place','scale change <0.5%','observed','crops/m_0480.png'),
('E21','S04',608,609,'edit','hard cut','extreme wide -> road march','mean_absdiff 46.2','observed','sheets/seq_F000600-F000611.png'),
('E22','S05',609,671,'camera','pan + pull','camera pans with group then pulls back; brightness rises 114->132','scale 609-672 ~0.66 cumulative; strong leftward translate','estimated','sheets/seq_F000612-F000623.png'),
('E23','S05',614,616,'character','militia enter','three militia walk in from right edge behind horse','3 frames to clear edge','observed','sheets/seq_F000612-F000623.png'),
('E24','S05',632,708,'graphic','unknown-figure silhouette','white dotted keyhole/person outline with white "?" enters from left edge and walks with group; settles x~0.24-0.30 y~0.55-0.90','enters F632, settled by ~F668','observed','crops/road_horse_672.png'),
('E25','S05',672,708,'character','treadmill walk','horse legs cycle on 1s, rider head steady (+-1px), soldiers bob, camera nearly static','head y 59-61px; scale 0.953 over 36f','observed','crops/road_horse_672.png'),
('E26','S05',708,709,'edit','hard cut','road -> formation field','mean_absdiff 48.8','observed','sheets/seq_F000708-F000719.png'),
('E27','S06',709,896,'crowd','formation march in place','8+ columns x 10 identical soldier sprites facing right, muskets right, per-frame jitter; W on horse right of block facing right','2 blocks of 4 cols + partial; camera pull cum ~0.74 (709-896)','observed','sheets/seq_F000804-F000815.png'),
('E28','S06',840,875,'character','opacity fade-out','Washington+horse fade out while formation keeps marching','~100% F839 -> ~50% F848 -> ~25% F860 -> 0 by ~F876; ~36f linear-ish','estimated','sheets/seq_F000840-F000851.png; sheets/seq_F000864-F000875.png'),
('E29','S06',896,897,'edit','hard cut','formation -> Washington CU (teal painted BG, hill)','mean_absdiff 61.8','observed','sheets/seq_F000888-F000899.png'),
('E30','S07',897,941,'character','smug hold','W 3/4 left, angled brows, smile; no blink, no mouth','scale 1.0009, ty -1.2px over 44f','observed','sheets/seq_F000900-F000911.png'),
('E31','S07',942,946,'camera','fast reframe pull+pan','5-frame move: W shifts to right third and shrinks, revealing blue coat; stamp space opens left','per-frame scale 0.964,0.907,0.878,0.882,0.945 (cum 0.64); tx +17.8,+44.8,+58.9,+57.1,+26.3px; ease-in-out','estimated','sheets/seq_F000936-F000947.png'),
('E32','S07',947,951,'stamp','slam in','red ink stamp THE LAST PRESIDENT / TO LEAD AN ARMY / PERSONALLY, rectangular border, rotated ~-8deg, grunge/transparent ink','scale 3.0,2.6,2.2,1.8,1.4 -> 1.0 at F952 (linear -0.4/f); centre (0.430,0.413)->(0.293,0.375); no overshoot, no flash, no dim','observed','crops/stamp_native.png; sheets/seq_F000948-F000959.png'),
('E33','S07',952,1019,'stamp','landed hold','stamp static to end','box x0.042-0.554 y0.158-0.608 (rot -7.97deg minAreaRect 211x82px); ink BGR ~(44,44,232)','observed','crops/stamp_native.png'),
('E34','S07',956,956,'face','reaction swap','4 frames after landing, W smug -> worried (arched brows, dot eyes, flat mouth, blue sweat drop); 1-frame swap','held 64f to end','observed','crops/stamp_native.png; sheets/seq_F000948-F000959.png'),
]
with open(f'{D}/events.csv','w',newline='') as fh:
    w=csv.writer(fh); w.writerow('event_id,shot_id,first_frame,last_frame,start_s,end_s,layer,event_type,observed_change,measured_values,confidence,evidence_paths'.split(','))
    for e in E: w.writerow([e[0],e[1],e[2],e[3],f'{e[2]/30:.3f}',f'{(e[3]+1)/30:.3f}']+list(e[4:]))
crop=set([0,10,20,30,40,54,55,56,83,84,85,86,87,88,100,126,127,300,350,952,956]+list(range(178,198))+[210,230,250,255,260]+list(range(340,364))+list(range(672,696)))
rows=list(csv.DictReader(open(f'{D}/frames.csv')))
def find(spans,f):
    for s in spans:
        if s[1]<=f<=s[2]: return s[0]
for r in rows:
    f=int(r['frame']); r['shot_id']=find(shots,f); r['visual_state_id']=find(states,f)
    r['event_ids']=';'.join(e[0] for e in E if e[2]<=f<=e[3])
    r['inspection_status']='inspected (sheet+crop)' if f in crop else 'inspected (sheet)'
with open(f'{D}/frames.csv','w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
A=[ # onset_s,tail_s,mapped,visual,cat,desc,conf
(2.89,'',87,85,'sfx candidate','onset near bottle+caption pop (F85); overlaps VO "called whiskey"','low'),
(6.08,'',182,180,'sfx candidate','onset as mascot rises in (F180-183); estimated: pop/whoosh if any','low'),
(6.42,'',193,193,'sfx candidate','onset exactly on W smug->worried face swap; may be VO "even"','low'),
(9.42,'',283,284,'vo/sfx candidate','onset 1f before name-card dim; overlaps VO "george"','low'),
(11.08,'',332,332,'vo','onset on 13,000 MILITIA caption pop; RMS jumps -35 -> -14 dB at F333; coincides with VO "thirteen thousand"','medium'),
(13.15,'',394,393,'vo','onset 1f after caption off; VO "on this course"','low'),
(15.70,'',471,468,'sfx candidate','onset at peak of big pull-back (F464-472); estimated: whoosh possible','low'),
(23.58,'',707,709,'edit','onset 2f before cut to formation; RMS dip -39 dB at F707 then rise','low'),
(28.02,'',841,840,'vo','onset at start of rider fade; VO "president riding along"','medium'),
(30.00,'',900,897,'vo','onset 3f after cut to CU; VO "making george washington"','medium'),
(31.33,'',940,942,'sfx candidate','onset 2f before fast reframe; estimated: whoosh','low'),
('31.667','',950,952,'sfx candidate','RMS rise to -11.9 dB at F950-951 (no flux onset listed) just before stamp lands F952; estimated: stamp thud; overlaps VO "last"','low'),
(32.56,'',977,956,'vo','VO "to lead"; no visual cue (face swap F956 precedes it)','low'),
]
with open(f'{D}/audio_cues.csv','w',newline='') as fh:
    w=csv.writer(fh); w.writerow('onset_s,tail_s,mapped_frame,visual_frame,delta_frames,category,description,confidence,verification'.split(','))
    for a in A: w.writerow([a[0],a[1],a[2],a[3],a[2]-a[3],a[4],a[5],a[6],'unverified (waveform only)'])
print('ok')
