export interface ToolkitItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  description: string;
  tips: string[];
  examples: { label: string; text: string }[];
  proTip?: string;
}

export interface ToolkitCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  items: ToolkitItem[];
}

export const toolkitCategories: ToolkitCategory[] = [
  {
    id: 'camera',
    label: 'Camera Shots',
    emoji: '🎥',
    color: '#6366f1',
    items: [
      {
        id: 'extreme-wide',
        title: 'Extreme Wide Shot (EWS)',
        subtitle: 'Also called "Establishing Shot"',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'The camera is so far from the subject that the person is barely visible, dwarfed by their environment. Used to establish location, scale, and the world your story inhabits.',
        tips: [
          'Open a film or new location with this shot',
          'Use to show isolation — a lone figure in a vast landscape',
          'Great for epics, westerns, sci-fi world-building',
          'Conveys the character\'s smallness vs. the world',
        ],
        examples: [
          { label: 'Script note', text: 'EXT. SAHARA DESERT - DAY\nA lone figure trudges across endless golden dunes. The sun burns mercilessly overhead.' },
          { label: 'Usage', text: 'Lawrence of Arabia\'s desert shots, 2001\'s bone-to-spacecraft cut, any "lone hero" moment.' },
        ],
        proTip: 'Pair an EWS with a close-up immediately after to create a powerful contrast between world and character.',
      },
      {
        id: 'wide-shot',
        title: 'Wide Shot (WS)',
        subtitle: 'Full body visible, some environment',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'The subject is fully visible with enough environment to give context. The character\'s body language and posture become a storytelling tool — gestures and movement read clearly.',
        tips: [
          'Shows full body language and physical performance',
          'Great for action, choreography, and blocking',
          'Keeps the audience oriented in space',
          'Use for entrances and exits',
        ],
        examples: [
          { label: 'Script note', text: 'INT. BOXING RING - NIGHT\nMARCO steps into the ring. He\'s smaller than his opponent by a full foot. The crowd jeers.' },
          { label: 'Usage', text: 'Fight sequences, dance scenes, character arrivals that need full physical context.' },
        ],
        proTip: 'In a conversation scene, cut to a wide shot when you want to show the emotional distance between two characters.',
      },
      {
        id: 'medium-shot',
        title: 'Medium Shot (MS)',
        subtitle: 'Waist up — the conversational default',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'Framed from the waist up. The most common shot in dialogue scenes — close enough to read facial expressions, wide enough to see hand gestures and body language.',
        tips: [
          'Default for two-person conversations',
          'Shows both face and hand gestures',
          'Neutral — neither intimate nor distant',
          'Use for interviews, news, everyday interaction',
        ],
        examples: [
          { label: 'Script note', text: 'INT. POLICE INTERROGATION ROOM - DAY\nDETECTIVE SARA leans back in her chair, arms folded. She\'s heard this lie before.' },
          { label: 'Usage', text: 'Talk show interviews, news anchors, most TV dialogue scenes.' },
        ],
        proTip: 'Moving from a medium shot to a close-up mid-dialogue signals a key emotional moment without cutting.',
      },
      {
        id: 'close-up',
        title: 'Close-Up (CU)',
        subtitle: 'Face fills the frame — maximum emotion',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'The face (or a key object) fills the frame. One of the most powerful shots in cinema. The audience is forced into intimacy with the character. Every micro-expression becomes a monologue.',
        tips: [
          'Use sparingly — each use should feel earned',
          'Reveals emotion the character is trying to hide',
          'Insert close-ups of objects to give them narrative weight',
          'Builds tension in horror and thriller sequences',
        ],
        examples: [
          { label: 'Script note', text: 'CLOSE ON — ELENA\'s eyes. A single tear she refuses to let fall. She blinks it away.' },
          { label: 'Usage', text: 'Sergio Leone\'s "The Good, The Bad and The Ugly" — close-ups of eyes during the standoff.' },
        ],
        proTip: 'The "Kuleshov Effect" — a close-up of a neutral face + any image makes the audience project emotion. Use it.',
      },
      {
        id: 'extreme-close-up',
        title: 'Extreme Close-Up (ECU)',
        subtitle: 'One detail — overwhelming focus',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'Just one feature — an eye, a mouth, a trigger finger, a ring. Isolates a single detail with absolute intensity. Creates unease, focus, or fetishizes an object.',
        tips: [
          'Use to signal what the audience MUST notice',
          'Creates claustrophobia and tension',
          'Perfect for horror — reveal a monster\'s eye, a wound',
          'Use on objects to make them symbolically important',
        ],
        examples: [
          { label: 'Script note', text: 'ECU — The SAFETY PIN on his grenade. His thumb hovers over it.' },
          { label: 'Usage', text: 'Hitchcock used ECU of feet, hands, eyes to control audience anxiety precisely.' },
        ],
        proTip: 'An ECU of an object (a clock, a gun, a letter) can replace an entire exposition scene.',
      },
      {
        id: 'over-shoulder',
        title: 'Over-the-Shoulder (OTS)',
        subtitle: 'Perspective and power dynamics',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'Camera shoots over one character\'s shoulder at the other. Grounds the audience in the POV character\'s perspective while showing the other\'s reaction. Also reveals power dynamics through framing.',
        tips: [
          'Character with more screen space has more power',
          'Alternate OTS shots in arguments to track shifts',
          'Keep the 180° rule — never cross the line',
          'Slightly lower angles give the character authority',
        ],
        examples: [
          { label: 'Script note', text: 'OTS — DANIEL, looking up at the judge. She towers over him in frame.' },
          { label: 'Usage', text: 'Courtroom dramas, interrogation scenes, any power-imbalanced conversation.' },
        ],
        proTip: 'Deliberately violate the 180° rule for a disorienting, psychologically disturbing effect.',
      },
      {
        id: 'pov',
        title: 'Point of View (POV)',
        subtitle: 'The audience becomes the character',
        tag: 'Shot Type',
        color: '#6366f1',
        description: 'The camera literally becomes the character\'s eyes. The audience experiences exactly what the character sees. Creates maximum immersion and forces empathy or dread.',
        tips: [
          'Establish whose POV with a prior shot of the character looking',
          'Handheld adds authenticity and body presence',
          'Used in horror to put audience in victim\'s position',
          'First-person shooters borrowed this entirely from film',
        ],
        examples: [
          { label: 'Script note', text: 'POV — MIRA\'S — She peers through the keyhole. A darkened room. Then — a shape moves.' },
          { label: 'Usage', text: 'Peele\'s "Get Out" — the sunken place sequence. Hitchcock\'s "Rear Window" throughout.' },
        ],
        proTip: 'Deliberately delay the POV reveal — first show the character\'s reaction, then cut to POV. Builds anticipation.',
      },
      {
        id: 'dolly-zoom',
        title: 'Dolly Zoom (Vertigo Effect)',
        subtitle: 'Disorientation made physical',
        tag: 'Technique',
        color: '#8b5cf6',
        description: 'The camera physically moves toward or away from the subject while simultaneously zooming the opposite direction. The subject stays the same size, but the background warps and stretches — creating a visceral sense of psychological disturbance.',
        tips: [
          'Zoom in + dolly back = background grows, figure stays constant',
          'Used for sudden revelations, vertigo, panic attacks',
          'The character feels the world shifting around them',
          'Takes planning — mark your start/end positions precisely',
        ],
        examples: [
          { label: 'Script note', text: 'DOLLY ZOOM on BRODY as he realizes the shark is in the water. The world falls away behind him.' },
          { label: 'Usage', text: 'Hitchcock invented it in "Vertigo." Spielberg used it perfectly in "Jaws." Scorsese in "Goodfellas."' },
        ],
        proTip: 'Modern version: replicate in post with a "Ken Burns + scale" effect, but in-camera always feels more real.',
      },
      {
        id: 'dutch-angle',
        title: 'Dutch Angle (Canted Frame)',
        subtitle: 'Unease without a single word',
        tag: 'Technique',
        color: '#8b5cf6',
        description: 'The camera is tilted on its roll axis so the horizon is not level. The world is literally crooked. Immediately signals to the audience that something is wrong, unstable, or morally off.',
        tips: [
          'Villains, madness, and moral corruption use Dutch angles',
          'Degree of tilt = degree of wrongness',
          '15° feels uneasy; 45° feels psychotic',
          'Avoid overuse — loses impact if used everywhere',
        ],
        examples: [
          { label: 'Script note', text: 'DUTCH ANGLE — The WARDEN smiles at the new prisoner. Something is deeply wrong here.' },
          { label: 'Usage', text: 'Tim Burton films, Batman (1966 TV show), Requiem for a Dream\'s addiction sequences.' },
        ],
        proTip: 'Use a Dutch angle on the PROTAGONIST when they\'re making a morally wrong choice — even heroes can be shown as tilted.',
      },
    ],
  },
  {
    id: 'mood',
    label: 'Cinematic Moods',
    emoji: '🎭',
    color: '#ec4899',
    items: [
      {
        id: 'silence',
        title: 'Silence Before Impact',
        subtitle: 'The loudest tool is no sound',
        tag: 'Sound Design',
        color: '#ec4899',
        description: 'Sudden silence after busy soundscapes creates more tension than any music could. The brain interprets the absence of sound as danger — something is wrong, something is about to happen. Silence is anticipation weaponized.',
        tips: [
          'Cut all ambient sound 2–3 seconds before a key moment',
          'Hold silence longer than feels comfortable',
          'Followed by a sudden sound = maximum impact',
          'Works for horror, drama, and unexpected comedy beats',
        ],
        examples: [
          { label: 'Direction', text: 'The crowd ROARS — then — SILENCE. Everyone has seen what she did. The only sound: her breathing.' },
          { label: 'Usage', text: 'The opening of "No Country for Old Men." The D-Day sequence in "Saving Private Ryan."' },
        ],
        proTip: 'Tell your composer and sound designer: "I want 4 seconds of total silence here." Fight to keep it.',
      },
      {
        id: 'diegetic',
        title: 'Diegetic vs Non-Diegetic Sound',
        subtitle: 'What\'s real in the world vs. what only we hear',
        tag: 'Sound Theory',
        color: '#ec4899',
        description: 'Diegetic sound exists within the story world — characters can hear it (a radio playing, footsteps, dialogue). Non-diegetic sound is for the audience only — score, voiceover narration. The boundary between them is one of cinema\'s most powerful tools.',
        tips: [
          'Diegetic: radio, TV, a character singing, ambient noise',
          'Non-diegetic: orchestral score, narrator\'s voice',
          'Blurring the line creates surreal, dreamlike effects',
          'A character hearing the score = psychological break from reality',
        ],
        examples: [
          { label: 'Technique', text: 'Score fades IN as a character imagines a memory — then CUTS OUT when they\'re snapped back to reality.' },
          { label: 'Usage', text: '"Whiplash" — the drumming blurs between diegetic performance and non-diegetic fantasy obsession.' },
        ],
        proTip: 'Have a character\'s diegetic music (headphones) bleed into your non-diegetic score — audiences subconsciously feel the merge.',
      },
      {
        id: 'leitmotif',
        title: 'Leitmotif for Characters',
        subtitle: 'Give every character a sonic identity',
        tag: 'Score Design',
        color: '#ec4899',
        description: 'A leitmotif is a recurring musical theme tied to a character, place, or idea. When that theme plays, even without the character on screen, the audience emotionally connects. It\'s unconscious storytelling through music.',
        tips: [
          'Assign a short melodic phrase (4–8 notes) per major character',
          'Introduce it when the character first appears strongly',
          'Transform it as the character changes (minor key = corruption)',
          'Let it play softly when the character is referenced but absent',
        ],
        examples: [
          { label: 'Direction', text: 'ELENA\'S THEME plays softly — but she\'s not on screen. MARCUS is holding her photograph. He misses her.' },
          { label: 'Usage', text: 'John Williams: Darth Vader\'s Imperial March, Schindler\'s List theme, Harry Potter\'s Hedwig\'s Theme.' },
        ],
        proTip: 'When the villain\'s leitmotif plays in a heroic major key, you\'ve foreshadowed a redemption arc.',
      },
    ],
  },
  {
    id: 'structure',
    label: 'Story Structures',
    emoji: '📐',
    color: '#f59e0b',
    items: [
      {
        id: 'save-the-cat',
        title: 'Save the Cat Beat Sheet',
        subtitle: 'Blake Snyder\'s 15-beat Hollywood blueprint',
        tag: 'Structure',
        color: '#f59e0b',
        description: 'The most-used screenplay structure in Hollywood. 15 specific beats mapped to page numbers in a 110-page screenplay. "Save the Cat" = the moment your hero does something likeable before the story begins.',
        tips: [
          'Opening Image (p.1) — sets tone and theme visually',
          'Theme Stated (p.5) — someone tells the hero what they need to learn',
          'Catalyst (p.12) — the incident that starts everything',
          'Break Into Two (p.25) — hero steps into the new world',
          'Midpoint (p.55) — false victory or false defeat',
          'All Is Lost (p.75) — the darkest moment',
          'Break Into Three (p.85) — hero finds the solution',
          'Final Image (p.110) — mirror of Opening Image, showing change',
        ],
        examples: [
          { label: 'Template', text: 'p.1: We see MAYA in her element — confident, sharp.\np.12: Her mentor is murdered.\np.25: She accepts the job no one else will take.\np.55: She thinks she\'s caught the killer.\np.75: She was wrong. And now she\'s the target.\np.85: She remembers what her mentor taught her.\np.110: Same coffee shop — but now she\'s the mentor.' },
        ],
        proTip: 'The Opening and Final Image should be almost identical visually — but the meaning is completely transformed.',
      },
      {
        id: 'heros-journey',
        title: "Hero's Journey",
        subtitle: "Joseph Campbell's monomyth — 12 stages",
        tag: 'Structure',
        color: '#f59e0b',
        description: "Found in virtually every culture's mythology. The hero leaves their ordinary world, faces trials, transforms, and returns changed. George Lucas studied Campbell directly when writing Star Wars. It works because it mirrors psychological growth.",
        tips: [
          'Ordinary World — who is this person before the story?',
          'Call to Adventure — the inciting disruption',
          'Refusal of the Call — fear, doubt, resistance',
          'Meeting the Mentor — wisdom received',
          'Crossing the Threshold — no going back',
          'Ordeal — the central crisis, near-death or darkest moment',
          'Reward — the hero seizes what they came for',
          'The Road Back — return to ordinary world is dangerous',
          'Resurrection — final test, the hero is truly transformed',
          'Return with Elixir — brings something back for their world',
        ],
        examples: [
          { label: 'Mapping', text: 'Star Wars: Luke (Ordinary World) → R2D2 message (Call) → Ben Kenobi (Mentor) → Death Star (Ordeal) → Destroys it (Resurrection) → Medal ceremony (Return).' },
        ],
        proTip: "The 'Refusal of the Call' is the most skipped beat. Don't skip it — it makes your hero human, not a chosen-one robot.",
      },
      {
        id: 'in-medias-res',
        title: 'In Medias Res',
        subtitle: 'Start in the middle of the action',
        tag: 'Technique',
        color: '#f59e0b',
        description: 'Latin: "into the middle of things." Open your story at a moment of action, tension, or conflict — then fill in backstory as needed. Grabs the audience immediately. No slow build-up, no "let me explain who everyone is first."',
        tips: [
          'First scene = maximum interest, not maximum explanation',
          'Trust your audience to catch up — they will',
          'Use dialogue and small details to imply history',
          'Cold opens in TV use this almost universally',
          'Backstory is revealed through action, not monologue',
        ],
        examples: [
          { label: 'Bad opening', text: 'FADE IN:\nWe see a city. It\'s busy. JOHN, 35, a detective, has been working this case for 3 years. He lives alone after his divorce...' },
          { label: 'In medias res', text: 'FADE IN:\nJOHN slams a suspect against the wall. "Where is she?" His hands are shaking. He hasn\'t slept in 36 hours.' },
        ],
        proTip: 'Your best opening line is somewhere on page 3. Cut everything before it.',
      },
    ],
  },
  {
    id: 'format',
    label: 'Screenplay Format',
    emoji: '📝',
    color: '#10b981',
    items: [
      {
        id: 'slug-lines',
        title: 'Slug Lines Set the Scene',
        subtitle: 'INT./EXT. LOCATION — TIME OF DAY',
        tag: 'Format',
        color: '#10b981',
        description: 'Every new scene begins with a slug line (scene heading). Always caps. It tells production exactly where and when they need to be. It also functions as a rhythm break for readers — visual breathing room between scenes.',
        tips: [
          'Format: INT. LOCATION — DAY / NIGHT / CONTINUOUS',
          'INT. = Interior (indoors), EXT. = Exterior (outdoors)',
          'CONTINUOUS = immediately follows the prior scene',
          'Be specific enough for a location scout to find it',
          'Avoid overlong slug lines — "INT. ABANDONED WAREHOUSE — NIGHT" not "INT. THE OLD ABANDONED WAREHOUSE ON THE EAST SIDE OF TOWN — NIGHT"',
        ],
        examples: [
          { label: 'Correct', text: 'INT. DETECTIVE\'S OFFICE — NIGHT\n\nEXT. GOLDEN GATE BRIDGE — DAWN\n\nINT./EXT. MOVING TRAIN — DAY (use when action moves inside and outside)' },
          { label: 'Secondary header', text: 'Use: "INT. DETECTIVE\'S OFFICE — CONTINUOUS" when you cut from just outside the door to inside without a time jump.' },
        ],
        proTip: 'Number your scenes only in a "shooting script" — not in spec scripts. Numbered scenes signal "this is ready to shoot."',
      },
      {
        id: 'show-dont-tell',
        title: "Show, Don't Tell in Action Lines",
        subtitle: 'Write what the camera sees, not what characters feel',
        tag: 'Format',
        color: '#10b981',
        description: 'Action lines describe only what can be SEEN and HEARD on screen. You cannot write "John is sad" — a camera cannot photograph sadness. You write what sadness looks like: the untouched coffee, the way he stares at the ceiling, the photograph face-down on the desk.',
        tips: [
          'Never write internal states directly — externalize them',
          '"He\'s nervous" → "His leg bounces under the table"',
          '"She\'s angry" → "She sets the glass down without spilling a drop. Slowly."',
          'The most powerful action lines use unexpected specificity',
          'White space is your friend — short paragraphs read faster on screen',
        ],
        examples: [
          { label: 'Tell (wrong)', text: 'JAMES feels sad about losing his job. He thinks about his daughter and wonders if he failed her.' },
          { label: 'Show (right)', text: 'JAMES stares at the severance letter. He slides it into the recycling bin, then fishes it back out. Smooths the crease.\n\nHe sets it beside his daughter\'s drawing on the fridge.' },
        ],
        proTip: '"A man\'s face crumples" tells us more about crying than "tears fall down his face." Choose unexpected, precise verbs.',
      },
      {
        id: 'dialogue-three-lines',
        title: 'Keep Dialogue Under 3 Lines',
        subtitle: 'Real people don\'t monologue',
        tag: 'Format',
        color: '#10b981',
        description: 'In real speech, people rarely say more than 2–3 sentences uninterrupted. Long dialogue blocks feel theatrical, not cinematic. Break them up with action beats — what is the character DOING while they talk? What is the other character\'s face doing?',
        tips: [
          'If a speech is longer than 3 lines, add an action beat',
          'Action beats give actors direction without stage direction',
          'Subtext: what they MEAN is not what they SAY',
          '"Fine." can mean rage, defeat, sarcasm, or relief — context is everything',
          'Read dialogue aloud — if you run out of breath, cut it',
        ],
        examples: [
          { label: 'Too long', text: 'SARAH\nI\'ve been thinking about everything and I realize that you never really cared about me or my feelings and you always put your work first and I\'m done waiting for you to change because I don\'t think you ever will.' },
          { label: 'Broken up (right)', text: 'SARAH\nI\'ve been thinking.\n\nShe slides her keys across the table.\n\nSARAH (CONT\'D)\nYou\'re not going to change.\n\nJAMES opens his mouth.\n\nSARAH\nDon\'t.' },
        ],
        proTip: '"Don\'t." alone, in the right moment, is more powerful than a 10-line monologue. Trust silence and implication.',
      },
    ],
  },
];
