// White belt curriculum: survival and fundamentals.
// Each unit: videos (curated via tools/curate-videos.mjs), key ideas, and lessons of 4 questions.
// Question types: mc, sequence (steps in correct order), position (illustrated multiple choice).

const WHITE_UNITS = [
  {
    id: "w1",
    title: "Mat Basics",
    subtitle: "Etiquette, hierarchy, and the rules",
    videoQueries: [
      "bjj etiquette for beginners first class",
      "bjj positional hierarchy explained",
      "what is legal at white belt ibjjf rules",
      "how to tap in bjj beginners",
    ],
    videos: [],
    keyIdeas: [
      "Tap early, tap clearly. A tap is how you stay healthy enough to train tomorrow.",
      "Position before submission: get somewhere stable first, then attack.",
      "Know what's legal at your belt before you try it on a partner.",
    ],
    lessons: [
      {
        id: "w1a",
        title: "Etiquette & safety",
        questions: [
          { type: "mc", prompt: "What does tapping mean in jiu-jitsu?", choices: ["Stop right now, I'm caught", "Keep going, but harder", "Switch to the other side", "Restart the round"], answer: 0 },
          { type: "mc", prompt: "A submission is fully locked and you can't escape. You should:", choices: ["Tap early and clearly, with your hand or your voice", "Wait until it really hurts", "Try to slam your way out", "Hold your breath and squeeze"], answer: 0 },
          { type: "mc", prompt: "Why do academies insist on trimmed nails and clean gear?", choices: ["To prevent cuts and skin infections like ringworm and staph", "It's purely tradition", "So you look good on the mat", "Referees check for it"], answer: 0 },
          { type: "sequence", prompt: "Put the etiquette of a normal training roll in order:", steps: ["Slap hands and bump fists", "Start from the agreed position", "Roll, tapping early when caught", "Thank your partner at the end"] },
        ],
      },
      {
        id: "w1b",
        title: "The positional hierarchy",
        questions: [
          { type: "mc", prompt: "Which position is generally considered the most dominant?", choices: ["Back control", "Mount", "Side control", "Closed guard"], answer: 0 },
          { type: "mc", prompt: "\"Position before submission\" means:", choices: ["Secure a stable, dominant position first, then attack", "Always attack immediately", "Never attempt submissions", "Only positions score points"], answer: 0 },
          { type: "mc", prompt: "You're on the bottom of side control. Your first goal is usually to:", choices: ["Escape or recover guard, not attack", "Attack a submission", "Give up your back", "Stay flat and wait"], answer: 0 },
          { type: "position", position: "mount", prompt: "Coral is on top. Which position is this?", choices: ["Mount", "Side control", "Knee on belly", "North-south"], answer: 0 },
        ],
      },
      {
        id: "w1c",
        title: "White belt rules",
        questions: [
          { type: "mc", prompt: "Under IBJJF rules, which leg lock is legal for adult white belts?", choices: ["Straight ankle lock", "Heel hook", "Toe hold", "Kneebar"], answer: 0 },
          { type: "mc", prompt: "Which of these is illegal at every belt in IBJJF competition?", choices: ["Slamming your opponent", "Cross collar choke", "Pulling guard", "Straight ankle lock"], answer: 0 },
          { type: "mc", prompt: "\"Knee reaping\" refers to:", choices: ["Your leg crossing over their knee line so the knee twists inward", "A type of sweep", "Grabbing inside the pant leg", "A guard pass"], answer: 0 },
          { type: "mc", prompt: "How many points does a takedown score under IBJJF rules?", choices: ["2", "3", "4", "1"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w2",
    title: "Movement",
    subtitle: "Shrimp, bridge, stand up, fall safely",
    videoQueries: [
      "bjj shrimp hip escape drill tutorial",
      "bjj bridging upa drill",
      "technical stand up bjj tutorial",
      "bjj breakfall for beginners",
    ],
    videos: [],
    keyIdeas: [
      "Move your hips, not your arms. The shrimp makes space; frames only hold it.",
      "Bridge up and over one shoulder, never straight up.",
      "Stand up with a hand posted and your lead leg back so you can't be kicked over.",
    ],
    lessons: [
      {
        id: "w2a",
        title: "Shrimping",
        questions: [
          { type: "mc", prompt: "What does the shrimp (hip escape) mainly do?", choices: ["Moves your hips away to create space", "Raises your hips to throw the opponent", "Turns you onto your knees", "Locks a submission"], answer: 0 },
          { type: "mc", prompt: "During a shrimp, your shoulders and hips should be:", choices: ["On their side, facing the opponent", "Flat on the mat", "Facing away from the opponent", "Lifted completely off the mat"], answer: 0 },
          { type: "mc", prompt: "How do frames (forearms and shins) work with the shrimp?", choices: ["They hold the space your hips just created", "They push the opponent away with strength", "They replace the hip movement", "They don't—frames are unrelated"], answer: 0 },
          { type: "sequence", prompt: "Order the steps of a shrimp when the opponent is on your side:", steps: ["Turn onto your side facing them and frame", "Plant your foot and bridge slightly", "Push your hips back and away", "Bring your knee into the space you created"] },
        ],
      },
      {
        id: "w2b",
        title: "Bridging",
        questions: [
          { type: "mc", prompt: "The bridge (upa) is powered by:", choices: ["Driving your feet into the mat and lifting your hips over one shoulder", "Your arms pushing up", "Your neck", "Pulling with your hands"], answer: 0 },
          { type: "mc", prompt: "When bridging to escape mount, you drive over:", choices: ["One shoulder, toward the side where you trapped their arm", "Straight up toward the ceiling", "Your head", "Your lower back"], answer: 0 },
          { type: "mc", prompt: "Why combine a bridge and a shrimp?", choices: ["The bridge unloads their weight; the shrimp uses that moment to move your hips", "They're the same movement", "Bridging alone always escapes", "Shrimping only works standing"], answer: 0 },
          { type: "mc", prompt: "At the top of a good bridge, what touches the mat?", choices: ["Your feet and one shoulder only", "Your whole back", "Your head only", "Your hands"], answer: 0 },
        ],
      },
      {
        id: "w2c",
        title: "Technical stand-up & breakfalls",
        questions: [
          { type: "sequence", prompt: "Order the technical stand-up:", steps: ["Sit up and post one hand behind you", "Plant the opposite foot in front, knee bent", "Lift your hips and swing the free leg back under you", "Stand up with your free hand guarding"] },
          { type: "mc", prompt: "Why use a technical stand-up instead of just getting up?", choices: ["You keep a hand up and a leg back, so you're protected and balanced as you rise", "It's faster", "It's only for MMA", "It scores points"], answer: 0 },
          { type: "mc", prompt: "When breakfalling backward, you should:", choices: ["Tuck your chin and slap the mat with your arms", "Reach back with your hands to catch yourself", "Land on your elbows", "Look up at the ceiling"], answer: 0 },
          { type: "mc", prompt: "A forward roll in jiu-jitsu goes over:", choices: ["Your shoulder, diagonally across your back", "Your head, straight over", "Your back, flat", "Your knees"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w3",
    title: "Positions",
    subtitle: "Name every place you'll end up",
    videoQueries: [
      "bjj positions explained for beginners mount side control",
      "bjj guards explained closed guard half guard open guard",
      "bjj back control hooks seatbelt basics",
      "bjj turtle position basics",
    ],
    videos: [],
    keyIdeas: [
      "Every position has a top and bottom job: the top player advances, the bottom player escapes.",
      "Guard is the only bottom position where you're still attacking.",
      "Back control is the one position where you can't see your opponent, and that's what makes it so strong.",
    ],
    lessons: [
      {
        id: "w3a",
        title: "Top positions",
        questions: [
          { type: "position", position: "side_control", prompt: "Which position is this?", choices: ["Side control", "Mount", "Half guard", "Turtle"], answer: 0 },
          { type: "position", position: "knee_on_belly", prompt: "Which position is this?", choices: ["Knee on belly", "Mount", "North-south", "Back control"], answer: 0 },
          { type: "position", position: "north_south", prompt: "Which position is this?", choices: ["North-south", "Side control", "Turtle", "Closed guard"], answer: 0 },
          { type: "mc", prompt: "Which of these top positions scores 4 points under IBJJF rules?", choices: ["Mount", "Side control", "Knee on belly", "Half guard top"], answer: 0 },
        ],
      },
      {
        id: "w3b",
        title: "Guards",
        questions: [
          { type: "position", position: "closed_guard", prompt: "Coral is on top. Which guard is the partner playing?", choices: ["Closed guard", "Half guard", "Butterfly guard", "Spider guard"], answer: 0 },
          { type: "position", position: "half_guard", prompt: "Which position is this?", choices: ["Half guard", "Closed guard", "Turtle", "Knee on belly"], answer: 0 },
          { type: "mc", prompt: "In \"open guard\" your legs:", choices: ["Aren't locked around them; you use hooks, frames and grips", "Are always locked", "Rest flat on the mat", "Are behind their back"], answer: 0 },
          { type: "mc", prompt: "Butterfly guard means:", choices: ["Sitting up with both feet hooked inside their thighs", "Lying flat with legs locked", "Standing over them", "Kneeling in front of them"], answer: 0 },
        ],
      },
      {
        id: "w3c",
        title: "Back & turtle",
        questions: [
          { type: "position", position: "back_control", prompt: "Which position is this?", choices: ["Back control", "Turtle", "Mount", "Side control"], answer: 0 },
          { type: "position", position: "turtle", prompt: "Which position is the partner in?", choices: ["Turtle", "Back control", "North-south", "Half guard"], answer: 0 },
          { type: "mc", prompt: "\"Hooks\" in back control are:", choices: ["Your feet inside their thighs", "Your hands on their collar", "Your legs crossed in front of their stomach", "Your chin on their shoulder"], answer: 0 },
          { type: "mc", prompt: "Why is crossing your feet in front of their stomach a mistake from back control?", choices: ["They can figure-four your ankles and attack them, and you lose the hooks", "It's illegal", "It scores points for them", "It isn't a mistake"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w4",
    title: "Escapes",
    subtitle: "Get out of the bad spots",
    videoQueries: [
      "bjj mount escape upa elbow knee tutorial",
      "bjj side control escape shrimp to guard",
      "bjj back escape basics tutorial",
      "bjj headlock escape ground",
    ],
    videos: [],
    keyIdeas: [
      "Escapes are a sequence: frame, make space, move your hips into the space.",
      "Never push on their chest with straight arms from the bottom. That's an armbar.",
      "Under attack from the back, the neck comes first, the hooks second.",
    ],
    lessons: [
      {
        id: "w4a",
        title: "Mount escapes",
        questions: [
          { type: "sequence", prompt: "Order the bridge-and-roll (upa) escape:", steps: ["Trap one arm and the foot on the same side", "Bridge hard over that shoulder", "Roll them over", "Land inside their guard"] },
          { type: "mc", prompt: "The elbow-knee escape from mount works by:", choices: ["Shrimping and sliding your knee inside to recover half or full guard", "Pushing their chest with both hands", "Bridging straight up", "Rolling onto your stomach"], answer: 0 },
          { type: "mc", prompt: "Before you upa, you must trap their:", choices: ["Arm and foot on the same side, so they can't post", "Both arms", "Head", "Belt"], answer: 0 },
          { type: "mc", prompt: "The biggest mistake when you're mounted:", choices: ["Pushing on their chest with straight arms", "Keeping your elbows tight", "Bridging", "Framing on their hips"], answer: 0 },
        ],
      },
      {
        id: "w4b",
        title: "Side control escapes",
        questions: [
          { type: "sequence", prompt: "Order the shrimp-to-guard escape from side control:", steps: ["Frame on their neck and hip", "Bridge into them to make space", "Shrimp your hips away", "Bring your knee in and recover guard"] },
          { type: "mc", prompt: "The \"underhook to knees\" escape ends with you:", choices: ["On your knees, driving into them or taking a single leg", "In closed guard", "Standing", "On your back"], answer: 0 },
          { type: "mc", prompt: "Where should your near-side elbow be under side control?", choices: ["Tight to your body, framing on their hip", "Extended overhead", "Flat on the mat away from you", "Behind your head"], answer: 0 },
          { type: "mc", prompt: "Why is lying flat with both shoulders pinned so bad under side control?", choices: ["You can't shrimp or turn, so they control every movement", "It's illegal", "It scores points for them", "It's actually fine"], answer: 0 },
        ],
      },
      {
        id: "w4c",
        title: "Back & headlock escapes",
        questions: [
          { type: "sequence", prompt: "Order the basic back escape:", steps: ["Tuck your chin and control their choking hand", "Slide your hips out and get your shoulders to the mat", "Clear the hook on that side", "Turn into them to guard or come on top"] },
          { type: "mc", prompt: "When defending the rear naked choke, which hand matters most?", choices: ["The hand of the arm reaching around your neck", "Their under-hook hand", "Your own top hand", "Neither"], answer: 0 },
          { type: "mc", prompt: "Escaping a side headlock on the ground usually starts with:", choices: ["Bridging into them so you can free a leg and hook their head, or roll them", "Pulling your head out by force", "Tapping", "Lying still"], answer: 0 },
          { type: "mc", prompt: "Someone has your back with both hooks in. First priority:", choices: ["Defend the neck", "Escape the hooks", "Attack their feet", "Stand up"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w5",
    title: "Closed Guard Offense",
    subtitle: "Posture, attacks, sweeps",
    videoQueries: [
      "bjj closed guard break posture grips",
      "bjj armbar from closed guard tutorial",
      "bjj triangle choke from guard beginners",
      "bjj scissor sweep hip bump sweep tutorial",
    ],
    videos: [],
    keyIdeas: [
      "Closed guard is an attacking position. If their posture is up, break it first.",
      "Your legs are the strongest thing you own on the bottom. Pull with them.",
      "Attacks and sweeps are one system: when they defend the sweep, the submission opens.",
    ],
    lessons: [
      {
        id: "w5a",
        title: "Posture control & grips",
        questions: [
          { type: "mc", prompt: "Breaking your opponent's posture in closed guard means:", choices: ["Pulling them forward so their back rounds and their hips come close", "Pushing them away", "Standing up", "Locking your ankles tighter"], answer: 0 },
          { type: "mc", prompt: "A classic grip combination to break posture:", choices: ["Cross collar grip plus their same-side sleeve, pulling with your legs", "Two hands on their ankle", "Belt grip only", "Both hands on their head"], answer: 0 },
          { type: "mc", prompt: "Most of the pulling power when you break posture comes from:", choices: ["Your legs, pulling their hips in and rocking them forward", "Your biceps", "Your neck", "Your fingers"], answer: 0 },
          { type: "sequence", prompt: "Order the posture break from closed guard:", steps: ["Get a deep collar grip", "Grip their opposite sleeve or wrist", "Pull your knees to your chest to rock them forward", "Keep their head down with the collar grip"] },
        ],
      },
      {
        id: "w5b",
        title: "Closed guard attacks",
        questions: [
          { type: "sequence", prompt: "Order the armbar from closed guard:", steps: ["Control their arm across the centerline and break their posture", "Put a foot on their hip and angle your body", "Swing your leg over their head", "Squeeze your knees, lift your hips, extend the arm"] },
          { type: "mc", prompt: "The triangle choke works by:", choices: ["Squeezing their neck against their own shoulder with your legs", "Choking with your arms", "Twisting their head", "Squeezing both of their arms"], answer: 0 },
          { type: "mc", prompt: "For a triangle, one of the opponent's arms must be:", choices: ["Inside your legs while the other is outside", "Both inside", "Both outside", "Behind their back"], answer: 0 },
          { type: "mc", prompt: "The cross collar choke from guard uses:", choices: ["Two deep opposing collar grips, elbows pulling toward you", "One grip on the belt", "A wrist grip", "The skirt of the gi"], answer: 0 },
        ],
      },
      {
        id: "w5c",
        title: "Sweeps & the guillotine",
        questions: [
          { type: "sequence", prompt: "Order the scissor sweep:", steps: ["Get collar and sleeve grips and angle your hips", "Shin across their belly, other leg low on the mat", "Pull them forward onto your shin", "Scissor your legs and roll them over"] },
          { type: "mc", prompt: "The hip bump sweep works best when the opponent:", choices: ["Is postured up or leaning back", "Is smashing you flat", "Is standing", "Has your collar"], answer: 0 },
          { type: "mc", prompt: "The flower (pendulum) sweep uses:", choices: ["An underhook on their leg and a pendulum swing of your leg to roll them", "A foot on the hip only", "Standing up", "A neck crank"], answer: 0 },
          { type: "mc", prompt: "For a guillotine from guard, your arm goes:", choices: ["Around the front of their neck, the blade of your wrist under their chin", "Behind their neck", "Around their waist", "Under their armpit"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w6",
    title: "Guard Passing",
    subtitle: "Open it, get past the legs, pin",
    videoQueries: [
      "bjj how to open closed guard standing",
      "bjj knee slice pass tutorial",
      "bjj toreando pass beginners",
      "bjj half guard pass knee cut underhook",
    ],
    videos: [],
    keyIdeas: [
      "A guard pass isn't done until you've pinned. Past the legs, then settle your weight.",
      "Control the hips and the legs follow. Control the head and the body follows.",
      "Posture opens the guard. Pressure passes it.",
    ],
    lessons: [
      {
        id: "w6a",
        title: "Opening the closed guard",
        questions: [
          { type: "sequence", prompt: "Order the standing guard break:", steps: ["Posture up and control their hips or a sleeve", "Step one foot up beside their hip", "Stand up, pushing their knee down", "Step back to pop their ankles open"] },
          { type: "mc", prompt: "When you stand in someone's closed guard, the big danger is:", choices: ["Getting swept, so keep your base wide and low", "Getting ankle locked", "Nothing", "Losing points"], answer: 0 },
          { type: "mc", prompt: "Good posture inside closed guard:", choices: ["Head up, back straight, elbows in, hips forward", "Head down, arms extended", "Leaning back with straight arms", "Chest on their chest"], answer: 0 },
          { type: "mc", prompt: "Why post a hand on their chest or belt while opening guard?", choices: ["To stop them sitting up or pulling you down", "To strike", "To grab the belt for points", "To rest"], answer: 0 },
        ],
      },
      {
        id: "w6b",
        title: "Knee slice & toreando",
        questions: [
          { type: "sequence", prompt: "Order the knee slice pass:", steps: ["Control their hip and get a cross-face or underhook", "Slide your knee across their thigh", "Drive shoulder pressure and flatten them", "Free your trailing leg and settle in side control"] },
          { type: "mc", prompt: "The toreando (bullfighter) pass controls:", choices: ["Their pant legs or knees while you move around their legs", "Their collar", "Their head", "Their belt"], answer: 0 },
          { type: "mc", prompt: "The main goal of any guard pass:", choices: ["Get past their legs and establish a pin", "Stand up", "Pull guard", "Submit them from inside guard"], answer: 0 },
          { type: "mc", prompt: "In a knee slice, your sliding knee goes:", choices: ["Across their thigh toward the mat on the far side", "Onto their belly", "Under their leg", "Behind you"], answer: 0 },
        ],
      },
      {
        id: "w6c",
        title: "Double-under & half guard pass",
        questions: [
          { type: "mc", prompt: "The double-under (stack) pass involves:", choices: ["Both arms under their legs, lifting and stacking them", "Standing over them", "Grabbing both sleeves", "Pulling their collar"], answer: 0 },
          { type: "mc", prompt: "The key to passing half guard is:", choices: ["Free your trapped knee: flatten them, cross-face, slide the knee out", "Pull your leg out with force alone", "Stand up and run", "Roll backward"], answer: 0 },
          { type: "mc", prompt: "A \"cross-face\" is:", choices: ["Your shoulder or arm across their jaw, turning their head away", "A slap", "Pulling their collar across", "Facing away from them"], answer: 0 },
          { type: "sequence", prompt: "Order the half guard knee cut:", steps: ["Get an underhook and cross-face", "Flatten them onto their back", "Pull your knee up and slide it toward the mat", "Kick your foot free into side control"] },
        ],
      },
    ],
  },
  {
    id: "w7",
    title: "Top Attacks",
    subtitle: "Finish from mount, side, and back",
    videoQueries: [
      "bjj americana from mount tutorial",
      "bjj kimura from side control tutorial",
      "bjj rear naked choke details beginners",
      "bjj bow and arrow choke tutorial",
    ],
    videos: [],
    keyIdeas: [
      "From the top, weight first, then grips, then the finish.",
      "Straight arms from the bottom are gifts. Take them.",
      "A choke that isn't finishing is a control. Don't burn out on it; switch attacks.",
    ],
    lessons: [
      {
        id: "w7a",
        title: "Mount attacks",
        questions: [
          { type: "sequence", prompt: "Order the americana from mount:", steps: ["Pin their wrist to the mat", "Slide your other hand under their elbow and grab your own wrist", "Keep their elbow bent at ninety degrees", "Drag the elbow toward their hip as you lift it"] },
          { type: "mc", prompt: "The Ezekiel choke uses:", choices: ["Your own sleeve as a grip for the hand across their throat", "Their collar only", "Both of their lapels", "No grips at all"], answer: 0 },
          { type: "mc", prompt: "From mount, they push your chest with straight arms. You can:", choices: ["Attack an armbar", "Do nothing", "Only choke", "Stand up"], answer: 0 },
          { type: "mc", prompt: "\"High mount\" (knees up in their armpits) is good because:", choices: ["It kills their bridge and exposes arms and neck", "It's more comfortable", "It scores extra", "It helps them escape"], answer: 0 },
        ],
      },
      {
        id: "w7b",
        title: "Side control attacks",
        questions: [
          { type: "mc", prompt: "The kimura from side control attacks:", choices: ["Their far arm, bent behind them, with a figure-four grip", "Their near ankle", "Their neck", "Their fingers"], answer: 0 },
          { type: "mc", prompt: "The americana from side control:", choices: ["Pins their wrist to the mat above their head with a figure-four", "Pulls their arm straight down", "Grabs the belt", "Chokes with the lapel"], answer: 0 },
          { type: "sequence", prompt: "Order the transition from side control to mount:", steps: ["Cross-face and control their far hip", "Slide your knee across their belly", "Step your far leg over their body", "Sink your hips and settle into mount"] },
          { type: "mc", prompt: "Knee on belly from side control is set up by:", choices: ["Popping up and placing your near knee on their belly, other foot posted wide", "Lying flatter", "Grabbing both wrists", "Standing up"], answer: 0 },
        ],
      },
      {
        id: "w7c",
        title: "Back attacks",
        questions: [
          { type: "sequence", prompt: "Order the rear naked choke:", steps: ["Get the seatbelt: one arm over the shoulder, one under the armpit", "Slide the choking arm under their chin", "Grab your bicep and put your other hand behind their head", "Squeeze your elbows together and expand your chest"] },
          { type: "mc", prompt: "The bow and arrow choke uses:", choices: ["A collar grip and a grip on their pant leg, pulling like a bow", "Both hands on their collar", "Their belt and sleeve", "A body triangle only"], answer: 0 },
          { type: "mc", prompt: "Why keep your chest glued to their back?", choices: ["Space lets them turn into you and escape", "For comfort", "To score", "No reason"], answer: 0 },
          { type: "mc", prompt: "They're hand-fighting your choking arm hard. You should:", choices: ["Switch sides or attack the other arm or collar instead of forcing it", "Squeeze harder for a minute", "Let go and stand", "Cross your feet"], answer: 0 },
        ],
      },
    ],
  },
  {
    id: "w8",
    title: "Standing",
    subtitle: "Grips, takedowns, and pulling guard",
    videoQueries: [
      "bjj grip fighting basics standing",
      "double leg takedown for bjj beginners",
      "osoto gari for bjj tutorial",
      "how to pull guard safely bjj",
    ],
    videos: [],
    keyIdeas: [
      "Whoever controls the grips controls the takedown.",
      "Change levels with your knees, not your back.",
      "Pulling guard is a technique, not a fall. Have grips first.",
    ],
    lessons: [
      {
        id: "w8a",
        title: "Grips & stance",
        questions: [
          { type: "mc", prompt: "A good grappling stance:", choices: ["Knees bent, feet staggered, head up, hands in front", "Straight legs, feet together", "Hands down at your sides", "Leaning back"], answer: 0 },
          { type: "mc", prompt: "Why does breaking grips matter?", choices: ["Whoever controls the grips controls the takedown", "Grips are illegal", "It scores", "It tires them out"], answer: 0 },
          { type: "mc", prompt: "A standing \"underhook\" is:", choices: ["Your arm under theirs, hand on their back", "Your arm over theirs", "A collar grip", "A wrist grip"], answer: 0 },
          { type: "mc", prompt: "Where's the safe distance when standing?", choices: ["Out of reach, or chest-to-chest with grips. Never half-way.", "Always arm's length", "Always touching", "It doesn't matter"], answer: 0 },
        ],
      },
      {
        id: "w8b",
        title: "Takedowns",
        questions: [
          { type: "sequence", prompt: "Order the double leg takedown:", steps: ["Change levels: bend your knees and drop your hips", "Step in deep between their feet", "Drive with your head to the side and wrap both legs", "Lift or run through to finish"] },
          { type: "mc", prompt: "A single leg takedown:", choices: ["Controls one leg while you drive or trip them down", "Lifts both legs", "Trips from behind only", "Needs a collar grip"], answer: 0 },
          { type: "mc", prompt: "Osoto gari is:", choices: ["A judo throw reaping the back of their leg while you pull them off balance", "A hip throw", "A foot sweep to the front", "A guard pull"], answer: 0 },
          { type: "mc", prompt: "Head position in a double leg:", choices: ["Head up and to the side of their hip, driving through", "Head down between their legs", "Head back", "It doesn't matter"], answer: 0 },
        ],
      },
      {
        id: "w8c",
        title: "Guard pull & takedown defense",
        questions: [
          { type: "mc", prompt: "A guard pull is:", choices: ["Sitting to guard while controlling grips so you don't give up points", "Falling down randomly", "Getting swept", "Pulling their guard open"], answer: 0 },
          { type: "mc", prompt: "To pull guard safely you should first:", choices: ["Have grips (collar and sleeve) and put a foot on their hip", "Jump", "Turn away", "Let go of everything"], answer: 0 },
          { type: "mc", prompt: "A sprawl is:", choices: ["Throwing your hips down and back, legs out, to stop a takedown", "Sitting on them", "Jumping guard", "Rolling backward"], answer: 0 },
          { type: "sequence", prompt: "Order the sprawl and go-behind:", steps: ["See the shot coming: hands to their head and shoulders", "Sprawl: hips down, legs back", "Cross-face and drive their head down", "Circle behind to their back"] },
        ],
      },
    ],
  },
  {
    id: "w9",
    title: "Leg Locks 101",
    subtitle: "The straight ankle lock, safely",
    videoQueries: [
      "bjj straight ankle lock tutorial beginners",
      "how to defend straight ankle lock bjj",
      "bjj leg lock safety knee reaping explained",
      "ibjjf legal leg locks by belt",
    ],
    videos: [],
    keyIdeas: [
      "The straight ankle lock is the one leg lock every white belt should know, and defend.",
      "Tap early on leg locks. Knees and ankles get hurt before they hurt.",
      "Never pull your leg straight out of an ankle lock. It tightens it.",
    ],
    lessons: [
      {
        id: "w9a",
        title: "Straight ankle lock",
        questions: [
          { type: "sequence", prompt: "Order the straight ankle lock:", steps: ["Trap their leg between yours and control the foot", "Wrap the blade of your wrist under their Achilles", "Grip your hands and pull the foot to your chest", "Extend your hips and arch back to finish"] },
          { type: "mc", prompt: "The straight ankle lock attacks:", choices: ["The ankle and Achilles, by hyperextension and pressure", "The knee", "The hip", "The toes"], answer: 0 },
          { type: "mc", prompt: "The blade of your wrist goes:", choices: ["Under the Achilles tendon, just above the heel", "On their toes", "Behind their knee", "On their shin"], answer: 0 },
          { type: "mc", prompt: "To stay IBJJF-legal, your outside foot should be:", choices: ["On their hip on the same side as their leg, never crossing inward over the knee", "Across their belly", "Behind their back", "Anywhere"], answer: 0 },
        ],
      },
      {
        id: "w9b",
        title: "Defending & safety",
        questions: [
          { type: "mc", prompt: "Your first defense to a straight ankle lock:", choices: ["Boot your foot (toes toward your shin), push your heel into them and come forward", "Pull your leg straight out", "Roll away", "Freeze"], answer: 0 },
          { type: "mc", prompt: "With leg locks, tap:", choices: ["Early. Ankle and knee injuries come before the pain does.", "When it really hurts", "Never", "Only if your partner says to"], answer: 0 },
          { type: "mc", prompt: "Why do coaches say never pull your leg straight out of an ankle lock?", choices: ["It tightens the lock on the Achilles", "It's illegal", "It's slow", "It works fine"], answer: 0 },
          { type: "mc", prompt: "Training leg locks safely means:", choices: ["Go slow, apply gradually, tap early, respect the tap", "Crank fast before they can defend", "Only try them in competition", "Never practice them"], answer: 0 },
        ],
      },
      {
        id: "w9c",
        title: "Legal vs illegal",
        questions: [
          { type: "mc", prompt: "Heel hooks in IBJJF gi competition are:", choices: ["Illegal at every belt", "Legal at white belt", "Legal at blue belt", "Always legal"], answer: 0 },
          { type: "mc", prompt: "Knee reaping in IBJJF competition:", choices: ["Is illegal until brown belt, and only in no-gi", "Is a legal sweep", "Is legal at white belt", "Is a choke"], answer: 0 },
          { type: "mc", prompt: "Kneebars and toe holds become legal at:", choices: ["Brown belt", "White belt", "Blue belt", "Never"], answer: 0 },
          { type: "mc", prompt: "Outside competition, whether you can train heel hooks depends on:", choices: ["Your gym's rules. Always ask your coach.", "Your belt only", "Nothing", "The mat color"], answer: 0 },
        ],
      },
    ],
  },
];
