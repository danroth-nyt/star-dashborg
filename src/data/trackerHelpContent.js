// Help content extracted from the Star Dashborg rulebook

export const trackerHelpContent = {
  threatDie: {
    title: "Threat Die",
    description: "The Threat Die (TD) is used to ramp up the general sense of 'heat' or 'pressure' against your Rebel. Use a D6 (preferably of a different color from your other dice) to represent your TD. It starts at 1 and can increase to 6.",
    sections: [
      {
        heading: "Increase the Threat Die When...",
        type: "info",
        items: [
          "A new threat presents itself or you begin a new Danger Clock.",
          "Roll a Blunder.",
          "Begin an Escape from a Dangerous Location."
        ]
      },
      {
        heading: "Decrease the Threat Die When...",
        type: "success",
        items: [
          "Complete a Mission Track or Resolve a Danger Clock.",
          "Roll a Critical.",
          "Your Rebel has a moment to catch their breath in a safe or hidden location."
        ]
      },
      {
        heading: "When the Threat Die Reaches 6...",
        type: "danger",
        items: [
          "Advance all Danger Clocks by one.",
          "Or completely fill a single Danger Clock."
        ],
        note: "This is a critical moment! The pressure has built to maximum. Choose one of the two options above, then reset the Threat Die as appropriate."
      }
    ]
  },
  
  missionTracks: {
    title: "Mission Tracks",
    description: "Mission Tracks are a helpful way of keeping track of your Rebel's progress on their current missions. Some tracks will be long-term, some average length, and others very short. Each has a number of tracking boxes and a Difficulty Rating (DR).",
    sections: [
      {
        heading: "Setting Up a Mission",
        type: "info",
        items: [
          "Decide on length/difficulty of the mission and draw the check boxes.",
          "SHORT / EASY - four boxes - DR10",
          "AVERAGE / NORMAL - six boxes - DR12",
          "LONG / DIFFICULT - eight boxes - DR14",
          "GALAXY SAVING - ten boxes - DR16"
        ]
      },
      {
        heading: "Making Progress",
        type: "info",
        items: [
          "Each time you make progress in the mission, check off one box.",
          "It is up to you as the Player/GM to decide what constitutes progress.",
          "If you've rolled a Strong Hit in a relevant Test, filling in two progress boxes would be appropriate."
        ]
      },
      {
        heading: "Completing Missions",
        type: "success",
        content: "You may attempt to complete a mission at any point (even before the track is filled) by making a Progress Test: Roll D20 + Current Progress against the Mission's DR.",
        items: [
          "SUCCESS - You've completed the mission.",
          "FAIL - You're not done yet. Remove 1 progress and increase TD by 1."
        ]
      },
      {
        heading: "Example Missions",
        type: "info",
        examples: [
          {
            type: "Long",
            description: "Revenge on the one who killed your family; re-stealing the ship you gambled away; corrupting a government official; building a hidden base."
          },
          {
            type: "Average",
            description: "Repairing a badly damaged bot; delivering contraband; building a Blazer Sword."
          },
          {
            type: "Short",
            description: "Dismantling a rival's ship; hacking into a console; navigating an asteroid field."
          }
        ]
      }
    ]
  },
  
  dangerClocks: {
    title: "Danger Clocks",
    description: "Danger Clocks function much like Mission Tracks, but operate for the wider world against your Rebel. When something in the world presents itself that directly opposes your Rebel's existence, start a Danger Clock for it. Clocks are broken into 4, 6, 8, or 10 segments.",
    sections: [
      {
        heading: "Advance the Danger Clock When...",
        type: "danger",
        items: [
          "Fail a Test related to the Clock (even if you use a Destiny Point to reroll).",
          "Roll a Scene Shakeup or new Event.",
          "Enter a new scene with an unresolved Danger Clock."
        ]
      },
      {
        heading: "Resolving a Danger Clock",
        type: "danger",
        content: "When a Clock is filled, the result happens. Reserve Danger Clocks for events that will present very challenging situations.",
        items: [
          "When a Clock is filled, the consequence occurs immediately.",
          "When a Mission is completed and danger is avoided, remove the Danger Clock, regardless of how far along it has progressed."
        ]
      },
      {
        heading: "Example Danger Clocks",
        type: "info",
        examples: [
          {
            segments: 4,
            description: "Legionary reinforcements are on the way"
          },
          {
            segments: 6,
            description: "The reactor core is overheating"
          },
          {
            segments: 8,
            description: "The ion storm rages around your ship"
          },
          {
            segments: 10,
            description: "An Elite Bounty Hunter is hunting you down"
          }
        ]
      }
    ]
  }
};
