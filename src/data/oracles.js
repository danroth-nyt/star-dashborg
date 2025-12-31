// ==========================================
// STAR BORG ORACLE COMPENDIUM
// Complete oracle tables from Solo Rules, GM Guide, and Rebel Handbook
// ==========================================

import { pvOpeningScenes } from './perilousVoidOracles';

// ==========================================
// 1. SOLO PLAY ORACLES (The core engine)
// ==========================================

export const soloOracles = {
  affirmation: {
    "1": { 
      result: "Extreme No", 
      detail: "As bad as it can be", 
      size: "Miniscule / One", 
      weather: "Electric Storm", 
      npcReaction: "Immediately Attack" 
    },
    "2-3": { 
      result: "No", 
      detail: "It's Gnarly", 
      size: "Small / Pair", 
      weather: "Ice Storm", 
      npcReaction: "Hostile" 
    },
    "4-5": { 
      result: "No", 
      detail: "Oof, What Now", 
      size: "Handful (d4+1)", 
      weather: "Blowing Dust", 
      npcReaction: "Threatening" 
    },
    "6-7": { 
      result: "No", 
      detail: "Could Use a Hand", 
      size: "Several (d6+1)", 
      weather: "Heavy Rain", 
      npcReaction: "Wary" 
    },
    "8-9": { 
      result: "No, but", 
      detail: "Average", 
      size: "Several (d6+1)", 
      weather: "Drizzling", 
      npcReaction: "Curious" 
    },
    "10-11": { 
      result: "Random Event", 
      detail: "Average", 
      size: "Several (d6+2)", 
      weather: "Foggy", 
      npcReaction: "Indifferent" 
    },
    "12-13": { 
      result: "Yes, but", 
      detail: "Average", 
      size: "Several (d6+2)", 
      weather: "Overcast", 
      npcReaction: "Indifferent" 
    },
    "14-15": { 
      result: "Yes", 
      detail: "I've Seen Better", 
      size: "Several (d6+3)", 
      weather: "A Bit Warm", 
      npcReaction: "Helpful" 
    },
    "16-17": { 
      result: "Yes", 
      detail: "I've Got This", 
      size: "Patrol (d10+5)", 
      weather: "Sunny", 
      npcReaction: "Helpful" 
    },
    "18-19": { 
      result: "Yes", 
      detail: "The Good Stuff", 
      size: "Unit (d20+10)", 
      weather: "Comfortable", 
      npcReaction: "Generous" 
    },
    "20": { 
      result: "Extreme Yes", 
      detail: "Top Shelf", 
      size: "Gigantic / Too Many", 
      weather: "Chilly", 
      npcReaction: "Willing to Betray" 
    }
  },
  
  // Roll d20
  openingScene: [
    "You've been poisoned with a timer-release toxin (d6 days).",
    "A new character pleads for help hiding from a Bounty Hunter.",
    "An important piece of your tech was just broken.",
    "You are in a scrape at a cantina.",
    "You are being chased by a Bounty Hunter.",
    "An electrical storm has knocked out communications.",
    "A bomb has gone off in the nearby spaceport.",
    "Rebels have assaulted an official and are cornered in a plaza.",
    "You've been stopped at a Galactic Legion checkpoint.",
    "A scrap trader offers to sell you a rusty old bot and box of parts.",
    "A patrol is knocking on doors demanding information on rebels.",
    "A ship was just shot down nearby.",
    "Word that a connection to the PC has been captured.",
    "Word that the Galactic Legion has destroyed PC's homeworld.",
    "A major storm has halted all travel.",
    "An NPC has betrayed you, the Galactic Legion is on the way.",
    "A festival and hov-zoom racing event.",
    "Broke down vehicle hails you for an emergency lift.",
    "Galactic Legion forces have just arrived in the area.",
    "You're being held by a group of gangsters."
  ],

  // Roll d20 + Threat
  sceneShakeup: [
    "Rival appears.",
    "Ambush.",
    "Something in the environment changes.",
    "Someone gets hurt.",
    "You discover a beneficial opportunity.",
    "New NPC appears.",
    "Resource you had is lost.",
    "You discover a beneficial object.",
    "New Event takes place.",
    "All Danger Clocks advance." // Result 10+
  ],

  // Roll d4 when you Crit (20) or Blunder (1)
  critBlunder: {
    crit: [
      "You gain useful information.",
      "You gain a minor item or resource.",
      "You gain a tactical advantage.",
      "You double the intended effect."
    ],
    blunder: [
      "Something thought true now appears false.",
      "You break or lose gear or a resource.",
      "More enemies or obstacles appear.",
      "The intended effect harms you or an ally."
    ]
  },

  // The Big Event Table (Roll d20)
  eventOracle: [
    { roll: 1, verb: "Abandon", subject: "Battle", description: "Foul", activity: "Fighting", omen: "Shadow" },
    { roll: 2, verb: "Acquire", subject: "Enemy", description: "Dark", activity: "Seeking", omen: "Sound" },
    { roll: 3, verb: "Seek", subject: "Path", description: "Modified", activity: "Hunting", omen: "Odor" },
    { roll: 4, verb: "Betray", subject: "Balance", description: "Corrupt", activity: "Learning", omen: "Tracks" },
    { roll: 5, verb: "Return", subject: "Peace", description: "Blocked", activity: "Stealing", omen: "Blood" },
    { roll: 6, verb: "Destroy", subject: "Law", description: "Hidden", activity: "Repairing", omen: "Scorching" },
    { roll: 7, verb: "Plot", subject: "Leader", description: "Refined", activity: "Dying", omen: "Debris" },
    { roll: 8, verb: "Move", subject: "Device", description: "Mystical", activity: "Killing", omen: "Wreckage" },
    { roll: 9, verb: "Begin", subject: "Secret", description: "Strange", activity: "Negotiating", omen: "Disconnected" },
    { roll: 10, verb: "Pursue", subject: "Knowledge", description: "Protected", activity: "Planning", omen: "Voices" },
    { roll: 11, verb: "Control", subject: "Fellowship", description: "Feeble", activity: "Lying", omen: "Message" },
    { roll: 12, verb: "Breach", subject: "Structure", description: "Harsh", activity: "Guiding", omen: "Sparks" },
    { roll: 13, verb: "Guard", subject: "Corruption", description: "Worn", activity: "Demanding", omen: "Footsteps" },
    { roll: 14, verb: "Deliver", subject: "Faction", description: "New", activity: "Examining", omen: "Scratches" },
    { roll: 15, verb: "Oppress", subject: "Weapon", description: "Complex", activity: "Gambling", omen: "Body" },
    { roll: 16, verb: "Hunt", subject: "Ally", description: "Rare", activity: "Hiding", omen: "Damage" },
    { roll: 17, verb: "Secure", subject: "Debt", description: "Broken", activity: "Performing", omen: "Slime" },
    { roll: 18, verb: "Inspect", subject: "Community", description: "Ancient", activity: "Conspiring", omen: "Temperature" },
    { roll: 19, verb: "Protect", subject: "Supply", description: "Grimy", activity: "Escorting", omen: "Blocked" },
    { roll: 20, verb: "Explore", subject: "Vow", description: "Graceful", activity: "Disabling", omen: "Illness" }
  ],

  // Event Specific (d6) - Roll to determine focus
  eventSpecific: [
    "PC Positive",
    "PC Negative",
    "Far Away Event",
    "Relating to current Mission",
    "NPC Positive",
    "NPC Negative"
  ]
};

// ==========================================
// 2. MISSION & PLOT GENERATORS
// ==========================================

export const missionGenerators = {
  // Damn Fool Idealistic Crusades
  villain: ["Crime Lord", "Space Monstrosity", "Galactic Legion", "Legionary Grand Admiral", "Dragoon", "Lord Commander Vortex"],
  villainGoal: ["Destroy", "Enrich", "Control", "Chaos", "Justice", "Return"],
  villainPlan: ["Recruit", "Poison", "Overrun", "Silence", "Subterfuge", "Catastrophe"],
  villainMeans: ["Mercenaries", "Beasts", "Troops", "Technology", "Super Weapon", "Ancient Magi Arts"],

  // Mission Details (Roll d6 for each)
  missionType: ["Deliver", "Rescue", "Steal", "Destroy", "Locate", "Negotiate"],
  missionGoods: ["Weapons", "Leader", "Plans", "Base", "Magi", "Bits"],
  missionSpot: ["Crime Lord", "Space Ship", "Space Pirates", "Remote Planet", "Bounty Hunter", "Base"],
  missionReward: ["Ally", "Bits", "Key", "Weapon", "Item", "Tactical Advantage"],
  
  // Rebel Mission Generator (Alternative/Quick)
  quickMission: ["Locate", "Steal", "Rescue", "Protect", "Sabotage", "Destroy"],
  quickTarget: [
     "Valuable contraband / Bounty Hunter target",
     "Prototype Tech / Captured prince",
     "Blackmail / Small but formidable creature",
     "Powerful relic / Crime Lord confidant",
     "Forbidden knowledge / Legionary high-up",
     "Legionary Super Weapon / Bot with secret plans"
  ],
  
  // Pre-generated Scenarios
  scenarios: [
    { 
      title: "The Planet Gun", 
      desc: "Legion using super hyperdrive to smash planets together. Drop antiparticle bomb in core to destroy." 
    },
    { 
      title: "Bot-Mind Overlord", 
      desc: "Colossal bot mind reprogramming billions. Install data tape countermind to wipe memory banks." 
    },
    { 
      title: "The Antispace Circuit", 
      desc: "Pirate warstation disabling hyperdrives. Activate thrusters to misalign circuit and destroy field." 
    },
    { 
      title: "The Doomsday Engine", 
      desc: "Floating mega-factory disassembling planets. Kill Lord Commander Vortex on throne to tear machine apart." 
    },
    { 
      title: "The Magi Harvester", 
      desc: "Extracting Magi powers for Immortals. Demolish ancient necropolis foundation to collapse facility." 
    },
    { 
      title: "The Pangalactic Teleporter", 
      desc: "Instant troop travel via pulsar station. Sabotage super-solar collectors to malfunction permanently." 
    }
  ]
};

// ==========================================
// 3. WORLD BUILDING & ENVIRONMENT
// ==========================================

export const worldOracles = {
  // Roll d6 for Scene Construction
  sceneLocation: ["Wilderness", "Wilderness", "Settlement", "Settlement", "Space Ship", "Base"],
  sceneTone: ["Too quiet", "Lively", "On alert", "Secretive", "Dangerous", "Cryptic"],
  sceneObstacle: ["Wildlife / Alien Beast", "Guards / Security", "Terrain / Weather", "Lock / Barrier / Trap", "NPC", "Villain"],

  // Urgent Obstacles (d6)
  urgentObstacles: [
    "Fire spreading towards fuel/people (D2+1 rounds).",
    "Tremors/Unstable footing, chasm opening (D2+1 rounds).",
    "Flooding with toxic gas/insects/sewage (D2+1 rounds).",
    "Turret calibrating / Monster waking / Machine approaching (D2+1 rounds).",
    "Evidence of battle discovered soon, area on high alert in 20 mins.",
    "Public execution / Prison barge departing / Weapon firing (4 rounds)."
  ],

  // Mishaps (d6)
  generalMishaps: [
    { 
      roll: 1, 
      title: "LURKING MONSTER", 
      desc: "The trash chute leads to a swampy dump with an enormous alien beast that eats trash AND people." 
    },
    { 
      roll: 2, 
      title: "AMBUSH", 
      desc: "There's a Bounty Hunter with a Net Launcher waiting by the back exit." 
    },
    { 
      roll: 3, 
      title: "INCLEMENT WEATHER", 
      desc: "Escaping outside leads into dangerous lightning storms (landslides, low atmosphere, acid floods). Maybe it was better to stay inside?" 
    },
    { 
      roll: 4, 
      title: "STINK BOMB", 
      desc: "The explosion used for a distraction erupts in a cloud of choking poison. It spreads quickly, leaving anyone who breathes it in agonising pain (sick, paralyzed, hypnotic visions)." 
    },
    { 
      roll: 5, 
      title: "TRACKING DEVICE", 
      desc: "When the Rebels finally get to rest, they realize they've been tagged with a tracking beacon. A deadly Murder Bot is on its way." 
    },
    { 
      roll: 6, 
      title: "A MYSTERY UNFOLDS", 
      desc: "Rumors have led the Rebels this far, but the only way to discover the truth is to go deeper inside, where even greater dangers lurk." 
    }
  ],

  // Space Obstacles (d6)
  spaceObstacles: [
    "Debris field of destroyed ships/warheads.",
    "Asteroid field infested with Space Worms.",
    "Stellar nursery with explosive gas.",
    "Comet Tail with freezing fog.",
    "Space Lane Traffic Jam.",
    "Freak Ion Pulse disabled ships."
  ],

  // Space Travel Mishaps (d6)
  hyperspaceMishaps: [
    "Timespace Rift (Your future ship needs help).",
    "Uncharted Hypermagnetic Storm.",
    "Magi Temple Ship (Near black hole).",
    "Hyperspace Femtosharks.",
    "Protocol Bot Corsairs (Polite robbery).",
    "Rebel Distress Signal (Trap)."
  ],

  // Planets (d6)
  planetTerrain: ["Mountainous/Wasteland", "Swampy/Canyonlands", "Fungal/Desert", "Forested/Oceanic", "Barren/Hilly", "Volcanic/Crystalline"],
  planetWeather: ["Frozen", "Rain", "Arid", "Windy", "Static Storms", "Pleasant"],
  planetColor: ["Blue", "Green", "Yellow", "Brown", "Red", "White"],
  planetPopulation: ["Hundreds", "Hundreds", "Thousands", "Thousands", "Millions", "Outpost/Abandoned"],
  planetControl: ["Local Gov", "Rebels", "Pirates", "Crime Lord", "Galactic Legion", "Galactic Legion"],

  // Settlements (d10)
  settlementAppearance: [
    "Colorful tents", "Mobile huts", "Circular buildings on stilts", "Container towers",
    "Underground bunkers", "Dusty low buildings", "Floating villas", "Stone ziggurat",
    "Stacked modular highrises", "Legion-constructed prefabs"
  ],
  settlementKnownFor: [
    "Rebels", "Trade", "Information", "Carousing", "Transports", 
    "Mining", "Prison", "Trade", "Racing", "Legion"
  ],
  settlementCurrentState: [
    "Noisy / Chaotic", "Dangerous / Curfew", "Quiet / Industrious", "Political Upheaval", "Preparing for threat",
    "Suspicious locals", "Fertile / Productive", "Wild / Overgrown", "Sleepy / Docile", "Seized by Legion"
  ],
  settlementComplication: [
    "Electrical storms", "Flood / Quake", "Creatures", "Crime", "Science",
    "Illness", "Dark omen", "Raiders", "Factional warfare", "Revolt"
  ],

  // Settlement Extended (d6 each) - Solo Rules p.17
  settlementLeader: [
    "Crime Lord",
    "Galactic Legion",
    "Elected Leader",
    "Two separate Gangsters",
    "Exiled Smuggler",
    "Space Pirates"
  ],
  settlementLandmark: [
    "Neon obelisk",
    "Crashed ship",
    "Dark grey prison building",
    "Large fountain plaza",
    "Tall communications tower",
    "Hill with glass roof"
  ],
  settlementRumors: [
    "Map",
    "Gear",
    "Secret information",
    "Combat",
    "Hacking",
    "Uprising"
  ],
  settlementHookups: [
    "Transfer of Bits",
    "Stolen information",
    "Disguised Magi",
    "Weapons cache",
    "Transport",
    "Huge refining factory"
  ],
  
  // Planet Details (d10)
  planetFeatures: [
    "Desert of dead sea salt, bleached coral, boneyards.",
    "Pits of gurgling mud and geysers.",
    "Bottomless misty canyons with petrified trees.",
    "Lakes of bioluminescent scum beneath sunless sky.",
    "Choking black dust storms, electro lanterns needed.",
    "Industrial sludge waves, red lightning clouds.",
    "Creeping vines/tropical trees reclaiming megacity.",
    "Craters of scorched glass, fulgurite pillars.",
    "Partially constructed ring station on asteroids.",
    "Revelers lounging in hallucinogenic fungal colonies."
  ],
  planetScenarios: [
    "Legionary garrison stripmining for superweapon resource.",
    "Governor forcing captured rebels to fight in colosseum.",
    "Legion holding off waves of giant insects from mantle.",
    "Cloaked spies searching for data stolen by Rebels.",
    "Legionary Dreadnought Carrier landed for repairs.",
    "Debaucherous Crime Lord forcing festival in their honor."
  ],
  
  // Location Details (d6)
  backwaters: [
    "High atmosphere gas mining operations.",
    "Spice-dust farmstead with malfunctioning bots.",
    "Space ice quarry carving comet blocks.",
    "Pre-terraforming fertilizer crew.",
    "Bot graveyard (Grand Galactic Backup).",
    "Slime rigs on moon-sized protoplasm."
  ],
  backalleys: [
    "Flickering hologram signs in factory smog.",
    "Snow/sleet from refrigeration unit.",
    "Iridescent oil pools under solar dome.",
    "Scaly hides drying in sweltering air.",
    "Tethered dynamo towers sapping aurora energy.",
    "Razorleaf vines taking over hovels."
  ],
  hiddenFeatures: [
    "Downtrodden locals ready to rise up!",
    "Secret network of local Rebels.",
    "Old friend working on the inside.",
    "Vault full of bits.",
    "Concealed weak point.",
    "Secret back entrance.",
    "Readily available stimpacks.",
    "The Rebels' map doesn't match location.",
    "Rigged to explode.",
    "IT'S A TRAP!"
  ],
  locationDangers: [
    "Swarming with Legionary Foot Soldiers.",
    "Team of Bounty Hunters.",
    "Security cameras everywhere.",
    "Space Pirates using Rebels as distraction.",
    "Hungry wildlife.",
    "Impenetrable force fields.",
    "Guarded by laser turrets.",
    "Patrolling security bots.",
    "Caged Space Monstrosity.",
    "Bottomless pit."
  ]
};

// ==========================================
// 4. DANGEROUS LOCATIONS (Ship/Base) - Solo Rules p.20-21
// ==========================================

export const dangerousLocations = {
  // 1. Determine the Size (Roll d20)
  siteSize: {
    "1-10": { type: "Small Site", zones: "d6 + 2", note: "Add 1 final Objective Zone" },
    "11-16": { type: "Medium Site", zones: "d6 + 5", note: "Add 1 final Objective Zone" },
    "17-20": { type: "Large Site", zones: "d12 + 5", note: "Add 1 final Objective Zone" }
  },

  // 2. The Main Generator (Roll d20 per Zone)
  // When entering a Zone:
  // 1. Roll row (1-20) to determine Feature.
  // 2. Roll d20 + Threat. On 12+, use the "Obstacle" column.
  // 3. If searching, use the "Search" column (Strong Hit = d20 / Weak Hit = d10).
  features: [
    { roll: 1, ship: "Plain", base: "Dormitory", obstacle: "Bot", search: "Junk" },
    { roll: 2, ship: "Barracks", base: "Holding", obstacle: "Alarm", search: "Scrap (Tradeable to right client)" },
    { roll: 3, ship: "Pod Bay", base: "Storage", obstacle: "Enemy", search: "Bot Parts" },
    { roll: 4, ship: "Workshop", base: "Fighting Pit", obstacle: "Enemy", search: "Goods (Worth Bits on Black Market)" },
    { roll: 5, ship: "Comms", base: "Parts", obstacle: "Enemy", search: "Eye / Headwear" },
    { roll: 6, ship: "Medical", base: "Trash", obstacle: "Missile", search: "Clothing" },
    { roll: 7, ship: "Hangar", base: "Mess", obstacle: "Debris", search: "Datapad" },
    { roll: 8, ship: "Trash", base: "Torture", obstacle: "Trap", search: "Stimpack" },
    { roll: 9, ship: "Scrap", base: "Cage", obstacle: "Lost", search: "Repair Toolkit" },
    { roll: 10, ship: "Mess", base: "Armory", obstacle: "Monster", search: "Bits" },
    { roll: 11, ship: "Life Support", base: "Laboratory", obstacle: "Barrier", search: "Power Pack / Battery" },
    { roll: 12, ship: "Interrogation", base: "Cantina", obstacle: "Shaft", search: "Melee Weapon" },
    { roll: 13, ship: "Prison Cells", base: "Lounge", obstacle: "Environment", search: "Ranged Weapon" },
    { roll: 14, ship: "Mission Deck", base: "Gambling", obstacle: "Device", search: "Thrown Weapon" },
    { roll: 15, ship: "Officer Quarters", base: "Storage", obstacle: "Ambush", search: "Random Gear" },
    { roll: 16, ship: "Armory", base: "Vault", obstacle: "Crushing", search: "Armor" },
    { roll: 17, ship: "Science", base: "Quarters", obstacle: "Distraction", search: "Legionary Equipment" },
    { roll: 18, ship: "Cargo", base: "Hover-Port", obstacle: "Surveillance", search: "Special Item" },
    { roll: 19, ship: "Bridge", base: "Generator", obstacle: "Resources", search: "Keycard" },
    { roll: 20, ship: "Power", base: "Comms", obstacle: "Gas", search: "Ally" }
  ],

  // 3. Escape Rules (Reference)
  escape: "When the Mission is complete, roll on the Obstacle column one last time to escape!"
};

// ==========================================
// 5. NPCS & CHARACTERS
// ==========================================

export const npcOracles = {
  // Travel Encounters (d10)
  travelTheme: ["Hostility", "Trade", "Tracking", "Smuggling", "Battle", "Assistance", "Wreck", "Science", "Religion", "Weather"],
  travelActor: ["Legionary Troopers", "Caravan", "Bounty Hunter", "Gangsters", "Crime Lord", "Survivors", "Space Pirates", "Refugees", "Alien Beast", "Monstrosity"],

  // NPC Details (d20)
  npcRoles: ["Soldier", "Bounty Hunter", "Smuggler", "Commoner", "Youth", "Magi", "Guard", "Criminal", "Pilot", "Bot", "Gangster", "Mercenary", "Clone", "Trader", "Mechanic", "Politician", "Hacker", "Gambler", "Leader", "Healer"],
  
  npcSpecies: [
    "Baseline Human", "Woolly Anthrosquatch", "Fish-eyed Ichthyoid", "Scaley Lacertian", 
    "Flatheaded Tricladid", "Runtish Zinto", "Sucker-lipped Anuran", "Flightless Macrobat", 
    "Lithe Pseudopoid", "Little Ursanid", "Ocular Picaroo", "Flammari Siren", 
    "Ratling Ambau", "Avian Caldecta", "Horned Thernee", "Cerebral Roothan", 
    "Bantam Clookoo", "Waifish Nilata", "Green Mardonalians", "Pale Vril-ya"
  ],

  npcMotivations: ["Revenge", "Truth", "Belonging", "Adventure", "Favor", "Mentor", "Discipline", "Chaos", "Reputation", "Connection", "Wealth", "Rebellion", "Power", "Discovery", "Redemption", "Peace", "War", "Death", "Love", "Justice"],
  
  npcSecrets: ["Killed someone powerful", "Owns valuable data pad", "Noble birth", "Wealthy", "Has mystical pull", "Desires power", "Will betray", "Has bunker of stolen goods", "Never been in battle", "Holding valuable info", "Wants to be someone else", "Wanted fugitive", "Stolen identity", "Lost family in conflict", "Deserter", "Wants war", "Collects scandalous info", "Massive debt", "Is a Clone", "More powerful than lets on"],
  
  npcTraits: ["Tattoo on face", "Ragged clothes", "Visible scar", "Drunkard", "Well-dressed", "Missing eye", "Tall", "Missing hand", "Big hair", "Charming voice", "Bristly beard", "Gaunt", "Covered hand", "Rotten teeth", "Mechanical leg", "Facial birthmark", "Pierced chin", "Sideburns", "Glasses", "Beaded beard"],
  
  npcDemeanor: ["Stoic", "Harsh", "Jovial", "Menacing", "Thoughtful", "Warm", "Hostile", "Chatty", "Greedy", "Humorous", "Merciful", "Terse", "Needy", "Mopey", "Ambitious", "Aggressive", "Polite", "Lazy", "Anxious", "Kind"],
  
  // Rebel Contacts (d6)
  rebelContacts: [
    "Gwarark (Grumpy Anthrosquatch)", "TN-60 (Talkative Bot)", "Boomer (Sly Roothan)",
    "Selene (Guilty Avian)", "Tuz Rix (Experienced Ichthyoid)", "Bamro (Radical Ursanid)"
  ],

  // Weirdo Aliens (d10)
  weirdoAliens: [
    "Ylat Dara (Conniving Anuran)", "Erden Rainsinger (Enthusiastic Mardonalian)", "Kodo Shif (Suave Thernee)",
    "Corde Nenu (Bored Flammari)", "Tillie Winai (Curious Pseudopoid)", "Gorts (Grunting Lacertian)",
    "Shoom (Aloof Macrobat)", "Cataru (Keen Zinto)", "HD-3N (Dull Bot)", "Valin Pax (Reclusive Magi)"
  ],

  // Reactions (d8)
  reactions: [
    "Hostile", "Betray", "Angered", "Cautious",
    "Indifferent", "Curious", "Friendly", "Helpful"
  ]
};

// ==========================================
// 6. NAME GENERATORS
// ==========================================

export const nameOracles = {
  baselineFirst: ["Mason", "Wren", "Alex", "Luca", "Harper", "Teagan", "Ellis", "Vick", "Dylan", "Jace"],
  botNamePrefixes: ["XT", "RY", "KT", "Q", "VV", "ZZT", "L5R", "NTH", "ALT", "TM"],
  botNameSuffixes: ["64", "90", "37", "88", "42", "5E", "02", "16", "F4", "006"],
  familyNames: ["Parsec", "Lighthour", "Cotorn", "Bastion", "Outlander", "Quasar", "Voyager", "Hadron", "Fraction", "Lysander"],
  ancientNames: ["Anatu", "Belatsunat", "Kishar", "Zirratbanit", "Igigi", "Kinziru", "Nebo", "Ubaratutu", "Gadatas", "Haban"],
  archaicNames: ["Sycorax", "Banquo", "Marullus", "Calphurnia", "Verges", "Escalus", "Egeon", "Caliban", "Oberon", "Cressida"],
  distantNames: ["Tarkas", "Komak", "Vastus", "Marthis", "Lakor", "Yamdor", "Xodar", "Zithad", "Parthak", "Hovan"],
  grandNames: ["Armaros", "Gabriel", "Metatron", "Urizon", "Yadathan", "Zephon", "Mastema", "Lailah", "Eleleth", "Azrael"],
  
  shipNames: [
    "Z / Wing", "Midnight / Bolt", "Crimson / Ray", "Violet / Baroness", 
    "Boreal / Storm", "Nova / Dragon", "Shadow / Huntress", "Light / Banshee", 
    "Fallen / Chimera", "Centurion / Hawk"
  ],

  // Ship Name Generator - d100 for first part, d100 for second part
  shipNameFirstParts: [
    "Androm", "Anth", "Aph", "Aqu", "Ar", "Arc", "Ast", "Astr", "Ath", "Aur",
    "Bell", "Cael", "Cap", "Cass", "Cast", "Ch", "Chron", "Cr", "Crys", "Cyg",
    "D", "Dr", "Drac", "El", "Elys", "Erid", "Eryth", "G", "Gal", "Galax",
    "Geos", "H", "Heli", "Hesp", "Hul", "Hulv", "Hydr", "Hyp", "Icar", "Ir",
    "Jup", "L", "Lar", "Lum", "Lumi", "Lun", "Lyr", "M", "Mar", "Min",
    "Mon", "N", "Neb", "Nep", "Nept", "Nim", "Nom", "Nov", "Nyx", "Or",
    "Os", "P", "Peg", "Per", "Pers", "Ph", "Phaet", "Pis", "Plut", "Pol",
    "Prox", "Pyr", "Pyth", "R", "Rhex", "Rhiz", "S", "Sel", "Selen", "Sol",
    "Solar", "Solv", "Stas", "Stel", "Styg", "T", "Tar", "Taur", "Th", "Thalas",
    "Tir", "Titan", "Ur", "Urb", "Urs", "V", "Vir", "Virg", "Z", "Zeph"
  ],

  shipNameSecondParts: [
    "a", "adan", "aelios", "aidon", "alis", "an", "anithos", "anthys", "antia", "aphos",
    "ar", "ara", "aras", "arax", "archos", "arex", "aria", "arion", "aros", "arpos",
    "arubra", "aryx", "as", "aster", "astra", "astria", "astrias", "astro", "ate", "athos",
    "axis", "edon", "elios", "ella", "emoros", "eneon", "eneus", "entus", "eon", "eonia",
    "eonis", "ephyra", "erato", "eratus", "ere", "erium", "eron", "erra", "ex", "exus",
    "ia", "iarex", "ichthon", "idon", "ilia", "ilion", "ima", "imatra", "ina", "ion",
    "ios", "ipolis", "irra", "is", "isaurum", "isilva", "ithos", "ius", "oclia", "ocris",
    "odon", "olis", "olith", "on", "onexus", "onis", "onox", "onyx", "or", "ora",
    "oria", "oros", "os", "oterra", "otos", "ox", "ubra", "ulon", "ulos", "urox",
    "us", "usis", "usmaris", "ux", "ygia", "ympus", "ys", "ythos", "ythron", "yx"
  ],
  
  planetNames: [
    "Corinath", "Mardestine", "Poxor", "Faergonh", "Bal'poex", 
    "Hurs-V", "Laerdwu", "Muwh_13", "Cirgo", "Cordinnia", 
    "Gornath", "Jagost", "Xirnoth", "Qul", "Otr System", 
    "Rusgith Major", "Sartun", "Dornsu", "Vilnix", "Lormae 6"
  ],

  settlementNames: [
    "Ger / -atoom", "Nabeck / -rikaant", "Dablar / -ordest", "Grim / -cite",
    "Saar / -tex", "Hyro / -avor", "Popwa / -dorp", "Urvok / Outpost",
    "Vandirg / City", "Tar / Station"
  ],

  // Split settlement names for multi-roll (d10 each)
  settlementNamePrefixes: [
    "Ger", "Nabeck", "Dablar", "Grim", "Saar", 
    "Hyro", "Popwa", "Urvok", "Vandirg", "Tar"
  ],
  
  settlementNameSuffixes: [
    "-atoom", "-rikaant", "-ordest", "-cite", "-tex", 
    "-avor", "-dorp", "Outpost", "City", "Station"
  ],

  legionaryNames: [
    "Aelia / Albus", "Caelia / Calvus", "Decima / Domitius", "Fabricia / Faustus",
    "Galla / Gaius", "Juliana / Jovian", "Marcella / Maximus", "Sabina / Scorpio",
    "Tatiana / Tiberius", "Vita / Virgil"
  ],

  bountyHunterNames: [
    "Harkin 'The Red'", "Graven", "Boris Deadlock", "Ragna Nebula",
    "Cassandra Syko", "Sskob", "Scotch Torga", "H3-0"
  ],

  crimeLordNames: [
    "Andras 'the Duke'", "Witch of Baa", "Blood Prince Odaros", "'Crusher' Vuul",
    "Shax 'Kingpin of Krysar'", "Dr. Raum", "Brainy Zelez", "Voynix 'the Bookie'",
    "'Numbers'", "Yurdra 'the Jeweler'"
  ],

  pirateCrewNames: [
    "Bloody Bots", "Gnar Dogs", "Rogue Gang", "Lost Squad", "Shiver Hellions",
    "Dread Posse", "Wicked Raiders", "Skull Scoundrels", "Deep Legends", "Wild Pirates"
  ]
};

// ==========================================
// 7. CHARACTER CREATION
// ==========================================

export const characterOracles = {
  // 3d6 Bobs (Starting Items)
  bobsWeapons: [
    "Utility Knife (D4 damage)",
    "Upcycled Staff (D4 damage)",
    "Modified Shock Baton (D6, shoddy)",
    "Pocket Blaster (D6, reload)",
    "Old Service Blaster (D6 damage)",
    "Busted Blaster Rifle (D8, bulky, shoddy)"
  ],
  bobsGear: [
    "Deck of Hologram Playing Cards",
    "Binocular with Laser Microphone",
    "Legionary Bot Head (answers one question, then explodes D8)",
    "Space Helmet with 5 minutes of air",
    "Counterfeit Bits",
    "Collapsible Gravbike (shoddy)"
  ],
  bobsArmor: [
    "Tattered Robes over a Tunic",
    "Scuffed Boots and Smudged Goggles",
    "Patched-up Flight Suit",
    "Bandoleer and Vest",
    "Scarf and Leather Jacket (tier 1, -D2)",
    "Scavenged Bot Plate Armor (tier 2, -D4)"
  ],
  
  // Roll d10
  galacticSpecies: [
    "Baseline Human", "Woolly Anthrosquatch", "Fish-eyed Ichthyoid", "Scaley Lacertian",
    "Flatheaded Tricladid", "Runtish Zinto", "Sucker-lipped Anuran", "Flightless Macrobat",
    "Lithe Pseudopoid", "Little Ursanid"
  ],

  // Roll d10
  rebelMotivations: [
    "Destroy criminal record database.",
    "Free long lost twin from prison.",
    "Find cure for pet space lizard.",
    "Solve cold case of what happened years ago.",
    "Convince childhood friend to defect.",
    "Revenge on elusive adversary.",
    "Repay favor to Rebel General.",
    "Prove you aren't a low-life.",
    "Protect best pal on the mission.",
    "Atonement: You caused this crisis."
  ],

  // Roll d6
  nicks: [
    "Hilt of Magi Blazer Sword (2D6 damage)",
    "Polished breastplate with family crest (Tier 2, -D4)",
    "Pair of blaster pistols and badge (2D4 damage)",
    "Disintegrator rifle (D8, reload)",
    "Coded research notes on Legion Superweapon",
    "Signet ring of noble house"
  ],

  // Roll d6
  knacks: [
    "Burdogs Body (Roll highest stat when following orders)",
    "Busker (Techno-harp distraction)",
    "Bootshiner (Blend in)",
    "Cutpurse (Sticky fingers)",
    "Tinkerer (Understand bots)",
    "Mucker (Search garbage)"
  ],
  
  // The "Broken" Table (When HP hits 0) - Roll d4
  broken: [
    { roll: 1, result: "Unconscious D4 rounds, awaken with D4 HP." },
    { roll: 2, result: "Roll D6: 1–3 Broken Limb, 4–5 Severed Limb, 6 Lost Eye. Unconscious D4 rounds." },
    { roll: 3, result: "Severe Injury! Death in 1 hour unless treated. All tests DR16/DR18." },
    { roll: 4, result: "Dead! Roll a new Rebel." }
  ]
};

// ==========================================
// 8. CLASS SPECIFIC TABLES
// ==========================================

export const classOracles = {
  botFunctions: [
    "Protocol (Translate/Bureaucracy)", "Porter (Lifting/Hauling)", "Supervisor (Tiny repair bot)",
    "Computer Interface (Talk to systems)", "Power (Walking battery)", "Surveillance (Fly/Scan)"
  ],
  botMalfunctions: [
    "Exterminate (Attack randoms)", "Warning Critical Error (Freeze)", "Bugged Audio (Repeat words)",
    "Archived Memories (Wrong function)", "Trick Leg (Dislocate)", "Screw Loose (No stealth)"
  ],
  botMods: [
    "Retractable Bone Saw", "Smuggling Compartment", "Comm Scrambler",
    "Legion Cypher", "Trash Compactor Torso", "Self Destruct"
  ],
  bountyHunterSkills: [
    "Rough Rider (Ride anything)", "Escape Artist (Slip bonds)", "Deserter (Know Legion tactics)",
    "Tracker (Find prey)", "Bouncer (Unarmed combat)", "Armorer (Start with Tier 3 Armor)"
  ],
  bountyHunterSoftSpots: [
    "Helpless little creatures.", "Youthful whippersnappers.", "Simple folk making ends meet.",
    "Mistreated bots.", "Elderly curmudgeons.", "Wounded veterans."
  ],
  heirloomWeapons: [
    "Grapple Whip", "Flamethrower", "Jetpack",
    "Ray Shielding", "Sawed Off Repeater", "Disintegration Rifle"
  ],
  magiArts: [
    "Mind Muddle", "Magi Hand", "Blaster Deflect", "Healing Touch"
  ],
  burnerIdentities: [
    "Powder Miner", "Wasteland Scavenger", "Vapor Farmer",
    "Vagabond", "Reclusive Healer", "Barfly"
  ],
  smugglerTricks: [
    "Ceramic Knife", "Eyeball Blaster", "Psychogun",
    "Monofilament Garrote", "Sonic Grenade", "Vapor Tooth"
  ],
  smugglerTrades: [
    "Engineered Organs", "Frozen Bone Crabs", "Particle Warheads",
    "Hyper Mushrooms", "Gravity Magnet", "Rogue Bot Mind"
  ],
  technicianScratchBuilds: [
    "Hyperspace Transporter Pack", "Zero Blaster", "Gravity Disruptor",
    "Cloaking Device", "Machine Mind Dominator", "Devastator Fist"
  ],
  technicianHyperFixations: [
    "Hologram Emitters", "Bot Optical Lenses", "Space Suit Respirators",
    "Hyperdrive Ignition Switches", "High Explosives", "Speeder Hood Ornaments"
  ],
  youngsterKnocks: [
    "Explosion took out auntie/uncle.", "Grandparents caught in crossfire.", "Caretaker bot fell off bridge.",
    "Circus troupe trampled.", "Wise old healer beheaded.", "Moonbase AI virus."
  ]
};

// ==========================================
// 9. GM GUIDE EXTRAS (Enemies & Loot)
// ==========================================

export const gmExtras = {
  // Roll d6
  warBuilds: [
    "Bot Mind (Jamming vulnerability)", "Walker (Trip vulnerability)", "Hover (Collision vulnerability)",
    "Energy Deflectors (Explosive vulnerability)", "Tank Treads (Immobile vulnerability)", "Stationary (Blindspot vulnerability)"
  ],
  
  // Roll d6
  fighterBuilds: [
    "Sleek Interceptor", "Bulky Interdictor", "Flying Wing",
    "Twin-Seat Bomber", "Recon Bot Saucer", "Armor-Plated Hull"
  ],
  
  // Roll d8
  spaceJunk: [
    "Scrapped Bot parts", "Dim Fusion Lantern", "Glitched Data Pad", "Discarded Key Card",
    "Flimsy Trip Mine", "Shoddy Blaster D6", "Broken Blazer Sword", "Bits"
  ]
};

// ==========================================
// 10. MONSTERS & BEASTS
// ==========================================

export const monsterOracles = {
  // Alien Beast Adaptations (GM Guide p.16)
  beastAdaptations: [
    "Stalker: Always attacks first.",
    "Ferocious: Attacks twice per round (DR10 to hit).",
    "Stinger: D6 damage + D2 next round.",
    "Carapace: Armor tier 3 -D6.",
    "Bile: Regurgitates acid puddles (D10).",
    "Wings: DR14 to hit with melee attacks."
  ],

  // Space Monstrosity Adaptations (GM Guide p.17)
  monstrosityAdaptations: [
    "Calcified Shell: Can only target Weak Spot with Melee.",
    "Gigantic: Double damage attacks, Rebels defend with Advantage.",
    "Horrid: Rebels test PRS DR12 or skip first turn.",
    "Bioelectric: Melee attackers take D6 damage.",
    "Venomous: Target suffers D2 damage every turn until treated.",
    "Jaws: Bite holds target (D6/turn), STR DR14 to escape."
  ],

  // Monstrosity Weak Spots
  weakSpots: [
    "Glowing Eye", "Pulsating Core", "Soft Underbelly",
    "Old Wound", "Open Mouth", "Missing Exoskeleton Plate"
  ],

  // Monstrous Names (2d10)
  monsterNames: {
    prefix: ["Rukkadon", "Wroat", "Irragorr", "Phyto", "Vorpal", "Xith", "Kanth", "Jadoon", "Balo", "Zodan"],
    suffix: ["Beast", "Kraken", "Raptor", "Worm", "Dragon", "Hound", "Brute", "Beak", "Hog", "Crawler"]
  }
};

// ==========================================
// 11. EQUIPMENT & SHIP UPGRADES
// ==========================================

export const equipmentOracles = {
  // Ship Upgrades (Rebel Handbook p.26)
  torpedoes: [
    "Cluster Torpedo (up to 3 targets)",
    "Hunter-Killer Torpedo (Advantage to hit/dam)",
    "Chaff Torpedo (Defensive advantage)",
    "Ion Torpedo (Reduces shield tier)"
  ],
  turrets: [
    "Gravity Catapult (Throws bulky objects)",
    "Hyper Railgun (Ignores armor)"
  ],
  shipMisc: [
    "Smuggling Compartments",
    "Asteroid Mining Drill",
    "Harpoon and Tow Cable",
    "Hyperspace Destabilizer"
  ],

  // Full Equipment List (Rebel Handbook p.23)
  meleeWeapons: [
    "Knife (D4)", "Chain Whip (D4)", "Slash Staff (D4)", 
    "Quakehammer (D6)", "Taser Baton (D6)", "Rivet Gun (D8, bulky)", 
    "Sonic Mining Drill (D8, bulky)", "Battle Axe (D8, bulky)", "Blazer Sword (2D6)"
  ],
  rangedWeapons: [
    "Hold-Out Blaster (D4)", "Blaster Pistol (D6)", "Blaster Rifle (D8, bulky)",
    "Scatter Blaster (2D4, blast)", "Bolt Caster (D10, bulky)", "Rocket Launcher (D12, blast)"
  ],
  gear: [
    "Magnetic Boots", "Grapple Hook", "Repair Toolkit", "Battery Lamp",
    "Lockpicking Kit", "Grav-Lock Manacles", "Stimpack", "Shortwave Communicator"
  ],
  
  // Enemy Equipment
  enemyRangedWeapons: [
    "Lightning Rifle (D6, bulky, shoddy, ignores armor)",
    "Flame Rifle (D8, bulky, blast, ignores cover)",
    "Cluster Rockets (2D6, bulky, reload, blast)"
  ],
  enemyMeleeWeapons: [
    "Gravity Claws (D4, spider climb, advantage STR)",
    "Lightning Spear (D6, bulky, shoddy, ignores armor)",
    "Gravity Hammer (D8, advantage vs armor/bulky)"
  ],
  enemyMisc: [
    "Booster Pack (Hover, explode on death)",
    "Optic Camo (Test PRS DR12 to spot)",
    "Laser Cutter (D8, cuts bulkheads)",
    "Deflector Shield (Disadvantage on first hit)"
  ],
  
  // Crime Lord Weapons
  dastardlyWeapons: [
    "Homing Missile (D6, DR14 to dodge)",
    "Laser Eye Beams (D6, fire at any time)",
    "Bits Blaster (D8, fires currency)",
    "Repeating Bolt Caster (D10, bulky, no reload)"
  ],
  lordlyVisages: [
    "Bloated slug with stimulant gas tanks.",
    "Enormous pulsating brain in a jar.",
    "Bickering two-headed bot.",
    "Colossal hologram (real body hidden).",
    "Battle-scarred Legionary dragoon.",
    "Slobbering chitinous queen in royal jelly."
  ],
  criminalBases: [
    "Souped-up spaceship orbiting a blackhole.",
    "Floating palace in gas giant tempest.",
    "Grand penthouse on throne world.",
    "Decommissioned military fortress.",
    "Submersible arena on swamp world.",
    "Sewage nexus station beneath starport."
  ]
};

// ==========================================
// 12. ENEMY STAT TEMPLATES (Reference)
// ==========================================

export const enemyStats = {
  personnel: [
    { name: "Minion", hp: "6-12", morale: "7", armor: "None", weapon: "Blaster D6", notes: "Rebels roll DR12 AGI to dodge." },
    { name: "Leader", hp: "12-24", morale: "10", armor: "Tier 2 (-D4)", weapon: "D8 or D10", notes: "Rebels roll DR14 AGI to dodge." },
    { name: "Legionary Foot Soldier", hp: "6 (Fodder)", morale: "6 (Squad 8)", armor: "Tier 1 (-D2)", weapon: "Blaster D6", notes: "Dies in 1 hit." },
    { name: "Legionary Officer", hp: "6", morale: "9", armor: "None", weapon: "Sidearm D6", notes: "Calls D4 backup." },
    { name: "War Bot", hp: "12", morale: "-", armor: "Tier 2 (-D4)", weapon: "Blaster D6", notes: "Ceaseless." },
    { name: "Dragoon (Elite)", hp: "40", morale: "10", armor: "Tier 2 (-D4)", weapon: "Blazer Sword 2D6", notes: "Magi Arts. DR14 to defend." },
    { name: "Space Pirate", hp: "8", morale: "7", armor: "None", weapon: "Blaster D6", notes: "Slippery." },
    { name: "Bounty Hunter (Elite)", hp: "14", morale: "10", armor: "Tier 2 (-D4)", weapon: "Pulse Rifle D6+1", notes: "Greedy." }
  ],
  ships: [
    { name: "Hunter Fighter", hp: "6 (Fodder)", morale: "7", armor: "None", weapon: "Turbo Laser D6", notes: "Mass Produced." },
    { name: "Predator Leader", hp: "12", morale: "10", armor: "Tier 2 (-D4)", weapon: "Particle Beam D8", notes: "Elite." },
    { name: "Dreadnought", hp: "Impervious", morale: "-", armor: "-", weapon: "Batteries D10", notes: "Plot device ship." },
    { name: "Pirate Marauder", hp: "12", morale: "7", armor: "Tier 1 (-D2)", weapon: "Twin Turrets D8", notes: "Boarding Airlock." }
  ],
  monsters: [
    { name: "Alien Beast", hp: "12", morale: "9", armor: "Tier 1 (-D2)", weapon: "Bite/Claw D8", notes: "Wilds." },
    { name: "Space Monstrosity", hp: "45", morale: "10", armor: "Carapace -D8", weapon: "Tusk/Talon D10", notes: "Weak Spot DR16." }
  ]
};

// ==========================================
// 13. TITLE GENERATORS (Campaign/Episode Names)
// ==========================================

export const titleGenerators = {
  // Roll d6 for each column to build a title (e.g., "The Cosmic War")
  theEpic: {
    col1: ["The", "The", "The", "A", "A", "Attack"],
    col2: ["New", "Rise", "Fall", "Last", "Void", "Prophecy"],
    col3: ["Hope", "Empire", "Cosmic", "Ascending", "Shadow", "Sword"],
    col4: ["Prophet", "War", "Gambit", "Star", "Gods", "Exile"]
  },
  
  // Roll d6 for each column
  theEpisode: {
    col1: ["The", "The", "The", "A", "A", "NPC Name"],
    col2: ["Cage", "Trap", "Flight", "Final", "Doppelganger", "Errand"],
    col3: ["Dagger", "Plot", "Operation", "Metamorphosis", "Journey", "Hidden"],
    col4: ["Doom", "Arena", "Garden", "Separation", "Home", "Sacrifice"]
  }
};

// ==========================================
// 14. VISUAL ORACLES (Inspiration Prompts)
// ==========================================

export const visualOracles = {
  // Boost Oracle (Icons converted to text concepts) - Page 20 Solo Rules
  boost: [
    "Star / Compass / Direction", "Skull / Death / Danger", "Blaster / Attack / Conflict", "Droid / Tech / AI",
    "Atom / Science / Energy", "Cloak / Hidden / Secret", "Monster / Beast / Wild", "Arrow / Up / Rise",
    "Remote / Control / Signal", "Mask / Deception / Persona", "Planet / World / Environment", "TIE Fighter / Enemy / Empire",
    "Hand / Stop / Help", "Spiral / Confusion / Hypnosis", "Card / Chance / Gamble", "Boot / Kick / Travel",
    "Mushrooms / Nature / Growth", "Trash / Container / Loot", "Radar / Search / Scan", "Saber / Weapon / Power"
  ]
};

// ==========================================
// 15. CRIMINAL ORACLES (Crime Lords & Criminals)
// ==========================================

export const criminalOracles = {
  // Bounty Hunter Soft Spots (Rebel Handbook p.9) - Already in classOracles but duplicated here for organization
  softSpots: [
    "Helpless little creatures.", "Youthful whippersnappers.", "Simple folk making ends meet.",
    "Mistreated bots.", "Elderly curmudgeons.", "Wounded veterans."
  ],
  
  // Crime Lord Details (GM Guide p.14-15) - Already in equipmentOracles but duplicated here for organization
  dastardlyWeapons: [
    "Homing Missile (D6, DR14 to dodge)",
    "Laser Eye Beams (D6, fire at any time)",
    "Bits Blaster (D8, fires currency)",
    "Repeating Bolt Caster (D10, bulky, no reload)"
  ],
  lordlyVisages: [
    "Bloated slug with stimulant gas tanks.",
    "Enormous pulsating brain in a jar.",
    "Bickering two-headed bot.",
    "Colossal hologram (real body hidden).",
    "Battle-scarred Legionary dragoon.",
    "Slobbering chitinous queen in royal jelly."
  ],
  criminalBases: [
    "Souped-up spaceship orbiting a blackhole.",
    "Floating palace in gas giant tempest.",
    "Grand penthouse on throne world.",
    "Decommissioned military fortress.",
    "Submersible arena on swamp world.",
    "Sewage nexus station beneath starport."
  ]
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Roll dice
export function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Roll multiple dice
export function rollMultipleDice(count, sides) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDice(sides));
  }
  return rolls;
}

// Roll on an array-based table
export function rollOnTable(table) {
  if (!table || table.length === 0) {
    return 'Table not found or empty';
  }
  return table[Math.floor(Math.random() * table.length)];
}

// Roll on the d20 affirmation oracle
export function rollAffirmation() {
  const roll = rollDice(20);
  
  // Map roll to result
  if (roll === 1) return { roll, ...soloOracles.affirmation["1"] };
  if (roll >= 2 && roll <= 3) return { roll, ...soloOracles.affirmation["2-3"] };
  if (roll >= 4 && roll <= 5) return { roll, ...soloOracles.affirmation["4-5"] };
  if (roll >= 6 && roll <= 7) return { roll, ...soloOracles.affirmation["6-7"] };
  if (roll >= 8 && roll <= 9) return { roll, ...soloOracles.affirmation["8-9"] };
  if (roll >= 10 && roll <= 11) return { roll, ...soloOracles.affirmation["10-11"] };
  if (roll >= 12 && roll <= 13) return { roll, ...soloOracles.affirmation["12-13"] };
  if (roll >= 14 && roll <= 15) return { roll, ...soloOracles.affirmation["14-15"] };
  if (roll >= 16 && roll <= 17) return { roll, ...soloOracles.affirmation["16-17"] };
  if (roll >= 18 && roll <= 19) return { roll, ...soloOracles.affirmation["18-19"] };
  if (roll === 20) return { roll, ...soloOracles.affirmation["20"] };
}

// Roll on event oracle
export function rollEventOracle() {
  // Roll each field independently for more permutations
  const verbRoll = rollDice(20);
  const subjectRoll = rollDice(20);
  const descRoll = rollDice(20);
  const activityRoll = rollDice(20);
  const omenRoll = rollDice(20);
  const specificRoll = rollDice(6);
  
  return {
    roll: verbRoll, // Keep for backward compatibility with logging
    verbRoll,
    subjectRoll,
    descRoll,
    activityRoll,
    omenRoll,
    specificRoll,
    verb: soloOracles.eventOracle[verbRoll - 1].verb,
    subject: soloOracles.eventOracle[subjectRoll - 1].subject,
    description: soloOracles.eventOracle[descRoll - 1].description,
    activity: soloOracles.eventOracle[activityRoll - 1].activity,
    omen: soloOracles.eventOracle[omenRoll - 1].omen,
    specific: soloOracles.eventSpecific[specificRoll - 1]
  };
}

// Roll scene shakeup (d20 + threat modifier)
// First roll d20 + Threat to check if shakeup occurs (15+)
// If successful, determine which shakeup happens
export function rollSceneShakeup(threatDie = 1) {
  const checkRoll = rollDice(20);
  const total = checkRoll + threatDie;
  const success = total >= 15;
  
  let shakeupResult = null;
  if (success) {
    // Roll again on the shakeup table (d20 + Threat)
    const shakeupD20 = rollDice(20);
    const shakeupTotal = shakeupD20 + threatDie;
    const index = Math.min(shakeupTotal - 1, soloOracles.sceneShakeup.length - 1);
    shakeupResult = {
      d20: shakeupD20, // Display the d20 roll
      roll: shakeupTotal, // Total for table lookup
      result: soloOracles.sceneShakeup[index]
    };
  }
  
  return { 
    checkRoll,
    threatDie,
    total,
    success,
    shakeup: shakeupResult
  };
}

// Generate a mission - multi-roll for more permutations
export function generateMission() {
  const typeRoll = rollDice(missionGenerators.missionType.length);
  const goodsRoll = rollDice(missionGenerators.missionGoods.length);
  const spotRoll = rollDice(missionGenerators.missionSpot.length);
  const rewardRoll = rollDice(missionGenerators.missionReward.length);
  
  return {
    typeRoll,
    goodsRoll,
    spotRoll,
    rewardRoll,
    type: missionGenerators.missionType[typeRoll - 1],
    goods: missionGenerators.missionGoods[goodsRoll - 1],
    spot: missionGenerators.missionSpot[spotRoll - 1],
    reward: missionGenerators.missionReward[rewardRoll - 1]
  };
}

// Generate quick mission - multi-roll for more permutations
export function generateQuickMission() {
  const actionRoll = rollDice(missionGenerators.quickMission.length);
  const targetRoll = rollDice(missionGenerators.quickTarget.length);
  
  return {
    actionRoll,
    targetRoll,
    action: missionGenerators.quickMission[actionRoll - 1],
    target: missionGenerators.quickTarget[targetRoll - 1]
  };
}

// Generate villain - multi-roll for more permutations
export function generateVillain() {
  const villainRoll = rollDice(missionGenerators.villain.length);
  const goalRoll = rollDice(missionGenerators.villainGoal.length);
  const planRoll = rollDice(missionGenerators.villainPlan.length);
  const meansRoll = rollDice(missionGenerators.villainMeans.length);
  
  return {
    villainRoll,
    goalRoll,
    planRoll,
    meansRoll,
    villain: missionGenerators.villain[villainRoll - 1],
    goal: missionGenerators.villainGoal[goalRoll - 1],
    plan: missionGenerators.villainPlan[planRoll - 1],
    means: missionGenerators.villainMeans[meansRoll - 1]
  };
}

// Generate NPC
export function generateNPC() {
  // Multi-roll - each field rolls independently for more permutations
  const roleRoll = rollDice(npcOracles.npcRoles.length);
  const speciesRoll = rollDice(npcOracles.npcSpecies.length);
  const motivationRoll = rollDice(npcOracles.npcMotivations.length);
  const secretRoll = rollDice(npcOracles.npcSecrets.length);
  const traitRoll = rollDice(npcOracles.npcTraits.length);
  const demeanorRoll = rollDice(npcOracles.npcDemeanor.length);
  
  return {
    roleRoll,
    speciesRoll,
    motivationRoll,
    secretRoll,
    traitRoll,
    demeanorRoll,
    role: npcOracles.npcRoles[roleRoll - 1],
    species: npcOracles.npcSpecies[speciesRoll - 1],
    motivation: npcOracles.npcMotivations[motivationRoll - 1],
    secret: npcOracles.npcSecrets[secretRoll - 1],
    trait: npcOracles.npcTraits[traitRoll - 1],
    demeanor: npcOracles.npcDemeanor[demeanorRoll - 1]
  };
}

// Generate planet - multi-roll for more permutations
export function generatePlanet() {
  const terrainRoll = rollDice(worldOracles.planetTerrain.length);
  const weatherRoll = rollDice(worldOracles.planetWeather.length);
  const colorRoll = rollDice(worldOracles.planetColor.length);
  const populationRoll = rollDice(worldOracles.planetPopulation.length);
  const controlRoll = rollDice(worldOracles.planetControl.length);
  const nameRoll = rollDice(nameOracles.planetNames.length);
  
  return {
    terrainRoll,
    weatherRoll,
    colorRoll,
    populationRoll,
    controlRoll,
    nameRoll,
    terrain: worldOracles.planetTerrain[terrainRoll - 1],
    weather: worldOracles.planetWeather[weatherRoll - 1],
    color: worldOracles.planetColor[colorRoll - 1],
    population: worldOracles.planetPopulation[populationRoll - 1],
    control: worldOracles.planetControl[controlRoll - 1],
    name: nameOracles.planetNames[nameRoll - 1]
  };
}

// Generate settlement - multi-roll for more permutations
export function generateSettlement() {
  const appearanceRoll = rollDice(worldOracles.settlementAppearance.length);
  const knownForRoll = rollDice(worldOracles.settlementKnownFor.length);
  const currentStateRoll = rollDice(worldOracles.settlementCurrentState.length);
  const complicationRoll = rollDice(worldOracles.settlementComplication.length);
  const leaderRoll = rollDice(worldOracles.settlementLeader.length);
  const landmarkRoll = rollDice(worldOracles.settlementLandmark.length);
  const rumorsRoll = rollDice(worldOracles.settlementRumors.length);
  const hookupsRoll = rollDice(worldOracles.settlementHookups.length);
  const namePrefixRoll = rollDice(nameOracles.settlementNamePrefixes.length);
  const nameSuffixRoll = rollDice(nameOracles.settlementNameSuffixes.length);
  
  const prefix = nameOracles.settlementNamePrefixes[namePrefixRoll - 1];
  const suffix = nameOracles.settlementNameSuffixes[nameSuffixRoll - 1];
  const name = `${prefix}${suffix}`;
  
  return {
    appearanceRoll,
    knownForRoll,
    currentStateRoll,
    complicationRoll,
    leaderRoll,
    landmarkRoll,
    rumorsRoll,
    hookupsRoll,
    namePrefixRoll,
    nameSuffixRoll,
    appearance: worldOracles.settlementAppearance[appearanceRoll - 1],
    knownFor: worldOracles.settlementKnownFor[knownForRoll - 1],
    currentState: worldOracles.settlementCurrentState[currentStateRoll - 1],
    complication: worldOracles.settlementComplication[complicationRoll - 1],
    leader: worldOracles.settlementLeader[leaderRoll - 1],
    landmark: worldOracles.settlementLandmark[landmarkRoll - 1],
    rumors: worldOracles.settlementRumors[rumorsRoll - 1],
    hookups: worldOracles.settlementHookups[hookupsRoll - 1],
    name
  };
}

// Generate scene - multi-roll for more permutations
export function generateScene() {
  const locationRoll = rollDice(worldOracles.sceneLocation.length);
  const toneRoll = rollDice(worldOracles.sceneTone.length);
  const obstacleRoll = rollDice(worldOracles.sceneObstacle.length);
  
  return {
    locationRoll,
    toneRoll,
    obstacleRoll,
    location: worldOracles.sceneLocation[locationRoll - 1],
    tone: worldOracles.sceneTone[toneRoll - 1],
    obstacle: worldOracles.sceneObstacle[obstacleRoll - 1]
  };
}

// Generate travel encounter - multi-roll for more permutations
// First roll d20 + Threat to check if encounter occurs (12+)
// If successful, roll 2d10 for theme and actor
export function generateTravelEncounter(threatDie = 1) {
  const checkRoll = rollDice(20);
  const total = checkRoll + threatDie;
  const success = total >= 12;
  
  let encounterResult = null;
  if (success) {
    const themeRoll = rollDice(npcOracles.travelTheme.length);
    const actorRoll = rollDice(npcOracles.travelActor.length);
    encounterResult = {
      themeRoll,
      actorRoll,
      theme: npcOracles.travelTheme[themeRoll - 1],
      actor: npcOracles.travelActor[actorRoll - 1]
    };
  }
  
  return {
    checkRoll,
    threatDie,
    total,
    success,
    encounter: encounterResult
  };
}

// Roll dangerous location - each column rolls independently for more permutations
// Threat Die is used to determine if Obstacle is triggered (d20 + Threat >= 12)
export function rollDangerousLocation(threatDie = 1) {
  const shipRoll = rollDice(20);
  const baseRoll = rollDice(20);
  const obstacleRoll = rollDice(20);
  const searchRoll = rollDice(20);
  
  // Roll d20 + Threat. On 12+, obstacle is triggered
  const threatD20Roll = rollDice(20);
  const threatTotal = threatD20Roll + threatDie;
  const obstacleTriggered = threatTotal >= 12;
  
  return {
    shipRoll,
    baseRoll,
    obstacleRoll,
    searchRoll,
    threatRoll: threatD20Roll, // Display the d20 roll
    threatTotal, // Store the total for checks
    threatDie, // Store the threat die value
    obstacleTriggered,
    ship: dangerousLocations.features[shipRoll - 1].ship,
    base: dangerousLocations.features[baseRoll - 1].base,
    obstacle: dangerousLocations.features[obstacleRoll - 1].obstacle,
    search: dangerousLocations.features[searchRoll - 1].search
  };
}

// Generate monster name
export function generateMonsterName() {
  const prefix = rollOnTable(monsterOracles.monsterNames.prefix);
  const suffix = rollOnTable(monsterOracles.monsterNames.suffix);
  return `${prefix} ${suffix}`;
}

// Generate complete monster - all subtables at once
export function generateMonster() {
  const beastRoll = rollDice(6);
  const monstrosityRoll = rollDice(6);
  const weakSpotRoll = rollDice(6);
  const namePrefix = rollDice(monsterOracles.monsterNames.prefix.length);
  const nameSuffix = rollDice(monsterOracles.monsterNames.suffix.length);
  
  return {
    beastRoll,
    monstrosityRoll,
    weakSpotRoll,
    namePrefixRoll: namePrefix,
    nameSuffixRoll: nameSuffix,
    beast: monsterOracles.beastAdaptations[beastRoll - 1],
    monstrosity: monsterOracles.monstrosityAdaptations[monstrosityRoll - 1],
    weakSpot: monsterOracles.weakSpots[weakSpotRoll - 1],
    name: `${monsterOracles.monsterNames.prefix[namePrefix - 1]} ${monsterOracles.monsterNames.suffix[nameSuffix - 1]}`
  };
}

// Generate epic title - multi-roll for more permutations
export function generateEpicTitle() {
  const col1Roll = rollDice(titleGenerators.theEpic.col1.length);
  const col2Roll = rollDice(titleGenerators.theEpic.col2.length);
  const col3Roll = rollDice(titleGenerators.theEpic.col3.length);
  const col4Roll = rollDice(titleGenerators.theEpic.col4.length);
  
  return {
    col1Roll,
    col2Roll,
    col3Roll,
    col4Roll,
    col1: titleGenerators.theEpic.col1[col1Roll - 1],
    col2: titleGenerators.theEpic.col2[col2Roll - 1],
    col3: titleGenerators.theEpic.col3[col3Roll - 1],
    col4: titleGenerators.theEpic.col4[col4Roll - 1]
  };
}

// Generate episode title - multi-roll for more permutations
export function generateEpisodeTitle() {
  const col1Roll = rollDice(titleGenerators.theEpisode.col1.length);
  const col2Roll = rollDice(titleGenerators.theEpisode.col2.length);
  const col3Roll = rollDice(titleGenerators.theEpisode.col3.length);
  const col4Roll = rollDice(titleGenerators.theEpisode.col4.length);
  
  return {
    col1Roll,
    col2Roll,
    col3Roll,
    col4Roll,
    col1: titleGenerators.theEpisode.col1[col1Roll - 1],
    col2: titleGenerators.theEpisode.col2[col2Roll - 1],
    col3: titleGenerators.theEpisode.col3[col3Roll - 1],
    col4: titleGenerators.theEpisode.col4[col4Roll - 1]
  };
}

// Generate crime lord
export function generateCrimeLord() {
  const nameRoll = rollDice(nameOracles.crimeLordNames.length);
  const visageRoll = rollDice(criminalOracles.lordlyVisages.length);
  const weaponRoll = rollDice(criminalOracles.dastardlyWeapons.length);
  const baseRoll = rollDice(criminalOracles.criminalBases.length);
  
  return {
    nameRoll,
    visageRoll,
    weaponRoll,
    baseRoll,
    name: nameOracles.crimeLordNames[nameRoll - 1],
    visage: criminalOracles.lordlyVisages[visageRoll - 1],
    weapon: criminalOracles.dastardlyWeapons[weaponRoll - 1],
    base: criminalOracles.criminalBases[baseRoll - 1]
  };
}

// Generate ship name - combines first and second parts
export function generateShipName() {
  const firstPart = rollOnTable(nameOracles.shipNameFirstParts);
  const secondPart = rollOnTable(nameOracles.shipNameSecondParts);
  return `The ${firstPart}${secondPart}`;
}

// ==========================================
// INDIVIDUAL ROLL FUNCTIONS
// ==========================================

// Scene individual rolls
export function rollSceneLocation() {
  const roll = rollDice(worldOracles.sceneLocation.length);
  return {
    roll,
    result: worldOracles.sceneLocation[roll - 1]
  };
}

export function rollSceneTone() {
  const roll = rollDice(worldOracles.sceneTone.length);
  return {
    roll,
    result: worldOracles.sceneTone[roll - 1]
  };
}

export function rollSceneObstacle() {
  const roll = rollDice(worldOracles.sceneObstacle.length);
  return {
    roll,
    result: worldOracles.sceneObstacle[roll - 1]
  };
}

// Settlement name individual rolls
export function rollSettlementNamePrefix() {
  const roll = rollDice(nameOracles.settlementNamePrefixes.length);
  return {
    roll,
    result: nameOracles.settlementNamePrefixes[roll - 1]
  };
}

export function rollSettlementNameSuffix() {
  const roll = rollDice(nameOracles.settlementNameSuffixes.length);
  return {
    roll,
    result: nameOracles.settlementNameSuffixes[roll - 1]
  };
}

// ==========================================
// UNIFIED OPENING SCENE GENERATOR
// Combines Star Borg (d20) + Perilous Void (d10) = d30
// ==========================================

export function generateOpeningScene(includePV = true) {
  if (includePV) {
    // Roll d30: 1-20 Star Borg, 21-30 Perilous Void
    const roll = rollDice(30);
    
    if (roll <= 20) {
      // Star Borg opening scene (simple string)
      return {
        roll,
        result: soloOracles.openingScene[roll - 1],
        source: 'starBorg'
      };
    } else {
      // Perilous Void opening scene (structured with follow-up questions)
      const pvIndex = roll - 21; // 21->0, 22->1, ..., 30->9
      const pvScene = pvOpeningScenes[pvIndex];
      return {
        roll,
        incident: pvScene.incident,
        followUpQuestions: pvScene.followUpQuestions,
        source: 'perilousVoid'
      };
    }
  } else {
    // Roll d20: Star Borg only
    const roll = rollDice(20);
    return {
      roll,
      result: soloOracles.openingScene[roll - 1],
      source: 'starBorg'
    };
  }
}
