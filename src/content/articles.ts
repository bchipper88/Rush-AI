import type { ContentArticle } from '@/types';

export const articles: ContentArticle[] = [
  {
    slug: 'rush-101-how-rounds-work',
    title: 'Rush 101: How the Week Actually Works',
    teaser: 'From Open House to running home on Bid Day — the whole structure, demystified.',
    category: 'basics',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'Formal recruitment is a mutual-selection process: you rank chapters, chapters rank you, and a matching system pairs everyone up. Each round you visit fewer houses, conversations get longer, and outfits get dressier.',
      },
      { type: 'heading', text: 'The rounds' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Open House / Go Greek — short visits to every chapter (sometimes by video). First impressions, big energy, lots of small talk.',
          'Philanthropy — chapters present their national cause, often with an activity. Show genuine interest in service.',
          'Sisterhood — deeper conversations, and house tours on housed campuses. This is where fit really gets tested.',
          'Preference ("Pref") — up to two longer, emotional, ritual-heavy visits: candlelight, songs, sentimental speeches.',
          'Bid Day — you open your bid and run home to your new chapter.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'After each round you rank the chapters you visited, and chapters submit their own lists. A system called RFM controls how many invitations each chapter can give — so getting fewer invites back is often math, not rejection.',
      },
      { type: 'heading', text: 'Who helps you' },
      {
        type: 'paragraph',
        text: 'Your Rho Gamma (also called Pi Chi or Gamma Chi) is a sorority member who temporarily hides her affiliation to guide your group neutrally. Bring her every question — that is literally her job.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Between parties, jot two lines about each house in your notes app. By day three, they blur — your notes become your ranking superpower.',
      },
    ],
  },
  {
    slug: 'elevator-pitch',
    title: 'Your 30-Second Intro (and What to Say Next)',
    teaser: 'Conversation is the whole game. Here is how to start strong and keep it flowing.',
    category: 'strategy',
    readingMinutes: 4,
    blocks: [
      {
        type: 'paragraph',
        text: 'Members rotate through "bump groups" — a new sister joins your conversation every few minutes. Each one will open with roughly the same questions, so having a warm, practiced intro keeps you relaxed.',
      },
      { type: 'heading', text: 'The formula' },
      {
        type: 'list',
        items: [
          'Name + hometown ("I\'m Emma, from Nashville")',
          'Major or academic interest — plus why, in one sentence',
          'One thing you genuinely love (a sport, a job, a hobby, a show you can talk about with real enthusiasm)',
        ],
      },
      {
        type: 'paragraph',
        text: 'Then prepare three go-to stories you can tell with energy: a leadership moment, a favorite summer memory, something funny from senior year. Stories beat résumés in conversation.',
      },
      { type: 'heading', text: 'Keep it flowing' },
      {
        type: 'doDont',
        dos: [
          'Ask her questions back — favorite chapter memory, why she chose this house',
          'Use her name once or twice',
          'Let yourself laugh; warmth reads better than polish',
        ],
        donts: [
          'Recite your achievements like a list',
          'Try to be who you think they want — chapters can tell',
          'Sabotage a conversation to get dropped (chapters share notes; it can hurt you everywhere)',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Nerves are normal and members expect them. A genuine "I\'m so nervous, but I\'m so excited" is more charming than fake confidence.',
      },
    ],
  },
  {
    slug: 'five-bs',
    title: "The Five B's: Topics to Avoid",
    teaser: 'Boys, Booze, Beliefs, Bucks, Ballots — why these five topics are off-limits all week.',
    category: 'strategy',
    readingMinutes: 3,
    blocks: [
      {
        type: 'paragraph',
        text: 'Recruitment conversations have five famous no-go zones. Members are trained to avoid them, and PNMs should too — they derail conversations and can leave the wrong impression fast.',
      },
      {
        type: 'list',
        items: [
          'Boys — boyfriends, situationships, fraternity men',
          'Booze — drinking, partying, fake IDs (also: never anything to post about)',
          'Beliefs — religion and faith, yours or theirs',
          'Bucks — money: dues gossip, designer brags, what anything costs',
          'Ballots — politics, elections, hot-button issues',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If a member brings one up, redirect gently: "Honestly I\'m so focused on this week — tell me about your favorite sisterhood event!" You will never be penalized for gracefully changing the subject.',
      },
      {
        type: 'paragraph',
        text: 'You will sometimes hear the third one called "Bible." "Beliefs" is the better word: this is a national convention, not a Southern one, and it covers faith of every kind. Several NPC sororities were founded by Jewish women, and some campuses have religious heritage of their own (SMU is Methodist-affiliated) — which is exactly why faith stays personal in a five-minute conversation.',
      },
      {
        type: 'paragraph',
        text: 'There is also a fairness reason. Recruitment is a selection process, so questions about religion edge toward screening people on it. If a member raises her chapter\'s values or her own faith, it is fine to engage warmly — just do not lead with it.',
      },
      {
        type: 'paragraph',
        text: 'One nuance: asking practical questions about dues and payment plans is legitimate — save it for Sisterhood/Pref rounds or your Rho Gamma rather than first conversations.',
      },
    ],
  },
  {
    slug: 'mraba-and-bid-matching',
    title: 'The MRABA & Why "Maximizing Options" Wins',
    teaser: 'The one piece of strategy that is actually math: rank every house you attend at Pref.',
    category: 'strategy',
    readingMinutes: 6,
    blocks: [
      {
        type: 'paragraph',
        text: 'After Preference you sign the MRABA — a binding agreement where you rank the chapters whose Pref events you attended. A matching algorithm (similar to the med-school residency match) then pairs PNMs and chapters.',
      },
      { type: 'heading', text: 'The rules that matter' },
      {
        type: 'list',
        items: [
          'If you match with a chapter you listed and decline it, you cannot join any NPC sorority on that campus for a full year.',
          'You may list every chapter you attended, or fewer — but listing fewer only removes safety nets.',
          'PNMs who maximize (rank everyone they attended) and still do not match get placed as "quota additions" — a built-in guarantee.',
        ],
      },
      { type: 'heading', text: 'Why suicide bidding backfires' },
      {
        type: 'paragraph',
        text: 'Listing only one chapter ("single intentional preference") does not signal devotion to that chapter or improve your odds there — the algorithm matches you to your highest-ranked chapter that also ranked you. It only means that if that one chapter\'s list fills before it reaches you, you go home with nothing.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Only list fewer chapters if you would genuinely rather rush again next year than join that house. That is the honest test.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'RFM (Release Figure Methodology) also explains the week\'s bruises: popular chapters are forced to release many more PNMs early. Getting cut from a "top" house early is often capacity math, not a judgment of you.',
      },
    ],
  },
  {
    slug: 'rec-letters-by-region',
    title: 'Rec Letters: Who Needs Them & How to Get Them',
    teaser: 'Functionally required in the South, irrelevant in the Northeast. Where you fall — and the playbook.',
    category: 'recs',
    readingMinutes: 5,
    relevantIf: { recs: ['required', 'recommended'] },
    blocks: [
      {
        type: 'paragraph',
        text: 'A rec (or RIF — Recruitment Information Form) is a letter from an alumna introducing you to her chapter before recruitment. At deep-South schools chapters expect one per house; at Northeast and West Coast schools they are not used at all.',
      },
      { type: 'heading', text: 'The playbook' },
      {
        type: 'list',
        ordered: true,
        items: [
          'List the chapters on your campus (your Panhellenic site has them).',
          'Hunt for writers: family friends, neighbors, teachers, your mom\'s coworkers, your high school\'s alumnae — anyone initiated into each sorority. Local Alumnae Panhellenic associations exist precisely to match PNMs with writers.',
          'Send each writer a packet: social résumé, headshot, transcript, and a warm note — by late spring for fall rush.',
          'Confirm submission ~3 weeks out. Many sororities now use online rec portals.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'School quirks matter: SMU requires recs sent directly to each house (they are discarded if sent to Panhellenic). Alabama and Ohio State accept but do not require them. Cornell does not collect them at all.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Missing a rec for one chapter is not fatal — chapters know not everyone has Southern networks. A polite email to that chapter\'s alumnae association often solves it.',
      },
    ],
  },
  {
    slug: 'social-resume-and-headshot',
    title: 'Your Social Résumé & Headshot',
    teaser: 'The one-pager that powers your registration, your recs, and chapter pre-screening.',
    category: 'recs',
    readingMinutes: 4,
    blocks: [
      {
        type: 'paragraph',
        text: 'A social résumé is a one-page snapshot chapters and rec writers use to know you before they meet you. It is often the primary information a chapter has about you at the start.',
      },
      { type: 'heading', text: 'What goes on it' },
      {
        type: 'list',
        items: [
          'Name, hometown, high school, graduation year, college + intended major',
          'GPA (weighted and unweighted) and test scores if strong',
          'Activities and leadership — offices held, years involved',
          'Community service — hours and causes',
          'Work experience, honors, awards',
          'Family Greek affiliations (optional — many sororities no longer consider legacy status)',
        ],
      },
      { type: 'heading', text: 'The headshot' },
      {
        type: 'paragraph',
        text: 'Natural light, simple background, shoulders-up, genuine smile, minimal filter. It should look like you on your best ordinary day — chapters will see you in person within weeks, so heavy editing works against you.',
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Save it as a clean PDF named "Firstname Lastname – Social Resume." Your rec writers will forward it exactly as-is.',
      },
    ],
  },
  {
    slug: 'instagram-cleanup-guide',
    title: 'The Instagram Cleanup Guide',
    teaser: 'Chapters look. Here is exactly what to audit, archive, and polish before they do.',
    category: 'strategy',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'Chapters review PNM social media during summer pre-screening — it is standard practice, not paranoia. The goal of a cleanup is not to look fake; it is to make sure your profile tells the story you would tell in person.',
      },
      { type: 'heading', text: 'The audit checklist' },
      {
        type: 'list',
        items: [
          'Photos with alcohol, vapes, or party settings — archive, even if you are just holding a red cup',
          'Overly revealing outfits — use the "would I wear this to meet their alumnae board?" test',
          'Political posts, hot-take reposts, activist stories — the Five B\'s apply online too',
          'Profanity in captions, mean comments, vague-post drama',
          'Tagged photos — check them; untag or limit visibility',
          'Your bio: school + year + something warm beats an edgy quote',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Public vs. private is debated, but most coaches now recommend a clean public profile: chapters WILL look, and a curated public grid works for you. A locked account just leaves them guessing.',
      },
      {
        type: 'paragraph',
        text: 'Use the Audit tab in this app to review your photos and captions the way a recruitment committee would — it will flag exactly what to keep, edit, archive, or delete.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'During rush week itself, strongly consider not posting at all. Many campuses now discourage it, and RushTok attention has brought real hate to PNMs who went viral.',
      },
    ],
  },
  {
    slug: 'outfit-guide-by-round',
    title: 'What to Wear, Round by Round',
    teaser: 'Dress codes decoded, with real budget tiers — you do not need Cartier to get a bid.',
    category: 'style',
    readingMinutes: 6,
    blocks: [
      {
        type: 'paragraph',
        text: 'Attire escalates through the week: casual for Open House, elevated casual for Philanthropy (many campuses provide a round T-shirt), polished for Sisterhood, dressy for Pref, and letters-ready comfy for Bid Day. Always check your own campus dress guide first — official guidance increasingly pushes "no frills" simplicity.',
      },
      { type: 'heading', text: 'Budget tiers that all work' },
      {
        type: 'list',
        items: [
          '$ — borrow + closet + Target/Old Navy/thrift: a sundress, white sneakers, simple gold-tone jewelry. Totally bid-worthy.',
          '$$ — the coach-favorite middle: Altar\'d State tops ($35-80), a Lilly or Show Me Your Mumu dress for Pref ($100-200), Steve Madden sandals, one Kendra Scott piece.',
          '$$$ — designer if you already own it. But know: viral $1,000+ OOTDs are content, not strategy. No one has ever received a bid because of a Cartier bracelet.',
        ],
      },
      {
        type: 'doDont',
        dos: [
          'Break in every shoe for a week beforehand',
          'Dress for the weather — August in the South is brutal; January rush means layers',
          'Pick clothes you can sit, stand, and hug in comfortably',
        ],
        donts: [
          'Buy anything you cannot walk a mile in',
          'Wear another sorority\'s letters or colors head-to-toe (some campuses ask PNMs to avoid this)',
          'Blow the budget — chapters bid the girl, not the outfit',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'A realistic full-week budget with borrowing is around $450. Spend it where photos happen: Pref and Bid Day.',
      },
    ],
  },
  {
    slug: 'what-sorority-life-costs',
    title: 'What Sorority Life Actually Costs',
    teaser: 'Real numbers — registration to live-in dues — so the money talk happens before Pref.',
    category: 'money',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'Costs vary wildly by campus. Registration fees run $165-$375. Nationally, new-member dues range $850-$5,000, living out $400-$4,500 per semester, and living in up to $9,500 per semester.',
      },
      { type: 'heading', text: 'Benchmarks' },
      {
        type: 'list',
        items: [
          'Alabama: first year can total ~$8,300; new-member fees ~$4,200-$5,000/semester; live-in ~$7,500-$9,400/semester',
          'UGA: ~$1,800 new-member fall; ~$4,300 to live in',
          'LSU: new-member average ~$2,200',
          'Clemson: new-member ~$820',
          'UCLA: new-member up to ~$1,700; live-in ~$7,650/year',
        ],
      },
      { type: 'heading', text: 'How to manage it' },
      {
        type: 'list',
        items: [
          'Ask every chapter for its actual dues sheet before Pref — this is a normal, expected question',
          'Ask about payment plans and scholarships (many chapters have both)',
          'Living out or joining an unhoused chapter cuts costs dramatically',
          'Some chapters on every campus are notably cheaper — dues are a legitimate ranking factor',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Financial aid generally cannot cover dues beyond your school\'s official cost of attendance. Agree on the family budget before you rank houses, not after you fall in love with one.',
      },
    ],
  },
  {
    slug: 'building-your-rush-bag',
    title: 'The Rush Bag: Pack Like a Veteran',
    teaser: 'Everything the TikTok girls carry, minus the sponsored fluff.',
    category: 'basics',
    readingMinutes: 3,
    blocks: [
      {
        type: 'paragraph',
        text: 'You will spend long days walking between houses in heat (or cold, for spring rush) with short breaks. A small tote or belt bag with the right kit saves the week.',
      },
      {
        type: 'list',
        items: [
          'Portable charger + cable',
          'Blister patches and flats/fold-up sandals for walks between houses',
          'Deodorant, blotting papers, powder, lip touch-up',
          'Water bottle and real snacks (protein, not just candy)',
          'Mini fan (August) or hand warmers (January)',
          'Safety pins, fashion tape, stain pen',
          'Phone notes app for impressions between parties',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Eat real breakfasts. Multiple parties of enthusiastic small talk on an empty stomach is how PNMs end up crying at lunch. Fed is best.',
      },
    ],
  },
  {
    slug: 'drop-resilience',
    title: 'Getting Dropped: The Survival Guide',
    teaser: 'Almost everyone gets cut somewhere. How to metabolize it and keep going.',
    category: 'wellness',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'Research on recruitment found essentially all PNMs report increased anxiety during the week — even those who love their outcome. Getting released from houses, including ones you loved, is a near-universal experience, and it is the hardest part of rush.',
      },
      { type: 'heading', text: 'Why drops happen (it is mostly math)' },
      {
        type: 'list',
        items: [
          'RFM forces popular chapters to release the most PNMs early — big cuts from "top" houses are structural',
          'Chapters carry limited invitations per round; missing a cut can mean #201 on a list of 200',
          'Legacy, recs, and a five-minute conversation are noisy signals — a drop is not a verdict on your worth',
        ],
      },
      { type: 'heading', text: 'In the moment' },
      {
        type: 'list',
        items: [
          'Let yourself be disappointed for the evening — then decide to show up fully for the houses that DID invite you back',
          'The chapters on your schedule tomorrow chose you. Walk in curious instead of grieving the ones that are gone',
          'Talk to your Rho Gamma — she has seen every version of this week',
          'Call your one support person; skip the group chat autopsy',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'So many "wrong" houses become the right home by October. Bid Day placement predicts almost nothing about how much you will love your chapter.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'If the week starts affecting your sleep, eating, or mental health, tell your Rho Gamma and step back. No membership is worth your wellbeing — and COB and spring rush will still be there.',
      },
    ],
  },
  {
    slug: 'cob-explained',
    title: 'COB & Other Second Chances',
    teaser: 'No bid, wrong bid, or skipped formal rush entirely? Here are the real fallback paths.',
    category: 'basics',
    readingMinutes: 4,
    blocks: [
      {
        type: 'paragraph',
        text: 'Continuous Open Bidding (COB) is informal recruitment by chapters that still have room after formal rush. It starts almost immediately after Bid Day and runs through the year.',
      },
      { type: 'heading', text: 'How COB differs from formal rush' },
      {
        type: 'list',
        items: [
          'Relaxed: coffee dates, house dinners, small events — no rounds, no MRABA week',
          'Only chapters below "total" (the campus size cap) can participate — usually a handful',
          'Bids can come fast, sometimes after a couple of hangouts',
        ],
      },
      { type: 'heading', text: 'Your other paths' },
      {
        type: 'list',
        items: [
          'Spring/deferred rush — some campuses run a second, smaller formal round',
          'Sophomore rush — going through again next year is common and carries zero stigma; you will rush as a savvier, more settled version of yourself',
          'Snap bids — if you maximized options and did not match, a chapter with space may offer one before Bid Day',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'If you plan to COB, follow the eligible chapters on Instagram and go to their open events — COB runs on genuine, low-pressure connection.',
      },
    ],
  },
  {
    slug: 'your-rho-gamma',
    title: 'Your Rho Gamma: The Week\'s Secret Weapon',
    teaser: 'What recruitment counselors do, what to ask them, and what they cannot tell you.',
    category: 'basics',
    readingMinutes: 3,
    blocks: [
      {
        type: 'paragraph',
        text: 'Rho Gammas (Pi Chis, Gamma Chis — the name varies) are sorority members who disaffiliate for the summer: they hide their letters, scrub their Instagram, and guide a PNM group neutrally through the week.',
      },
      { type: 'heading', text: 'Use her for' },
      {
        type: 'list',
        items: [
          'Schedule logistics, dress-code questions, what each round is really like',
          'Processing drops — she has comforted a hundred PNMs before you',
          'MRABA mechanics and honest strategy talk (she will tell you to maximize options too)',
          'Reporting anything sketchy, like dirty rushing or promised bids',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'She cannot tell you which chapter she is in, sway your rankings, or share what chapters think of you. If she seems evasive about a house, she is following rules, not hiding bad news.',
      },
    ],
  },
  {
    slug: 'finding-your-fit',
    title: 'Fit Over Tiers: Ranking Houses Honestly',
    teaser: 'GreekRank is gossip. Here is how to actually tell where you belong.',
    category: 'strategy',
    readingMinutes: 5,
    blocks: [
      {
        type: 'paragraph',
        text: 'Every campus has "top/mid/bottom" folklore — from GreekRank, Reddit, and TikTok. It is anonymous, contradictory, shifts every year, and measures rumor, not sisterhood. Ranking houses by tier chatter is how PNMs end up miserable in a "top" house or heartbroken over algebra.',
      },
      { type: 'heading', text: 'Signals that actually predict happiness' },
      {
        type: 'list',
        items: [
          'Conversations felt easy — you left energized, not performed-at',
          'Members talked about each other warmly, not about their ranking',
          'You saw a range of personalities you could imagine as friends',
          'The commitments (time, money, live-in rules) fit your actual life',
          'Their philanthropy or values genuinely interest you',
        ],
      },
      {
        type: 'doDont',
        dos: [
          'Rank by your notes and your gut after Pref',
          'Ask members what they wish they had known as PNMs',
          'Take the tears at Pref seriously — chapters cry for girls they want',
        ],
        donts: [
          'Let a friend\'s ranking or a TikTok tier list override your own experience',
          'Chase a "top" house you felt invisible in',
          'Dismiss a house because someone called it mid — that someone was an anonymous teenager on the internet',
        ],
      },
    ],
  },
  {
    slug: 'legacy-status-today',
    title: 'Legacy Status in the 2020s',
    teaser: 'Most big sororities quietly ended legacy preference. What that means for you.',
    category: 'basics',
    readingMinutes: 3,
    blocks: [
      {
        type: 'paragraph',
        text: 'Since 2020-21, Kappa Kappa Gamma, Kappa Alpha Theta, Delta Gamma, Gamma Phi Beta, Phi Mu, and Sigma Kappa have all eliminated preferential treatment for legacies (daughters, sisters, granddaughters of members), generally citing equity and inclusion.',
      },
      {
        type: 'list',
        items: [
          'If you ARE a legacy: mention it naturally if asked, but do not lean on it — it likely carries no formal weight, and at most chapters no longer even appears on your file',
          'If you are NOT a legacy: this change is genuinely good news, especially in the South where legacy culture ran deepest',
          'A few organizations (e.g., Kappa Delta, Alpha Delta Pi) retain limited acknowledgment — but "acknowledged" is not "guaranteed"',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Never rank a house higher solely because of family history, and never feel bound to Mom\'s letters. She wants you happy more than she wants a matching sweatshirt. (Probably.)',
      },
    ],
  },
  {
    slug: 'week-of-logistics',
    title: 'Week-Of Logistics: Sleep, Heat & Schedules',
    teaser: 'The unglamorous operations that keep you smiling through 8 parties a day.',
    category: 'basics',
    readingMinutes: 4,
    blocks: [
      {
        type: 'paragraph',
        text: 'Rush week is an endurance event: multiple parties a day, quick turnarounds, big emotional swings, and (for fall rush) brutal heat. The PNMs who thrive treat it like an athlete treats a tournament.',
      },
      {
        type: 'list',
        items: [
          'Sleep 8 hours — puffiness is fixable, exhaustion-crankiness is not',
          'Eat protein at breakfast; pack snacks for gaps',
          'Hydrate constantly; August in the South is no joke',
          'Lay out tomorrow\'s outfit and charge everything tonight',
          'Build in 20 quiet minutes after each day before the debrief calls',
          'Screenshot your daily schedule; know each house\'s location',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Voice-memo your impressions while walking between houses — faster than typing, and your future self ranking houses will thank you.',
      },
    ],
  },
  {
    slug: 'grades-and-recruitment',
    title: 'Grades: The Quiet Gatekeeper',
    teaser: 'GPA cuts are real. What chapters check and how to stay above the line.',
    category: 'basics',
    readingMinutes: 3,
    blocks: [
      {
        type: 'paragraph',
        text: 'Nearly every chapter screens grades, and some use GPA as a hard cut line during pre-screening — no conversation can save a number below their floor. Recent bid classes at competitive schools average high-3s in high school GPA.',
      },
      {
        type: 'list',
        items: [
          'Know your exact GPA before registering; many campuses require a transcript',
          'For deferred (spring) rush, your first-semester COLLEGE grades count — protect them',
          'If your GPA is borderline, strong activities and recs help, and smaller or newer chapters often have more flexibility',
          'Once in, chapters run study hours and minimum-GPA requirements — sorority women often out-GPA the campus average',
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'A strong semester is the highest-ROI rush prep there is — it is free, and it opens doors no outfit can.',
      },
    ],
  },
  {
    slug: 'deferred-rush-playbook',
    title: 'The Deferred/Spring Rush Playbook',
    teaser: 'Rushing in January changes the strategy. Use fall to your advantage.',
    category: 'strategy',
    readingMinutes: 4,
    relevantIf: { style: ['deferred_spring'] },
    blocks: [
      {
        type: 'paragraph',
        text: 'At deferred campuses (Cornell, Northwestern, Duke, SMU, Indiana, Michigan and many more), recruitment happens in January — after a full semester on campus. That changes what preparation means.',
      },
      { type: 'heading', text: 'Your fall semester TO-DO' },
      {
        type: 'list',
        items: [
          'Protect your first-semester GPA — it is the number chapters will screen',
          'Meet sorority women naturally: clubs, dorms, classes. Genuine familiarity beats any rec letter',
          'Go to Panhellenic info sessions and open events in the fall',
          'Watch how chapters show up on campus — you have months of real data instead of a 5-minute party',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Deferred rush is usually cheaper, lower-stakes, and conversation-driven — most deferred campuses use no recs at all. The wardrobe arms race barely exists. Relax accordingly.',
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'One winter-specific tip: January rush means coats, layers, and walking on ice in heels. Plan outfits you can de-layer indoors.',
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ContentArticle | undefined {
  return articles.find((a) => a.slug === slug);
}
