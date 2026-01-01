// ==========================================
// THE PERILOUS VOID ORACLES
// Source: The Perilous Void by Blackoath Entertainment
// ==========================================

import { rollDice } from './oracles';

// ==========================================
// OPENING SCENE (Page 29)
// Roll 1d10 to determine the immediate situation kicking off the session
// ==========================================

export const pvOpeningScenes = [
  {
    incident: "Imminent Annihilation. Your current location is about to be destroyed.",
    followUpQuestions: [
      "What's the source of potential destruction?",
      "What are the potential means of escape?"
    ]
  },
  {
    incident: "Alien Ambush. You're pinned down by hostile alien forces.",
    followUpQuestions: [
      "What do you know about the aliens?",
      "How have they gotten you in a tight spot?"
    ]
  },
  {
    incident: "Rescue. You're in the middle of saving an individual or group whose well-being is at risk.",
    followUpQuestions: [
      "Who are you rescuing?",
      "Who wants to stop you?",
      "What's the greatest obstacle you face?"
    ]
  },
  {
    incident: "Crash Landing. You've been forced to land your ship on a planet, moon, or asteroid.",
    followUpQuestions: [
      "Why are you being forced to make a crash landing?",
      "What dangers await you?"
    ]
  },
  {
    incident: "Boarding Action. A hostile force has just breached your ship's airlock.",
    followUpQuestions: [
      "Who or what is coming on board?",
      "What do they want from you?"
    ]
  },
  {
    incident: "Mutiny. A ship's crew revolts against their commanders.",
    followUpQuestions: [
      "Whose side are you on?",
      "What precipitated the revolt?",
      "What's at stake?"
    ]
  },
  {
    incident: "Blown Cover. You're deep undercover and hostile forces have discovered your identity.",
    followUpQuestions: [
      "Who were you deceiving?",
      "What was your cover?",
      "What's the immediate threat?"
    ]
  },
  {
    incident: "Heist Gone Wrong. You got what you came for, but now all hell's broken loose.",
    followUpQuestions: [
      "What are you stealing?",
      "What went wrong?",
      "Who or what is coming after you?"
    ]
  },
  {
    incident: "Biohazard Outbreak. A deadly virus has been released, and you're at ground zero.",
    followUpQuestions: [
      "What does the virus do?",
      "What protective measures can be taken to avoid its effects?"
    ]
  }
];

// ==========================================
// INCITING INCIDENT (Page 25)
// Roll 1d10 to determine the catalyst for the campaign narrative
// ==========================================

export const pvIncitingIncidents = [
  {
    incident: "Hostage Situation. Someone is being held by a hostile group, and they're in danger.",
    followUpQuestions: [
      "Who's being held hostage?",
      "Why do you need to help them?",
      "Who is the hostile group?"
    ]
  },
  {
    incident: "Biohazard Outbreak. A deadly pathogen has escaped containment.",
    followUpQuestions: [
      "Where was it being contained?",
      "What allowed it to escape?",
      "What does it do to people?"
    ]
  },
  {
    incident: "Diplomatic Sabotage. Peace talks between hostile factions are on the verge of collapse.",
    followUpQuestions: [
      "What factions are involved?",
      "Who's the saboteur?",
      "Whose side are you on?"
    ]
  },
  {
    incident: "Crash Landing. You've been forced to land your ship on a planet, moon, or asteroid.",
    followUpQuestions: [
      "Why are you being forced to make a crash landing?",
      "What dangers await you?"
    ]
  },
  {
    incident: "Planetary Invasion. You're caught in the path of a powerful invading force.",
    followUpQuestions: [
      "Who are the invaders?",
      "What is their objective?",
      "How can you escape alive?"
    ]
  },
  {
    incident: "Derelict Escape. You discovered something life-threatening aboard an abandoned hulk.",
    followUpQuestions: [
      "What were you looking for aboard the derelict?",
      "What threat did you discover?"
    ]
  },
  {
    incident: "Prison Break. You've broken someone out, and the authorities are in pursuit.",
    followUpQuestions: [
      "Who was in jail?",
      "Why did you break them out?",
      "How close are the authorities?"
    ]
  },
  {
    incident: "Interstellar Ambush. A hostile ship has issued a demand for your surrender.",
    followUpQuestions: [
      "Why are you vulnerable right now?",
      "Who among you knows the opposing ship's captain?"
    ]
  },
  {
    incident: "Imminent Impact. A rogue asteroid is on a collision course with your current location.",
    followUpQuestions: [
      "How can you possibly escape?",
      "What else will surely be destroyed?"
    ]
  },
  {
    incident: "Navigational Error. You've popped out of jumpspace too close to a stellar body.",
    followUpQuestions: [
      "Where and what is the stellar body?",
      "How can you escape its gravitational pull?"
    ]
  }
];

// ==========================================
// GENERATOR FUNCTIONS
// ==========================================

// ==========================================
// NPC NAMES (Page 166)
// Roll 1d100 for first part and 1d100 for second part
// ==========================================

export const pvNPCNameFirstParts = [
  "Ad", "Al", "Ala", "An", "Ar", "As", "Bal", "Ban", "Bol", "Bor",
  "Bra", "Bru", "Can", "Cin", "Cie", "Da", "Dal", "Das", "Dav", "Daz",
  "Dol", "Do", "Fan", "Fin", "Gar", "Gre", "Gro", "Ha", "Haz", "Hu",
  "Il", "In", "Is", "Jan", "Jel", "Ji", "Jil", "Jor", "Kal", "Kan",
  "Ke", "Ko", "La", "Lan", "Lar", "Le", "Lo", "Lor", "Lu", "Ma",
  "Mi", "Mol", "Mul", "No", "Ol", "On", "Or", "Os", "Pai", "Par",
  "Pir", "Pra", "Pru", "Ra", "Ras", "Re", "Ril", "Rin", "Rol", "Ron",
  "Sa", "San", "Shan", "Si", "Ta", "Ul", "Un", "Us", "Va", "Val",
  "Vaz", "Vel", "Ves", "Vi", "Vin", "Vu", "Vuz", "Wa", "Wan", "Was",
  "Wi", "Wu", "Xa", "Xi", "Yel", "Zal", "Zar", "Zil", "Zir", "Zor"
];

export const pvNPCNameSecondParts = [
  "", "", "", "", "", "", "", "", "", "",
  "a", "ab", "abe", "al", "als", "am", "an", "ana", "ar", "arn",
  "arna", "arra", "as", "ax", "be", "ca", "can", "car", "dar", "de",
  "dira", "da", "do", "dor", "dra", "", "e", "gana", "go", "i",
  "ia", "ib", "in", "inia", "io", "ios", "ira", "is", "issa", "ja",
  "jo", "ju", "k", "ka", "ko", "la", "lo", "lu", "mar", "mo",
  "mua", "na", "nar", "nor", "nora", "o", "on", "ona", "or", "ora",
  "", "ra", "ran", "ras", "rab", "", "s", "si", "sir", "sira",
  "sun", "ta", "tam", "tama", "tar", "than", "thana", "tir", "tira", "tor",
  "tora", "tu", "tyl", "tyn", "u", "un", "ura", "ust", "z", "zo"
];

// ==========================================
// NPC SURNAMES (Page 167)
// Roll 1d100 for first part and 1d100 for second part
// ==========================================

export const pvNPCSurnameFirstParts = [
  "A", "Al", "An", "Ar", "As", "Ba", "Ban", "Bar", "Be", "Ber",
  "Bi", "Blu", "Bran", "Bras", "Bri", "Brin", "Bro", "Bry", "Bur", "Cam",
  "Can", "Cas", "Cor", "Da", "Dan", "Del", "Des", "Dol", "Don", "Dor",
  "E", "El", "En", "Fil", "Fol", "Fon", "Gran", "Gren", "Gun", "Han",
  "Har", "Hin", "Hor", "I", "Il", "Jan", "Jin", "Jis", "Ka", "Kal",
  "Kan", "Kar", "Kil", "Kin", "Kla", "Klu", "Kol", "Kun", "La", "Lu",
  "Man", "Mi", "Min", "O", "Ol", "On", "Or", "Pan", "Par", "Por",
  "Qua", "Qui", "Quin", "Ra", "Re", "Ri", "Ru", "Sa", "Sar", "Shi",
  "Si", "Su", "Sun", "Tha", "Tham", "Thi", "Til", "Ty", "U", "Ul",
  "Un", "Ven", "Von", "Wil", "Win", "Ya", "Yar", "Yin", "Zan", "Zin"
];

export const pvNPCSurnameSecondParts = [
  "aleon", "ana", "and", "ard", "as", "au", "ban", "bar", "da", "dar",
  "daras", "darian", "dark", "daros", "das", "den", "dis", "dool", "dor", "een",
  "en", "ene", "fa", "fir", "fo", "for", "fu", "gar", "garas", "gas",
  "gir", "gis", "i", "if", "il", "in", "is", "jan", "janas", "jarian",
  "ka", "kar", "karas", "karian", "kark", "kaws", "ko", "kor", "la", "las",
  "lo", "ma", "mak", "mar", "maras", "marian", "mark", "mas", "mik", "mo",
  "nall", "nar", "ne", "nor", "noros", "o", "ool", "phas", "phe", "phes",
  "pho", "ra", "ra", "rand", "sard", "stee", "tar", "taras", "tarian", "taro",
  "to", "tor", "tos", "tyr", "ul", "um", "us", "vin", "vir", "yk",
  "za", "zar", "zaras", "zarian", "zel", "zil", "zir", "zo", "zor", "zu"
];

// ==========================================
// GENERIC SPACE OPERA NAMES (Page 161)
// Roll 1d100 for first part and 1d100 for second part
// ==========================================

export const pvSpaceOperaFirstParts = [
  "A", "Alder", "Ar", "Ash", "Bar", "Ber", "Bes", "Bik", "Bo", "Bosh",
  "Brak", "Bre", "Bri", "Bug", "Bur", "Cal", "Cam", "Car", "Cas", "Cha",
  "Chrys", "Cor", "Coz", "Crac", "Dab", "Dag", "Dun", "E", "El", "Far",
  "Fin", "Fir", "Fr", "Gab", "Gar", "Haa", "Han", "Har", "Hark", "Hol",
  "Jan", "Jar", "Jas", "Jaz", "Kam", "Kash", "Kav", "Kir", "Kish", "Kr",
  "Kul", "Lee", "Len", "Les", "Man", "Mar", "Min", "Mir", "Mon", "Mor",
  "Mur", "Murk", "Must", "Nab", "Nal", "Nan", "Neo", "Nin", "O", "On",
  "Op", "Oph", "Par", "Pell", "Pir", "Pos", "San", "Sar", "Sin", "Star",
  "Stel", "Swan", "Tal", "Tan", "Tar", "Tat", "Tin", "Tol", "U", "Un",
  "Ur", "Var", "Vir", "X", "Yan", "Yar", "Yin", "Zab", "Zan", "Zin"
];

export const pvSpaceOperaSecondParts = [
  "a", "aak", "aan", "aar", "adan", "adir", "ag", "agan", "al", "alan",
  "ar", "aria", "aris", "bad", "bar", "bin", "bor", "dar", "ellia", "en",
  "eng", "eria", "gar", "gath", "gir", "gith", "go", "gol", "gu", "i",
  "ic", "igar", "ilin", "in", "ina", "ing", "ino", "ir", "irin", "irra",
  "is", "it", "ix", "kar", "kat", "ken", "kir", "ko", "ma", "min",
  "mo", "na", "no", "o", "obah", "odan", "odir", "on", "onia", "onis",
  "oo", "oon", "or", "oris", "oro", "orra", "osia", "osis", "paar", "pan",
  "para", "pin", "ra", "ro", "sar", "sid", "sil", "silia", "silor", "sk",
  "sko", "taa", "tal", "thami", "thar", "thor", "to", "u", "ucidar", "un",
  "unc", "ung", "untor", "ur", "uria", "uscant", "ut", "yk", "zar", "zir"
];

// ==========================================
// SETTLEMENT/DISTRICT NAME COMPONENTS (Pages 162-163)
// ==========================================

export const pvSettlementQualities = [
  "Acceptance", "Air", "Anguish", "Awe", "Balance", "Beauty", "Belief", "Belonging", "Birth", "Bliss",
  "Calm", "Chaos", "Comfort", "Courage", "Creation", "Darkness", "Dawn", "Death", "Denial", "Desolation",
  "Despair", "Destiny", "Destruction", "Devotion", "Discovery", "Dismay", "Dream", "Dusk", "Earth", "Enlightenment",
  "Fate", "Fear", "Fire", "Fortune", "Freedom", "Fury", "Grief", "Growth", "Harmony", "Harvest",
  "Heart", "Honor", "Hope", "Isolation", "Joy", "Justice", "Knowledge", "Legacy", "Life", "Light",
  "Loss", "Love", "Mercy", "Moon", "Music", "Mystery", "Order", "Patience", "Peace", "Power",
  "Promise", "Prophecy", "Prospect", "Protection", "Providence", "Rage", "Rain", "Rebirth", "Redemption", "Refusal",
  "Regret", "Renewal", "Restoration", "Resurrection", "Reverence", "Reverie", "Sacrifice", "Serenity", "Sight", "Solitude",
  "Sorrow", "Strength", "Sun", "Thunder", "Time", "Tranquility", "Transformation", "Triumph", "Truth", "Unity",
  "Victory", "Vision", "War", "Water", "Wind", "Wisdom", "Wonder", "Worry", "Wrath", "Zeal"
];

export const pvSettlementAdjectives = [
  "Amber", "Arisen", "Ascendant", "Ashen", "Azure", "Black", "Blessed", "Blossom", "Blue", "Bright",
  "Broken", "Certain", "Clear", "Close", "Clouded", "Cold", "Crystal", "Dark", "Deep", "Doubtful",
  "East", "Echo", "Eternal", "Fallen", "False", "Far", "Fire", "Flowering", "Forgotten", "Forsaken",
  "Free", "Gas", "Gold", "Great", "Green", "Hidden", "High", "Holy", "Ice", "Lone",
  "Lost", "Low", "Loyal", "Lunar", "Mist", "Moon", "Moonlit", "Near", "New", "North",
  "Old", "Open", "Peaceful", "Quiet", "Radiant", "Reborn", "Red", "Rocky", "Sea", "Serene",
  "Shady", "Shallow", "Sharp", "Shining", "Silver", "Sky", "Smoke", "Soft", "Solar", "South",
  "Star", "Starlit", "Stellar", "Strong", "Sun", "Sunny", "Tranquil", "True", "United", "West",
  "White", "Yellow", "[NPC Name]", "[NPC Name]", "[NPC Name]", "[NPC Name]", "[NPC Name]", "[NPC Name]", "[NPC Name]", "[NPC Name]",
  "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]"
];

export const pvSettlementForms = [
  "Apex", "Ascent", "Base", "Bastion", "Bed", "Bottom", "Branch", "Bridge", "Camp", "Chasm",
  "Circle", "Citadel", "Cloud", "Cluster", "Coast", "Colony", "Conclave", "Corner", "Crack", "Cradle",
  "Crater", "Creche", "Crest", "Cross", "Crossing", "Dawn", "Depot", "Dig", "Domain", "Echo",
  "Enclave", "End", "Exchange", "Fist", "Forge", "Fort", "Fortress", "Fount", "Garden", "Garrison",
  "Haven", "Hole", "Hollow", "Home", "Horizon", "Hub", "Junction", "Keep", "Labyrinth", "Market",
  "Mill", "Monument", "Nest", "Nexus", "Oasis", "Outland", "Outpost", "Peak", "Perch", "Pit",
  "Platform", "Pocket", "Port", "Post", "Prison", "Reach", "Redoubt", "Respite", "Ridge", "Ring",
  "Rise", "River", "Roost", "Root", "Ruin", "Sanctuary", "Sanctuary", "Sector", "Settlement", "Shaft",
  "Shield", "Shoal", "Shrine", "Source", "Spire", "Springs", "Stage", "Stand", "Station", "Strand",
  "Stronghold", "Summit", "Sword", "Terminal", "Tower", "Township", "Valley", "Wall", "Water", "Well"
];

export const pvSettlementTemplates = [
  "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]",
  "[Quality]", "[Quality]", "[Quality]", "[Quality]", "[Quality]",
  "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]",
  "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]",
  "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]", "[Adjective] [Quality]",
  "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]",
  "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]",
  "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]", "[Quality]'s [Form]",
  "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]",
  "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]",
  "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]", "[Form] [Number]",
  "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]",
  "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]",
  "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]", "The [Adjective] [Form]",
  "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]",
  "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]",
  "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]", "[Form] of the [Adjective]",
  "The [Form] of [Quality]", "The [Form] of [Quality]", "The [Form] of [Quality]", "The [Form] of [Quality]", "The [Form] of [Quality]",
  "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]"
];

// ==========================================
// FACTION NAME COMPONENTS (Pages 164-165)
// ==========================================

export const pvFactionStructures = [
  "Agency", "Alliance", "Alliance", "Assembly", "Axis", "Band", "Barony", "Battalion", "Bloc", "Brotherhood",
  "Cartel", "Cartel", "Cartel", "Cartel", "Cell", "Circle", "Citadel", "Clan", "Clan", "Coalition",
  "Coalition", "Collective", "Company", "Confederation", "Conglomerate", "Consortium", "Cooperative", "Council", "Council", "Council",
  "Council", "Corporation", "Corporation", "Coven", "Covenant", "Crew", "Directorate", "Division", "Domain", "Domain",
  "Enterprise", "Federation", "Federation", "Fellowship", "Following", "Force", "Foundation", "Front", "Gang", "Gang",
  "Gang", "Gang", "Group", "Guild", "Guild", "Guild", "Guild", "Hive", "Industries", "Insurgency",
  "Initiative", "League", "League", "Legion", "Legion", "Marauders", "Mercenaries", "Movement", "Network", "Network",
  "Nexus", "Order", "Order", "Order", "Order", "Party", "Pod", "Pyramid", "Rebellion", "Resistance",
  "Revolution", "Sect", "Section", "Sisterhood", "Society", "Society", "Squad", "Syndicate", "Syndicate", "Syndicate",
  "Syndicate", "Systems", "Tree", "Tribe", "Union", "Union", "Unity", "Uprising", "Vanguard", "Web"
];

export const pvFactionAdjectives = [
  "Ascendant", "Arisen", "Ashen", "Avenging", "Awakened", "Black", "Blessed", "Blood", "Blue", "Bright",
  "Broken", "Celestial", "Cloud", "Code", "Cold", "Crimson", "Crystal", "Cursed", "Dark", "Data",
  "Death", "Dream", "Eternal", "Ethereal", "Fallen", "False", "Far", "Fire", "Five", "Forgotten",
  "Free", "Frozen", "Golden", "Great", "Glorious", "Green", "Hidden", "High", "Holy", "Invisible",
  "Joined", "Light", "Liquid", "Living", "Lore", "Lost", "Low", "Lunar", "New", "Night",
  "Old", "Orbital", "Phantom", "Quantum", "Radiant", "Reborn", "Red", "Righteous", "Rogue", "Scarlet",
  "Secret", "Seven", "Shadow", "Silent", "Silver", "Sky", "Sleeping", "Solar", "Sovereign", "Space",
  "Stellar", "Terminal", "Three", "True", "Unbroken", "Undying", "United", "Vigilant", "Violet", "Void",
  "War", "White", "Yellow", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]", "[NPC Surname]",
  "[NPC Surname]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]", "[Place Name]"
];

export const pvFactionNouns = [
  "Apex", "Arc", "Assassin(s)", "Avenger(s)", "Beacon(s)", "Believer(s)", "Blade(s)", "Branch(es)", "Brother(s)", "Cascade",
  "Claw(s)", "Cloak(s)", "Dawn", "Death", "Defender(s)", "Disciple(s)", "Devil(s)", "Echo(es)", "Edge", "Exile(s)",
  "Eye(s)", "Father(s)", "Fist(s)", "Flame(s)", "Force", "Forge", "Garden", "Ghost(s)", "Glitch", "God(s)",
  "Guard(s)", "Guardian(s)", "Guide(s)", "Halo(s)", "Hammer(s)", "Hand(s)", "Heart(s)", "Horizon", "Hunter(s)", "Life",
  "Lord(s)", "Mark(s)", "Mask(s)", "Monolith", "Mother(s)", "Omen(s)", "Oracle(s)", "Orb(s)", "Outlaw(s)", "Paragon",
  "Path", "Pirate(s)", "Power", "Priest(s)", "Prism", "Raider(s)", "Ray(s)", "Rebel(s)", "Reach", "Reaver(s)",
  "Renegade(s)", "Rider(s)", "Root(s)", "Runner(s)", "Saint(s)", "Sanctuary", "Savior(s)", "Scar(s)", "Scepter(s)", "Scum",
  "Sector(s)", "Seed(s)", "Seeker(s)", "Sentinel(s)", "Serpent(s)", "Shadow(s)", "Shard(s)", "Shield(s)", "Sight", "Sister(s)",
  "Skull(s)", "Source", "Specter(s)", "Spire", "Star(s)", "Steward(s)", "Sun(s)", "System(s)", "Thief/Thieves", "Truth",
  "Vanguard", "Vector(s)", "Vessel(s)", "Vision", "Voice", "Walker(s)", "Warrior(s)", "Way", "Wing(s)", "Wolf/Wolves"
];

export const pvFactionTemplates = [
  "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]",
  "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]", "The [Structure]",
  "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]",
  "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]", "The [Adjective]",
  "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]",
  "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]", "The [Noun]",
  "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]",
  "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]",
  "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]", "The [Adjective] [Structure]",
  "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]",
  "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]",
  "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]", "The [Adjective] [Noun]",
  "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]",
  "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]",
  "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]", "The [Noun] [Structure]",
  "The [Structure] of [Noun]", "The [Structure] of [Noun]", "The [Structure] of [Noun]", "The [Structure] of [Noun]", "The [Structure] of [Noun]",
  "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]", "[Structure] of the [Adjective] [Noun]"
];

// Generate Inciting Incident
export function generatePVIncitingIncident() {
  const roll = rollDice(pvIncitingIncidents.length);
  const result = pvIncitingIncidents[roll - 1];
  
  return {
    roll,
    incident: result.incident,
    followUpQuestions: result.followUpQuestions,
    source: 'perilousVoid'
  };
}
