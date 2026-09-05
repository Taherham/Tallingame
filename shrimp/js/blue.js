// Blue belt curriculum: systems and depth.

const BLUE_UNITS = [
  {
    id: "b1",
    title: "Open Guards I",
    subtitle: "De la Riva, spider, lasso, collar-sleeve",
    videoQueries: [
      "de la riva guard basics bjj",
      "spider guard basics bjj tutorial",
      "lasso guard bjj tutorial",
      "collar sleeve guard bjj",
    ],
    videos: [
      {"id":"iTwjK-ou0js","title":"How to Improve your De La Riva Guard by MIKEY MUSUMECI","channel":"Bernardo Faria BJJ Fanatics","duration":52},
      {"id":"qpmc6uClx4o","title":"Intro to Spider Guard & How to Use It | BJJ Guards","channel":"Knight Jiu-Jitsu","duration":281},
      {"id":"kFCAsm0A85M","title":"Lasso Guard Sweep & Arm Drag Combo","channel":"MMA Leech","duration":293},
      {"id":"776BVyZM504","title":"Guard Players - Stop getting your guard passed 2 sweeps in collar sleeve","channel":"Sticks and Stones BJJ","duration":168}
    ],
    keyIdeas: [
      "Open guard is grips plus angles. Lose the grips and the guard collapses.",
      "Every hook does one job: off-balance them or hold distance. Know which one you're using.",
      "The best open guard attacks come when they post or reach. Give them a reason to.",
    ],
    lessons: [
      {
        id: "b1a",
        title: "De la Riva",
        questions: [
          { type: "mc", prompt: "De la Riva guard is defined by:", choices: ["Your outside leg hooking around the outside of their lead leg, with grips on their ankle and sleeve", "Both feet on their hips", "Legs locked around their waist", "Hooks inside both thighs"], answer: 0 },
          { type: "mc", prompt: "What does the De la Riva hook mainly do?", choices: ["Off-balances them by pulling their knee out and forward", "Chokes", "Locks the ankle", "Nothing"], answer: 0 },
          { type: "mc", prompt: "The biggest danger in De la Riva:", choices: ["Getting your hooking leg smashed and knee-cut passed. Keep the hook tight and your other foot on their hip or knee.", "Getting choked", "Nothing", "Being lifted"], answer: 0 },
          { type: "sequence", prompt: "Order the basic De la Riva sweep:", steps: ["Hook the outside of their lead leg and grab that ankle", "Put your other foot on their far knee or hip", "Pull the ankle as you push the knee", "Come up on top as they fall"] },
        ],
      },
      {
        id: "b1b",
        title: "Spider & lasso",
        questions: [
          { type: "mc", prompt: "Spider guard is:", choices: ["Feet on their biceps, gripping both sleeves", "Feet on their hips", "Feet hooked around their legs", "Lying flat with no grips"], answer: 0 },
          { type: "mc", prompt: "Lasso guard wraps your leg:", choices: ["Around their arm, your foot ending inside behind their arm", "Around their neck", "Around their leg", "Behind your own back"], answer: 0 },
          { type: "mc", prompt: "Spider guard is strong for:", choices: ["Controlling posture and setting up triangles, omoplatas and sweeps", "Standing up", "Leg locks", "Nothing in particular"], answer: 0 },
          { type: "mc", prompt: "The main weakness of spider and lasso if you lose the sleeve grips:", choices: ["The guard collapses and they pass easily", "No weakness", "It becomes closed guard", "They fall over"], answer: 0 },
        ],
      },
      {
        id: "b1c",
        title: "Collar-sleeve",
        questions: [
          { type: "mc", prompt: "Collar-sleeve guard controls:", choices: ["One collar and the opposite sleeve, with a foot on the bicep or hip", "Both sleeves", "The belt and pants", "Both collars"], answer: 0 },
          { type: "mc", prompt: "A common attack from collar-sleeve:", choices: ["Triangle or omoplata when they post the gripped arm", "Rear naked choke", "Heel hook", "Kneebar"], answer: 0 },
          { type: "mc", prompt: "Why is collar-sleeve so popular at blue belt?", choices: ["It's easy to get from closed guard and links to many attacks", "It's illegal later", "It scores four points", "It needs no grips"], answer: 0 },
          { type: "sequence", prompt: "Order the omoplata from collar-sleeve:", steps: ["Push their arm across and down with the sleeve grip and foot on the bicep", "Swing your leg over their shoulder", "Sit up and turn toward their legs, trapping the arm", "Control their hips and drive them face down"] },
        ],
      },
    ],
  },
  {
    id: "b2",
    title: "Open Guards II",
    subtitle: "Butterfly, X-guard, seated concepts",
    videoQueries: [
      "butterfly guard sweep tutorial bjj",
      "x guard basics bjj",
      "single leg x guard entry bjj",
      "seated guard concepts bjj distance management",
    ],
    videos: [
      {"id":"mnZi33gJ5pU","title":"7 Butterfly Guard Sweeps to Build an Effective Sweeping Game","channel":"Chewjitsu","duration":222},
      {"id":"1dz8AQsexyQ","title":"4 X-GUARD ENTRIES that you need to know! 💥 #bjj #brazilianjiujitsu #jiujitsu","channel":"Jordan Teaches Jiujitsu","duration":47},
      {"id":"usWlT7CW4HU","title":"Bjj X Guard Entry from Half Guard","channel":"Chewjitsu","duration":247},
      {"id":"y0C8vIeCrc0","title":"2 Single Leg X Entry and Sweep by Marcelo Garcia","channel":"BJJ Fanatics","duration":179}
    ],
    keyIdeas: [
      "Butterfly guard dies when you lie flat. Sit up, get chest to chest.",
      "X-guard turns their standing base into your sweep. Stretch them, then lift.",
      "From seated guard, your hands and feet are barriers. Win the grip fight before they win your legs.",
    ],
    lessons: [
      {
        id: "b2a",
        title: "Butterfly guard",
        questions: [
          { type: "mc", prompt: "In butterfly guard, your feet:", choices: ["Hook inside their thighs so you can lift them", "Lock behind their back", "Rest on their hips", "Stay on the mat"], answer: 0 },
          { type: "mc", prompt: "The butterfly sweep needs:", choices: ["An underhook (or overhook) and a lift with the hook as you fall to your shoulder", "Both collar grips", "Standing", "Their belt"], answer: 0 },
          { type: "sequence", prompt: "Order the butterfly sweep:", steps: ["Get an underhook and control their other arm", "Pull them in close, chest to chest", "Fall to the side away from your underhook while lifting with that side's hook", "Follow through into mount or side control"] },
          { type: "mc", prompt: "Butterfly guard is hardest to pass when you:", choices: ["Sit up and stay chest to chest", "Lie flat", "Cross your feet", "Let go of your grips"], answer: 0 },
        ],
      },
      {
        id: "b2b",
        title: "X-guard",
        questions: [
          { type: "mc", prompt: "X-guard is:", choices: ["You're under them, your legs making an X on one leg while you control the other", "Legs crossed behind their back", "A standing position", "Feet on their biceps"], answer: 0 },
          { type: "mc", prompt: "X-guard is usually entered from:", choices: ["Butterfly or single leg X when they stand", "Mount", "Side control", "Turtle"], answer: 0 },
          { type: "mc", prompt: "The basic X-guard sweep works by:", choices: ["Extending your legs to stretch their base while controlling the far leg", "Choking", "Pulling the collar", "Rolling backward"], answer: 0 },
          { type: "mc", prompt: "Single leg X differs from X-guard because:", choices: ["You control one leg with both of yours, outside foot on their hip", "You control both legs", "You're standing", "There's no difference"], answer: 0 },
        ],
      },
      {
        id: "b2c",
        title: "Seated guard concepts",
        questions: [
          { type: "mc", prompt: "In seated open guard, keep your:", choices: ["Hands and feet as barriers between you and them", "Hands on the mat behind you", "Legs flat", "Head down"], answer: 0 },
          { type: "mc", prompt: "Grip fighting from seated guard aims to:", choices: ["Control their sleeve, collar or ankle before they control your legs", "Rest", "Score", "Stand up"], answer: 0 },
          { type: "mc", prompt: "Why follow them with your hips as they circle?", choices: ["A passer circles for an angle; keeping your feet pointed at them shuts it down", "It's a rule", "To tire them out", "It looks good"], answer: 0 },
          { type: "mc", prompt: "When the opponent stands up to pass, a good option is:", choices: ["Enter X-guard or single leg X, or stand up yourself", "Lie flat and wait", "Cross your ankles", "Turn away"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b3",
    title: "Half Guard Offense",
    subtitle: "Underhook, knee shield, deep half",
    videoQueries: [
      "half guard underhook knee shield bjj",
      "old school sweep half guard tutorial",
      "plan b sweep half guard",
      "deep half guard basics bjj",
    ],
    videos: [
      {"id":"RdlbVK_9bpA","title":"5 tips for an IMPASSABLE Half Guard 🔥🥋 #bjj #brazilianjiujitsu #jiujitsu","channel":"Jordan Teaches Jiujitsu","duration":61},
      {"id":"-S1lhWAX2ps","title":"Roberto 'Gordo' Correa Teaches the Old School Half Guard Sweep","channel":"Stephan Kesting","duration":136},
      {"id":"nRFFmWCcgkE","title":"Escape and Attack From Bottom Half Guard by Brian Glick","channel":"Bernardo Faria BJJ Fanatics","duration":59},
      {"id":"BAw7EZ0jalc","title":"How to Go To Deep Half Guard From Closed Guard","channel":"Bernardo Faria BJJ Fanatics","duration":60}
    ],
    keyIdeas: [
      "Half guard on your side is offense. Half guard flat on your back is a pin.",
      "The underhook is the whole game: get it and you sweep or take the back.",
      "Deep half hides your head under their hips where their arms can't reach.",
    ],
    lessons: [
      {
        id: "b3a",
        title: "Underhook & knee shield",
        questions: [
          { type: "mc", prompt: "The knee shield is:", choices: ["Your top knee across their chest or hip, keeping distance", "Your knee on the mat", "Their knee on you", "A guard pass"], answer: 0 },
          { type: "mc", prompt: "The underhook from bottom half guard lets you:", choices: ["Come up to your knees (the dogfight) or take the back", "Lie flat", "Choke", "Nothing"], answer: 0 },
          { type: "mc", prompt: "They get the underhook and cross-face on you in half guard. That means:", choices: ["You're being flattened. Fight to recover the underhook, or frame and shrimp.", "You're winning", "Attack a heel hook", "Give up"], answer: 0 },
          { type: "sequence", prompt: "Order the underhook half guard to dogfight:", steps: ["Turn onto your side with the knee shield in", "Win the underhook and get your head under their chin", "Come up to your knees keeping the underhook", "Take the back or drive them over to sweep"] },
        ],
      },
      {
        id: "b3b",
        title: "Old school & plan B",
        questions: [
          { type: "sequence", prompt: "Order the old school sweep:", steps: ["Win the underhook from half guard", "Come up onto your elbow and knees", "Reach across and grab their far ankle", "Drive forward with your shoulder and pull the ankle"] },
          { type: "mc", prompt: "\"Plan B\" is:", choices: ["When they block old school by sprawling, you roll under and dump them backward the other way", "Pulling closed guard", "Standing up", "Tapping"], answer: 0 },
          { type: "mc", prompt: "The whizzer (overhook) from the top player is the main counter to:", choices: ["Your underhook", "Your knee shield", "Your collar grip", "Your foot lock"], answer: 0 },
          { type: "mc", prompt: "Deep half guard puts you:", choices: ["Under their hips, holding one of their legs with your whole body", "Far away", "On their back", "Standing"], answer: 0 },
        ],
      },
      {
        id: "b3c",
        title: "Deep half intro",
        questions: [
          { type: "mc", prompt: "Deep half is usually entered when:", choices: ["They stand or step up to pass and you dive under their hips", "They're flat on you", "You're in mount", "They're in turtle"], answer: 0 },
          { type: "mc", prompt: "The classic deep half sweep (the waiter sweep):", choices: ["Elevates their leg with your legs and rolls them over your body", "Chokes", "Kneebars", "Stands up"], answer: 0 },
          { type: "mc", prompt: "The danger in deep half:", choices: ["Getting your back taken or your neck attacked if you sit up wrong", "Nothing", "Losing points", "Cramping"], answer: 0 },
          { type: "mc", prompt: "Where should your head be in deep half?", choices: ["Tucked under and behind their leg, hidden from their arms", "Up, looking at them", "Between their legs", "On the mat behind you"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b4",
    title: "Guard Retention",
    subtitle: "Frames, hips, pummeling, inversion",
    videoQueries: [
      "guard retention frames distance management bjj",
      "leg pummeling guard retention drill bjj",
      "how to invert bjj granby roll tutorial",
      "guard retention against toreando pass",
    ],
    videos: [
      {"id":"dKjFzCqEc-c","title":"3 tips to improve your guard retention #shorts #bjj #lachlangiles #submeta #nogi  #jiujitsu #guard","channel":"Absolute MMA St Kilda - Melbourne","duration":72},
      {"id":"fIFM4fzVqC0","title":"Through the Legs (Guard Retention)","channel":"Absolute MMA St Kilda - Melbourne","duration":240},
      {"id":"-Ucqg8SJ8_I","title":"The Impassable Guard - White Belt Granby Roll - Invisible Jiu Jitsu","channel":"Invisible Jiu Jitsu","duration":179},
      {"id":"T9ckJr1MV7Q","title":"Three Simple Tricks To Massively Improve Guard Retention","channel":"JonThomasBJJ","duration":253}
    ],
    keyIdeas: [
      "Retention is hips first. If your hips face them, your legs can get back in front.",
      "Frames buy time; pummeling wins the position back.",
      "Inversion is a tool, not a home. Get upside down, get your legs back, get out.",
    ],
    lessons: [
      {
        id: "b4a",
        title: "Frames & distance",
        questions: [
          { type: "mc", prompt: "Frames are:", choices: ["Structural barriers (forearm, shin, foot) that hold distance without muscle", "Punches", "Grips only", "Legs locked around them"], answer: 0 },
          { type: "mc", prompt: "Distance management on the bottom means:", choices: ["Feet and hands on them when they're far, knees and elbows when they're close", "Always far", "Always close", "Whatever happens"], answer: 0 },
          { type: "mc", prompt: "They grab your ankles for a toreando. You:", choices: ["Circle your feet to break the grips and re-frame on their hips or biceps", "Give up guard", "Cross your feet", "Lie still"], answer: 0 },
          { type: "mc", prompt: "A good retention habit:", choices: ["Keep your knees pointed at them and your hips mobile", "Lie flat", "Extend your arms", "Look away"], answer: 0 },
        ],
      },
      {
        id: "b4b",
        title: "Hip movement & leg pummeling",
        questions: [
          { type: "mc", prompt: "Leg pummeling means:", choices: ["Re-inserting your knee or shin between you and the passer as they clear it", "Kicking", "Locking your ankles", "Standing up"], answer: 0 },
          { type: "mc", prompt: "The hip heist or shrimp during retention serves to:", choices: ["Re-square your hips to face them after they get an angle", "Attack", "Rest", "Score"], answer: 0 },
          { type: "mc", prompt: "They're halfway through a knee slice. A common retention:", choices: ["Underhook their passing leg and pummel your shin back in, or frame and shrimp away", "Turn away", "Tap", "Accept side control"], answer: 0 },
          { type: "sequence", prompt: "Order retention against the toreando:", steps: ["They grab your legs and step around", "Turn your hips to face them and frame on the near hip", "Swing your legs through to re-insert a knee", "Establish a new guard"] },
        ],
      },
      {
        id: "b4c",
        title: "Inversion & granby",
        questions: [
          { type: "mc", prompt: "Inverting (going upside down onto your shoulders) is used to:", choices: ["Bring your legs back between you and the passer after they clear your hips", "Attack the arm", "Stand up", "Escape mount"], answer: 0 },
          { type: "mc", prompt: "A granby roll is:", choices: ["A shoulder roll across your upper back to spin back to face them", "A leg lock", "A takedown", "A choke"], answer: 0 },
          { type: "mc", prompt: "Inversion is safer when you:", choices: ["Tuck your chin and roll across your shoulders, not your neck", "Roll over your head", "Keep your legs straight", "Hold your breath"], answer: 0 },
          { type: "mc", prompt: "Inverting exposes:", choices: ["Your back, and your legs to leg locks if you're slow", "Nothing", "Only your arms", "Your collar"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b5",
    title: "Pressure & Modern Passing",
    subtitle: "Over-under, smash, leg drag, long step",
    videoQueries: [
      "over under pass bjj tutorial",
      "smash pass half guard bjj",
      "leg drag pass tutorial bjj",
      "long step pass bjj tutorial",
    ],
    videos: [
      {"id":"rljiPRwM1Oc","title":"The Over-Under Pass in No Gi by Bernardo Faria","channel":"Stephan Kesting","duration":176},
      {"id":"EaZPO3v4OrQ","title":"Getting Stuck in Half Guard in BJJ? Try This Armlock Passing Strategy","channel":"Chewjitsu","duration":240},
      {"id":"n596l_pJi-E","title":"How To Do the Leg Drag Pass, Theory and Practice","channel":"Stephan Kesting","duration":235},
      {"id":"4e902BZ4XvY","title":"BJJ Moves - Long Step Leg Drag","channel":"BJJ Fanatics","duration":81}
    ],
    keyIdeas: [
      "Pressure passing makes them carry your weight until they can't move. Slow is fine.",
      "The leg drag turns their hips away from you. That's the whole point.",
      "Every pass has a counter, so chain passes to opposite sides.",
    ],
    lessons: [
      {
        id: "b5a",
        title: "Over-under & smash",
        questions: [
          { type: "mc", prompt: "The over-under pass:", choices: ["One arm over a leg, one under, chest heavy on their thigh, driving forward", "Both arms over", "Standing far away", "Jumping over"], answer: 0 },
          { type: "mc", prompt: "Pressure passing relies on:", choices: ["Chest and hip weight pinning their legs and hips so they can't move", "Speed only", "Grips only", "Their mistakes"], answer: 0 },
          { type: "mc", prompt: "In the smash pass, you:", choices: ["Pin their legs across their body with your shoulder and chest and walk around", "Stand and pull", "Sit on their chest", "Go under"], answer: 0 },
          { type: "sequence", prompt: "Order the over-under pass:", steps: ["Over one leg, under the other, head tight to their hip", "Drive forward with your chest to flatten them", "Walk your hips toward their head, freeing your knee", "Slide into side control"] },
        ],
      },
      {
        id: "b5b",
        title: "Leg drag",
        questions: [
          { type: "mc", prompt: "The leg drag:", choices: ["Pulls one of their legs across your body so their hips face away, then pins it with your hip", "Lifts both legs", "Grabs ankles and runs around", "Stacks them"], answer: 0 },
          { type: "mc", prompt: "After a leg drag, their hips are:", choices: ["Turned away from you. Great for side control or the back.", "Facing you", "In the air", "Under you"], answer: 0 },
          { type: "mc", prompt: "To counter the leg drag, the bottom player:", choices: ["Frames and turns their hips back to face you", "Lies flat", "Crosses their feet", "Taps"], answer: 0 },
          { type: "mc", prompt: "The leg drag pairs well with:", choices: ["The toreando. Drag when they resist the toreando.", "Closed guard", "Rear naked choke", "Ankle lock"], answer: 0 },
        ],
      },
      {
        id: "b5c",
        title: "Long step & back step",
        questions: [
          { type: "mc", prompt: "The long step pass:", choices: ["Steps your leg far back and around to clear their guard when they frame", "A short hop", "A jump over", "A knee slice"], answer: 0 },
          { type: "mc", prompt: "The back step:", choices: ["Turns your hips away and steps back over their leg to reverse direction, often to pass half guard or enter leg locks", "A guard pull", "Going under", "Bridging"], answer: 0 },
          { type: "mc", prompt: "Why chain passing combinations?", choices: ["Each pass has a counter; switching to the opposite side beats their reaction", "One pass is enough", "It looks fancy", "The rules require it"], answer: 0 },
          { type: "sequence", prompt: "Order the long step pass:", steps: ["Grip their knee and post your other hand on their hip", "Long-step your near leg back and away as you drop your hip", "Windshield-wiper your legs to clear theirs", "Settle into side control"] },
        ],
      },
    ],
  },
  {
    id: "b6",
    title: "Attack Chains",
    subtitle: "Triangle, armbar, omoplata, kimura trap, arm drag",
    videoQueries: [
      "triangle armbar omoplata chain bjj",
      "kimura trap system basics",
      "arm drag to back take seated guard bjj",
      "bjj submission chains from closed guard",
    ],
    videos: [
      {"id":"OGq21nmoG1g","title":"Chaining Together Triangle and Omoplata  by Mikey Musumeci","channel":"BJJ Fanatics","duration":127},
      {"id":"eIGogiDi0XI","title":"Kimura Trap - An In Depth Study","channel":"JeanJacquesMachado","duration":293},
      {"id":"p8Ly9dhK0D4","title":"ARM DRAG TO BACK TAKE - GORDON RYAN","channel":"BJJ Fanatics","duration":60},
      {"id":"Mt10mEk4pms","title":"BJJ Flow Drill: Armbar Triangle Omoplata From Closed Guard","channel":"MMA Leech","duration":242}
    ],
    keyIdeas: [
      "A defended attack is a setup. The defense to one submission is the entry to the next.",
      "The kimura grip is a control before it's a submission.",
      "The arm drag works because they reached. Make them reach.",
    ],
    lessons: [
      {
        id: "b6a",
        title: "Triangle, armbar, omoplata",
        questions: [
          { type: "mc", prompt: "They pull their arm out of your triangle. You:", choices: ["Switch to an armbar on the freed arm", "Give up", "Reset closed guard", "Stand up"], answer: 0 },
          { type: "mc", prompt: "They posture straight up against your armbar. You:", choices: ["Swing to an omoplata or sweep", "Pull harder", "Let go", "Tap"], answer: 0 },
          { type: "mc", prompt: "Triangle, armbar and omoplata chain together because they share:", choices: ["The same shoulder-line control and hip angle, so each defense feeds the next", "Nothing", "Only the grips", "Only the finish"], answer: 0 },
          { type: "sequence", prompt: "Order the armbar-to-triangle switch:", steps: ["Attack the armbar from guard", "They pull their elbow back and start to stack", "Shoot your leg over the shoulder of the freed arm", "Lock the triangle and cut the angle"] },
        ],
      },
      {
        id: "b6b",
        title: "Kimura trap",
        questions: [
          { type: "mc", prompt: "The kimura grip is:", choices: ["A figure-four on their wrist and your own wrist, their arm bent", "A collar grip", "A belt grip", "Two hands on the ankle"], answer: 0 },
          { type: "mc", prompt: "The kimura trap system uses the grip to:", choices: ["Control the back, sweep, or come on top even when the kimura won't finish", "Only submit", "Escape", "Score"], answer: 0 },
          { type: "mc", prompt: "From bottom half guard, the kimura grip often leads to:", choices: ["A sweep or a back take when they defend by posting", "Nothing", "A guard pull", "Standing up"], answer: 0 },
          { type: "mc", prompt: "When finishing the kimura, their elbow:", choices: ["Stays bent and pinned to your chest as you rotate the wrist toward their back", "Straightens", "Goes to the mat", "Doesn't matter"], answer: 0 },
        ],
      },
      {
        id: "b6c",
        title: "Arm drag to back",
        questions: [
          { type: "sequence", prompt: "Order the arm drag from seated guard:", steps: ["Grip their wrist with your same-side hand", "Reach across and grip above their elbow with the other hand", "Pull the arm across your body as you move your hips out", "Come up behind them and take the back"] },
          { type: "mc", prompt: "The arm drag works best when they:", choices: ["Reach or grip at you, so their arm is extended", "Stay far away", "Sit back", "Lie flat"], answer: 0 },
          { type: "mc", prompt: "After the drag, your first target:", choices: ["Chest to their back and a seatbelt grip, then hooks", "The armbar", "Their collar", "Their ankles"], answer: 0 },
          { type: "mc", prompt: "An arm drag is useful from:", choices: ["Standing, seated guard, and butterfly", "Mount only", "Side control only", "Never"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b7",
    title: "Back Takes",
    subtitle: "From turtle, half guard, side control",
    videoQueries: [
      "back take from turtle seatbelt roll bjj",
      "gift wrap back take from mount side control",
      "chair sit back take bjj",
      "clock choke from turtle bjj",
    ],
    videos: [
      {"id":"70uaVeiMe38","title":"Take the Back from Turtle Position by GORDON RYAN","channel":"Bernardo Faria BJJ Fanatics","duration":52},
      {"id":"UIWX13Sx-zw","title":"3 Back Takes From Mount Using The Gift Wrap Control","channel":"MMA Leech","duration":224},
      {"id":"CvhI6U-IN_8","title":"The Best Way to Get Back Mount for White Belts (I still use at Black Belt)","channel":"Chewjitsu","duration":243},
      {"id":"jAGbvarXopw","title":"How to Do the Clock Choke in 5 Easy Steps","channel":"Stephan Kesting","duration":192}
    ],
    keyIdeas: [
      "Seatbelt first, hooks second. The upper body connection is what keeps the back.",
      "When they turn away from you, they're giving you the back. Follow.",
      "One hook plus a seatbelt is already control. Use it to pull them onto you.",
    ],
    lessons: [
      {
        id: "b7a",
        title: "From turtle",
        questions: [
          { type: "mc", prompt: "Attacking turtle, the classic control is:", choices: ["Seatbelt from the side or behind, chest heavy on their back", "Two collar grips from the front", "Both legs", "Their ankles"], answer: 0 },
          { type: "sequence", prompt: "Order the roll to back from turtle:", steps: ["Get the seatbelt with your chest on their back", "Insert your near-side hook", "Roll them over your shoulder toward the hook side", "Insert the second hook and settle"] },
          { type: "mc", prompt: "The clock choke from turtle uses:", choices: ["A collar grip while you walk your legs around toward their head", "A guillotine", "Their belt", "An ankle lock"], answer: 0 },
          { type: "mc", prompt: "The turtle player's main defense:", choices: ["Elbows tight to knees, hips low, never let a hook in", "Reach back", "Flatten out", "Stand up fast"], answer: 0 },
        ],
      },
      {
        id: "b7b",
        title: "From half guard & side control",
        questions: [
          { type: "mc", prompt: "You have the underhook in half guard and they whizzer. A back take option:", choices: ["Limp-arm out or go under the whizzer to their back as they lift it", "Pull guard", "Tap", "Ankle lock"], answer: 0 },
          { type: "mc", prompt: "The gift wrap is:", choices: ["Pinning their arm across their own neck with a grip from behind their head, then stepping over to the back", "A choke", "A leg lock", "A takedown"], answer: 0 },
          { type: "mc", prompt: "From side control, they turn away onto their knees. You:", choices: ["Follow to the back with a seatbelt", "Let them go", "Just push them flat", "Stand up"], answer: 0 },
          { type: "sequence", prompt: "Order the gift wrap back take:", steps: ["Pin their arm across their neck and grab the wrist from behind their head", "Step your leg over their body into technical mount", "Slide behind them", "Bring in your hooks and seatbelt"] },
        ],
      },
      {
        id: "b7c",
        title: "Chair sit & keeping the back",
        questions: [
          { type: "mc", prompt: "The chair sit means:", choices: ["Sitting back with one hook in and using it to pull them onto you", "Sitting on their chest", "Kneeling", "Standing"], answer: 0 },
          { type: "mc", prompt: "You have one hook and they roll toward it. You:", choices: ["Follow and put in the second hook", "Let them go", "Grab the collar", "Stand up"], answer: 0 },
          { type: "mc", prompt: "Body triangle versus hooks:", choices: ["Body triangle is harder to escape and keeps you connected; hooks are faster to set", "No difference", "Hooks are illegal", "Body triangle is illegal"], answer: 0 },
          { type: "mc", prompt: "They're escaping the back toward the side of your under arm. You:", choices: ["Follow with your hips and re-establish the top hook, or go to mount", "Let go", "Reach for an ankle", "Cross your feet"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b8",
    title: "Leg Entanglements",
    subtitle: "Ashi garami, 50/50, heel hook awareness",
    videoQueries: [
      "ashi garami positions explained",
      "50 50 guard basics bjj",
      "heel hook defense awareness bjj",
      "leg lock positions legal ibjjf blue belt",
    ],
    videos: [
      {"id":"H4yzzjIghMc","title":"Opponent Posts Leg Cross Ashi Garami by John Danaher","channel":"BJJ Fanatics","duration":54},
      {"id":"q_MJy_g42LM","title":"Understanding Cross Ashi in Jiu Jitsu by Firas Zahabi","channel":"BJJ Fanatics","duration":140},
      {"id":"nNg9HrxUHqM","title":"50/50 Entry from Open Guard by Fellipe Andrew","channel":"BJJ Fanatics","duration":124},
      {"id":"Z0WDtUMkBP8","title":"If I Could Know Only One Thing About Defending Heel Hooks","channel":"Absolute MMA St Kilda - Melbourne","duration":170}
    ],
    keyIdeas: [
      "Control the hips and knee line first. The submission is the last thing, not the first.",
      "Hide your heel. If they can't reach the heel, they can't heel hook.",
      "Know which entanglements are legal for you before you enter them in competition.",
    ],
    lessons: [
      {
        id: "b8a",
        title: "Ashi garami positions",
        questions: [
          { type: "mc", prompt: "Ashi garami means:", choices: ["Leg entanglement", "Ankle lock", "Heel hook", "Standing throw"], answer: 0 },
          { type: "mc", prompt: "Single leg X, outside ashi, the saddle, and 50/50 are all:", choices: ["Leg entanglement positions that control one leg", "Sweeps", "Chokes", "Guard passes"], answer: 0 },
          { type: "mc", prompt: "In IBJJF gi competition, which entanglements are risky or illegal for blue belts?", choices: ["Anything that reaps the knee, where your leg crosses their knee line inward", "Single leg X with your outside foot on their hip", "The straight ankle lock", "None"], answer: 0 },
          { type: "mc", prompt: "\"Control before submission\" in leg locks means:", choices: ["Pin their hips and knee line with your legs before hunting the finish", "Grab the foot fast", "Spin", "Stand up"], answer: 0 },
        ],
      },
      {
        id: "b8b",
        title: "50/50",
        questions: [
          { type: "mc", prompt: "50/50 is:", choices: ["Both players' legs entangled symmetrically, so each can attack the other", "Only one player can attack", "A pin", "A takedown"], answer: 0 },
          { type: "mc", prompt: "In gi 50/50, the main legal attack for blue belts is:", choices: ["The straight ankle lock", "Heel hook", "Kneebar", "Toe hold"], answer: 0 },
          { type: "mc", prompt: "A 50/50 danger:", choices: ["Stalling and getting your own ankle attacked. Keep your heel hidden and stay active.", "Nothing", "A choke", "Losing points"], answer: 0 },
          { type: "mc", prompt: "To come up on top from 50/50:", choices: ["Sit up, control their far leg and drive forward", "Lie back", "Cross your ankles", "Tap"], answer: 0 },
        ],
      },
      {
        id: "b8c",
        title: "Heel hook awareness",
        questions: [
          { type: "mc", prompt: "A heel hook:", choices: ["Rotates the heel to twist the knee. Damage can happen before pain.", "Bends the toes", "Hyperextends the ankle", "Cranks the neck"], answer: 0 },
          { type: "mc", prompt: "Your heel gets exposed in training. You:", choices: ["Turn your knee to relieve the rotation and hide the heel. Tap early if it's on.", "Kick free with force", "Ignore it", "Roll away fast"], answer: 0 },
          { type: "mc", prompt: "Why does keeping your knee pointing the same way as your foot help?", choices: ["Rotation is what injures; aligning the two removes it", "It's faster", "It scores", "No reason"], answer: 0 },
          { type: "mc", prompt: "When can you heel hook in IBJJF competition?", choices: ["Only at brown and black belt, and only in no-gi", "At blue belt", "Always", "Only at white belt"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b9",
    title: "Standing & Strategy",
    subtitle: "Ties, throws, points, late defense",
    videoQueries: [
      "collar tie snapdown front headlock bjj",
      "ankle pick for bjj tutorial",
      "osoto gari ouchi gari for bjj",
      "ibjjf points system explained advantages",
    ],
    videos: [
      {"id":"LHIMtIYrNXo","title":"COLLAR TIE: what (not) to do 🥋❗","channel":"Jordan Teaches Jiujitsu","duration":59},
      {"id":"KzEoF49h-Ic","title":"Ankle Pick Takedown for No Gi BJJ","channel":"Chewjitsu","duration":195},
      {"id":"ommBYBxcCuE","title":"Osoto Gari's Most Important Detail","channel":"Shintaro Higashi","duration":263},
      {"id":"hjwFc7FwHS4","title":"Dominate Grips & Get the Takedown in BJJ with Ankle Pick","channel":"Chewjitsu","duration":254}
    ],
    keyIdeas: [
      "A snapdown turns their posture into your front headlock. Pull the head, step back.",
      "Points tell a story: pass 3, sweep 2, mount 4, back 4. Know the story you're telling.",
      "Late defense is about posture and time. Stack, posture, walk, then escape.",
    ],
    lessons: [
      {
        id: "b9a",
        title: "Ties, snapdowns, ankle picks",
        questions: [
          { type: "mc", prompt: "The collar tie is:", choices: ["Your hand cupped behind their neck, elbow down, controlling posture", "A lapel grip only", "A wrist grip", "Grabbing the belt"], answer: 0 },
          { type: "mc", prompt: "A snapdown:", choices: ["Pulls their head down sharply to break posture, often into a front headlock", "A hip throw", "A leg trip", "A guard pull"], answer: 0 },
          { type: "mc", prompt: "An ankle pick:", choices: ["Grabs their ankle as you pull their head or collar the other way", "A leg lock", "A sweep from guard", "A kick"], answer: 0 },
          { type: "sequence", prompt: "Order the snapdown to front headlock:", steps: ["Get a collar tie and an inside grip on their arm", "Snap their head down as you step back", "Wrap the front headlock", "Circle or go behind"] },
        ],
      },
      {
        id: "b9b",
        title: "Two throws",
        questions: [
          { type: "sequence", prompt: "Order osoto gari:", steps: ["Grip collar and sleeve and pull them onto their heel", "Step your lead foot beside their outside foot", "Swing your other leg past and reap the back of their leg", "Drive your chest through and follow them down"] },
          { type: "mc", prompt: "Ouchi gari reaps:", choices: ["The inside of their near leg, from between their legs", "Behind both legs", "Their arm", "Their far hip"], answer: 0 },
          { type: "mc", prompt: "Seoi nage is:", choices: ["A shoulder throw", "A foot sweep", "An ankle pick", "A sacrifice throw"], answer: 0 },
          { type: "mc", prompt: "Judo throws for jiu-jitsu should be practiced:", choices: ["With breakfalls and a partner who knows how to fall", "Only at full speed", "Only in competition", "Never"], answer: 0 },
        ],
      },
      {
        id: "b9c",
        title: "Points & late defense",
        questions: [
          { type: "mc", prompt: "IBJJF points for a guard pass, a sweep, and mount:", choices: ["3, 2, 4", "2, 2, 2", "4, 3, 2", "1, 1, 1"], answer: 0 },
          { type: "mc", prompt: "An \"advantage\" is:", choices: ["A near-score used to break ties, like an almost-completed sweep", "A penalty", "Two points", "A warning"], answer: 0 },
          { type: "mc", prompt: "Late armbar defense:", choices: ["Stack or hitchhiker escape, keeping your elbow bent and hands gripped until you can", "Extend your arm", "Roll onto your stomach", "Grab their belt"], answer: 0 },
          { type: "mc", prompt: "Late triangle defense:", choices: ["Posture up, bring your trapped-side hand to your own ear to relieve pressure, then stack and walk around", "Pull straight back", "Push their hips", "Lie down"], answer: 0 },
        ],
      },
    ],
  },
];
