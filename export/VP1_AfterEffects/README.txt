VP Part 1 - Intro to Tyler: editable After Effects project

1. Install fonts/Montserrat-ExtraBold.ttf (double-click > Install), then restart After Effects.
2. After Effects > File > Scripts > Run Script File... > choose the .jsx in this folder.
   (If AE asks, allow scripts: Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network.)
3. The script imports everything in footage/ and audio, and builds the comp "VP Part 1 - Intro to Tyler" (1920x1080, 30 fps):
   - VO + every sound effect as separate audio layers at their exact frames (levels already set)
   - BG ...       background / graphics plates for each shot (cut from footage/BG.mp4)
   - character layers: one layer per pose (PNG), feet-registered, with breathing/sway expressions,
     entrances, drops and walks keyframed; Quill's head + open beak swap on held keyframes
   - RIG / HIP nulls + body, leg and arm layers for walking characters (walk cycle = rotation expressions)
   - CAM / PUNCH nulls: each shot's slow push and punch-ins (all that shot's layers are parented to them)
   - FX ...       drawn effects overlay (footage/FX png sequence with alpha): sweat drops, arrows, vote bars...
   - LABEL / CAPTION / CARD: live text layers you can retype
Every layer is trimmed to the frames where it is on screen, so the timeline reads like the edit itself.
