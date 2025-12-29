/**
 * Star Borg Character Creation Data
 * Class-specific features, abilities, and equipment tables
 * Based on Star Borg Rebel Handbook v1.1
 */

// ==========================================
// BOT CLASS
// ==========================================

export const botData = {
  functions: [
    {
      name: "Protocol",
      description: "Translate any language, parse customs. Know what to say on DR10 PRS test."
    },
    {
      name: "Porter",
      description: "Roll with advantage for lifting and hauling tasks."
    },
    {
      name: "Supervisor",
      description: "Oversee tiny rolling repair bot (rarely does what you ask). Flip coin. D4 HP, D2 damage."
    },
    {
      name: "Computer Interface",
      description: "Plug into terminals to negotiate with computer systems. PRS test. Feedback shock (D4) on blunder."
    },
    {
      name: "Power",
      description: "Walking battery backup. Power/recharge/jumpstart moderate devices. Super charge on DR14 KNW test."
    },
    {
      name: "Surveillance",
      description: "Float with weak antigrav. Survey and transmit with sensors. Disadvantage on STR tests."
    }
  ],
  
  malfunctions: [
    {
      name: "Exterminate",
      description: "When you roll two blunders in a row, rush to attack a random individual within sight."
    },
    {
      name: "Warning Critical Error",
      description: "When you roll a blunder on a test of DR14 or higher, you freeze in place."
    },
    {
      name: "Bugged Audio",
      description: "When you roll a blunder on a PRS test, you can only repeat the last word of your previous sentence."
    },
    {
      name: "Archived Memories",
      description: "When you roll a blunder on a test that aligns with your Function, reroll for a new Function."
    },
    {
      name: "Trick Leg",
      description: "When you roll a blunder on an AGI test, your lower leg dislocates again."
    },
    {
      name: "Screw Loose",
      description: "Loose components squeak and rattle. Disadvantage on AGI tests for stealth."
    }
  ],
  
  upgrades: [
    "Retractable Bone Saw (D8 damage)",
    "Smuggling Compartment (houses mind-altering snuff-dust)",
    "Comm Scrambler (DR12 KNW test)",
    "Legion Cypher (flip coin to see if codes work)",
    "Trash Compactor Torso (crush handheld objects into cubes)",
    "Self Destruct (D8 damage blast, only head survives with 2HP)"
  ]
};

// ==========================================
// BOUNTY HUNTER CLASS
// ==========================================

export const bountyHunterData = {
  skills: [
    {
      name: "Rough Rider",
      description: "Ride any creature you can straddle. Roll PRS with advantage to tame wild beasts."
    },
    {
      name: "Escape Artist",
      description: "Been in and out of jail cells. Roll AGI with advantage to slip bonds and pick locks."
    },
    {
      name: "Deserter",
      description: "Know how Legion thinks and talks. Roll KNW with advantage when anticipating or impersonating Legionnaires."
    },
    {
      name: "Tracker",
      description: "With right tools, always tell if prey has been in area and where they went."
    },
    {
      name: "Bouncer",
      description: "Pain don't hurt. Roll STR with advantage when wrestling/shoving. D8 damage with bare hands."
    },
    {
      name: "Armorer",
      description: "Never take off helmet in front of anyone. Start with Quantum Armor (Tier 3, -D6 damage)."
    }
  ],
  
  heirlooms: [
    {
      name: "Grapple Whip",
      description: "Climb and swing. Test Morale to bind creature. Rebels roll with advantage to defend against bound creatures."
    },
    {
      name: "Flamethrower",
      description: "D6 damage. If you roll 6 for damage, target is on fire for 1 more round."
    },
    {
      name: "Jetpack",
      description: "You can fly. Every use, roll D20. On blunder, out of fuel."
    },
    {
      name: "Ray Shielding",
      description: "Ignore first damage from blaster fire. Resets on rest."
    },
    {
      name: "Sawed Off Repeater",
      description: "2D4 damage. On blunder, jams and can only be fixed on rest."
    },
    {
      name: "Disintegration Rifle",
      description: "D12 damage. If you roll 8+ on damage, enemy makes Morale test. On blunder, rifle disintegrates."
    }
  ],
  
  softSpots: [
    "Helpless little creatures",
    "Youthful whippersnappers",
    "Simple folk making ends meet",
    "Mistreated bots",
    "Elderly curmudgeons",
    "Wounded veterans"
  ]
};

// ==========================================
// MAGI KNIGHT CLASS
// ==========================================

export const magiKnightData = {
  arts: [
    {
      name: "Mind Muddle",
      description: "Cloud brains of simple-minded creatures and issue simple hypnotic commands. (KNW test)"
    },
    {
      name: "Magi Hand",
      description: "Reach out with powers to push, pull, and grasp objects and people. (KNW test)"
    },
    {
      name: "Blaster Deflect",
      description: "Instead of defense roll, deflect blaster bolts with Blazer Sword. Make damage roll against enemy with their own weapon damage. (KNW test)"
    },
    {
      name: "Healing Touch",
      description: "Touch a creature of flesh and bone to restore D6 HP. (KNW test)"
    }
  ],
  
  dragoonNemeses: [
    "Tragen Foul the Beheader",
    "Manus Giant the Strangler",
    "Gigus Noldo the Ripper",
    "X-66 the Bot",
    "Lord Commander Vortex",
    "Roll 2 Nemeses"
  ],
  
  burnerIdentities: [
    {
      name: "Powder Miner",
      description: "Coughing fit when you fail AGI test."
    },
    {
      name: "Wasteland Scavenger",
      description: "Freeze for a moment when you fail PRS test."
    },
    {
      name: "Vapor Farmer",
      description: "Back seizes up when you fail STR test."
    },
    {
      name: "Vagabond",
      description: "Need help to get back to feet when you fail AGI test."
    },
    {
      name: "Reclusive Healer",
      description: "Must help everyone who asks, DR14 PRS test to resist."
    },
    {
      name: "Barfly",
      description: "Must answer slightest insult with your own, DR14 PRS test to resist."
    }
  ]
};

// ==========================================
// SMUGGLER CLASS
// ==========================================

export const smugglerData = {
  tricks: [
    "Ceramic Knife (D4 damage, invisible to weapon scans)",
    "Eyeball Blaster (hidden under eyepatch, one shot, D6 damage)",
    "Psychogun (mechanical arm with bioelectrical cannon, D8 damage)",
    "Monofilament Garrote (retractable wire, 2 STR tests to subdue)",
    "Sonic Grenade (looks like comm unit, deafening stunning blast)",
    "Vapor Tooth (bite down to fill room with thick fog)"
  ],
  
  contraband: [
    {
      name: "Engineered Organs",
      description: "Blood is leaking out. D6 Containment Points."
    },
    {
      name: "Frozen Bone Crabs",
      description: "Will thaw and awaken. D6 Containment Points."
    },
    {
      name: "Particle Warheads",
      description: "Radioactive. D6 Containment Points."
    },
    {
      name: "Hyper Mushrooms",
      description: "Rotting smell and consciousness-altering gas. D6 Containment Points."
    },
    {
      name: "Gravity Magnet",
      description: "Nullification field deteriorating, will become black hole. D6 Containment Points."
    },
    {
      name: "Rogue Bot Mind",
      description: "Will eventually gain control of all machines in signal range. D6 Containment Points."
    }
  ],
  
  crimeLords: [
    "Don Crom",
    "Jojo 'The Borg'",
    "Moon Queen Zala",
    "'Stumpy' Skadeen",
    "'Meat Hook' Max",
    "Shadow Master Vu"
  ]
};

// ==========================================
// TECHNICIAN CLASS
// ==========================================

export const technicianData = {
  scratchBuilds: [
    {
      name: "Hyperspace Transporter Pack",
      description: "Roll KNW to teleport to visible location. Disadvantage if unclear. On blunder, pack and D6 items lost. (bulky, shoddy)"
    },
    {
      name: "Zero Blaster",
      description: "Cover surface in ice. Freeze target solid with sustained blast for 3 rounds. (bulky, shoddy)"
    },
    {
      name: "Gravity Disruptor",
      description: "Negate gravity for just a moment on single target you can touch. (bulky, shoddy)"
    },
    {
      name: "Cloaking Device",
      description: "Make person invisible or group mostly invisible (DR8 Hiding/Stealth, DR10 for small group). (bulky, shoddy)"
    },
    {
      name: "Machine Mind Dominator",
      description: "Test enemy Bot's Morale to turn them friendly. (bulky, shoddy)"
    },
    {
      name: "Devastator Fist",
      description: "Crush armor and tear bulkheads (D6 damage, ignores armor). Roll STR. On blunder, destroyed in energy blast (D8). (bulky, shoddy)"
    }
  ],
  
  hyperFixations: [
    "Hologram Emitters",
    "Bot Optical Lenses",
    "Space Suit Respirators",
    "Hyperdrive Ignition Switches",
    "High Explosives",
    "Speeder Hood Ornaments"
  ]
};

// ==========================================
// YOUNGSTER CLASS
// ==========================================

export const youngsterData = {
  tragedies: [
    "Freak mechanical explosion took out auntie and uncle while scavenging components.",
    "Gamgam and grampy caught in random blaster fire exchange during academy exams.",
    "PL-84 caretaker bot took deadly midnight tumble off bridge where you were discovered.",
    "Circus troupe that raised you were trampled in zanthadon stampede during market day.",
    "Wise old healer who took custody of you was beheaded by unknown assailant.",
    "AI that ran derelict moonbase contracted terminal virus and opened outside hatch."
  ],
  
  heirlooms: [
    {
      name: "Magi Blazer Sword Hilt",
      description: "Left by your parent. 2D6 damage. (See Dragoon Test p.8)"
    },
    {
      name: "Polished Breastplate",
      description: "Ancient armor set with family crest engraved. Tier 2, -D4 armor."
    },
    {
      name: "Pair of Blaster Pistols",
      description: "Badge your mamma once worn to protect galaxy. 2D4 damage."
    },
    {
      name: "Disintegrator Rifle",
      description: "Your uncle used as freedom fighter. D8 damage, takes round to reload."
    },
    {
      name: "Coded Research Notes",
      description: "Your parents were working on before they disappeared. Reveals weak points on Legion Superweapon when analyzed."
    },
    {
      name: "Signet Ring",
      description: "Of your once noble house. Can still grant favor when shown to right nostalgic fool."
    }
  ],
  
  knacks: [
    {
      name: "Burdogs Body",
      description: "Used to being bossed around. Roll with your highest stat when following another Rebel's bossy instructions."
    },
    {
      name: "Busker",
      description: "Never go anywhere without techno-harp. DR10 PRS test to cause obnoxious musical distraction."
    },
    {
      name: "Bootshiner",
      description: "Look average and unimportant. DR10 PRS test to blend in with the help."
    },
    {
      name: "Cutpurse",
      description: "Have sticky fingers. DR10 AGI to swipe item off unsuspecting mark."
    },
    {
      name: "Tinkerer",
      description: "Make friends with bots easily. Understand their machine speech. Roll PRS with advantage when being friendly to non-hostile bots."
    },
    {
      name: "Mucker",
      description: "At home in garbage and gutters of galaxy. DR10 AGI test to search for trinket."
    }
  ]
};
