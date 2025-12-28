// ==========================================
// STAR BORG ORACLE COMPENDIUM
// Complete oracle tables from Solo Rules, GM Guide, and Rebel Handbook
// ==========================================

// ==========================================
// 1. SOLO PLAY ORACLES (The core engine)
// ==========================================

export const soloOracles = {
  affirmation: {
    "1": { result: "Extreme No", detail: "As bad as it can be", size: "Miniscule / One" },
    "2-3": { result: "No", detail: "It's Gnarly", size: "Small / Pair" },
    "4-5": { result: "No", detail: "Oof, What Now", size: "Handful (d4+1)" },
    "6-7": { result: "No", detail: "Could Use a Hand", size: "Several (d6+1)" },
    "8-9": { result: "No, but", detail: "Average", size: "Several (d6+1)" },
    "10-11": { result: "Random Event", detail: "Average", size: "Several (d6+2)" },
    "12-13": { result: "Yes, but", detail: "Average", size: "Several (d6+2)" },
    "14-15": { result: "Yes", detail: "I've Seen Better", size: "Several (d6+3)" },
    "16-17": { result: "Yes", detail: "I've Got This", size: "Patrol (d10+5)" },
    "18-19": { result: "Yes", detail: "The Good Stuff", size: "Unit (d20+10)" },
    "20": { result: "Extreme Yes", detail: "Top Shelf", size: "Gigantic / Too Many" }
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
    "Lurking Monster (Dump/Swamp).",
    "Ambush (Bounty Hunter with Net).",
    "Inclement Weather (Storms/Acid).",
    "Stink Bomb (Choking poison/paralysis).",
    "Tracking Device (Murder Bot inbound).",
    "A Mystery Unfolds (Go deeper)."
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
// 4. DANGEROUS LOCATIONS (Ship/Base)
// ==========================================

export const dangerousLocations = {
  // d20 Table
  features: [
    { roll: 1, ship: "Plain", base: "Dormitory", obstacle: "Bot", search: "Junk" },
    { roll: 2, ship: "Barracks", base: "Holding", obstacle: "Alarm", search: "Scrap" },
    { roll: 3, ship: "Pod Bay", base: "Storage", obstacle: "Enemy", search: "Bot Parts" },
    { roll: 4, ship: "Workshop", base: "Fighting Pit", obstacle: "Enemy", search: "Goods" },
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
  ]
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
  botNames: ["XT-64", "RY-90", "KT-37", "Q-88", "VV-42", "ZZT-5E", "L5R-02", "NTH-16", "ALT-F4", "TM-006"],
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
  const roll = rollDice(20);
  return soloOracles.eventOracle[roll - 1];
}

// Roll scene shakeup (d20 + threat modifier)
export function rollSceneShakeup(threatDie = 1) {
  const roll = rollDice(20) + threatDie;
  const index = Math.min(roll - 1, soloOracles.sceneShakeup.length - 1);
  return { roll, result: soloOracles.sceneShakeup[index] };
}

// Generate a mission
export function generateMission() {
  return {
    type: rollOnTable(missionGenerators.missionType),
    goods: rollOnTable(missionGenerators.missionGoods),
    spot: rollOnTable(missionGenerators.missionSpot),
    reward: rollOnTable(missionGenerators.missionReward)
  };
}

// Generate quick mission
export function generateQuickMission() {
  return {
    action: rollOnTable(missionGenerators.quickMission),
    target: rollOnTable(missionGenerators.quickTarget)
  };
}

// Generate villain
export function generateVillain() {
  return {
    villain: rollOnTable(missionGenerators.villain),
    goal: rollOnTable(missionGenerators.villainGoal),
    plan: rollOnTable(missionGenerators.villainPlan),
    means: rollOnTable(missionGenerators.villainMeans)
  };
}

// Generate NPC
export function generateNPC() {
  return {
    role: rollOnTable(npcOracles.npcRoles),
    species: rollOnTable(npcOracles.npcSpecies),
    motivation: rollOnTable(npcOracles.npcMotivations),
    secret: rollOnTable(npcOracles.npcSecrets),
    trait: rollOnTable(npcOracles.npcTraits),
    demeanor: rollOnTable(npcOracles.npcDemeanor)
  };
}

// Generate planet
export function generatePlanet() {
  return {
    terrain: rollOnTable(worldOracles.planetTerrain),
    weather: rollOnTable(worldOracles.planetWeather),
    color: rollOnTable(worldOracles.planetColor),
    population: rollOnTable(worldOracles.planetPopulation),
    control: rollOnTable(worldOracles.planetControl),
    name: rollOnTable(nameOracles.planetNames)
  };
}

// Generate settlement
export function generateSettlement() {
  return {
    appearance: rollOnTable(worldOracles.settlementAppearance),
    knownFor: rollOnTable(worldOracles.settlementKnownFor),
    currentState: rollOnTable(worldOracles.settlementCurrentState),
    complication: rollOnTable(worldOracles.settlementComplication),
    name: rollOnTable(nameOracles.settlementNames)
  };
}

// Generate scene
export function generateScene() {
  return {
    location: rollOnTable(worldOracles.sceneLocation),
    tone: rollOnTable(worldOracles.sceneTone),
    obstacle: rollOnTable(worldOracles.sceneObstacle)
  };
}

// Generate travel encounter
export function generateTravelEncounter() {
  return {
    theme: rollOnTable(npcOracles.travelTheme),
    actor: rollOnTable(npcOracles.travelActor)
  };
}

// Roll dangerous location
export function rollDangerousLocation() {
  const roll = rollDice(20);
  return { roll, ...dangerousLocations.features[roll - 1] };
}

// Generate monster name
export function generateMonsterName() {
  const prefix = rollOnTable(monsterOracles.monsterNames.prefix);
  const suffix = rollOnTable(monsterOracles.monsterNames.suffix);
  return `${prefix} ${suffix}`;
}

// Generate epic title
export function generateEpicTitle() {
  return {
    col1: rollOnTable(titleGenerators.theEpic.col1),
    col2: rollOnTable(titleGenerators.theEpic.col2),
    col3: rollOnTable(titleGenerators.theEpic.col3),
    col4: rollOnTable(titleGenerators.theEpic.col4)
  };
}

// Generate episode title
export function generateEpisodeTitle() {
  return {
    col1: rollOnTable(titleGenerators.theEpisode.col1),
    col2: rollOnTable(titleGenerators.theEpisode.col2),
    col3: rollOnTable(titleGenerators.theEpisode.col3),
    col4: rollOnTable(titleGenerators.theEpisode.col4)
  };
}

// Generate crime lord
export function generateCrimeLord() {
  return {
    name: rollOnTable(nameOracles.crimeLordNames),
    visage: rollOnTable(criminalOracles.lordlyVisages),
    weapon: rollOnTable(criminalOracles.dastardlyWeapons),
    base: rollOnTable(criminalOracles.criminalBases)
  };
}
