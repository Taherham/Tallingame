// Curriculum data for Gi Path — a Duolingo-style jiu-jitsu learning app.
// Each belt is a unit containing lessons; each lesson has 5 questions.
// Question types: "mc" (multiple choice) and "sequence" (order the steps).

const CURRICULUM = [
  {
    id: "white",
    name: "White Belt",
    subtitle: "Fundamentals",
    color: "#e8e6df",
    textColor: "#3c3c3c",
    lessons: [
      {
        id: "w1",
        title: "Core Positions",
        questions: [
          {
            type: "mc",
            prompt: "Which position has you pinning your opponent's torso from the side, perpendicular to them, with both knees on the mat?",
            choices: ["Side Control", "Mount", "Guard", "Back Control"],
            answer: 0,
          },
          {
            type: "mc",
            prompt: "In 'mount', where are you relative to your opponent?",
            choices: [
              "Behind them with hooks in",
              "Sitting on their torso facing their head",
              "Between their legs",
              "Pinning their shoulder from the side",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "What is 'guard' in jiu-jitsu?",
            choices: [
              "Attacking from on top of the chest",
              "Standing grip fighting",
              "Controlling an opponent with your legs while facing them, often from your back",
              "Pinning from the side",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "Which position is considered the most dominant in jiu-jitsu, controlling an opponent from behind with hooks in?",
            choices: ["Half Guard", "Knee on Belly", "North-South", "Back Control"],
            answer: 3,
          },
          {
            type: "sequence",
            prompt: "Put these steps for standing up to break an opponent's closed guard in order:",
            steps: [
              "Posture up, controlling opponent's hips or biceps",
              "Plant one foot flat, knee up",
              "Push their hips down as you stand on that leg",
              "Circle your trapped knee out to free it from their guard",
            ],
          },
        ],
      },
      {
        id: "w2",
        title: "Base & Posture",
        questions: [
          {
            type: "mc",
            prompt: "Why is a strong base important when passing someone's guard?",
            choices: [
              "It prevents you from being swept or off-balanced",
              "It makes you tired faster",
              "It only matters for takedowns",
              "It increases your risk of being armbarred",
            ],
            answer: 0,
          },
          {
            type: "mc",
            prompt: "'Posture' inside someone's closed guard mainly means:",
            choices: [
              "Sitting cross-legged",
              "Keeping your chin tucked while punching",
              "Keeping your back straight and hips pulled away to avoid submissions",
              "Locking your ankles behind your back",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "A common way beginners get triangle-choked from inside closed guard is by:",
            choices: [
              "Posturing up with hips back and elbows in",
              "Standing up immediately",
              "Putting one arm across the opponent's body without controlling the far side",
              "Keeping both hands on their hips",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "Which grip is commonly used to break an opponent's posture from closed guard?",
            choices: [
              "An ankle grip only",
              "Collar and same-side sleeve/wrist, pulling down and across",
              "Overhooking both arms",
              "No grip is needed",
            ],
            answer: 1,
          },
          {
            type: "sequence",
            prompt: "Order the steps to break your opponent's posture from closed guard:",
            steps: [
              "Secure a collar grip with one hand",
              "Grab their opposite sleeve or wrist with your other hand",
              "Pull their collar down while pulling the wrist across",
              "Break their posture forward to set up a submission",
            ],
          },
        ],
      },
      {
        id: "w3",
        title: "Basic Escapes",
        questions: [
          {
            type: "mc",
            prompt: "The 'upa' (bridge and roll) escape is used to escape from:",
            choices: ["Closed Guard", "Mount", "Back Control", "Knee on Belly"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "In the mount escape (upa), after trapping an arm and leg, you should:",
            choices: [
              "Bridge your hips explosively upward and roll toward the trapped-arm side",
              "Stay flat and wait",
              "Roll away from the trapped arm",
              "Push straight down with your hips",
            ],
            answer: 0,
          },
          {
            type: "mc",
            prompt: "The 'shrimp' (hip escape) movement is mainly used to create space when escaping from:",
            choices: ["It's not a real escape movement", "Side Control", "Only standing positions", "Only the back"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "When shrimping to escape side control, your near-side arm should:",
            choices: [
              "Wrap around their back",
              "Frame against their hip or shoulder to create space",
              "Tuck under your own body",
              "Rest flat on the mat behind you",
            ],
            answer: 1,
          },
          {
            type: "sequence",
            prompt: "Order the steps of the bridge-and-roll (upa) escape from mount:",
            steps: [
              "Trap one of the opponent's arms against your chest and hook their same-side leg",
              "Bridge your hips explosively upward",
              "Roll over your shoulder toward the trapped-arm side",
              "End up on top, in their guard",
            ],
          },
        ],
      },
      {
        id: "w4",
        title: "Basic Submissions",
        questions: [
          {
            type: "mc",
            prompt: "The rear naked choke is applied from which position?",
            choices: ["Mount", "Guard", "Back Control", "Knee on Belly"],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "In an armbar from mount, which joint are you attacking?",
            choices: ["The wrist", "The shoulder", "The elbow", "The fingers"],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "When finishing a rear naked choke, you should avoid pressing directly on the:",
            choices: ["Sides of the neck", "Windpipe/trachea", "Jaw", "Shoulder"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The 'americana' shoulder lock attacks by:",
            choices: [
              "Straightening the arm and hyperextending the elbow",
              "Twisting the wrist",
              "Bending the arm and rotating the shoulder using a figure-4 grip",
              "Squeezing the bicep",
            ],
            answer: 2,
          },
          {
            type: "sequence",
            prompt: "Order the steps for an armbar from mount:",
            steps: [
              "Isolate one of the opponent's arms across your body",
              "Swing your leg over their face while keeping their arm trapped",
              "Sit back with your hips, trapping their arm between your legs",
              "Squeeze your knees and lift your hips to hyperextend the elbow",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "blue",
    name: "Blue Belt",
    subtitle: "Guard Work",
    color: "#1cb0f6",
    textColor: "#ffffff",
    lessons: [
      {
        id: "b1",
        title: "Closed Guard Basics",
        questions: [
          {
            type: "mc",
            prompt: "From closed guard, an 'overhook' is commonly used to set up:",
            choices: ["A rear naked choke", "A kimura or omoplata", "A knee bar", "Nothing — it's not a real grip"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The 'scissor sweep' from closed guard mainly works by:",
            choices: [
              "Pulling straight back",
              "Angling your hips and scissoring your legs to off-balance the opponent sideways",
              "Standing up and slamming",
              "Squeezing a choke",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The classic armbar from closed guard isolates the opponent's arm using:",
            choices: [
              "Your hip and both legs, swinging one leg over their head",
              "Only your hands",
              "A collar grip alone",
              "Your feet on their biceps",
            ],
            answer: 0,
          },
          {
            type: "mc",
            prompt: "A guillotine choke from closed guard is typically set up when:",
            choices: [
              "The opponent's head/neck gets trapped as they posture down or shoot in",
              "The opponent is standing far away",
              "The opponent is already passing to your back",
              "It only works from mount",
            ],
            answer: 0,
          },
          {
            type: "sequence",
            prompt: "Order the steps for a scissor sweep:",
            steps: [
              "Open your guard and angle your body to the side",
              "Grip their sleeve and collar; plant one shin across their belly, other leg low behind their leg",
              "Scissor your legs — top leg pushes their shoulder, bottom leg sweeps their base out",
              "Follow them over to land on top",
            ],
          },
        ],
      },
      {
        id: "b2",
        title: "Guard Passing",
        questions: [
          {
            type: "mc",
            prompt: "The primary goal when passing someone's guard is to:",
            choices: [
              "Stay as far away as possible",
              "Get your hips past their legs to establish side control or mount",
              "Pull them into your guard",
              "Only strike",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The 'knee slide' pass primarily works by:",
            choices: [
              "Jumping over their body",
              "Standing and pulling their legs open",
              "Sliding your knee under their thigh while controlling their hip and far arm to flatten them",
              "Pulling guard yourself",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "When passing guard, controlling the opponent's hips matters because:",
            choices: [
              "Hips have no bearing on guard passing",
              "Only the head matters",
              "Hips control the opponent's ability to reframe and re-guard",
              "Hips are only relevant for submissions",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "The 'torreando' (bullfighter) pass mainly controls the opponent's:",
            choices: [
              "Wrists only",
              "Head and neck",
              "It's a sweep, not a pass",
              "Pant legs or ankles while you step around their legs",
            ],
            answer: 3,
          },
          {
            type: "sequence",
            prompt: "Order the steps for a knee slide pass:",
            steps: [
              "Break the opponent's guard and posture up",
              "Control their far-side hip and near-side collar or arm",
              "Slide your knee across their near thigh, staying low and heavy",
              "Slide your other leg out to flatten into side control",
            ],
          },
        ],
      },
      {
        id: "b3",
        title: "Sweeps",
        questions: [
          {
            type: "mc",
            prompt: "The 'hip bump sweep' from closed guard is set up by:",
            choices: [
              "Sitting up to bump your hip into theirs while they defend an armbar threat",
              "Staying flat on your back the whole time",
              "It only works standing",
              "It requires no grips at all",
            ],
            answer: 0,
          },
          {
            type: "mc",
            prompt: "In half guard, the 'old school sweep' mainly controls the opponent's:",
            choices: ["Head only", "Far-side ankle and near-side arm", "Far-side wrist only", "No limbs — it's a choke"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The 'flower sweep' (pendulum sweep) from closed guard works by:",
            choices: [
              "Pulling both legs straight back",
              "Isolating one arm and swinging your leg like a pendulum to off-balance them forward",
              "Standing and slamming",
              "Choking from the back",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "In general, sweeps in jiu-jitsu are used to:",
            choices: [
              "Reverse position from bottom to top",
              "Finish a match by tapping your opponent directly",
              "Only work in no-gi",
              "Escape the mat area",
            ],
            answer: 0,
          },
          {
            type: "sequence",
            prompt: "Order the steps for a hip bump sweep:",
            steps: [
              "Threaten an armbar by isolating their arm and swinging a leg over their head",
              "When they posture back to defend, sit up toward your knees",
              "Bump your hip into their same-side leg while pulling their arm",
              "Drive through to land on top in mount or side control",
            ],
          },
        ],
      },
      {
        id: "b4",
        title: "Open Guard Concepts",
        questions: [
          {
            type: "mc",
            prompt: "'Open guard' differs from closed guard because:",
            choices: [
              "Your ankles are always locked",
              "You must be standing",
              "It only applies to leg locks",
              "Your legs aren't locked around their back — you use frames and hooks instead",
            ],
            answer: 3,
          },
          {
            type: "mc",
            prompt: "In 'spider guard', control is established primarily using:",
            choices: [
              "Both ankles locked behind their back",
              "Feet on the opponent's biceps while gripping their sleeves",
              "Hooks inside their thighs",
              "Overhooking both arms",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "'De la Riva guard' is characterized by:",
            choices: [
              "Locking your ankles around their back while lying flat",
              "Standing guard with no leg contact",
              "Hooking your leg around the outside of their near leg from a seated position",
              "It's only used for chokes",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "The main purpose of 'frames' (forearms/shins used as barriers) in open guard is to:",
            choices: [
              "Increase pressure on the opponent",
              "Create and maintain distance to prevent the pass",
              "Set up a submission only",
              "Nothing — frames are only for escapes",
            ],
            answer: 1,
          },
          {
            type: "sequence",
            prompt: "Order the steps to recover guard after an opponent starts passing to side control:",
            steps: [
              "Frame your forearm or shin against their hip or shoulder immediately",
              "Shrimp your hips away to create space",
              "Insert your knee or shin back between you and the opponent",
              "Re-establish open or closed guard",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "purple",
    name: "Purple Belt",
    subtitle: "Advanced Control",
    color: "#8b5cf6",
    textColor: "#ffffff",
    lessons: [
      {
        id: "p1",
        title: "Back Take & Control",
        questions: [
          {
            type: "mc",
            prompt: "When controlling the back, 'hooks' refer to:",
            choices: [
              "Your hands gripping their collar only",
              "Your feet/insteps hooked inside the opponent's thighs",
              "Your legs locked around their neck",
              "A type of choke",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "The 'seatbelt grip' when controlling the back consists of:",
            choices: [
              "Both arms under the armpits",
              "Both hands gripping the belt",
              "One arm over the shoulder, one arm under the armpit, hands clasped",
              "Overhooking both legs",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "A common way to take the back from turtle position is by:",
            choices: [
              "Pulling guard",
              "Rolling them toward you while inserting a hook and seatbelt grip",
              "Standing up and running away",
              "Attacking straight for an ankle lock",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "Practitioners often use a 'body triangle' instead of hooks for back control because it:",
            choices: [
              "Is required by IBJJF rules",
              "Makes breathing easier for the top player",
              "Has nothing to do with control",
              "Can provide tighter control and is harder to strip",
            ],
            answer: 3,
          },
          {
            type: "sequence",
            prompt: "Order the steps for taking the back from turtle position:",
            steps: [
              "Control the opponent's far hip and near arm from turtle",
              "Roll them toward you while inserting one hook",
              "Establish a seatbelt grip (over the shoulder, under the armpit)",
              "Insert the second hook to secure full back control",
            ],
          },
        ],
      },
      {
        id: "p2",
        title: "Leg Locks Basics",
        questions: [
          {
            type: "mc",
            prompt: "The 'straight ankle lock' primarily attacks:",
            choices: ["The knee by twisting it", "The ankle joint by hyperextending it", "The hip", "The lower back"],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "In modern leg lock systems, 'ashi garami' refers to:",
            choices: [
              "A type of choke",
              "A guard passing technique",
              "A family of leg entanglement positions used to control and attack the leg",
              "A striking position",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "A 'heel hook' is considered dangerous mainly because it:",
            choices: [
              "Attacks the ankle with obvious pain first",
              "Attacks the knee ligaments through rotation, often before pain is felt",
              "Targets the neck",
              "Targets the shoulder",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "Many gyms restrict heel hooks for lower belts because:",
            choices: [
              "They are illegal in all grappling",
              "They don't work",
              "Only black belts are allowed to grapple",
              "The injury risk is high and tap timing is harder to feel than other locks",
            ],
            answer: 3,
          },
          {
            type: "sequence",
            prompt: "Order the steps for a straight ankle lock from basic ashi garami control:",
            steps: [
              "Secure control of the opponent's leg, figure-fouring or triangling your legs around it",
              "Control their foot, pulling it tight against your hip or chest",
              "Fall back to your back while maintaining leg control",
              "Extend your hips forward while pulling the foot back to hyperextend the ankle",
            ],
          },
        ],
      },
      {
        id: "p3",
        title: "Submission Chains",
        questions: [
          {
            type: "mc",
            prompt: "A 'submission chain' or 'chain attack' means:",
            choices: [
              "Only attempting one submission at a time",
              "Flowing from one submission attempt to another as the opponent defends",
              "Chaining takedowns together",
              "An illegal move",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "If an opponent defends an armbar from guard by stacking you, a common follow-up is to:",
            choices: [
              "Give up the position entirely",
              "Stand up and reset",
              "Transition to a triangle choke or omoplata",
              "Switch to an unrelated leg lock",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "Chaining a triangle choke into an armbar (or vice versa) works well because both attacks share:",
            choices: [
              "No connection at all",
              "Completely different grips with no overlap",
              "Similar arm and head control from a similar angle",
              "They only work on opposite sides",
            ],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "The idea of 'attacking in combinations' in jiu-jitsu is often compared to:",
            choices: ["Playing checkers", "Combinations in boxing, where one attack sets up the next", "A single static hold", "Random guessing"],
            answer: 1,
          },
          {
            type: "sequence",
            prompt: "Order the steps of a common triangle-to-armbar chain:",
            steps: [
              "Attempt a triangle choke from guard, controlling the head and one arm",
              "The opponent postures and pulls the trapped arm out to defend",
              "Recognize the arm is now isolated and extended",
              "Adjust your hips and legs to finish an armbar on the freed arm",
            ],
          },
        ],
      },
      {
        id: "p4",
        title: "Transitions & Scrambles",
        questions: [
          {
            type: "mc",
            prompt: "A 'scramble' in jiu-jitsu refers to:",
            choices: [
              "A specific submission",
              "A fast exchange where position is contested and can change rapidly",
              "A warm-up drill only",
              "A rule violation",
            ],
            answer: 1,
          },
          {
            type: "mc",
            prompt: "A good base during a scramble primarily helps you:",
            choices: ["Submit faster", "Rest", "Avoid being swept or taken down while transitioning", "Escape without moving at all"],
            answer: 2,
          },
          {
            type: "mc",
            prompt: "When both competitors scramble for a single leg entry, controlling which grip first usually gives an advantage?",
            choices: ["The far collar", "The belt", "Nothing — wait it out", "The near-side leg or hip"],
            answer: 3,
          },
          {
            type: "mc",
            prompt: "'Positional awareness' during scrambles means:",
            choices: [
              "Ignoring position and focusing only on submissions",
              "Constantly tracking where your hips and weight are relative to your opponent",
              "Watching the clock only",
              "Watching other matches",
            ],
            answer: 1,
          },
          {
            type: "sequence",
            prompt: "Order the steps to win a scramble after a failed takedown attempt where the opponent sprawls:",
            steps: [
              "Recognize the opponent has sprawled and is flattening you out",
              "Fight to get an underhook or control a leg immediately",
              "Switch your hips to face them and get an angle",
              "Secure a dominant position before they settle",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "brown-black",
    name: "Brown & Black Belt",
    subtitle: "Coming soon",
    color: "#7a5230",
    textColor: "#ffffff",
    locked: true,
    lessons: [],
  },
];
