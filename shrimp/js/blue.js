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
      {"id":"Q_nW-1DchUw","title":"A Crash Course for the de la Riva Guard","channel":"Stephan Kesting","duration":360},
      {"id":"1iMxrcBiYwc","title":"2 Effective Spider Guard Sweeps for White Belts Wanting To Use Open Guard","channel":"Chewjitsu","duration":531},
      {"id":"_PFs6v7TJiw","title":"How To Smash The Lasso Guard by Andrew Wiltse","channel":"Bernardo Faria BJJ Fanatics","duration":662},
      {"id":"iPEd3Dkq66A","title":"How To Do The Perfect Collar Sleeve Guard From The Inside Control by Mikey Musumeci","channel":"Bernardo Faria BJJ Fanatics","duration":386}
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
          { type: "mc", prompt: "What does the De la Riva hook mainly do?", choices: ["Off-balances them by pulling their knee out and forward", "Chokes them from a strange angle", "Locks their ankle in place", "It doesn't do much at all"], answer: 0 },
          { type: "mc", prompt: "The biggest danger in De la Riva:", choices: ["Getting your hooking leg smashed and knee-cut passed. Keep the hook tight and your other foot on their hip or knee.", "Getting choked from that far away", "There's no real danger here", "Being picked up and slammed"], answer: 0 },
          { type: "sequence", prompt: "Order the basic De la Riva sweep:", steps: ["Hook the outside of their lead leg and grab that ankle", "Put your other foot on their far knee or hip", "Pull the ankle as you push the knee", "Come up on top as they fall"] },
        ],
      },
      {
        id: "b1b",
        title: "Spider & lasso",
        questions: [
          { type: "mc", prompt: "Spider guard is:", choices: ["Feet on their biceps, gripping both sleeves", "Feet on their hips", "Feet hooked around their legs", "Lying flat with no grips"], answer: 0 },
          { type: "mc", prompt: "Lasso guard wraps your leg:", choices: ["Around their arm, your foot ending inside behind their arm", "Around their neck", "Around their leg", "Behind your own back"], answer: 0 },
          { type: "mc", prompt: "Spider guard is strong for:", choices: ["Controlling posture and setting up triangles, omoplatas and sweeps", "Standing all the way up", "Attacking leg locks directly", "Nothing in particular really"], answer: 0 },
          { type: "mc", prompt: "The main weakness of spider and lasso if you lose the sleeve grips:", choices: ["The guard collapses and they pass easily", "There's no real weakness to it", "It just becomes closed guard instead", "They fall over on their own"], answer: 0 },
        ],
      },
      {
        id: "b1c",
        title: "Collar-sleeve",
        questions: [
          { type: "mc", prompt: "Collar-sleeve guard controls:", choices: ["One collar and the opposite sleeve, with a foot on the bicep or hip", "Both sleeves", "The belt and pants", "Both collars"], answer: 0 },
          { type: "mc", prompt: "A common attack from collar-sleeve:", choices: ["Triangle or omoplata when they post the gripped arm", "A rear naked choke from here", "A heel hook entry", "A kneebar setup"], answer: 0 },
          { type: "mc", prompt: "Why is collar-sleeve so popular at blue belt?", choices: ["It's easy to get from closed guard and links to many attacks", "It stops working past blue belt", "It scores extra points on its own", "It needs no grips to hold at all"], answer: 0 },
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
      {"id":"-wftJg6jm3E","title":"Butterfly Guard Guide In Gi & Nogi | BJJ Fundamentals","channel":"Jordan Teaches Jiujitsu","duration":413},
      {"id":"6GMAwcmWcpE","title":"The BEST Guard In BJJ... X Guard","channel":"Jordan Teaches Jiujitsu","duration":519},
      {"id":"usWlT7CW4HU","title":"Bjj X Guard Entry from Half Guard","channel":"Chewjitsu","duration":247},
      {"id":"b6krH-4sOIQ","title":"The Ranges of Guard - How to Controlling the Distance Keeps You Safe on the Bottom","channel":"Stephan Kesting","duration":459}
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
          { type: "mc", prompt: "The butterfly sweep needs:", choices: ["An underhook (or overhook) and a lift with the hook as you fall to your shoulder", "Both hands on their collar", "You standing up first", "A grip on their belt"], answer: 0 },
          { type: "sequence", prompt: "Order the butterfly sweep:", steps: ["Get an underhook and control their other arm", "Pull them in close, chest to chest", "Fall to the side away from your underhook while lifting with that side's hook", "Follow through into mount or side control"] },
          { type: "mc", prompt: "Butterfly guard is hardest to pass when you:", choices: ["Sit up and stay chest to chest", "Lie flat on your back", "Cross your feet together", "Let go of all your grips"], answer: 0 },
        ],
      },
      {
        id: "b2b",
        title: "X-guard",
        questions: [
          { type: "mc", prompt: "X-guard is:", choices: ["You're under them, your legs making an X on one leg while you control the other", "Legs crossed behind their back", "A standing position", "Feet on their biceps"], answer: 0 },
          { type: "mc", prompt: "X-guard is usually entered from:", choices: ["Butterfly or single leg X when they stand", "Straight from mount", "Straight from side control", "Straight from turtle"], answer: 0 },
          { type: "mc", prompt: "The basic X-guard sweep works by:", choices: ["Extending your legs to stretch their base while controlling the far leg", "Choking them from below", "Pulling on their collar", "Rolling backward suddenly"], answer: 0 },
          { type: "mc", prompt: "Single leg X differs from X-guard because:", choices: ["You control one leg with both of yours, outside foot on their hip", "You control both legs", "You're standing", "There's no difference"], answer: 0 },
        ],
      },
      {
        id: "b2c",
        title: "Seated guard concepts",
        questions: [
          { type: "mc", prompt: "In seated open guard, keep your:", choices: ["Hands and feet as barriers between you and them", "Hands on the mat behind you", "Legs flat on the mat", "Head down and tucked"], answer: 0 },
          { type: "mc", prompt: "Grip fighting from seated guard aims to:", choices: ["Control their sleeve, collar or ankle before they control your legs", "Give both of you a rest", "Rack up more score", "Get you back to standing"], answer: 0 },
          { type: "mc", prompt: "Why follow them with your hips as they circle?", choices: ["A passer circles for an angle; keeping your feet pointed at them shuts it down", "It's just a house rule", "To tire them out faster", "It looks good on video"], answer: 0 },
          { type: "mc", prompt: "When the opponent stands up to pass, a good option is:", choices: ["Enter X-guard or single leg X, or stand up yourself", "Lie flat and wait it out", "Cross your ankles tightly", "Turn your back away"], answer: 0 },
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
      {"id":"ATUzcKQk820","title":"How to Weaponize the Knee Shield | Jiu-Jitsu Subs & Sweeps","channel":"Knight Jiu-Jitsu","duration":569},
      {"id":"pW2YL_n8Q_U","title":"The main sweep to know from half guard (Lachlan Giles)","channel":"Absolute MMA St Kilda - Melbourne","duration":370},
      {"id":"XuoVaTP09l4","title":"The Big 2 Half Guard Sweeps - Eddie Bravo Old School and Plan B","channel":"Invisible Jiu Jitsu","duration":400},
      {"id":"ojvH99btFYo","title":"3 Very Efficient Sweeps From Deep Half Guard by Leonardo Nogueira","channel":"Bernardo Faria BJJ Fanatics","duration":576}
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
          { type: "mc", prompt: "The underhook from bottom half guard lets you:", choices: ["Come up to your knees (the dogfight) or take the back", "Lie flatter than before", "Set up a choke on them", "It doesn't really help"], answer: 0 },
          { type: "mc", prompt: "They get the underhook and cross-face on you in half guard. That means:", choices: ["You're being flattened. Fight to recover the underhook, or frame and shrimp.", "You're winning the exchange", "Attack a heel hook now", "Just give up the position"], answer: 0 },
          { type: "sequence", prompt: "Order the underhook half guard to dogfight:", steps: ["Turn onto your side with the knee shield in", "Win the underhook and get your head under their chin", "Come up to your knees keeping the underhook", "Take the back or drive them over to sweep"] },
        ],
      },
      {
        id: "b3b",
        title: "Old school & plan B",
        questions: [
          { type: "sequence", prompt: "Order the old school sweep:", steps: ["Win the underhook from half guard", "Come up onto your elbow and knees", "Reach across and grab their far ankle", "Drive forward with your shoulder and pull the ankle"] },
          { type: "mc", prompt: "\"Plan B\" is:", choices: ["When they block old school by sprawling, you roll under and dump them backward the other way", "Pulling closed guard instead", "Standing all the way up", "Tapping to end the roll"], answer: 0 },
          { type: "mc", prompt: "The whizzer (overhook) from the top player is the main counter to:", choices: ["Your underhook", "Your knee shield", "Your collar grip", "Your foot lock"], answer: 0 },
          { type: "mc", prompt: "Deep half guard puts you:", choices: ["Under their hips, holding one of their legs with your whole body", "Far away from them", "On top of their back", "Standing over them"], answer: 0 },
        ],
      },
      {
        id: "b3c",
        title: "Deep half intro",
        questions: [
          { type: "mc", prompt: "Deep half is usually entered when:", choices: ["They stand or step up to pass and you dive under their hips", "They're flat on you", "You're in mount", "They're in turtle"], answer: 0 },
          { type: "mc", prompt: "The classic deep half sweep (the waiter sweep):", choices: ["Elevates their leg with your legs and rolls them over your body", "Chokes them from below", "Kneebars their trapped leg", "Just stands you up"], answer: 0 },
          { type: "mc", prompt: "The danger in deep half:", choices: ["Getting your back taken or your neck attacked if you sit up wrong", "There's really no danger there", "Losing points on the scoreboard", "Your legs cramping up"], answer: 0 },
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
      {"id":"6zJpGBhEvwM","title":"How To NOT Get Your Guard Passed | Gi & Nogi BJJ","channel":"Jordan Teaches Jiujitsu","duration":520},
      {"id":"iTrQzYeCvHM","title":"The Top 5 Jiu Jitsu Guard Retention Mistakes by Lachlan Giles And Ariel Tabak","channel":"Bernardo Faria BJJ Fanatics","duration":436},
      {"id":"exkwjkM0P7U","title":"The Shoulder Roll (aka Granby Roll) Tutorial - 5 Easy Steps! (White Belt Grappling Basics)","channel":"Grappling SMARTY","duration":321},
      {"id":"2x2ySnQlRRQ","title":"Guard retention 101 - The Heisenberg Heist","channel":"Keenan Cornelius","duration":459}
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
          { type: "mc", prompt: "Frames are:", choices: ["Structural barriers (forearm, shin, foot) that hold distance without muscle", "Punches thrown at them", "Grips and nothing else", "Legs locked around them"], answer: 0 },
          { type: "mc", prompt: "Distance management on the bottom means:", choices: ["Feet and hands on them when they're far, knees and elbows when they're close", "Always staying far away", "Always staying close", "Reacting to whatever happens"], answer: 0 },
          { type: "mc", prompt: "They grab your ankles for a toreando. You:", choices: ["Circle your feet to break the grips and re-frame on their hips or biceps", "Give up guard entirely", "Cross your feet tightly", "Lie completely still"], answer: 0 },
          { type: "mc", prompt: "A good retention habit:", choices: ["Keep your knees pointed at them and your hips mobile", "Lie flat on your back", "Extend your arms fully", "Look away from them"], answer: 0 },
        ],
      },
      {
        id: "b4b",
        title: "Hip movement & leg pummeling",
        questions: [
          { type: "mc", prompt: "Leg pummeling means:", choices: ["Re-inserting your knee or shin between you and the passer as they clear it", "Kicking them away", "Locking your ankles together", "Standing straight up"], answer: 0 },
          { type: "mc", prompt: "The hip heist or shrimp during retention serves to:", choices: ["Re-square your hips to face them after they get an angle", "Launch a fresh attack on them", "Give your hips a rest", "Rack up an easy score"], answer: 0 },
          { type: "mc", prompt: "They're halfway through a knee slice. A common retention:", choices: ["Underhook their passing leg and pummel your shin back in, or frame and shrimp away", "Just turn away from them", "Tap out right there", "Accept the side control"], answer: 0 },
          { type: "sequence", prompt: "Order retention against the toreando:", steps: ["They grab your legs and step around", "Turn your hips to face them and frame on the near hip", "Swing your legs through to re-insert a knee", "Establish a new guard"] },
        ],
      },
      {
        id: "b4c",
        title: "Inversion & granby",
        questions: [
          { type: "mc", prompt: "Inverting (going upside down onto your shoulders) is used to:", choices: ["Bring your legs back between you and the passer after they clear your hips", "Attack their far arm", "Stand straight back up", "Escape from mount"], answer: 0 },
          { type: "mc", prompt: "A granby roll is:", choices: ["A shoulder roll across your upper back to spin back to face them", "A type of leg lock", "A type of takedown", "A type of choke"], answer: 0 },
          { type: "mc", prompt: "Inversion is safer when you:", choices: ["Tuck your chin and roll across your shoulders, not your neck", "Roll over your head", "Keep your legs straight", "Hold your breath"], answer: 0 },
          { type: "mc", prompt: "Inverting exposes:", choices: ["Your back, and your legs to leg locks if you're slow", "Nothing, it's completely safe", "Only your arms, nothing else", "Just your collar, oddly enough"], answer: 0 },
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
      {"id":"TiUQYmokr0g","title":"Overview of How to KILL The Over Under Pass by Bernardo Faria","channel":"Bernardo Faria BJJ Fanatics","duration":359},
      {"id":"BcnjgHwB6hk","title":"Crush Half Guard with this Slow Smash-Style Guard Pass (Finishes in Mount)","channel":"Chewjitsu","duration":309},
      {"id":"n596l_pJi-E","title":"How To Do the Leg Drag Pass, Theory and Practice","channel":"Stephan Kesting","duration":235},
      {"id":"cs84OhtG3Mw","title":"The early 2000's revolutionized jiu-jitsu with The Longstep Pass. Lets find out how it works.","channel":"Keenan Cornelius","duration":515}
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
          { type: "mc", prompt: "Pressure passing relies on:", choices: ["Chest and hip weight pinning their legs and hips so they can't move", "Speed and nothing else", "Grips and nothing else", "Waiting for their mistakes"], answer: 0 },
          { type: "mc", prompt: "In the smash pass, you:", choices: ["Pin their legs across their body with your shoulder and chest and walk around", "Stand up and pull", "Sit on their chest", "Go under their legs"], answer: 0 },
          { type: "sequence", prompt: "Order the over-under pass:", steps: ["Over one leg, under the other, head tight to their hip", "Drive forward with your chest to flatten them", "Walk your hips toward their head, freeing your knee", "Slide into side control"] },
        ],
      },
      {
        id: "b5b",
        title: "Leg drag",
        questions: [
          { type: "mc", prompt: "The leg drag:", choices: ["Pulls one of their legs across your body so their hips face away, then pins it with your hip", "Lifts both of their legs", "Grabs their ankles and circles", "Stacks them on their neck"], answer: 0 },
          { type: "mc", prompt: "After a leg drag, their hips are:", choices: ["Turned away from you. Great for side control or the back.", "Still facing you directly", "Up in the air somehow", "Trapped underneath you"], answer: 0 },
          { type: "mc", prompt: "To counter the leg drag, the bottom player:", choices: ["Frames and turns their hips back to face you", "Lies completely flat", "Crosses their feet together", "Taps out immediately"], answer: 0 },
          { type: "mc", prompt: "The leg drag pairs well with:", choices: ["The toreando. Drag when they resist the toreando.", "Attacking from closed guard", "A rear naked choke", "A straight ankle lock"], answer: 0 },
        ],
      },
      {
        id: "b5c",
        title: "Long step & back step",
        questions: [
          { type: "mc", prompt: "The long step pass:", choices: ["Steps your leg far back and around to clear their guard when they frame", "A short hop to the side", "A jump straight over them", "A version of the knee slice"], answer: 0 },
          { type: "mc", prompt: "The back step:", choices: ["Turns your hips away and steps back over their leg to reverse direction, often to pass half guard or enter leg locks", "A guard pull from standing", "Going straight under them", "A bridging motion"], answer: 0 },
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
      {"id":"Mt10mEk4pms","title":"BJJ Flow Drill: Armbar Triangle Omoplata From Closed Guard","channel":"MMA Leech","duration":242},
      {"id":"xyCakxmx-2E","title":"The Kimura Trap | One Of The MOST Effective Systems in BJJ","channel":"Jordan Teaches Jiujitsu","duration":628},
      {"id":"e_c7G5T_ZR8","title":"BJJ Techniques: Arm Drag to Back Take by Gordon Ryan","channel":"BJJ Fanatics","duration":318},
      {"id":"mVkKOPNGvjA","title":"Kimura From Closed Guard For White Belts (Small Details To Improve Success)","channel":"Chewjitsu","duration":302}
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
          { type: "mc", prompt: "They pull their arm out of your triangle. You:", choices: ["Switch to an armbar on the freed arm", "Give up the position", "Reset to closed guard", "Stand straight up"], answer: 0 },
          { type: "mc", prompt: "They posture straight up against your armbar. You:", choices: ["Swing to an omoplata or sweep", "Pull on the arm harder", "Let go of the arm", "Tap out yourself"], answer: 0 },
          { type: "mc", prompt: "Triangle, armbar and omoplata chain together because they share:", choices: ["The same shoulder-line control and hip angle, so each defense feeds the next", "Nothing, they're unrelated moves", "Only the grips, nothing else", "Only the finishing motion"], answer: 0 },
          { type: "sequence", prompt: "Order the armbar-to-triangle switch:", steps: ["Attack the armbar from guard", "They pull their elbow back and start to stack", "Shoot your leg over the shoulder of the freed arm", "Lock the triangle and cut the angle"] },
        ],
      },
      {
        id: "b6b",
        title: "Kimura trap",
        questions: [
          { type: "mc", prompt: "The kimura grip is:", choices: ["A figure-four on their wrist and your own wrist, their arm bent", "A grip on their collar", "A grip on their belt", "Two hands on the ankle"], answer: 0 },
          { type: "mc", prompt: "The kimura trap system uses the grip to:", choices: ["Control the back, sweep, or come on top even when the kimura won't finish", "Only ever submit them", "Only ever escape with it", "Only ever score points"], answer: 0 },
          { type: "mc", prompt: "From bottom half guard, the kimura grip often leads to:", choices: ["A sweep or a back take when they defend by posting", "Nothing much at all", "A guard pull instead", "You standing back up"], answer: 0 },
          { type: "mc", prompt: "When finishing the kimura, their elbow:", choices: ["Stays bent and pinned to your chest as you rotate the wrist toward their back", "Straightens out fully", "Goes flat to the mat", "It doesn't matter at all"], answer: 0 },
        ],
      },
      {
        id: "b6c",
        title: "Arm drag to back",
        questions: [
          { type: "sequence", prompt: "Order the arm drag from seated guard:", steps: ["Grip their wrist with your same-side hand", "Reach across and grip above their elbow with the other hand", "Pull the arm across your body as you move your hips out", "Come up behind them and take the back"] },
          { type: "mc", prompt: "The arm drag works best when they:", choices: ["Reach or grip at you, so their arm is extended", "Stay far away always", "Sit back and wait", "Lie flat on their back"], answer: 0 },
          { type: "mc", prompt: "After the drag, your first target:", choices: ["Chest to their back and a seatbelt grip, then hooks", "An immediate armbar attempt", "Their collar from the front", "Both of their ankles"], answer: 0 },
          { type: "mc", prompt: "An arm drag is useful from:", choices: ["Standing, seated guard, and butterfly", "Mount only, nowhere else", "Side control only, nowhere else", "It's never actually useful"], answer: 0 },
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
      {"id":"REuy4taamec","title":"Rolling Back Attack Ultimate Guide  | BJJ Instructional","channel":"Jordan Teaches Jiujitsu","duration":486},
      {"id":"CvhI6U-IN_8","title":"The Best Way to Get Back Mount for White Belts (I still use at Black Belt)","channel":"Chewjitsu","duration":243},
      {"id":"i4TXQkbjlcQ","title":"How to Take the Back in BJJ 1: The Chair Sit","channel":"Stephan Kesting","duration":477},
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
          { type: "mc", prompt: "Attacking turtle, the classic control is:", choices: ["Seatbelt from the side or behind, chest heavy on their back", "Two collar grips from the front", "Grabbing both of their legs", "Grabbing their ankles"], answer: 0 },
          { type: "sequence", prompt: "Order the roll to back from turtle:", steps: ["Get the seatbelt with your chest on their back", "Insert your near-side hook", "Roll them over your shoulder toward the hook side", "Insert the second hook and settle"] },
          { type: "mc", prompt: "The clock choke from turtle uses:", choices: ["A collar grip while you walk your legs around toward their head", "A guillotine choke instead", "Their own belt", "A straight ankle lock"], answer: 0 },
          { type: "mc", prompt: "The turtle player's main defense:", choices: ["Elbows tight to knees, hips low, never let a hook in", "Reach back and grab", "Flatten out completely", "Stand up as fast as possible"], answer: 0 },
        ],
      },
      {
        id: "b7b",
        title: "From half guard & side control",
        questions: [
          { type: "mc", prompt: "You have the underhook in half guard and they whizzer. A back take option:", choices: ["Limp-arm out or go under the whizzer to their back as they lift it", "Pull guard instead", "Tap and reset", "Go for an ankle lock"], answer: 0 },
          { type: "mc", prompt: "The gift wrap is:", choices: ["Pinning their arm across their own neck with a grip from behind their head, then stepping over to the back", "A type of choke", "A type of leg lock", "A type of takedown"], answer: 0 },
          { type: "mc", prompt: "From side control, they turn away onto their knees. You:", choices: ["Follow to the back with a seatbelt", "Let them go entirely", "Just push them flat again", "Stand straight up"], answer: 0 },
          { type: "sequence", prompt: "Order the gift wrap back take:", steps: ["Pin their arm across their neck and grab the wrist from behind their head", "Step your leg over their body into technical mount", "Slide behind them", "Bring in your hooks and seatbelt"] },
        ],
      },
      {
        id: "b7c",
        title: "Chair sit & keeping the back",
        questions: [
          { type: "mc", prompt: "The chair sit means:", choices: ["Sitting back with one hook in and using it to pull them onto you", "Sitting on their chest", "Kneeling behind them", "Standing over them"], answer: 0 },
          { type: "mc", prompt: "You have one hook and they roll toward it. You:", choices: ["Follow and put in the second hook", "Let them go entirely", "Grab for the collar", "Stand straight up"], answer: 0 },
          { type: "mc", prompt: "Body triangle versus hooks:", choices: ["Body triangle is harder to escape and keeps you connected; hooks are faster to set", "There's no real difference between them", "Hooks only work in the gi", "Body triangles only work standing"], answer: 0 },
          { type: "mc", prompt: "They're escaping the back toward the side of your under arm. You:", choices: ["Follow with your hips and re-establish the top hook, or go to mount", "Let go completely", "Reach for their ankle", "Cross your feet together"], answer: 0 },
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
      "ashi garami vs 50 50 vs saddle explained",
    ],
    videos: [
      {"id":"_IxtobCktAQ","title":"How To Perfect Leglocks In Jiu Jitsu No Gi by Gordon Ryan","channel":"Bernardo Faria BJJ Fanatics","duration":827},
      {"id":"PakIjCVPq6A","title":"BJJ World Champion Leandro Lo: How to Pass 50/50 guard","channel":"Stephan Kesting","duration":196},
      {"id":"k1Ic4eB4G0A","title":"Heel Hook Defense - Hiding the Heel by Craig Jones","channel":"BJJ Fanatics","duration":434},
      {"id":"fVPgnA0iAII","title":"Finishing From 50/50: CRAIG JONES BJJ Techqniques","channel":"BJJ Fanatics","duration":304}
    ],
    keyIdeas: [
      "Control the hips and knee line first. The submission is the last thing, not the first.",
      "Hide your heel. If they can't reach the heel, they can't heel hook.",
      "Ask your coach which leg attacks your gym allows in training, and start there.",
    ],
    lessons: [
      {
        id: "b8a",
        title: "Ashi garami positions",
        questions: [
          { type: "mc", prompt: "Ashi garami means:", choices: ["Leg entanglement", "Ankle lock", "Heel hook", "Standing throw"], answer: 0 },
          { type: "mc", prompt: "Single leg X, outside ashi, the saddle, and 50/50 are all:", choices: ["Leg entanglement positions that control one leg", "Types of sweeps", "Types of chokes", "Types of guard passes"], answer: 0 },
          { type: "mc", prompt: "\"Knee reaping\" refers to:", choices: ["Your leg crossing over their knee line, twisting the joint inward", "A type of sweep", "Grabbing inside the pant leg", "A guard pass"], answer: 0 },
          { type: "mc", prompt: "\"Control before submission\" in leg locks means:", choices: ["Pin their hips and knee line with your legs before hunting the finish", "Grab the foot fast", "Spin as fast as you can", "Stand straight back up"], answer: 0 },
        ],
      },
      {
        id: "b8b",
        title: "50/50",
        questions: [
          { type: "mc", prompt: "50/50 is:", choices: ["Both players' legs entangled symmetrically, so each can attack the other", "Only one player can attack", "A type of pin", "A type of takedown"], answer: 0 },
          { type: "mc", prompt: "In 50/50, the straight ankle lock is the go-to attack because:", choices: ["Both players can reach it from the same entanglement", "It's the only submission that exists", "It needs no grips", "It only works standing"], answer: 0 },
          { type: "mc", prompt: "A 50/50 danger:", choices: ["Stalling and getting your own ankle attacked. Keep your heel hidden and stay active.", "There's no real danger", "Getting choked out", "Losing points on the board"], answer: 0 },
          { type: "mc", prompt: "To come up on top from 50/50:", choices: ["Sit up, control their far leg and drive forward", "Lie all the way back", "Cross your ankles tightly", "Tap out and reset"], answer: 0 },
        ],
      },
      {
        id: "b8c",
        title: "Heel hook awareness",
        questions: [
          { type: "mc", prompt: "A heel hook:", choices: ["Rotates the heel to twist the knee. Damage can happen before pain.", "Bends the toes", "Hyperextends the ankle", "Cranks the neck"], answer: 0 },
          { type: "mc", prompt: "Your heel gets exposed in training. You:", choices: ["Turn your knee to relieve the rotation and hide the heel. Tap early if it's on.", "Kick free with force", "Just ignore it completely", "Roll away as fast as possible"], answer: 0 },
          { type: "mc", prompt: "Why does keeping your knee pointing the same way as your foot help?", choices: ["Rotation is what injures; aligning the two removes it", "It's just faster to move", "It scores extra points", "There's no real reason"], answer: 0 },
          { type: "mc", prompt: "Because heel hooks can injure a joint before you feel pain, most gyms:", choices: ["Restrict them to controlled drilling or higher belts, so ask your coach", "Ban every foot lock forever", "Allow them from day one at full speed", "Only teach them in seminars"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "b9",
    title: "Standing & Strategy",
    subtitle: "Ties, throws, and late defense",
    videoQueries: [
      "collar tie snapdown front headlock bjj",
      "ankle pick for bjj tutorial",
      "osoto gari ouchi gari for bjj",
      "bjj framing and creating space concepts",
    ],
    videos: [
      {"id":"8hzRbpUfawY","title":"Incredible Front Headlock Attacks by Gordon Ryan","channel":"Bernardo Faria BJJ Fanatics","duration":277},
      {"id":"KzEoF49h-Ic","title":"Ankle Pick Takedown for No Gi BJJ","channel":"Chewjitsu","duration":195},
      {"id":"2wGLgF-1Ffg","title":"Ouchi Gari For BJJ & Grip Control by Olympic Judo Champion Satoshi Ishii","channel":"Bernardo Faria BJJ Fanatics","duration":264},
      {"id":"6Q0iCb2Oac8","title":"How To NOT Get Smashed On Bottom - Concepts For BJJ White Belts","channel":"Jordan Teaches Jiujitsu","duration":333}
    ],
    keyIdeas: [
      "A snapdown turns their posture into your front headlock. Pull the head, step back.",
      "Rank position value in your head: control beats scrambling, and finishes come from control.",
      "Late defense is about posture and time. Stack, posture, walk, then escape.",
    ],
    lessons: [
      {
        id: "b9a",
        title: "Ties, snapdowns, ankle picks",
        questions: [
          { type: "mc", prompt: "The collar tie is:", choices: ["Your hand cupped behind their neck, elbow down, controlling posture", "A lapel grip only", "A wrist grip", "Grabbing the belt"], answer: 0 },
          { type: "mc", prompt: "A snapdown:", choices: ["Pulls their head down sharply to break posture, often into a front headlock", "A throw off the hip", "A trip on their leg", "A pull into guard"], answer: 0 },
          { type: "mc", prompt: "An ankle pick:", choices: ["Grabs their ankle as you pull their head or collar the other way", "A submission leg lock", "A sweep from guard", "A kick to the leg"], answer: 0 },
          { type: "sequence", prompt: "Order the snapdown to front headlock:", steps: ["Get a collar tie and an inside grip on their arm", "Snap their head down as you step back", "Wrap the front headlock", "Circle or go behind"] },
        ],
      },
      {
        id: "b9b",
        title: "Two throws",
        questions: [
          { type: "sequence", prompt: "Order osoto gari:", steps: ["Grip collar and sleeve and pull them onto their heel", "Step your lead foot beside their outside foot", "Swing your other leg past and reap the back of their leg", "Drive your chest through and follow them down"] },
          { type: "mc", prompt: "Ouchi gari reaps:", choices: ["The inside of their near leg, from between their legs", "Behind both of their legs", "Their arm, with a twist", "Their far hip, directly"], answer: 0 },
          { type: "mc", prompt: "Seoi nage is:", choices: ["A shoulder throw", "A foot sweep", "An ankle pick", "A sacrifice throw"], answer: 0 },
          { type: "mc", prompt: "Judo throws for jiu-jitsu should be practiced:", choices: ["With breakfalls and a partner who knows how to fall", "Only ever at full speed", "Only when it counts most", "Never, they're too risky"], answer: 0 },
        ],
      },
      {
        id: "b9c",
        title: "Late defense",
        questions: [
          { type: "mc", prompt: "The best time to escape a bad position is:", choices: ["Early, before they lock in control, since waiting only makes it harder", "After they submit you", "Never, always wait it out", "Only when you're tired"], answer: 0 },
          { type: "mc", prompt: "\"Framing\" means:", choices: ["Using your bones, like forearms and shins, to create space against their weight", "Grabbing the gi frame", "Standing near the mat edge", "A type of choke"], answer: 0 },
          { type: "mc", prompt: "Late armbar defense:", choices: ["Stack or hitchhiker escape, keeping your elbow bent and hands gripped until you can", "Extend your arm", "Roll onto your stomach", "Grab their belt"], answer: 0 },
          { type: "mc", prompt: "Late triangle defense:", choices: ["Posture up, bring your trapped-side hand to your own ear to relieve pressure, then stack and walk around", "Pull straight back hard", "Push down on their hips", "Just lie down flat"], answer: 0 },
        ],
      },
    ],
  },
];
