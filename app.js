/* ==========================================================================
   ROLL QUEST: AI & GAME ENGINE (LM STUDIO CONNECTION)
   ========================================================================== */

// 1. SOUND EFFECTS SYNTHESIZER (Web Audio API)
const SoundEffects = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playRoll() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 - i * 15, now + i * 0.12);
      gain.gain.setValueAtTime(0.15, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.08);
    }
  },
  playLanding() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  },
  playHit() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noiseNode.start(now);
    noiseNode.stop(now + 0.15);
  },
  playCritical() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.playHit();
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.25);
    });
  },
  playMiss() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  },
  playHeal() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + i * 120, now + i * 0.06);
      gain.gain.setValueAtTime(0.15, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.15);
    }
  },
  playVictory() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chord = [261.63, 329.63, 392.00, 523.25];
    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.setValueAtTime(freq * 2, now + 0.4);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + 1.0);
    });
  },
  playGameOver() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(100, now);
    osc1.frequency.linearRampToValueAtTime(45, now + 1.5);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(98, now);
    osc2.frequency.linearRampToValueAtTime(44, now + 1.5);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
  }
};

// 2. LM STUDIO AI MANAGER (Gemma Integration)
const AIManager = {
  apiUrl: window.location.protocol.startsWith('http') ? `${window.location.origin}/proxy/v1` : 'http://127.0.0.1:1234/v1',
  modelName: 'gemma-4-12b-it-uncensored',
  isOnline: false,

  updateConfig(url, model) {
    this.apiUrl = url.trim().replace(/\/$/, ""); // Strip trailing slash
    this.modelName = model.trim();
  },

  async testConnection() {
    try {
      const response = await fetch(`${this.apiUrl}/models`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        this.isOnline = true;
        // Auto-assign model name if user didn't specify one
        if (!this.modelName && data.data && data.data.length > 0) {
          this.modelName = data.data[0].id;
        }
        return true;
      }
    } catch (e) {
      console.warn("Local LM Studio not reachable at " + this.apiUrl, e);
    }
    this.isOnline = false;
    return false;
  },

  // Calls local server using OpenAI Chat format
  async fetchChatCompletion(messages, temperature = 0.7) {
    if (!this.isOnline) {
      const ping = await this.testConnection();
      if (!ping) throw new Error("LM Studio server is offline");
    }

    const payload = {
      model: this.modelName || "loaded-model",
      messages: messages,
      temperature: temperature,
      max_tokens: 600
    };

    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  // Robust parsing: extracts JSON blocks or falls back
  parseJson(text) {
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/i;
    const match = text.match(jsonBlockRegex);
    let rawStr = match ? match[1] : text;
    
    // Strip trailing ticks
    rawStr = rawStr.replace(/```/g, '').trim();

    try {
      return JSON.parse(rawStr);
    } catch (e) {
      // Find boundary brackets
      const start = rawStr.indexOf('{');
      const end = rawStr.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        try {
          return JSON.parse(rawStr.substring(start, end + 1));
        } catch (inner) {
          throw new Error("Unable to parse enclosing bracket structures: " + inner.message);
        }
      }
      
      const arrayStart = rawStr.indexOf('[');
      const arrayEnd = rawStr.lastIndexOf(']');
      if (arrayStart !== -1 && arrayEnd !== -1) {
        try {
          return JSON.parse(rawStr.substring(arrayStart, arrayEnd + 1));
        } catch (inner) {
          throw new Error("Unable to parse enclosing array structures: " + inner.message);
        }
      }
      throw e;
    }
  },

  // Dynamic Generator Prompts
  async generateQuests(playerClass, playerLevel) {
    const prompt = `Generate exactly 3 D&D themed quests suited for a Level ${playerLevel} ${playerClass}. 
Output the quests in a JSON array format. Do NOT add conversational intro/outro text.
JSON Structure:
[
  {
    "id": "unique_id_string_1",
    "title": "Quest Title 1",
    "desc": "Short compelling mission description (max 25 words).",
    "difficulty": "Easy" or "Medium" or "Hard",
    "reward": "Reward Summary (e.g. 25 Gold, 50 XP)"
  },
  ...
]`;

    try {
      const raw = await this.fetchChatCompletion([
        { role: 'system', content: 'You are an expert DnD Dungeon Master that outputs raw JSON data without explanations.' },
        { role: 'user', content: prompt }
      ], 0.8);
      return this.parseJson(raw);
    } catch (err) {
      console.warn("Using offline fallback for Quest Board generation", err);
      GameState.log(`⚠️ AI Quest Board failed: ${err.message}. Running in offline fallback mode.`, 'system');
      return this.getOfflineQuests(playerClass, playerLevel);
    }
  },

  async generateQuestStep(player, questTitle, step, history) {
    const prompt = `Act as a DnD Dungeon Master. The player character "${player.name}" (Level ${player.level} ${player.charClass}, Current HP: ${player.hp}/${player.maxHp}, AC: ${player.ac}) is on the quest "${questTitle}".
This is Step ${step} of 4.
History of choices made in this quest: [${history.join(" -> ")}].

Generate a narrative description (max 90 words) of their immediate situation and provide EXACTLY TWO CHOICES (A and B).
At least one choice must trigger a combat encounter or a treasure event. Make sure the difficulty matches the player's level.
Return your response ONLY in this exact JSON format:
{
  "narrative": "A text describing the situation...",
  "choices": [
    {
      "text": "Description of Choice A...",
      "type": "combat" or "event" or "treasure",
      "monster": { // Only include if type is "combat"
        "name": "Custom Monster Name",
        "avatar": "Single Emoji representing the monster",
        "desc": "Short description of the creature.",
        "ac": integer between 10 and 17,
        "hp": integer between 10 and 50,
        "dmgDice": 4 or 6 or 8 or 10 or 12 (damage die size),
        "bonus": integer between 1 and 6 (attack roll bonus)
      },
      "reward": { // Rewards for successfully choosing this or winning the combat
        "gold": integer,
        "xp": integer,
        "statChanges": { // Optional permanent/temp modifications by DM
          "hp": integer (negative for trap damage, positive for heal),
          "ac": integer,
          "attackBonus": integer,
          "damageBonus": integer
        }
      }
    },
    {
      "text": "Description of Choice B...",
      "type": "combat" or "event" or "treasure",
      "monster": { ... }, // Only if type is combat
      "reward": { ... }
    }
  ]
}`;

    try {
      const raw = await this.fetchChatCompletion([
        { role: 'system', content: 'You are a D&D Dungeon Master that outputs quest steps in strict raw JSON format.' },
        { role: 'user', content: prompt }
      ], 0.75);
      return this.parseJson(raw);
    } catch (err) {
      console.warn("Using offline fallback for Quest Step", err);
      GameState.log(`⚠️ AI Quest Step failed: ${err.message}. Running in offline fallback mode.`, 'system');
      return this.getOfflineQuestStep(player, questTitle, step);
    }
  },

  async generateQuestEnding(player, questTitle, history) {
    const prompt = `Act as a DnD Dungeon Master. The player "${player.name}" has completed their quest "${questTitle}" after making choices: [${history.join(" -> ")}].
Write a short victorious ending paragraph (max 100 words) describing their glorious return to the Sleeping Dragon Inn. Include gold and XP bonuses.
Return ONLY in this JSON format:
{
  "narrative": "The completion story text...",
  "gold": integer,
  "xp": integer
}`;
    try {
      const raw = await this.fetchChatCompletion([
        { role: 'system', content: 'You are a D&D Dungeon Master that outputs final quest endings in strict JSON format.' },
        { role: 'user', content: prompt }
      ], 0.7);
      return this.parseJson(raw);
    } catch (err) {
      console.warn("Using offline fallback for Quest Ending", err);
      GameState.log(`⚠️ AI Quest Ending failed: ${err.message}. Running in offline fallback mode.`, 'system');
      return this.getOfflineQuestEnding(player, questTitle);
    }
  },

  // 3. OFFLINE FALLBACK ENGINE (For playability when LM Studio is off)
  getOfflineQuests(playerClass, playerLevel) {
    return [
      { id: 'off_1', title: 'Clear the Crypts', desc: 'Raid the catacombs under the inn where skeletal warriors have awakened.', difficulty: 'Easy', reward: '25 Gold, 40 XP' },
      { id: 'off_2', title: 'Stolen Elixirs', desc: 'Hunt a goblin band that ambushed Bram\'s carriage and took his supplies.', difficulty: 'Medium', reward: '45 Gold, 70 XP' },
      { id: 'off_3', title: 'The Cave Lurker', desc: 'Explore the deep caves to defeat a massive spider nesting in the light crystal veins.', difficulty: 'Hard', reward: '80 Gold, 110 XP' }
    ];
  },

  getOfflineQuestStep(player, questTitle, step) {
    if (step === 1) {
      return {
        narrative: "You set out from the tavern. The path leads into a dark forest. After walking for an hour, you encounter a diverging path. Smoke rises from a hollow tree to the left, while fresh blood stains decorate the stone pathway on the right.",
        choices: [
          {
            text: "Investigate the smoking tree hollow.",
            type: "combat",
            monster: { name: "Forest Goblin", avatar: "👺", desc: "A wild goblin roasted a stolen rabbit.", ac: 11, hp: 12, dmgDice: 4, bonus: 1 },
            reward: { gold: 10, xp: 20 }
          },
          {
            text: "Follow the bloody stones on the right.",
            type: "event",
            reward: { gold: 5, xp: 15, statChanges: { hp: -2 } } // Blood trap
          }
        ]
      };
    } else if (step === 2) {
      return {
        narrative: "Moving forward, you enter a damp cavern chamber. Rusted weaponry litter the floor. In the center, a locked ancient steel chest sits untouched, surrounded by glowing mushrooms. Suddenly, you hear skittering above you.",
        choices: [
          {
            text: "Try to picklock/break open the chest.",
            type: "treasure",
            reward: { gold: 25, xp: 10, statChanges: { damageBonus: 1 } }
          },
          {
            text: "Look up and prepare for the skittering creature.",
            type: "combat",
            monster: { name: "Giant Centipede", avatar: "🐛", desc: "A segmented horror dropping from the ceiling.", ac: 13, hp: 16, dmgDice: 6, bonus: 2 },
            reward: { gold: 12, xp: 25 }
          }
        ]
      };
    } else if (step === 3) {
      return {
        narrative: "You press deeper into the dungeon. The air turns freezing cold. A thick iron door stands between you and the inner sanctum. A heavy lever is situated on a stone altar nearby, but it is covered in crackling elemental sparks.",
        choices: [
          {
            text: "Grab the lever and pull it with brute force.",
            type: "event",
            reward: { gold: 0, xp: 30, statChanges: { hp: -5 } } // Shocked!
          },
          {
            text: "Smash the iron door down using your weapons.",
            type: "combat",
            monster: { name: "Rune Guardian", avatar: "🗿", desc: "A stone statuette charged with lightning sentinel magic.", ac: 14, hp: 20, dmgDice: 6, bonus: 3 },
            reward: { gold: 20, xp: 30 }
          }
        ]
      };
    } else {
      return {
        narrative: "You finally stand in the heart of the dungeon. The primary threat lies before you, defending the final rewards of the quest. The boss creature turns around, roaring as it spots your approach!",
        choices: [
          {
            text: "Charge head-first into battle!",
            type: "combat",
            monster: { name: "Dungeon Overlord", avatar: "😈", desc: "The corrupted executioner holding a massive executioner blade.", ac: 15, hp: 38, dmgDice: 8, bonus: 4 },
            reward: { gold: 40, xp: 50 }
          },
          {
            text: "Create a tactical distraction before striking.",
            type: "combat",
            monster: { name: "Dungeon Overlord (Surprised)", avatar: "😈", desc: "Distracted by your actions. Its defense is lower.", ac: 12, hp: 32, dmgDice: 8, bonus: 3 },
            reward: { gold: 45, xp: 60 }
          }
        ]
      };
    }
  },

  getOfflineQuestEnding(player, questTitle) {
    return {
      narrative: `With a final exhausting strike, you defeat the threats inside the dungeon and claim your prize. Collecting your gear, you walk out into the warm sunlight and travel back to the Sleeping Dragon Inn. Bram the shopkeeper waves you in, offering a warm mug and counting out your heavy sack of gold coins!`,
      gold: 25,
      xp: 40
    };
  }
};

// ============================================
// SKILLS DATABASE DEFINITIONS
// ============================================
const SKILLS_DATABASE = {
  secondWind: { id: 'secondWind', name: 'Second Wind', icon: '🌬️', desc: 'Heal 1d10 + level HP', cooldown: 3, type: 'heal', class: 'Fighter', reqLevel: 1 },
  shieldSlam: { id: 'shieldSlam', name: 'Shield Slam', icon: '🛡️', desc: 'Deal 1d6 + Str physical damage and apply 2 Weak (enemy deals -25% damage)', cooldown: 3, type: 'physical', class: 'Fighter', reqLevel: 2 },
  battleCry: { id: 'battleCry', name: 'Battle Cry', icon: '🗣️', desc: 'Gain +3 Strength stacks (adds +6 flat damage) for 3 turns', cooldown: 4, type: 'buff', class: 'Fighter', reqLevel: 3 },
  whirlwind: { id: 'whirlwind', name: 'Whirlwind', icon: '🌪️', desc: 'Deal 2d8 + Str physical damage', cooldown: 4, type: 'physical', class: 'Fighter', reqLevel: 4 },
  recklessStrike: { id: 'recklessStrike', name: 'Reckless Strike', icon: '💥', desc: 'Deal 3d8 + Str physical damage, but apply 1 Vulnerable to self (+50% damage taken)', cooldown: 3, type: 'physical', class: 'Fighter', reqLevel: 5 },
  heavyStrike: { id: 'heavyStrike', name: 'Heavy Strike', icon: '🔨', desc: 'Deal 4d8 + Str physical damage, apply 1 Weak to enemy', cooldown: 4, type: 'physical', class: 'Fighter', reqLevel: 6 },
  
  sneakAttack: { id: 'sneakAttack', name: 'Sneak Attack', icon: '🗡️', desc: 'Prime: Next hit deals double damage', cooldown: 3, type: 'buff', class: 'Rogue', reqLevel: 1 },
  poisonBlade: { id: 'poisonBlade', name: 'Poison Blade', icon: '🧪', desc: 'Deal 1d4 + Dex physical damage and apply 3 Poison (deals 2 dmg/stack per turn)', cooldown: 3, type: 'poison', class: 'Rogue', reqLevel: 2 },
  smokeBomb: { id: 'smokeBomb', name: 'Smoke Bomb', icon: '💨', desc: 'Apply 2 Weak stacks to the enemy and reduce enemy attack modifier by 2', cooldown: 4, type: 'debuff', class: 'Rogue', reqLevel: 3 },
  bladeDance: { id: 'bladeDance', name: 'Blade Dance', icon: '⚔️', desc: 'Deal 3d4 + Dex physical damage', cooldown: 4, type: 'physical', class: 'Rogue', reqLevel: 4 },
  shadowStep: { id: 'shadowStep', name: 'Shadow Step', icon: '👣', desc: 'Gain 15 temporary Shield and apply 1 Vulnerable to enemy', cooldown: 4, type: 'shield', class: 'Rogue', reqLevel: 5 },
  assassinate: { id: 'assassinate', name: 'Assassinate', icon: '💀', desc: 'Deal 6d4 + Dex physical damage and apply 2 Vulnerable stacks to enemy', cooldown: 5, type: 'physical', class: 'Rogue', reqLevel: 6 },
  
  fireball: { id: 'fireball', name: 'Fireball', icon: '🔥', desc: 'Deal 3d6 + Int fire damage and apply 2 Burn (deals 3 dmg/stack at end of turn) (costs 1 slot)', slots: 1, type: 'fire', class: 'Wizard', reqLevel: 1 },
  frostbolt: { id: 'frostbolt', name: 'Frostbolt', icon: '❄️', desc: 'Deal 1d8 + Int ice damage and apply 2 Weak (costs 1 slot)', slots: 1, type: 'ice', class: 'Wizard', reqLevel: 2 },
  arcaneShield: { id: 'arcaneShield', name: 'Arcane Shield', icon: '🔮', desc: 'Gain 15 temporary Shield (costs 1 slot)', slots: 1, type: 'shield', class: 'Wizard', reqLevel: 3 },
  chainLightning: { id: 'chainLightning', name: 'Chain Lightning', icon: '⚡', desc: 'Deal 4d6 + Int lightning damage (costs 2 slots)', slots: 2, type: 'lightning', class: 'Wizard', reqLevel: 4 },
  haste: { id: 'haste', name: 'Haste', icon: '⏳', desc: 'Gain +2 Strength stacks (damage) and 15 Shield for 3 turns (costs 1 slot)', slots: 1, type: 'buff', class: 'Wizard', reqLevel: 5 },
  disintegrate: { id: 'disintegrate', name: 'Disintegrate', icon: '💫', desc: 'Deal 8d6 fire/lightning damage (costs 3 slots)', slots: 3, type: 'fire', class: 'Wizard', reqLevel: 6 },

  healingAura: { id: 'healingAura', name: 'Healing Aura', icon: '🌿', desc: 'Apply 4 Regen stacks (heals 3 HP/turn at start of turn)', cooldown: 4, type: 'heal', class: 'Generic', reqLevel: 1 },
  goldToss: { id: 'goldToss', name: 'Gold Toss', icon: '🪙', desc: 'Spend 10 Gold coins to deal 15 physical damage directly (no roll needed)', cooldown: 2, type: 'physical', class: 'Generic', reqLevel: 1 },
  stoneSkin: { id: 'stoneSkin', name: 'Stone Skin', icon: '🪨', desc: 'Gain 10 temporary Shield and apply 1 Strength to self', cooldown: 4, type: 'shield', class: 'Generic', reqLevel: 3 },
  ironWill: { id: 'ironWill', name: 'Iron Will', icon: '🦾', desc: 'Heal 20 HP and gain +3 Strength for 2 turns', cooldown: 5, type: 'buff', class: 'Generic', reqLevel: 5 }
};

// 4. MAIN GAME STATE & ENGINE
const GameState = {
  player: {
    name: 'Hero',
    charClass: 'Fighter',
    level: 1,
    xp: 0,
    nextXp: 100,
    gold: 20, // starts with some pocket change for the shop
    hp: 35,
    maxHp: 35,
    ac: 16,
    attackBonus: 3,
    damageBonus: 0,
    damageDice: 8,
    vampirism: 0,
    critRange: 20,
    potions: 1,
    spellSlots: 0,
    maxSpellSlots: 0,
    hasLuckyCharm: false,
    
    skillCooldown: 0,
    maxSkillCooldown: 3,
    sneakAttackCharge: false,
    
    skillBuffs: {
      secondWindBonus: 0,
      secondWindCdReduction: 0,
      sneakMult: 2.0,
      spellDmgBonus: 0
    },
    activeBuffs: []
  },

  enemy: null,
  activeQuest: null,
  questStep: 1,
  questHistory: [],
  currentChoices: [],
  selectedChoice: null,
  enemiesDefeatedCount: 0,
  questsCompletedCount: 0,
  isPlayerTurn: true,

  // UI caches
  ui: {
    startScreen: document.getElementById('start-screen'),
    customizationScreen: document.getElementById('customization-screen'),
    innScreen: document.getElementById('inn-screen'),
    questScreen: document.getElementById('quest-screen'),
    gameScreen: document.getElementById('game-screen'),
    gameOverScreen: document.getElementById('game-over-screen'),
    
    toggleSettingsBtn: document.getElementById('toggle-settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    apiUrlInput: document.getElementById('api-url-input'),
    apiModelInput: document.getElementById('api-model-input'),
    connectionDot: document.getElementById('connection-dot'),
    connectionText: document.getElementById('connection-text'),
    testConnectionBtn: document.getElementById('test-connection-btn'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    
    // Launcher / Save slot IDs
    btnTriggerCreate: document.getElementById('btn-trigger-create'),
    saveSlotsContainer: document.getElementById('save-slots-container'),

    // Customization Screen Inputs
    portraitUploadBox: document.getElementById('portrait-upload-box'),
    avatarUploadInput: document.getElementById('avatar-upload-input'),
    avatarPreviewImg: document.getElementById('avatar-preview-img'),
    customNameInput: document.getElementById('custom-name-input'),
    selectGender: document.getElementById('select-gender'),
    selectRace: document.getElementById('select-race'),
    selectHeight: document.getElementById('select-height'),
    selectBackground: document.getElementById('select-background'),
    selectClass: document.getElementById('select-class'),
    selectSubclass: document.getElementById('select-subclass'),

    // Customization Screen Overview (Right column)
    overviewAvatarImg: document.getElementById('overview-avatar-img'),
    overviewAvatarPlaceholder: document.getElementById('overview-avatar-placeholder'),
    overviewNameDisplay: document.getElementById('overview-name-display'),
    overviewIdentityDisplay: document.getElementById('overview-identity-display'),
    overviewClassDisplay: document.getElementById('overview-class-display'),
    overviewHpVal: document.getElementById('overview-hp-val'),
    overviewAcVal: document.getElementById('overview-ac-val'),
    overviewAtkVal: document.getElementById('overview-atk-val'),
    overviewDmgVal: document.getElementById('overview-dmg-val'),
    overviewGoldVal: document.getElementById('overview-gold-val'),
    overviewPotionsVal: document.getElementById('overview-potions-val'),
    overviewSkillsList: document.getElementById('overview-skills-list'),
    
    confirmCustomizationBtn: document.getElementById('confirm-customization-btn'),
    customPointsLeft: document.getElementById('custom-points-left'),
    allocHpVal: document.getElementById('alloc-hp-val'),
    allocAcVal: document.getElementById('alloc-ac-val'),
    allocAtkVal: document.getElementById('alloc-atk-val'),
    allocDmgVal: document.getElementById('alloc-dmg-val'),
    allocGoldVal: document.getElementById('alloc-gold-val'),
    allocPotionsVal: document.getElementById('alloc-potions-val'),
    
    statChangeModal: document.getElementById('stat-change-modal'),
    statPopupTitle: document.getElementById('stat-popup-title'),
    statPopupSubtitle: document.getElementById('stat-popup-subtitle'),
    statPopupList: document.getElementById('stat-popup-list'),
    closeStatPopupBtn: document.getElementById('close-stat-popup-btn'),

    // Tavern Tabs
    tabQuestsBtn: document.getElementById('tab-quests-btn'),
    tabSkillsBtn: document.getElementById('tab-skills-btn'),
    questBoardTab: document.getElementById('quest-board-tab'),
    skillsGuildTab: document.getElementById('skills-guild-tab'),
    unlockedSkillsPool: document.getElementById('unlocked-skills-pool'),

    // Combat Layout
    combatActionsContainer: document.getElementById('combat-actions-container'),
    combatSkillsContainer: document.getElementById('combat-skills-container'),
    combatPotionsCount: document.getElementById('combat-potions-count'),
    playerStatusList: document.getElementById('player-status-list'),
    enemyAffinityPanel: document.getElementById('enemy-affinity-panel'),
    enemyStatusList: document.getElementById('enemy-status-list'),
    damageDiceContainer: document.getElementById('damage-dice-container'),
    
    innGoldDisplay: document.getElementById('inn-gold-display'),
    innQuestsDisplay: document.getElementById('inn-quests-display'),
    innPlayerName: document.getElementById('inn-player-name'),
    innClassBadge: document.getElementById('inn-class-badge'),
    innHpText: document.getElementById('inn-hp-text'),
    innHpBar: document.getElementById('inn-hp-bar'),
    innXpText: document.getElementById('inn-xp-text'),
    innXpBar: document.getElementById('inn-xp-bar'),
    innLevel: document.getElementById('inn-level'),
    innStatAtk: document.getElementById('inn-stat-atk'),
    innStatAc: document.getElementById('inn-stat-ac'),
    innStatDmg: document.getElementById('inn-stat-dmg'),
    innStatPotions: document.getElementById('inn-stat-potions'),
    innRestBtn: document.getElementById('inn-rest-btn'),
    
    refreshQuestsBtn: document.getElementById('refresh-quests-btn'),
    questsLoader: document.getElementById('quests-loader'),
    questCardsContainer: document.getElementById('quest-cards-container'),
    
    shopPotionBtn: document.querySelector('#shop-potion button'),
    shopAtkBtn: document.querySelector('#shop-atk button'),
    shopAcBtn: document.querySelector('#shop-ac button'),
    shopModBtn: document.querySelector('#shop-modifier button'),
    
    activeQuestTitle: document.getElementById('active-quest-title'),
    questStepIndicator: document.getElementById('quest-step-indicator'),
    questStepBar: document.getElementById('quest-step-bar'),
    questHeroName: document.getElementById('quest-hero-name'),
    questHpText: document.getElementById('quest-hp-text'),
    questHpBar: document.getElementById('quest-hp-bar'),
    questAcVal: document.getElementById('quest-ac-val'),
    questAtkVal: document.getElementById('quest-atk-val'),
    questDmgVal: document.getElementById('quest-dmg-val'),
    questPotionsVal: document.getElementById('quest-potions-val'),
    questSpellSlotsRow: document.getElementById('quest-spell-slots-row'),
    questSpellSlotsVal: document.getElementById('quest-spell-slots-val'),
    questUsePotionBtn: document.getElementById('quest-use-potion-btn'),
    
    storyLoader: document.getElementById('story-loader'),
    parchmentContainer: document.getElementById('parchment-container'),
    questNarrativeText: document.getElementById('quest-narrative-text'),
    choicesContainer: document.getElementById('choices-container'),
    choiceABtn: document.getElementById('choice-a-btn'),
    choiceBBtn: document.getElementById('choice-b-btn'),
    choiceAText: document.getElementById('choice-a-text'),
    choiceBText: document.getElementById('choice-b-text'),
    
    combatQuestTitle: document.getElementById('combat-quest-title'),
    combatHpFraction: document.getElementById('combat-hp-fraction'),
    playerGoldDisplay: document.getElementById('player-gold-display'),
    
    playerClassBadge: document.getElementById('player-class-badge'),
    playerNameDisplay: document.getElementById('player-name-display'),
    playerHpText: document.getElementById('player-hp-text'),
    playerHpBar: document.getElementById('player-hp-bar'),
    statAtkMod: document.getElementById('stat-atk-mod'),
    statAc: document.getElementById('stat-ac'),
    statSpellSlots: document.getElementById('stat-spell-slots'),
    statPotions: document.getElementById('stat-potions'),
    playerBuffsList: document.getElementById('player-buffs-list'),
    
    enemyPanel: document.getElementById('enemy-panel'),
    enemyName: document.getElementById('enemy-name'),
    enemyAcVal: document.getElementById('enemy-ac-val'),
    enemyDesc: document.getElementById('enemy-desc'),
    enemyHpText: document.getElementById('enemy-hp-text'),
    enemyHpBar: document.getElementById('enemy-hp-bar'),
    enemyAvatar: document.getElementById('enemy-avatar'),
    enemyHitFlash: document.getElementById('enemy-hit-flash'),
    
    damageTextLayer: document.getElementById('damage-text-layer'),
    d20: document.getElementById('d20'),
    d20Container: document.getElementById('d20-container'),
    damageDice: document.getElementById('damage-dice'),
    damageDiceContainer: document.getElementById('damage-dice-container'),
    damageDiceLabel: document.getElementById('damage-dice-label'),
    resultBanner: document.getElementById('result-banner'),
    
    attackBtn: document.getElementById('attack-btn'),
    healBtn: document.getElementById('heal-btn'),
    
    combatLog: document.getElementById('combat-log'),
    clearLogBtn: document.getElementById('clear-log-btn'),
    
    summaryClass: document.getElementById('summary-class'),
    summaryStage: document.getElementById('summary-stage'),
    summaryDefeated: document.getElementById('summary-defeated'),
    summaryGold: document.getElementById('summary-gold'),
    restartBtn: document.getElementById('restart-btn'),

    // Avatar clicking triggers
    innAvatarClickbox: document.getElementById('inn-avatar-clickbox'),
    innAvatarImg: document.getElementById('inn-avatar-img'),
    innAvatarPlaceholder: document.getElementById('inn-avatar-placeholder'),
    questAvatarClickbox: document.getElementById('quest-avatar-clickbox'),
    questAvatarImg: document.getElementById('quest-avatar-img'),
    questAvatarPlaceholder: document.getElementById('quest-avatar-placeholder'),
    combatAvatarClickbox: document.getElementById('combat-avatar-clickbox'),
    combatAvatarImg: document.getElementById('combat-avatar-img'),
    combatAvatarPlaceholder: document.getElementById('combat-avatar-placeholder'),

    // Character Sheet modal
    statSheetModal: document.getElementById('stat-sheet-modal'),
    closeStatSheetBtn: document.getElementById('close-stat-sheet-btn'),
    sheetAvatarImg: document.getElementById('sheet-avatar-img'),
    sheetAvatarPlaceholder: document.getElementById('sheet-avatar-placeholder'),
    sheetHeroName: document.getElementById('sheet-hero-name'),
    sheetHeroClass: document.getElementById('sheet-hero-class'),
    sheetHeroSubclass: document.getElementById('sheet-hero-subclass'),
    sheetHeroIdentity: document.getElementById('sheet-hero-identity'),
    sheetHeroLevel: document.getElementById('sheet-hero-level'),
    sheetHeroXp: document.getElementById('sheet-hero-xp'),
    sheetStatPoints: document.getElementById('sheet-stat-points'),
    sheetValHp: document.getElementById('sheet-val-hp'),
    sheetValAc: document.getElementById('sheet-val-ac'),
    sheetValAtk: document.getElementById('sheet-val-atk'),
    sheetValDmg: document.getElementById('sheet-val-dmg'),
    sheetValSlots: document.getElementById('sheet-val-slots'),
    confirmSheetStatsBtn: document.getElementById('confirm-sheet-stats-btn'),
    sheetPointsIndicator: document.getElementById('sheet-points-indicator'),

    // Hardship skill checks D20 modal
    skillCheckModal: document.getElementById('skill-check-modal'),
    checkD20: document.getElementById('check-d20'),
    rollCheckBtn: document.getElementById('roll-check-btn'),
    resolveCheckBtn: document.getElementById('resolve-check-btn')
  },

  init() {
    // 1. Settings cogs & Connection verification
    this.ui.toggleSettingsBtn.addEventListener('click', () => {
      this.ui.apiUrlInput.value = AIManager.apiUrl;
      this.ui.apiModelInput.value = AIManager.modelName;
      this.ui.settingsModal.classList.add('active');
      this.verifyConnection();
    });
    this.ui.closeSettingsBtn.addEventListener('click', () => {
      AIManager.updateConfig(this.ui.apiUrlInput.value, this.ui.apiModelInput.value);
      this.ui.settingsModal.classList.remove('active');
    });
    this.ui.testConnectionBtn.addEventListener('click', async () => {
      AIManager.updateConfig(this.ui.apiUrlInput.value, this.ui.apiModelInput.value);
      this.ui.connectionDot.className = 'status-dot checking';
      this.ui.connectionText.textContent = 'Status: Checking...';
      const ok = await AIManager.testConnection();
      this.updateConnectionUI(ok);
    });

    // Launcher Screen Create New Hero button listener
    this.ui.btnTriggerCreate.addEventListener('click', () => {
      SoundEffects.init();
      this.openCustomizationScreen();
    });

    // Customization Screen Event Listeners
    // Image upload trigger
    this.ui.portraitUploadBox.addEventListener('click', () => {
      this.ui.avatarUploadInput.click();
    });
    
    this.ui.avatarUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Url = event.target.result;
          this.customization.portrait = base64Url;
          
          this.ui.avatarPreviewImg.src = base64Url;
          this.ui.avatarPreviewImg.classList.remove('hidden');
          document.getElementById('portrait-placeholder').classList.add('hidden');
          
          this.ui.overviewAvatarImg.src = base64Url;
          this.ui.overviewAvatarImg.classList.remove('hidden');
          this.ui.overviewAvatarPlaceholder.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    this.ui.customNameInput.addEventListener('input', () => {
      this.player.name = this.ui.customNameInput.value.trim() || 'Hero';
      this.updateCustomizationUI();
    });

    this.ui.selectGender.addEventListener('change', () => this.updateCustomizationUI());
    this.ui.selectRace.addEventListener('change', () => this.updateCustomizationUI());
    this.ui.selectHeight.addEventListener('change', () => this.updateCustomizationUI());
    this.ui.selectBackground.addEventListener('change', () => this.updateCustomizationUI());
    
    this.ui.selectClass.addEventListener('change', () => {
      this.player.charClass = this.ui.selectClass.value;
      this.updateSubclassOptions();
      this.updateCustomizationUI();
    });
    this.ui.selectSubclass.addEventListener('change', () => this.updateCustomizationUI());

    const plusBtns = document.querySelectorAll('.allocator-controls .btn-plus');
    const minusBtns = document.querySelectorAll('.allocator-controls .btn-minus');
    
    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stat = btn.getAttribute('data-stat');
        this.adjustCustomStat(stat, 1);
      });
    });
    
    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stat = btn.getAttribute('data-stat');
        this.adjustCustomStat(stat, -1);
      });
    });

    this.ui.confirmCustomizationBtn.addEventListener('click', () => {
      this.finalizeCharacterCreation();
    });

    // Tavern tab events
    this.ui.tabQuestsBtn.addEventListener('click', () => {
      this.ui.tabQuestsBtn.classList.add('selected');
      this.ui.tabSkillsBtn.classList.remove('selected');
      this.ui.questBoardTab.classList.remove('hidden');
      this.ui.skillsGuildTab.classList.add('hidden');
    });

    this.ui.tabSkillsBtn.addEventListener('click', () => {
      this.ui.tabSkillsBtn.classList.add('selected');
      this.ui.tabQuestsBtn.classList.remove('selected');
      this.ui.skillsGuildTab.classList.remove('hidden');
      this.ui.questBoardTab.classList.add('hidden');
      this.renderSkillsGuild();
    });

    // Register shop buttons
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cost = parseInt(btn.getAttribute('data-cost'));
        const shopItemEl = btn.closest('.shop-item').id;
        this.handleShopBuy(shopItemEl, cost);
      });
    });

    // Choice Screen button listeners
    this.ui.choiceABtn.addEventListener('click', () => this.handleChoiceSelect(0));
    this.ui.choiceBBtn.addEventListener('click', () => this.handleChoiceSelect(1));
    this.ui.questUsePotionBtn.addEventListener('click', () => this.handleQuestPotionUse());

    // Combat Action buttons
    this.ui.attackBtn.addEventListener('click', () => this.handlePlayerAttack());
    this.ui.healBtn.addEventListener('click', () => this.handlePlayerHeal());
    this.ui.clearLogBtn.addEventListener('click', () => {
      this.ui.combatLog.innerHTML = '';
      this.log('Log cleared.', 'system');
    });

    // Game over restart button
    this.ui.restartBtn.addEventListener('click', () => this.resetToTitle());
    
    // Click avatar triggers -> opens sheet modal
    this.ui.innAvatarClickbox.addEventListener('click', () => this.openStatSheetModal());
    this.ui.questAvatarClickbox.addEventListener('click', () => this.openStatSheetModal());
    this.ui.combatAvatarClickbox.addEventListener('click', () => this.openStatSheetModal());
    
    // Close sheet modal
    this.ui.closeStatSheetBtn.addEventListener('click', () => {
      this.ui.statSheetModal.classList.remove('active');
    });

    // Level-up sheet plus buttons click
    const sheetPlusBtns = document.querySelectorAll('.sheet-stats-list .sheet-plus-btn');
    sheetPlusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stat = btn.getAttribute('data-stat');
        this.allocateStatPoint(stat);
      });
    });
    
    // Confirm level-up stats button
    document.getElementById('confirm-sheet-stats-btn').addEventListener('click', () => {
      this.confirmAllocatedStatPoints();
    });

    // Fetch new quests button (Fixed!)
    this.ui.refreshQuestsBtn.addEventListener('click', () => this.refreshQuestBoard());

    // Run initial connection test silently
    AIManager.testConnection().then(ok => this.updateConnectionUI(ok));

    // Load initial save game list
    this.loadSavedCharactersList();
  },

  // ============================================
  // SAVE GAME SYSTEM LOGIC
  // ============================================
  async saveActiveCharacter() {
    if (!this.player.id) {
      this.player.id = Date.now();
    }
    this.player.lastSaved = new Date().toISOString();
    
    // Save to local storage as well for backup
    let saves = [];
    try {
      saves = JSON.parse(localStorage.getItem('roll_quest_saves') || '[]');
    } catch(e) {
      saves = [];
    }
    
    const idx = saves.findIndex(s => s.player.id === this.player.id);
    const saveData = {
      player: this.player,
      enemiesDefeatedCount: this.enemiesDefeatedCount,
      questsCompletedCount: this.questsCompletedCount
    };
    
    if (idx !== -1) {
      saves[idx] = saveData;
    } else {
      saves.push(saveData);
    }
    localStorage.setItem('roll_quest_saves', JSON.stringify(saves));

    // Try saving in local folder via server API
    try {
      await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData)
      });
    } catch(e) {
      console.warn("Failed to save to local folder, using localStorage fallback:", e);
    }
  },

  async loadSavedCharactersList() {
    let saves = [];
    
    // Try listing from server saves folder first
    try {
      const resp = await fetch('/api/saves');
      if (resp.ok) {
        saves = await resp.json();
      } else {
        throw new Error("API return code: " + resp.status);
      }
    } catch(e) {
      console.warn("Failed to load from local saves folder, using localStorage fallback:", e);
      try {
        saves = JSON.parse(localStorage.getItem('roll_quest_saves') || '[]');
      } catch(ex) {
        saves = [];
      }
    }
    
    this.ui.saveSlotsContainer.innerHTML = '';
    if (saves.length === 0) {
      this.ui.saveSlotsContainer.innerHTML = `
        <div class="empty-saves-message" style="color: #64748b; font-size: 0.9rem; text-align: center; padding: 20px;">
          No saved heroes found. Create a new hero to start your adventure!
        </div>
      `;
      return;
    }
    
    saves.forEach(save => {
      const slot = document.createElement('div');
      slot.className = 'save-slot-item';
      
      const char = save.player;
      const dateStr = new Date(char.lastSaved || Date.now()).toLocaleDateString();
      
      const avatarHTML = char.portrait 
        ? `<img src="${char.portrait}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid var(--accent-gold);">`
        : `<span style="font-size: 1.5rem;">👤</span>`;
      
      slot.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
          <div class="save-avatar-container" style="display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.02);">
            ${avatarHTML}
          </div>
          <div class="save-slot-info">
            <span class="save-slot-name">${char.name}</span>
            <span class="save-slot-meta">Level ${char.level} ${char.charClass} (${char.subclass || 'No Subclass'}) - Gold: ${char.gold}g - Saved: ${dateStr}</span>
          </div>
        </div>
        <div class="save-slot-actions">
          <button class="btn btn-secondary btn-small load-slot-btn" data-id="${char.id}">Load</button>
          <button class="btn btn-danger btn-small delete-slot-btn" data-id="${char.id}" style="background: rgba(255,0,84,0.1); border-color: var(--danger-red); color: var(--danger-red); padding: 5px 8px;">Delete</button>
        </div>
      `;
      
      slot.querySelector('.load-slot-btn').addEventListener('click', () => {
        this.loadCharacterFromSave(char.id);
      });
      slot.querySelector('.delete-slot-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteCharacterSave(char.id);
      });
      
      this.ui.saveSlotsContainer.appendChild(slot);
    });
  },

  async loadCharacterFromSave(id) {
    let saves = [];
    try {
      // Fetch list from saves folder first
      const resp = await fetch('/api/saves');
      if (resp.ok) {
        saves = await resp.json();
      } else {
        throw new Error();
      }
    } catch(e) {
      saves = JSON.parse(localStorage.getItem('roll_quest_saves') || '[]');
    }
    const save = saves.find(s => s.player.id === id);
    if (!save) return;
    
    this.player = save.player;
    this.enemiesDefeatedCount = save.enemiesDefeatedCount || 0;
    this.questsCompletedCount = save.questsCompletedCount || 0;
    
    this.ui.startScreen.classList.remove('active');
    this.ui.innScreen.classList.add('active');
    
    this.ui.tabQuestsBtn.click();
    this.updateInnUI();
    this.refreshQuestBoard();
    SoundEffects.playVictory();
  },

  async deleteCharacterSave(id) {
    // Delete in local storage
    let saves = [];
    try {
      saves = JSON.parse(localStorage.getItem('roll_quest_saves') || '[]');
    } catch(e) {
      saves = [];
    }
    saves = saves.filter(s => s.player.id !== id);
    localStorage.setItem('roll_quest_saves', JSON.stringify(saves));

    // Try deleting on server
    try {
      await fetch('/api/saves/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      });
    } catch(e) {
      console.warn("Failed to delete from server folder:", e);
    }
    this.loadSavedCharactersList();
  },

  // ============================================
  // CHARACTER CUSTOMIZATION LOGIC
  // ============================================
  openCustomizationScreen() {
    this.player.name = 'Hero';
    this.player.charClass = 'Fighter';
    
    this.customization = {
      pointsLeft: 10,
      allocated: { hp: 0, ac: 0, atk: 0, dmg: 0, gold: 0, potions: 0 },
      portrait: ''
    };
    
    this.ui.customNameInput.value = 'Hero';
    this.ui.selectGender.value = 'Male';
    this.ui.selectRace.value = 'Human';
    this.ui.selectHeight.value = 'Medium';
    this.ui.selectBackground.value = 'Soldier';
    this.ui.selectClass.value = 'Fighter';
    
    this.ui.avatarPreviewImg.classList.add('hidden');
    this.ui.avatarPreviewImg.src = '';
    document.getElementById('portrait-placeholder').classList.remove('hidden');
    
    this.ui.overviewAvatarImg.classList.add('hidden');
    this.ui.overviewAvatarImg.src = '';
    this.ui.overviewAvatarPlaceholder.classList.remove('hidden');

    this.updateSubclassOptions();
    this.updateCustomizationUI();
    
    this.ui.startScreen.classList.remove('active');
    this.ui.customizationScreen.classList.add('active');
  },

  getClassBaseStats(selectedClass) {
    if (selectedClass === 'Fighter') {
      return { hp: 35, ac: 16, atk: 3, dmg: 0, dice: 8, gold: 20, potions: 1, slots: 0 };
    } else if (selectedClass === 'Rogue') {
      return { hp: 28, ac: 15, atk: 4, dmg: 0, dice: 6, gold: 20, potions: 1, slots: 0 };
    } else if (selectedClass === 'Wizard') {
      return { hp: 22, ac: 12, atk: 2, dmg: 0, dice: 4, gold: 20, potions: 1, slots: 1 };
    }
    return { hp: 30, ac: 10, atk: 0, dmg: 0, dice: 6, gold: 20, potions: 1, slots: 0 };
  },

  updateSubclassOptions() {
    const cls = this.ui.selectClass.value;
    this.ui.selectSubclass.innerHTML = '';
    
    if (cls === 'Fighter') {
      this.ui.selectSubclass.innerHTML = `
        <option value="Champion">Champion (Fighter: critRange = 18)</option>
        <option value="BattleMaster">Battle Master (Fighter: +1d4 attack damage die)</option>
      `;
    } else if (cls === 'Rogue') {
      this.ui.selectSubclass.innerHTML = `
        <option value="Assassin">Assassin (Rogue: +5 starting combat turn damage)</option>
        <option value="Thief">Thief (Rogue: +20% gold from quests)</option>
      `;
    } else if (cls === 'Wizard') {
      this.ui.selectSubclass.innerHTML = `
        <option value="Evoker">Evoker (Wizard: +3 fire spell damage)</option>
        <option value="Conjurer">Conjurer (Wizard: +2 shield when casting spell)</option>
      `;
    }
  },

  updateCustomizationUI() {
    this.ui.customPointsLeft.textContent = this.customization.pointsLeft;
    
    this.ui.allocHpVal.textContent = this.customization.allocated.hp;
    this.ui.allocAcVal.textContent = this.customization.allocated.ac;
    this.ui.allocAtkVal.textContent = this.customization.allocated.atk;
    this.ui.allocDmgVal.textContent = this.customization.allocated.dmg;
    this.ui.allocGoldVal.textContent = this.customization.allocated.gold;
    this.ui.allocPotionsVal.textContent = this.customization.allocated.potions;
    
    // Retrieve values
    const name = this.player.name || 'Hero';
    const gender = this.ui.selectGender.value;
    const race = this.ui.selectRace.value;
    const height = this.ui.selectHeight.value;
    const background = this.ui.selectBackground.value;
    const charClass = this.player.charClass || 'Fighter';
    const subclass = this.ui.selectSubclass.value;
    
    const base = this.getClassBaseStats(charClass);
    const alloc = this.customization.allocated;
    
    // Core calculation
    let hp = base.hp + alloc.hp * 2;
    let ac = base.ac + Math.floor(alloc.ac / 2);
    let atk = base.atk + Math.floor(alloc.atk / 2);
    let dmg = base.dmg + Math.floor(alloc.dmg / 2);
    let gold = base.gold + alloc.gold * 10;
    let potions = base.potions + Math.floor(alloc.potions / 2);
    let slots = base.slots;
    
    // Race adjustments
    if (race === 'Human') hp += 5;
    if (race === 'Elf') ac += 1;
    if (race === 'Dwarf') dmg += 1;
    if (race === 'Halfling') {
      atk += 1;
      if (height === 'Short') ac += 1;
    }
    
    // Height adjustments
    if (height === 'Short') ac += 1;
    if (height === 'Tall') {
      hp += 2;
      dmg += 1;
    }
    
    // Background adjustments
    if (background === 'Soldier') hp += 5;
    if (background === 'Urchin') ac += 1;
    if (background === 'Scholar' && charClass === 'Wizard') slots += 1;
    if (background === 'Acolyte') potions += 3;
    if (background === 'Noble') gold += 50;
    
    // Update labels
    this.ui.overviewNameDisplay.textContent = name;
    this.ui.overviewIdentityDisplay.textContent = `${gender} ${race} (${height}) - ${background}`;
    this.ui.overviewClassDisplay.textContent = `${charClass} (${subclass})`;
    
    this.ui.overviewHpVal.textContent = hp;
    this.ui.overviewAcVal.textContent = ac;
    this.ui.overviewAtkVal.textContent = `+${atk}`;
    this.ui.overviewDmgVal.textContent = `+${dmg}`;
    this.ui.overviewGoldVal.textContent = `${gold}g`;
    this.ui.overviewPotionsVal.textContent = potions;
    
    // Populate active starting skills list
    const classSkill = charClass === 'Fighter' ? 'secondWind' : (charClass === 'Rogue' ? 'sneakAttack' : 'fireball');
    const bgSkill = background === 'Soldier' ? 'shieldSlam' : (background === 'Urchin' ? 'poisonBlade' : (background === 'Scholar' ? 'arcaneShield' : (background === 'Acolyte' ? 'healingAura' : 'goldToss')));
    
    const cs = SKILLS_DATABASE[classSkill];
    const bs = SKILLS_DATABASE[bgSkill];
    
    this.ui.overviewSkillsList.innerHTML = `
      <div class="skill-slot-box equipped" style="flex-direction: row; justify-content: flex-start; gap: 8px; width: 100%; height: auto; padding: 6px 10px; cursor: default;">
        <span>${cs.icon}</span>
        <div style="text-align: left;">
          <div style="font-size: 0.75rem; font-weight: 700; color: white;">${cs.name}</div>
          <div style="font-size: 0.6rem; color: #94a3b8;">${cs.desc}</div>
        </div>
      </div>
      <div class="skill-slot-box equipped" style="flex-direction: row; justify-content: flex-start; gap: 8px; width: 100%; height: auto; padding: 6px 10px; cursor: default;">
        <span>${bs.icon}</span>
        <div style="text-align: left;">
          <div style="font-size: 0.75rem; font-weight: 700; color: white;">${bs.name}</div>
          <div style="font-size: 0.6rem; color: #94a3b8;">${bs.desc}</div>
        </div>
      </div>
    `;
    // Update plus/minus button disabled states
    const plusButtons = document.querySelectorAll('.allocator-controls .btn-plus');
    plusButtons.forEach(btn => {
      btn.disabled = this.customization.pointsLeft <= 0;
    });

    const minusButtons = document.querySelectorAll('.allocator-controls .btn-minus');
    minusButtons.forEach(btn => {
      const stat = btn.getAttribute('data-stat');
      btn.disabled = (this.customization.allocated[stat] || 0) <= 0;
    });
  },

  adjustCustomStat(stat, amount) {
    const alloc = this.customization.allocated;
    if (amount > 0 && this.customization.pointsLeft > 0) {
      alloc[stat]++;
      this.customization.pointsLeft--;
    } else if (amount < 0 && alloc[stat] > 0) {
      alloc[stat]--;
      this.customization.pointsLeft++;
    }
    this.updateCustomizationUI();
    SoundEffects.playLanding();
  },

  finalizeCharacterCreation() {
    if (this.customization.pointsLeft > 0) {
      const confirmProceed = confirm(`You have ${this.customization.pointsLeft} unspent attribute points. If you confirm, these points will be lost. Do you want to proceed?`);
      if (!confirmProceed) return;
    }
    const charClass = this.player.charClass || 'Fighter';
    const subclass = this.ui.selectSubclass.value;
    const race = this.ui.selectRace.value;
    const background = this.ui.selectBackground.value;
    const height = this.ui.selectHeight.value;
    const gender = this.ui.selectGender.value;
    
    const base = this.getClassBaseStats(charClass);
    const alloc = this.customization.allocated;
    
    // Core attributes setup
    let hp = base.hp + alloc.hp * 2;
    let ac = base.ac + Math.floor(alloc.ac / 2);
    let atk = base.atk + Math.floor(alloc.atk / 2);
    let dmg = base.dmg + Math.floor(alloc.dmg / 2);
    let gold = base.gold + alloc.gold * 10;
    let potions = base.potions + Math.floor(alloc.potions / 2);
    let slots = base.slots;
    
    // Apply all racial bonuses
    if (race === 'Human') hp += 5;
    if (race === 'Elf') ac += 1;
    if (race === 'Dwarf') dmg += 1;
    if (race === 'Halfling') {
      atk += 1;
      if (height === 'Short') ac += 1;
    }
    
    // Apply height bonuses
    if (height === 'Short') ac += 1;
    if (height === 'Tall') {
      hp += 2;
      dmg += 1;
    }
    
    // Apply background bonuses
    if (background === 'Soldier') hp += 5;
    if (background === 'Urchin') ac += 1;
    if (background === 'Scholar' && charClass === 'Wizard') slots += 1;
    if (background === 'Acolyte') potions += 3;
    if (background === 'Noble') gold += 50;
    
    // Finalize state
    this.player.maxHp = hp;
    this.player.hp = hp;
    this.player.ac = ac;
    this.player.attackBonus = atk;
    this.player.damageBonus = dmg;
    this.player.damageDice = base.dice;
    
    this.player.gender = gender;
    this.player.race = race;
    this.player.height = height;
    this.player.background = background;
    this.player.subclass = subclass;
    this.player.portrait = this.customization.portrait || '';
    
    // Setup wizard spell slots
    if (charClass === 'Wizard') {
      this.player.maxSpellSlots = slots;
      this.player.spellSlots = slots;
    } else {
      this.player.maxSpellSlots = 0;
      this.player.spellSlots = 0;
    }
    
    this.player.gold = gold;
    this.player.potions = potions;
    this.player.vampirism = 0;
    this.player.critRange = 20;
    this.player.hasLuckyCharm = false;
    
    // Subclass special effects
    if (subclass === 'Champion') {
      this.player.critRange = 18; // Fighter Champion crits on 18, 19, or 20
    }
    
    this.player.level = 1;
    this.player.xp = 0;
    this.player.nextXp = 100;
    this.player.cooldowns = {};
    this.player.sneakAttackCharge = false;
    this.player.activeBuffs = [];
    this.player.statuses = { poison: 0, burn: 0, strength: 0, vulnerable: 0, weak: 0, shield: 0 };
    this.player.skillPoints = 0;
    this.player.statPoints = 0;
    this.player.shopBuys = { damage: 0, ac: 0, attack: 0 };
    this.player.skillBuffs = {
      secondWindBonus: 0,
      secondWindCdReduction: 0,
      sneakMult: 2.0,
      spellDmgBonus: 0
    };
    
    // Dragonborn resistance values
    this.player.fireResistance = race === 'Dragonborn' ? 0.1 : 0.0;
    this.player.iceResistance = race === 'Dragonborn' ? 0.1 : 0.0;
    this.player.lightningResistance = race === 'Dragonborn' ? 0.1 : 0.0;

    // Starting skills
    const classSkill = charClass === 'Fighter' ? 'secondWind' : (charClass === 'Rogue' ? 'sneakAttack' : 'fireball');
    const bgSkill = background === 'Soldier' ? 'shieldSlam' : (background === 'Urchin' ? 'poisonBlade' : (background === 'Scholar' ? 'arcaneShield' : (background === 'Acolyte' ? 'healingAura' : 'goldToss')));
    
    this.player.learnedSkills = [classSkill, bgSkill];
    this.player.activeSkills = [classSkill, bgSkill]; // Equip starting skills

    this.enemiesDefeatedCount = 0;
    this.questsCompletedCount = 0;

    // Save hero
    this.saveActiveCharacter();

    // Transition to Tavern
    this.ui.customizationScreen.classList.remove('active');
    this.ui.innScreen.classList.add('active');
    
    // Choose quest tab
    this.ui.tabQuestsBtn.click();

    this.updateInnUI();
    this.refreshQuestBoard();
    
    SoundEffects.playVictory();
  },

  // ============================================
  // SKILLS GUILD INTERFACE LOGIC
  // ============================================
  renderSkillsGuild() {
    // Sync points display
    const descEl = this.ui.skillsGuildTab.querySelector('.modal-subtitle');
    if (descEl) {
      descEl.innerHTML = `Choose up to 3 active skills to bring into battle. Unlock more skills using Skill Points!<br><strong class="gold" style="font-size: 0.95rem; text-shadow: 0 0 5px rgba(245,158,11,0.5);">Skill Points available: ${this.player.skillPoints || 0} SP</strong>`;
    }

    // 1. Populates active equipped slots visual box
    const active = this.player.activeSkills || [];
    for (let i = 0; i < 3; i++) {
      const box = document.getElementById(`slot-${i}`);
      box.innerHTML = '';
      box.className = 'skill-slot-box';
      
      const skillId = active[i];
      if (skillId && SKILLS_DATABASE[skillId]) {
        const skill = SKILLS_DATABASE[skillId];
        box.classList.add('equipped');
        box.innerHTML = `
          <span class="skill-slot-icon">${skill.icon}</span>
          <span class="skill-slot-name">${skill.name}</span>
          <span style="font-size: 0.55rem; color: #ff8fa3; margin-top: 4px; font-weight: 700;">UNEQUIP</span>
        `;
        box.addEventListener('click', () => {
          this.player.activeSkills = this.player.activeSkills.filter(id => id !== skillId);
          this.renderSkillsGuild();
          this.saveActiveCharacter();
        }, { once: true });
      } else {
        box.innerHTML = `<span class="slot-empty-lbl" style="font-size: 0.7rem; color: #64748b;">Empty Slot</span>`;
      }
    }
    
    // 2. Populate pool grid
    const pool = this.ui.unlockedSkillsPool;
    pool.innerHTML = '';
    
    // Find all eligible skills (matches player class OR is Generic)
    const cls = this.player.charClass;
    const eligibleSkills = Object.values(SKILLS_DATABASE).filter(s => s.class === cls || s.class === 'Generic');
    
    // Sort skills by required level, then by class
    eligibleSkills.sort((a, b) => a.reqLevel - b.reqLevel);
    
    eligibleSkills.forEach(skill => {
      const isLearned = this.player.learnedSkills.includes(skill.id);
      const isEquipped = active.includes(skill.id);
      
      const card = document.createElement('div');
      card.className = `skill-pool-card ${isLearned ? (isEquipped ? 'active-equipped' : '') : 'locked-skill'}`;
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      card.style.padding = '12px';
      card.style.background = isLearned ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.3)';
      card.style.border = isEquipped ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.05)';
      card.style.borderRadius = '8px';
      card.style.transition = 'all 0.2s ease';
      
      let actionHTML = '';
      if (isLearned) {
        actionHTML = `
          <span class="equip-indicator" style="font-size: 0.75rem; font-weight: 700; color: ${isEquipped ? 'var(--accent-cyan)' : '#64748b'}; margin-top: 8px;">
            ${isEquipped ? 'EQUIPPED' : 'TAP TO EQUIP'}
          </span>
        `;
      } else {
        const canUnlock = this.player.level >= skill.reqLevel && (this.player.skillPoints || 0) > 0;
        const levelError = this.player.level < skill.reqLevel;
        
        if (levelError) {
          actionHTML = `
            <button class="btn btn-secondary btn-small" disabled style="width: 100%; font-size: 0.7rem; margin-top: 8px; border-color: rgba(255,255,255,0.03); color: var(--danger-red);">
              Requires Lvl ${skill.reqLevel}
            </button>
          `;
        } else {
          actionHTML = `
            <button class="btn btn-primary btn-small unlock-skill-btn" data-id="${skill.id}" ${canUnlock ? '' : 'disabled'} style="width: 100%; font-size: 0.7rem; margin-top: 8px;">
              🗝️ Unlock (1 SP)
            </button>
          `;
        }
      }
      
      card.innerHTML = `
        <div class="skill-pool-info" style="display: flex; gap: 10px; align-items: flex-start;">
          <span class="skill-pool-icon" style="font-size: 1.5rem;">${skill.icon}</span>
          <div class="skill-pool-details" style="display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="skill-pool-name" style="font-weight: 600; font-size: 0.85rem; color: ${isLearned ? 'white' : '#64748b'}">${skill.name}</span>
              <span style="font-size: 0.65rem; padding: 1px 5px; border-radius: 4px; background: rgba(255,255,255,0.05); color: #94a3b8;">Lvl ${skill.reqLevel}</span>
            </div>
            <span class="skill-pool-desc" style="font-size: 0.75rem; color: #94a3b8; margin-top: 3px; line-height: 1.2;">${skill.desc}</span>
          </div>
        </div>
        ${actionHTML}
      `;
      
      // Event bindings
      if (isLearned) {
        card.addEventListener('click', () => {
          if (isEquipped) {
            this.player.activeSkills = this.player.activeSkills.filter(id => id !== skill.id);
          } else {
            if (this.player.activeSkills.length >= 3) {
              alert("You can only equip up to 3 active skills! Unequip an active skill first.");
              return;
            }
            this.player.activeSkills.push(skill.id);
          }
          this.renderSkillsGuild();
          this.saveActiveCharacter();
        });
      } else {
        const unlockBtn = card.querySelector('.unlock-skill-btn');
        if (unlockBtn) {
          unlockBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card clicks
            this.unlockSkill(skill.id);
          });
        }
      }
      
      pool.appendChild(card);
    });
  },

  unlockSkill(skillId) {
    if ((this.player.skillPoints || 0) <= 0) return;
    const skill = SKILLS_DATABASE[skillId];
    if (!skill || this.player.level < skill.reqLevel) return;
    
    this.player.skillPoints--;
    if (!this.player.learnedSkills) this.player.learnedSkills = [];
    this.player.learnedSkills.push(skillId);
    
    this.saveActiveCharacter();
    this.renderSkillsGuild();
    SoundEffects.playVictory();
    this.log(`✨ Learned new skill: ${skill.icon} <strong>${skill.name}</strong>!`, 'system');
  },

  async verifyConnection() {
    const ok = await AIManager.testConnection();
    this.updateConnectionUI(ok);
  },

  updateConnectionUI(isOnline) {
    if (isOnline) {
      this.ui.connectionDot.className = 'status-dot online';
      this.ui.connectionText.textContent = `Status: Connected (${AIManager.modelName || 'Default Model'})`;
    } else {
      this.ui.connectionDot.className = 'status-dot offline';
      this.ui.connectionText.textContent = 'Status: Offline (Using fallback quests)';
    }
  },



  // ============================================
  // STAT POPUP MODAL LOGIC
  // ============================================
  showStatChangePopup(title, subtitle, changes, callback) {
    this.ui.statPopupTitle.textContent = title;
    this.ui.statPopupSubtitle.textContent = subtitle;
    this.ui.statPopupList.innerHTML = '';
    
    let hasChanges = false;
    
    if (changes.stats) {
      const statNames = {
        hp: { label: "Health (HP)", icon: "❤️" },
        maxHp: { label: "Max HP", icon: "💖" },
        ac: { label: "Armor Class (AC)", icon: "🛡️" },
        attackBonus: { label: "Attack Modifier", icon: "⚔️" },
        damageBonus: { label: "Damage Bonus", icon: "💥" }
      };
      
      for (const [key, val] of Object.entries(changes.stats)) {
        if (val !== 0) {
          hasChanges = true;
          const config = statNames[key] || { label: key, icon: "📊" };
          const row = document.createElement('div');
          row.className = `stat-change-row ${val > 0 ? 'positive' : 'negative'}`;
          row.innerHTML = `
            <span class="stat-change-icon">${config.icon}</span>
            <span class="stat-change-name">${config.label}</span>
            <span class="stat-change-val">${val > 0 ? '+' : ''}${val}</span>
          `;
          this.ui.statPopupList.appendChild(row);
        }
      }
    }
    
    if (changes.loot) {
      if (changes.loot.gold) {
        hasChanges = true;
        const row = document.createElement('div');
        row.className = 'stat-change-row neutral';
        row.innerHTML = `
          <span class="stat-change-icon">💰</span>
          <span class="stat-change-name">Gold</span>
          <span class="stat-change-val">+${changes.loot.gold}g</span>
        `;
        this.ui.statPopupList.appendChild(row);
      }
      if (changes.loot.xp) {
        hasChanges = true;
        const row = document.createElement('div');
        row.className = 'stat-change-row positive';
        row.innerHTML = `
          <span class="stat-change-icon">✨</span>
          <span class="stat-change-name">Experience (XP)</span>
          <span class="stat-change-val">+${changes.loot.xp} XP</span>
        `;
        this.ui.statPopupList.appendChild(row);
      }
    }
    
    if (!hasChanges) {
      const row = document.createElement('div');
      row.className = 'stat-change-row neutral';
      row.innerHTML = `
        <span class="stat-change-icon">📜</span>
        <span class="stat-change-name">No status changes.</span>
        <span class="stat-change-val">-</span>
      `;
      this.ui.statPopupList.appendChild(row);
    }
    
    this.ui.statChangeModal.classList.add('active');
    
    const onDismiss = () => {
      this.ui.statChangeModal.classList.remove('active');
      this.ui.closeStatPopupBtn.removeEventListener('click', onDismiss);
      if (callback) callback();
    };
    
    this.ui.closeStatPopupBtn.addEventListener('click', onDismiss);
  },

  updateInnUI() {
    this.ui.innGoldDisplay.textContent = this.player.gold;
    this.ui.innQuestsDisplay.textContent = this.questsCompletedCount;
    this.ui.innPlayerName.textContent = this.player.name;
    this.ui.innClassBadge.textContent = this.player.charClass;
    
    this.ui.innHpText.textContent = `${this.player.hp}/${this.player.maxHp}`;
    const hpPct = Math.max(0, (this.player.hp / this.player.maxHp) * 100);
    this.ui.innHpBar.style.width = `${hpPct}%`;

    this.ui.innXpText.textContent = `${this.player.xp}/${this.player.nextXp}`;
    const xpPct = Math.min(100, (this.player.xp / this.player.nextXp) * 100);
    this.ui.innXpBar.style.width = `${xpPct}%`;

    this.ui.innLevel.textContent = this.player.level;
    this.ui.innStatAtk.textContent = `+${this.player.attackBonus}`;
    this.ui.innStatAc.textContent = this.player.ac;
    this.ui.innStatDmg.textContent = `+${this.player.damageBonus}`;
    this.ui.innStatPotions.textContent = this.player.potions;

    // Render Inn avatar
    if (this.player.portrait) {
      document.getElementById('inn-avatar-img').src = this.player.portrait;
      document.getElementById('inn-avatar-img').classList.remove('hidden');
      document.getElementById('inn-avatar-placeholder').classList.add('hidden');
    } else {
      document.getElementById('inn-avatar-img').classList.add('hidden');
      document.getElementById('inn-avatar-placeholder').classList.remove('hidden');
    }

    // Rest button status
    this.ui.innRestBtn.disabled = this.player.gold < 10 || this.player.hp === this.player.maxHp;
    
    // Purchase buttons status with progressive cost and cap
    if (!this.player.shopBuys) {
      this.player.shopBuys = { damage: 0, ac: 0, attack: 0 };
    }

    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(btn => {
      const parentItem = btn.closest('.shop-item');
      if (!parentItem) return;
      const itemId = parentItem.id;
      
      let cost = 15;
      let capReached = false;
      let levelText = '';

      if (itemId === 'shop-potion') {
        cost = 15;
      } else if (itemId === 'shop-atk') {
        const count = this.player.shopBuys.damage || 0;
        cost = 40 + count * 40;
        capReached = count >= 5;
        levelText = ` (${count}/5)`;
        const effectEl = parentItem.querySelector('.item-effect');
        if (effectEl) effectEl.textContent = `+1 Permanent Damage Bonus${levelText}`;
      } else if (itemId === 'shop-ac') {
        const count = this.player.shopBuys.ac || 0;
        cost = 40 + count * 40;
        capReached = count >= 5;
        levelText = ` (${count}/5)`;
        const effectEl = parentItem.querySelector('.item-effect');
        if (effectEl) effectEl.textContent = `+1 Permanent AC${levelText}`;
      } else if (itemId === 'shop-modifier') {
        const count = this.player.shopBuys.attack || 0;
        cost = 50 + count * 50;
        capReached = count >= 5;
        levelText = ` (${count}/5)`;
        const effectEl = parentItem.querySelector('.item-effect');
        if (effectEl) effectEl.textContent = `+1 Permanent Attack Modifier${levelText}`;
      }

      // Update button visual
      if (capReached) {
        btn.textContent = 'SOLD OUT';
        btn.disabled = true;
      } else {
        btn.textContent = `${cost}g`;
        btn.disabled = this.player.gold < cost;
      }
      
      // Store dynamic cost to attribute
      btn.setAttribute('data-current-cost', cost);
    });
  },

  handleInnRest() {
    if (this.player.gold < 10 || this.player.hp === this.player.maxHp) return;
    this.player.gold -= 10;
    this.player.hp = this.player.maxHp;
    
    if (this.player.charClass === 'Wizard') {
      this.player.spellSlots = this.player.maxSpellSlots;
    }
    
    SoundEffects.playHeal();
    this.updateInnUI();
  },

  handleShopBuy(itemId, btn) {
    if (!this.player.shopBuys) {
      this.player.shopBuys = { damage: 0, ac: 0, attack: 0 };
    }

    const currentCost = parseInt(btn.getAttribute('data-current-cost') || '15');
    if (this.player.gold < currentCost) return;
    
    if (itemId === 'shop-potion') {
      this.player.gold -= currentCost;
      this.player.potions++;
      SoundEffects.playHeal();
    } else if (itemId === 'shop-atk') {
      const count = this.player.shopBuys.damage || 0;
      if (count >= 5) return;
      this.player.gold -= currentCost;
      this.player.shopBuys.damage = count + 1;
      this.player.damageBonus++;
      SoundEffects.playLanding();
    } else if (itemId === 'shop-ac') {
      const count = this.player.shopBuys.ac || 0;
      if (count >= 5) return;
      this.player.gold -= currentCost;
      this.player.shopBuys.ac = count + 1;
      this.player.ac++;
      SoundEffects.playLanding();
    } else if (itemId === 'shop-modifier') {
      const count = this.player.shopBuys.attack || 0;
      if (count >= 5) return;
      this.player.gold -= currentCost;
      this.player.shopBuys.attack = count + 1;
      this.player.attackBonus++;
      SoundEffects.playLanding();
    }

    this.saveActiveCharacter();
    this.updateInnUI();
  },

  async refreshQuestBoard() {
    this.ui.questCardsContainer.classList.add('hidden');
    this.ui.questsLoader.classList.remove('hidden');
    this.ui.refreshQuestsBtn.disabled = true;

    try {
      const quests = await AIManager.generateQuests(this.player.charClass, this.player.level);
      this.ui.questCardsContainer.innerHTML = '';
      
      quests.forEach(q => {
        const card = document.createElement('div');
        card.className = 'quest-card-item';
        card.innerHTML = `
          <div class="quest-info">
            <div class="quest-tag-row">
              <span class="quest-difficulty">${q.difficulty} Difficulty</span>
              <span class="quest-reward-hint">Reward: ${q.reward}</span>
            </div>
            <h3>${q.title}</h3>
            <p>${q.desc}</p>
          </div>
          <button class="btn btn-primary accept-btn">Embark</button>
        `;
        
        card.querySelector('.accept-btn').addEventListener('click', () => {
          this.startQuest(q);
        });
        
        this.ui.questCardsContainer.appendChild(card);
      });
      
    } catch (e) {
      console.error(e);
    } finally {
      this.ui.questsLoader.classList.add('hidden');
      this.ui.questCardsContainer.classList.remove('hidden');
      this.ui.refreshQuestsBtn.disabled = false;
    }
  },

  // ============================================
  // ADVENTURE / QUEST PATH LOOP
  // ============================================
  startQuest(quest) {
    this.activeQuest = quest;
    this.questStep = 1;
    this.questHistory = [];
    
    this.ui.innScreen.classList.remove('active');
    this.ui.questScreen.classList.add('active');
    
    this.ui.activeQuestTitle.textContent = quest.title;
    
    this.updateQuestPanelUI();
    this.loadNextQuestStep();
  },

  updateQuestPanelUI() {
    this.ui.questStepIndicator.textContent = `Step ${this.questStep} of 4`;
    this.ui.questStepBar.style.width = `${(this.questStep / 4) * 100}%`;
    this.ui.questHeroName.textContent = this.player.name;
    this.ui.questHpText.textContent = `${this.player.hp}/${this.player.maxHp}`;
    this.ui.questHpBar.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    
    this.ui.questAcVal.textContent = this.player.ac;
    this.ui.questAtkVal.textContent = `+${this.player.attackBonus}`;
    this.ui.questDmgVal.textContent = `+${this.player.damageBonus}`;
    this.ui.questPotionsVal.textContent = this.player.potions;

    if (this.player.charClass === 'Wizard') {
      this.ui.questSpellSlotsRow.classList.remove('hidden');
      this.ui.questSpellSlotsVal.textContent = `${this.player.spellSlots} / ${this.player.maxSpellSlots}`;
    } else {
      this.ui.questSpellSlotsRow.classList.add('hidden');
    }

    // Render Quest avatar
    if (this.player.portrait) {
      document.getElementById('quest-avatar-img').src = this.player.portrait;
      document.getElementById('quest-avatar-img').classList.remove('hidden');
      document.getElementById('quest-avatar-placeholder').classList.add('hidden');
    } else {
      document.getElementById('quest-avatar-img').classList.add('hidden');
      document.getElementById('quest-avatar-placeholder').classList.remove('hidden');
    }

    this.ui.questUsePotionBtn.disabled = this.player.potions <= 0 || this.player.hp === this.player.maxHp;
  },

  handleQuestPotionUse() {
    if (this.player.potions <= 0 || this.player.hp === this.player.maxHp) return;
    this.player.potions--;
    
    const r1 = Math.floor(Math.random() * 4) + 1;
    const r2 = Math.floor(Math.random() * 4) + 1;
    const heal = r1 + r2 + 2;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
    
    SoundEffects.playHeal();
    this.updateQuestPanelUI();
  },

  async loadNextQuestStep() {
    this.ui.choicesContainer.classList.add('hidden');
    this.ui.parchmentContainer.classList.add('hidden');
    this.ui.storyLoader.classList.remove('hidden');

    try {
      const stepData = await AIManager.generateQuestStep(
        this.player, 
        this.activeQuest.title, 
        this.questStep, 
        this.questHistory
      );
      
      this.currentChoices = stepData.choices;
      
      // Update UI elements
      this.ui.questNarrativeText.innerHTML = stepData.narrative.replace(/\n/g, "<br>");
      
      this.ui.choiceAText.textContent = this.currentChoices[0].text;
      this.ui.choiceBText.textContent = this.currentChoices[1].text;
      
    } catch (err) {
      console.error(err);
    } finally {
      this.ui.storyLoader.classList.add('hidden');
      this.ui.parchmentContainer.classList.remove('hidden');
      this.ui.choicesContainer.classList.remove('hidden');
    }
  },

  async handleChoiceSelect(index) {
    const choice = this.currentChoices[index];
    this.selectedChoice = choice;
    this.questHistory.push(choice.text);
    
    // Disable buttons
    this.ui.choiceABtn.disabled = true;
    this.ui.choiceBBtn.disabled = true;

    // Check if this choice text indicates a hardship check (picking lock, sneak, pass, force, search, climb, disarm)
    const textLower = choice.text.toLowerCase();
    const isCheck = textLower.includes('sneak') || 
                    textLower.includes('lock') || 
                    textLower.includes('pick') || 
                    textLower.includes('steal') || 
                    textLower.includes('climb') || 
                    textLower.includes('pass') || 
                    textLower.includes('force') || 
                    textLower.includes('search') ||
                    textLower.includes('avoid') ||
                    textLower.includes('disarm');

    if (isCheck) {
      // Intercept and open skill check modal!
      const dc = 10 + Math.floor(this.player.level * 1.5) + Math.floor(Math.random() * 5);
      
      // Calculate modifier based on class and details
      let mod = Math.max(0, this.player.attackBonus - 2);
      let label = "Attack Mod Base";
      const charClass = this.player.charClass;

      if ((textLower.includes('sneak') || textLower.includes('lock') || textLower.includes('pick') || textLower.includes('steal') || textLower.includes('disarm')) && charClass === 'Rogue') {
        mod += 5;
        label = "Rogue Agility Bonus";
      } else if ((textLower.includes('force') || textLower.includes('climb') || textLower.includes('break')) && charClass === 'Fighter') {
        mod += 5;
        label = "Fighter Athletics Bonus";
      } else if ((textLower.includes('search') || textLower.includes('inspect') || textLower.includes('magical') || textLower.includes('read')) && charClass === 'Wizard') {
        mod += 5;
        label = "Wizard Arcana Bonus";
      }

      // Update skill check modal UI
      document.getElementById('check-title').textContent = "Hardship Skill Check!";
      document.getElementById('check-desc').innerHTML = `You chose: <strong>"${choice.text}"</strong>.<br>A check is required to resolve this hardship safely.`;
      document.getElementById('check-dc-val').textContent = dc;
      document.getElementById('check-mod-details').textContent = `Your Modifier: +${mod} (${label})`;
      
      const banner = document.getElementById('check-result-banner');
      banner.textContent = "Roll the D20 to decide your fate!";
      banner.className = "dice-result-banner";
      
      const rollBtn = document.getElementById('roll-check-btn');
      const resolveBtn = document.getElementById('resolve-check-btn');
      
      rollBtn.style.display = 'block';
      rollBtn.disabled = false;
      resolveBtn.style.display = 'none';
      
      // Show check modal
      this.ui.skillCheckModal.classList.add('active');

      // Bind roll button once
      const onRollClick = async () => {
        rollBtn.disabled = true;
        
        const checkD20 = document.getElementById('check-d20');
        const roll = Math.floor(Math.random() * 20) + 1;
        
        checkD20.className = "dice d20 player-dice";
        await this.animateDiceRoll(checkD20, roll, true);
        
        const total = roll + mod;
        const success = total >= dc;
        
        if (success) {
          SoundEffects.playVictory();
          banner.textContent = `SUCCESS! Rolled ${roll} + ${mod} = ${total} (Met DC ${dc})!`;
          banner.className = "dice-result-banner success";
          
          this.log(`🎲 Skill Check Success: Rolled ${roll} + ${mod} = ${total} vs DC ${dc}.`, 'victory');
        } else {
          SoundEffects.playHit();
          banner.textContent = `FAILURE! Rolled ${roll} + ${mod} = ${total} (Failed DC ${dc})`;
          banner.className = "dice-result-banner fail";
          
          this.log(`🎲 Skill Check Failure: Rolled ${roll} + ${mod} = ${total} vs DC ${dc}.`, 'enemy-hit');

          // Apply punishment: 50% stat/gold loss, 50% ambush combat encounter!
          if (Math.random() < 0.5) {
            choice.type = 'combat';
            choice.monster = {
              name: "Ambushing Sentry",
              avatar: "👹",
              desc: "A hostile guardian alerted by your failure!",
              hp: 15 + this.player.level * 6,
              ac: 10 + this.player.level,
              dmgDice: 6,
              bonus: 2
            };
            this.log(`🚨 Alarm! Ambushed by an angry guardian!`, 'enemy-hit');
          } else {
            const hpLoss = 5 + Math.floor(this.player.level * 2);
            const goldLoss = Math.min(this.player.gold, 10 + this.player.level * 3);
            
            this.player.hp = Math.max(1, this.player.hp - hpLoss);
            this.player.gold -= goldLoss;
            
            if (!choice.reward) choice.reward = {};
            choice.reward.statChanges = { hp: -hpLoss };
            choice.reward.gold = -goldLoss;
            
            this.log(`💥 Penalty: Took ${hpLoss} damage and lost ${goldLoss} gold from your failure.`, 'enemy-hit');
            document.body.classList.add('flash-red');
            setTimeout(() => document.body.classList.remove('flash-red'), 300);
          }
        }

        rollBtn.style.display = 'none';
        resolveBtn.style.display = 'block';
      };

      rollBtn.onclick = onRollClick;
      resolveBtn.onclick = () => {
        this.ui.skillCheckModal.classList.remove('active');
        this.executeChoiceOutcome(choice);
      };
      
      return; // Stop execution here, wait for D20 roll modal
    }

    this.executeChoiceOutcome(choice);
  },

  async executeChoiceOutcome(choice) {
    // Track changes for the popup
    const changes = {
      stats: { hp: 0, ac: 0, attackBonus: 0, damageBonus: 0 },
      loot: { gold: 0, xp: 0 }
    };

    // Apply immediate stat changes (e.g. traps/heals)
    if (choice.reward && choice.reward.statChanges) {
      const mods = choice.reward.statChanges;
      if (mods.hp) {
        const oldHp = this.player.hp;
        this.player.hp = Math.max(1, Math.min(this.player.maxHp, this.player.hp + mods.hp));
        changes.stats.hp = this.player.hp - oldHp;
        
        if (mods.hp < 0) {
          SoundEffects.playHit();
          this.log(`💥 Trap! You took <strong>${Math.abs(mods.hp)}</strong> damage during your path selection.`, 'enemy-hit');
        } else {
          SoundEffects.playHeal();
          this.log(`✨ Aura: Healed for <strong>${mods.hp}</strong> HP.`, 'heal');
        }
      }
      if (mods.ac) {
        const oldAc = this.player.ac;
        this.player.ac = Math.max(8, this.player.ac + mods.ac);
        changes.stats.ac = this.player.ac - oldAc;
      }
      if (mods.attackBonus) {
        this.player.attackBonus += mods.attackBonus;
        changes.stats.attackBonus = mods.attackBonus;
      }
      if (mods.damageBonus) {
        this.player.damageBonus += mods.damageBonus;
        changes.stats.damageBonus = mods.damageBonus;
      }
    }

    // Apply general loot if not combat type (for combat, it's rewarded at victory)
    if (choice.type !== 'combat' && choice.reward) {
      const gold = choice.reward.gold || 0;
      const xp = choice.reward.xp || 0;
      
      // Handle Thief subclass quest bonus (+20% gold)
      let finalGold = gold;
      if (gold > 0 && this.player.subclass === 'Thief') {
        finalGold = Math.floor(gold * 1.20);
        this.log(`💰 Thief: Greed and agility awards you +20% Gold!`, 'system');
      }

      this.player.gold = Math.max(0, this.player.gold + finalGold);
      this.player.xp += xp;
      changes.loot.gold = finalGold;
      changes.loot.xp = xp;
      
      if (finalGold > 0 || xp > 0) {
        this.log(`Path Choice Outcome: Found <strong>${finalGold} Gold</strong> and gained <strong>${xp} XP</strong>.`, 'victory');
        SoundEffects.playVictory();
      }
    }

    this.updateQuestPanelUI();

    const hasStats = changes.stats.hp !== 0 || changes.stats.ac !== 0 || changes.stats.attackBonus !== 0 || changes.stats.damageBonus !== 0;
    const hasLoot = changes.loot.gold !== 0 || changes.loot.xp !== 0;

    const proceedChoice = async () => {
      // Check choice type
      if (choice.type === 'combat') {
        // Transition to Combat Screen!
        await new Promise(r => setTimeout(r, 600));
        this.startQuestCombat(choice.monster);
      } else {
        // Level checks
        if (this.player.xp >= this.player.nextXp) {
          this.gainXP(0); // evaluates level up checks
        }
        await new Promise(r => setTimeout(r, 1000));
        this.progressQuest();
      }
    };

    if (hasStats || hasLoot) {
      let subtitle = "Your character status has been updated by the environment.";
      if (changes.stats.hp < 0) {
        subtitle = "Ouch! You triggered a trap or obstacle along the way!";
      } else if (changes.stats.hp > 0) {
        subtitle = "Excellent! You recovered some attributes along the path.";
      }
      this.showStatChangePopup(
        "Quest Progression Update",
        subtitle,
        changes,
        proceedChoice
      );
    } else {
      await proceedChoice();
    }
  },

  progressQuest() {
    this.questStep++;
    this.ui.choiceABtn.disabled = false;
    this.ui.choiceBBtn.disabled = false;

    if (this.questStep > 4) {
      this.completeActiveQuest();
    } else {
      this.updateQuestPanelUI();
      this.loadNextQuestStep();
    }
  },

  async completeActiveQuest() {
    this.ui.choicesContainer.classList.add('hidden');
    this.ui.parchmentContainer.classList.add('hidden');
    this.ui.storyLoader.classList.remove('hidden');

    try {
      const completion = await AIManager.generateQuestEnding(this.player, this.activeQuest.title, this.questHistory);
      
      this.player.gold += completion.gold || 0;
      this.gainXP(completion.xp || 0);
      
      this.questsCompletedCount++;
      
      this.ui.questNarrativeText.innerHTML = `<strong>QUEST COMPLETE!</strong><br><br>${completion.narrative.replace(/\n/g, "<br>")}`;
      
      // Clear choices and show "Return to Inn" button instead
      this.ui.choicesContainer.innerHTML = '';
      const returnBtn = document.createElement('button');
      returnBtn.className = 'btn btn-primary btn-glow';
      returnBtn.style.gridColumn = '1 / -1';
      returnBtn.textContent = '🍻 Return to the Tavern Lobby';
      returnBtn.addEventListener('click', () => {
        // Re-align default choice buttons structure back
        this.resetChoiceButtons();
        this.ui.questScreen.classList.remove('active');
        this.ui.innScreen.classList.add('active');
        this.updateInnUI();
        this.refreshQuestBoard();
      });
      
      this.ui.choicesContainer.appendChild(returnBtn);
      SoundEffects.playVictory();
      
    } catch (e) {
      console.error(e);
    } finally {
      this.ui.storyLoader.classList.add('hidden');
      this.ui.parchmentContainer.classList.remove('hidden');
      this.ui.choicesContainer.classList.remove('hidden');
    }
  },

  resetChoiceButtons() {
    this.ui.choicesContainer.innerHTML = `
      <button class="btn btn-primary choice-card" id="choice-a-btn">
        <span class="choice-letter">A</span>
        <p id="choice-a-text">Choice A loading...</p>
      </button>
      <button class="btn btn-primary choice-card" id="choice-b-btn">
        <span class="choice-letter">B</span>
        <p id="choice-b-text">Choice B loading...</p>
      </button>
    `;
    this.ui.choiceABtn = document.getElementById('choice-a-btn');
    this.ui.choiceBBtn = document.getElementById('choice-b-btn');
    this.ui.choiceAText = document.getElementById('choice-a-text');
    this.ui.choiceBText = document.getElementById('choice-b-text');
    
    this.ui.choiceABtn.addEventListener('click', () => this.handleChoiceSelect(0));
    this.ui.choiceBBtn.addEventListener('click', () => this.handleChoiceSelect(1));
    this.ui.choiceABtn.disabled = false;
    this.ui.choiceBBtn.disabled = false;
  },

  async startQuestCombat(aiMonster) {
    this.ui.questScreen.classList.remove('active');
    this.ui.gameScreen.classList.add('active');

    // Convert AI stats to runtime enemy structure
    this.enemy = {
      name: aiMonster.name || "Unknown Fiend",
      avatar: aiMonster.avatar || "👾",
      desc: aiMonster.desc || "A mysterious creature blocking your path.",
      ac: aiMonster.ac || 12,
      maxHp: aiMonster.hp || 20,
      hp: aiMonster.hp || 20,
      dmgDice: aiMonster.dmgDice || 6,
      attackBonus: aiMonster.bonus || 2,
      statuses: { poison: 0, burn: 0, strength: 0, vulnerable: 0, weak: 0, shield: 0 }
    };

    // Initialize player statuses for combat
    if (!this.player.statuses) {
      this.player.statuses = { poison: 0, burn: 0, strength: 0, vulnerable: 0, weak: 0, shield: 0 };
    } else {
      this.player.statuses.poison = 0;
      this.player.statuses.burn = 0;
      this.player.statuses.strength = 0;
      this.player.statuses.vulnerable = 0;
      this.player.statuses.weak = 0;
      this.player.statuses.shield = 0;
    }

    this.combatTurnCount = 1;
    this.isPlayerTurn = true;
    this.ui.combatQuestTitle.textContent = this.activeQuest.title;
    
    // Assign monster elemental affinities and dice counts
    this.assignMonsterAffinities(this.enemy);

    // Clear logs
    this.ui.combatLog.innerHTML = '';
    this.log(`⚔️ <strong>Combat Start:</strong> You face a <strong>${this.enemy.name}</strong>!`, 'system');
    
    // Render affinity badges
    this.ui.enemyAffinityPanel.innerHTML = '';
    if (this.enemy.weaknesses && this.enemy.weaknesses.length > 0) {
      this.enemy.weaknesses.forEach(w => {
        const span = document.createElement('span');
        span.className = 'affinity-badge weak';
        span.innerHTML = `🔥 Weak: ${w}`;
        this.ui.enemyAffinityPanel.appendChild(span);
      });
    }
    if (this.enemy.resistances && this.enemy.resistances.length > 0) {
      this.enemy.resistances.forEach(r => {
        const span = document.createElement('span');
        span.className = 'affinity-badge resist';
        span.innerHTML = `🛡️ Resist: ${r}`;
        this.ui.enemyAffinityPanel.appendChild(span);
      });
    }

    this.updateCombatScreenUI();
    this.enableControls();
    
    this.ui.resultBanner.textContent = "Your Turn! Choose an action.";
    this.ui.resultBanner.className = "dice-result-banner";
  },

  assignMonsterAffinities(monster) {
    const name = monster.name.toLowerCase();
    monster.resistances = [];
    monster.weaknesses = [];
    
    if (name.includes('goblin') || name.includes('scamp') || name.includes('thief')) {
      monster.weaknesses.push('fire');
      monster.resistances.push('poison');
    } else if (name.includes('spider') || name.includes('centipede') || name.includes('bug')) {
      monster.weaknesses.push('fire');
      monster.resistances.push('poison');
    } else if (name.includes('skele') || name.includes('zombie') || name.includes('undead') || name.includes('ghost')) {
      monster.weaknesses.push('fire');
      monster.resistances.push('physical');
    } else if (name.includes('slime') || name.includes('ooze')) {
      monster.weaknesses.push('lightning');
      monster.resistances.push('physical');
    } else if (name.includes('dragon') || name.includes('fire') || name.includes('lava') || name.includes('demon')) {
      monster.weaknesses.push('ice');
      monster.resistances.push('fire');
    } else if (name.includes('ice') || name.includes('frost') || name.includes('yeti')) {
      monster.weaknesses.push('fire');
      monster.resistances.push('ice');
    } else {
      const types = ['fire', 'ice', 'lightning', 'poison', 'physical'];
      const r1 = Math.floor(Math.random() * types.length);
      const r2 = (r1 + 1 + Math.floor(Math.random() * (types.length - 1))) % types.length;
      monster.weaknesses.push(types[r1]);
      monster.resistances.push(types[r2]);
    }
    
    monster.diceCount = 1;
    if (monster.hp >= 50) {
      monster.diceCount = 3;
    } else if (monster.hp >= 30) {
      monster.diceCount = 2;
    }
  },

  updateCombatScreenUI() {
    this.ui.combatHpFraction.textContent = `${this.player.hp}/${this.player.maxHp}`;
    this.ui.playerGoldDisplay.textContent = this.player.gold;
    this.ui.combatPotionsCount.textContent = this.player.potions;
    
    this.ui.playerClassBadge.textContent = this.player.charClass;
    this.ui.playerNameDisplay.textContent = this.player.name;

    this.ui.playerHpText.textContent = `${this.player.hp}/${this.player.maxHp}`;
    this.ui.playerHpBar.style.width = `${(this.player.hp / this.player.maxHp) * 100}%`;
    
    this.ui.statAtkMod.textContent = `+${this.player.attackBonus}`;
    this.ui.statAc.textContent = this.player.ac;
    
    if (this.player.charClass === 'Wizard') {
      this.ui.statSpellSlots.textContent = `${this.player.spellSlots} / ${this.player.maxSpellSlots}`;
    } else {
      this.ui.statSpellSlots.textContent = 'N/A';
    }
    
    this.ui.statPotions.textContent = this.player.potions;

    // Render Combat avatar
    if (this.player.portrait) {
      document.getElementById('combat-avatar-img').src = this.player.portrait;
      document.getElementById('combat-avatar-img').classList.remove('hidden');
      document.getElementById('combat-avatar-placeholder').classList.add('hidden');
    } else {
      document.getElementById('combat-avatar-img').classList.add('hidden');
      document.getElementById('combat-avatar-placeholder').classList.remove('hidden');
    }

    // Enemy card
    this.ui.enemyName.textContent = this.enemy.name;
    this.ui.enemyAcVal.textContent = this.enemy.ac;
    this.ui.enemyDesc.textContent = this.enemy.desc;
    this.ui.enemyAvatar.textContent = this.enemy.avatar;
    this.ui.enemyHpText.textContent = `${this.enemy.hp}/${this.enemy.maxHp}`;
    this.ui.enemyHpBar.style.width = `${(this.enemy.hp / this.enemy.maxHp) * 100}%`;

    // Active buffs list
    this.ui.playerBuffsList.innerHTML = '';
    if (this.player.activeBuffs.length === 0) {
      this.ui.playerBuffsList.innerHTML = '<div class="empty-list-text">No active buffs.</div>';
    } else {
      this.player.activeBuffs.forEach(buff => {
        const item = document.createElement('div');
        item.className = 'buff-item-ui';
        item.innerHTML = `<span class="buff-ui-icon">${buff.icon}</span><div><span class="buff-ui-name">${buff.name}</span></div>`;
        this.ui.playerBuffsList.appendChild(item);
      });
    }

    // Dynamic skills buttons
    this.renderCombatSkillButtons();
    
    // Status Badges
    this.renderStatusBadges();
  },

  renderCombatSkillButtons() {
    this.ui.combatSkillsContainer.innerHTML = '';
    const active = this.player.activeSkills || [];
    
    if (active.length === 0) {
      this.ui.combatSkillsContainer.innerHTML = '<div style="color: #64748b; font-size: 0.75rem; text-align: center; width: 100%;">No skills equipped.</div>';
      return;
    }
    
    active.forEach(skillId => {
      const skill = SKILLS_DATABASE[skillId];
      if (!skill) return;
      
      const btn = document.createElement('button');
      btn.className = 'btn btn-action btn-secondary';
      btn.style.flex = '1';
      btn.style.fontSize = '0.8rem';
      btn.style.height = '40px';
      
      let costText = '';
      if (skill.slots) {
        costText = ` (${skill.slots} Slot)`;
      } else {
        const cd = this.player.cooldowns ? (this.player.cooldowns[skillId] || 0) : 0;
        if (cd > 0) {
          costText = ` (${cd}s)`;
        }
      }
      
      btn.innerHTML = `<span class="btn-icon">${skill.icon}</span> ${skill.name}${costText}`;
      
      // Hook up event click
      btn.addEventListener('click', () => this.handleUseSkill(skillId));
      this.ui.combatSkillsContainer.appendChild(btn);
    });
  },

  renderStatusBadges() {
    this.ui.playerStatusList.innerHTML = '';
    const pStatus = this.player.statuses || {};
    
    if (pStatus.shield > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('shield', '🛡️ Shield', pStatus.shield));
    }
    if (pStatus.poison > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('poison', '💀 Poison', pStatus.poison));
    }
    if (pStatus.burn > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('burn', '🔥 Burn', pStatus.burn));
    }
    if (pStatus.strength > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('strength', '💪 Str', pStatus.strength));
    }
    if (pStatus.vulnerable > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('vulnerable', '💢 Vuln', pStatus.vulnerable));
    }
    if (pStatus.weak > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('weak', '📉 Weak', pStatus.weak));
    }
    if (pStatus.regen > 0) {
      this.ui.playerStatusList.appendChild(this.createStatusBadge('poison', '🌿 Regen', pStatus.regen)); // green text color
    }
    
    this.ui.enemyStatusList.innerHTML = '';
    if (this.enemy) {
      const eStatus = this.enemy.statuses || {};
      
      if (eStatus.shield > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('shield', '🛡️ Shield', eStatus.shield));
      }
      if (eStatus.poison > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('poison', '💀 Poison', eStatus.poison));
      }
      if (eStatus.burn > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('burn', '🔥 Burn', eStatus.burn));
      }
      if (eStatus.strength > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('strength', '💪 Str', eStatus.strength));
      }
      if (eStatus.vulnerable > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('vulnerable', '💢 Vuln', eStatus.vulnerable));
      }
      if (eStatus.weak > 0) {
        this.ui.enemyStatusList.appendChild(this.createStatusBadge('weak', '📉 Weak', eStatus.weak));
      }
    }
  },
  
  createStatusBadge(className, label, count) {
    const el = document.createElement('span');
    el.className = `status-badge ${className}`;
    el.textContent = `${label} (${count})`;
    return el;
  },

  async handleUseSkill(skillId) {
    const skill = SKILLS_DATABASE[skillId];
    if (!skill) return;

    // Check cooldown or spell slots
    if (skill.slots) {
      if ((this.player.spellSlots || 0) < skill.slots) {
        this.log(`🔮 Not enough Spell Slots to cast ${skill.name}!`, 'system');
        return;
      }
    } else {
      const cd = this.player.cooldowns ? (this.player.cooldowns[skillId] || 0) : 0;
      if (cd > 0) {
        this.log(`⏳ ${skill.name} is on cooldown for ${cd} more turns!`, 'system');
        return;
      }
    }

    this.disableControls();
    this.ui.resultBanner.textContent = `Casting ${skill.name}...`;

    // Deduct slots or trigger cooldown
    if (skill.slots) {
      this.player.spellSlots -= skill.slots;
    } else {
      if (!this.player.cooldowns) this.player.cooldowns = {};
      this.player.cooldowns[skillId] = skill.cooldown;
    }

    this.updateCombatScreenUI();

    // 1. Spell Slots special subclasses logic
    if (skill.slots && this.player.subclass === 'Conjurer') {
      if (!this.player.statuses) this.player.statuses = {};
      this.player.statuses.shield = (this.player.statuses.shield || 0) + 2;
      this.log(`🔮 Conjurer Ward: Gained +2 Shield stacks on spell cast!`, 'system');
      this.updateCombatScreenUI();
    }

    // Resolve skill actions based on type
    if (skill.type === 'heal') {
      SoundEffects.playHeal();
      if (skillId === 'secondWind') {
        const roll = Math.floor(Math.random() * 10) + 1;
        const totalHeal = roll + this.player.level + (this.player.skillBuffs.secondWindBonus || 0);
        this.healPlayer(totalHeal);
        this.log(`🌬️ Second Wind: Healed for <strong>${totalHeal}</strong> HP.`, 'heal');
      } else if (skillId === 'healingAura') {
        this.player.statuses.regen = (this.player.statuses.regen || 0) + 4;
        this.log(`🌿 Healing Aura: Applied 4 Regen stacks (restore 3 HP/turn).`, 'heal');
      }
      this.updateCombatScreenUI();
      await new Promise(r => setTimeout(r, 1200));
      this.triggerEnemyTurn();

    } else if (skill.type === 'shield') {
      SoundEffects.playHeal();
      let shieldVal = 10;
      if (skillId === 'arcaneShield') {
        shieldVal = 15;
      } else if (skillId === 'shadowStep') {
        shieldVal = 15;
        this.enemy.statuses.vulnerable = (this.enemy.statuses.vulnerable || 0) + 1;
        this.log(`👣 Shadow Step: Applied 1 Vulnerable stack to ${this.enemy.name}!`, 'system');
      } else if (skillId === 'stoneSkin') {
        shieldVal = 10;
        this.player.statuses.strength = (this.player.statuses.strength || 0) + 1;
        this.log(`🪨 Stone Skin: Applied +1 Strength stack to self!`, 'system');
      }

      this.player.statuses.shield = (this.player.statuses.shield || 0) + shieldVal;
      this.log(`🛡️ Skill: Gained <strong>${shieldVal}</strong> Shield stacks.`, 'heal');
      
      this.updateCombatScreenUI();
      await new Promise(r => setTimeout(r, 1200));
      this.triggerEnemyTurn();

    } else if (skill.type === 'buff') {
      SoundEffects.playVictory();
      if (skillId === 'battleCry') {
        this.player.statuses.strength = (this.player.statuses.strength || 0) + 3;
        this.log(`🗣️ Battle Cry: Gained +3 Strength stacks (+6 flat damage) for 3 turns!`, 'system');
      } else if (skillId === 'sneakAttack') {
        this.player.sneakAttackCharge = true;
        this.log(`🗡️ Sneak Attack primed: Next hit deals double damage.`, 'system');
      } else if (skillId === 'ironWill') {
        this.healPlayer(20);
        this.player.statuses.strength = (this.player.statuses.strength || 0) + 3;
        this.log(`🦾 Iron Will: Healed 20 HP and gained +3 Strength for 2 turns!`, 'system');
      }
      
      this.updateCombatScreenUI();
      await new Promise(r => setTimeout(r, 1000));
      this.isPlayerTurn = true;
      this.enableControls();
      this.ui.resultBanner.textContent = "Your Turn! Attack!";

    } else if (skill.type === 'debuff') {
      SoundEffects.playMiss();
      if (skillId === 'smokeBomb') {
        this.enemy.statuses.weak = (this.enemy.statuses.weak || 0) + 2;
        this.enemy.attackBonus = Math.max(0, this.enemy.attackBonus - 2);
        this.log(`💨 Smoke Bomb: Enemy weak (-25% damage) and attack modifier reduced by 2!`, 'system');
      }
      
      this.updateCombatScreenUI();
      await new Promise(r => setTimeout(r, 1200));
      this.triggerEnemyTurn();

    } else {
      // Attacks and Damage skills
      this.ui.enemyHitFlash.style.opacity = '0.5';
      setTimeout(() => this.ui.enemyHitFlash.style.opacity = '0', 200);
      this.ui.enemyPanel.classList.add('shake');
      setTimeout(() => this.ui.enemyPanel.classList.remove('shake'), 450);

      let diceList = [];
      let type = skill.type; 
      let statBonus = 0;
      let flatBonus = 0;
      
      if (skillId === 'shieldSlam') {
        diceList.push({ count: 1, size: 6 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
        this.enemy.statuses.weak = (this.enemy.statuses.weak || 0) + 2;
      } else if (skillId === 'whirlwind') {
        diceList.push({ count: 2, size: 8 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
      } else if (skillId === 'recklessStrike') {
        diceList.push({ count: 3, size: 8 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
        this.player.statuses.vulnerable = (this.player.statuses.vulnerable || 0) + 1;
        this.log(`💥 Reckless Strike: Self-inflicted 1 Vulnerable stack (+50% damage taken)!`, 'system');
      } else if (skillId === 'heavyStrike') {
        diceList.push({ count: 4, size: 8 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
        this.enemy.statuses.weak = (this.enemy.statuses.weak || 0) + 1;
      } else if (skillId === 'poisonBlade') {
        diceList.push({ count: 1, size: 4 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
        this.enemy.statuses.poison = (this.enemy.statuses.poison || 0) + 3;
      } else if (skillId === 'bladeDance') {
        diceList.push({ count: 3, size: 4 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
      } else if (skillId === 'assassinate') {
        diceList.push({ count: 6, size: 4 });
        statBonus = Math.max(0, this.player.attackBonus - 2);
        this.enemy.statuses.vulnerable = (this.enemy.statuses.vulnerable || 0) + 2;
      } else if (skillId === 'fireball') {
        diceList.push({ count: 3, size: 6 });
        statBonus = Math.max(1, this.player.level);
        if (this.player.subclass === 'Evoker') {
          flatBonus += 3;
          this.log(`🔥 Evoker: Fireball gains +3 spell damage bonus!`, 'system');
        }
        this.enemy.statuses.burn = (this.enemy.statuses.burn || 0) + 2;
      } else if (skillId === 'frostbolt') {
        diceList.push({ count: 1, size: 8 });
        statBonus = Math.max(1, this.player.level);
        this.enemy.statuses.weak = (this.enemy.statuses.weak || 0) + 2;
      } else if (skillId === 'chainLightning') {
        diceList.push({ count: 4, size: 6 });
        statBonus = Math.max(1, this.player.level);
      } else if (skillId === 'disintegrate') {
        diceList.push({ count: 8, size: 6 });
        statBonus = Math.max(1, this.player.level);
      } else if (skillId === 'goldToss') {
        if (this.player.gold < 10) {
          this.log(`🪙 Not enough gold to cast Gold Toss!`, 'system');
          this.enableControls();
          return;
        }
        this.player.gold -= 10;
        flatBonus = 15;
        this.log(`🪙 Tossed 10 Gold coins to Bram's chagrin!`, 'system');
      }

      let rollSum = 0;
      if (diceList.length > 0) {
        rollSum = await this.rollDamageDice(diceList, true);
      }
      
      let baseDmg = rollSum + statBonus + flatBonus;
      let finalDmg = this.calculateFinalDamage(baseDmg, type, this.player, this.enemy);
      
      finalDmg = Math.max(1, finalDmg);
      const dealt = this.applyDamage(finalDmg, this.enemy);
      this.spawnFloatingText(dealt, true, false);
      SoundEffects.playCritical();

      this.log(`✨ Skill Cast: ${skill.name} deals <strong>${dealt}</strong> ${type} damage!`, 'player-hit');
      
      this.updateCombatScreenUI();
      
      if (this.enemy.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleCombatVictory();
      } else {
        await new Promise(r => setTimeout(r, 1200));
        this.triggerEnemyTurn();
      }
    }
  },

  openStatSheetModal() {
    this.statPointsLeft = this.player.statPoints || 0;
    this.allocatedStatPoints = { hp: 0, ac: 0, atk: 0, dmg: 0, slots: 0 };
    
    this.ui.sheetHeroName.textContent = this.player.name;
    this.ui.sheetHeroClass.textContent = this.player.charClass;
    this.ui.sheetHeroSubclass.textContent = this.player.subclass || 'No Subclass';
    this.ui.sheetHeroIdentity.textContent = `${this.player.gender || 'Unknown'}, ${this.player.race || 'Human'}, ${this.player.background || 'Soldier'}`;
    this.ui.sheetHeroLevel.textContent = this.player.level;
    this.ui.sheetHeroXp.textContent = `${this.player.xp}/${this.player.nextXp}`;
    
    if (this.player.portrait) {
      this.ui.sheetAvatarImg.src = this.player.portrait;
      this.ui.sheetAvatarImg.classList.remove('hidden');
      this.ui.sheetAvatarPlaceholder.classList.add('hidden');
    } else {
      this.ui.sheetAvatarImg.classList.add('hidden');
      this.ui.sheetAvatarPlaceholder.classList.remove('hidden');
    }
    
    const slotsRow = document.getElementById('sheet-spell-slots-row');
    if (slotsRow) {
      slotsRow.style.display = this.player.charClass === 'Wizard' ? 'flex' : 'none';
    }
    
    this.updateStatSheetUI();
    this.ui.statSheetModal.classList.add('active');
  },

  allocateStatPoint(stat) {
    if (this.statPointsLeft <= 0) return;
    if (stat === 'ac' && (this.player.ac + this.allocatedStatPoints.ac >= 20)) {
      alert("Armor Class is capped at 20!");
      return;
    }
    this.allocatedStatPoints[stat]++;
    this.statPointsLeft--;
    this.updateStatSheetUI();
    SoundEffects.playLanding();
  },

  confirmAllocatedStatPoints() {
    const changes = this.allocatedStatPoints;
    const hpInc = changes.hp * 3;
    const acInc = changes.ac;
    const atkInc = changes.atk;
    const dmgInc = changes.dmg;
    const slotsInc = changes.slots;
    
    this.player.maxHp += hpInc;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + hpInc);
    this.player.ac += acInc;
    this.player.attackBonus += atkInc;
    this.player.damageBonus += dmgInc;
    if (this.player.charClass === 'Wizard') {
      this.player.maxSpellSlots = (this.player.maxSpellSlots || 0) + slotsInc;
      this.player.spellSlots = Math.min(this.player.maxSpellSlots, (this.player.spellSlots || 0) + slotsInc);
    }
    
    this.player.statPoints = this.statPointsLeft;
    
    this.log(`永久 <strong>Attribute Upgrades:</strong> Permanent stats increased (+${hpInc} Max HP, +${acInc} AC, +${atkInc} Atk Mod, +${dmgInc} Dmg Bonus)!`, 'level-up');
    
    this.ui.statSheetModal.classList.remove('active');
    this.saveActiveCharacter();
    this.updateInnUI();
    this.updateQuestPanelUI();
    this.updateCombatScreenUI();
    SoundEffects.playVictory();
  },

  updateStatSheetUI() {
    this.ui.sheetStatPoints.textContent = this.statPointsLeft;
    
    const hp = this.player.maxHp + this.allocatedStatPoints.hp * 3;
    const ac = this.player.ac + this.allocatedStatPoints.ac;
    const atk = this.player.attackBonus + this.allocatedStatPoints.atk;
    const dmg = this.player.damageBonus + this.allocatedStatPoints.dmg;
    const slots = (this.player.maxSpellSlots || 0) + this.allocatedStatPoints.slots;
    
    this.ui.sheetValHp.textContent = hp;
    this.ui.sheetValAc.textContent = ac;
    this.ui.sheetValAtk.textContent = `+${atk}`;
    this.ui.sheetValDmg.textContent = `+${dmg}`;
    this.ui.sheetValSlots.textContent = slots;
    
    const pointsAllocated = Object.values(this.allocatedStatPoints).reduce((a, b) => a + b, 0);
    this.ui.confirmSheetStatsBtn.style.display = pointsAllocated > 0 ? 'inline-block' : 'none';
    this.ui.sheetPointsIndicator.style.display = this.statPointsLeft > 0 ? 'block' : 'none';
    
    const plusBtns = document.querySelectorAll('.sheet-stats-list .sheet-plus-btn');
    plusBtns.forEach(btn => {
      const stat = btn.getAttribute('data-stat');
      if (this.statPointsLeft <= 0) {
        btn.disabled = true;
      } else {
        if (stat === 'ac' && (this.player.ac + this.allocatedStatPoints.ac >= 20)) {
          btn.disabled = true;
        } else {
          btn.disabled = false;
        }
      }
    });
  },

  async animateDiceRoll(diceElement, finalValue, isD20 = true) {
    diceElement.classList.add('rolling');
    SoundEffects.playRoll();
    await new Promise(resolve => setTimeout(resolve, 1000));
    diceElement.classList.remove('rolling');
    SoundEffects.playLanding();

    const frontFace = diceElement.querySelector('.face.front');
    if (frontFace) frontFace.textContent = finalValue;
    
    if (isD20) {
      diceElement.style.transform = `rotateX(0deg) rotateY(0deg) rotateZ(${Math.random() * 20 - 10}deg)`;
    } else {
      let rotateTransform = '';
      const rollMap = finalValue > 6 ? (finalValue % 6) + 1 : finalValue;
      switch (rollMap) {
        case 1: rotateTransform = 'rotateX(0deg) rotateY(0deg)'; break;
        case 2: rotateTransform = 'rotateX(180deg) rotateY(0deg)'; break;
        case 3: rotateTransform = 'rotateX(0deg) rotateY(90deg)'; break;
        case 4: rotateTransform = 'rotateX(0deg) rotateY(-90deg)'; break;
        case 5: rotateTransform = 'rotateX(-90deg) rotateY(0deg)'; break;
        case 6: rotateTransform = 'rotateX(90deg) rotateY(0deg)'; break;
        default: rotateTransform = 'rotateX(0deg) rotateY(0deg)';
      }
      diceElement.style.transform = rotateTransform;
    }
    return finalValue;
  },

  async rollDamageDice(diceList, playerTheme = true) {
    const label = document.getElementById('damage-dice-label');
    let labelText = '';
    
    const existingDice = this.ui.damageDiceContainer.querySelectorAll('.dice');
    existingDice.forEach(d => d.remove());
    
    const diceElements = [];
    const values = [];
    
    diceList.forEach(dGroup => {
      labelText += (labelText ? ' + ' : '') + `${dGroup.count}d${dGroup.size}`;
      for (let i = 0; i < dGroup.count; i++) {
        const val = Math.floor(Math.random() * dGroup.size) + 1;
        values.push(val);
        
        const die = document.createElement('div');
        die.className = `dice d${dGroup.size === 20 ? '20' : '6'} ${playerTheme ? 'player-dice' : 'enemy-dice'}`;
        die.innerHTML = `
          <div class="face front">${val}</div>
          <div class="face back">1</div>
          <div class="face right">4</div>
          <div class="face left">3</div>
          <div class="face top">5</div>
          <div class="face bottom">2</div>
        `;
        this.ui.damageDiceContainer.appendChild(die);
        diceElements.push(die);
      }
    });
    
    label.textContent = `${labelText} Damage`;
    
    diceElements.forEach(die => die.classList.add('rolling'));
    SoundEffects.playRoll();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    diceElements.forEach((die, index) => {
      die.classList.remove('rolling');
      const front = die.querySelector('.face.front');
      if (front) front.textContent = values[index];
      
      let rotateTransform = '';
      const rollMap = values[index] > 6 ? (values[index] % 6) + 1 : values[index];
      switch (rollMap) {
        case 1: rotateTransform = 'rotateX(0deg) rotateY(0deg)'; break;
        case 2: rotateTransform = 'rotateX(180deg) rotateY(0deg)'; break;
        case 3: rotateTransform = 'rotateX(0deg) rotateY(90deg)'; break;
        case 4: rotateTransform = 'rotateX(0deg) rotateY(-90deg)'; break;
        case 5: rotateTransform = 'rotateX(-90deg) rotateY(0deg)'; break;
        case 6: rotateTransform = 'rotateX(90deg) rotateY(0deg)'; break;
        default: rotateTransform = 'rotateX(0deg) rotateY(0deg)';
      }
      die.style.transform = rotateTransform;
    });
    SoundEffects.playLanding();
    
    const sum = values.reduce((a, b) => a + b, 0);
    return sum;
  },

  calculateFinalDamage(baseDmg, type, attacker, defender) {
    let dmg = baseDmg;
    
    const attStrength = attacker.statuses ? (attacker.statuses.strength || 0) : 0;
    dmg += attStrength * 2;
    
    const attWeak = attacker.statuses ? (attacker.statuses.weak || 0) : 0;
    if (attWeak > 0) {
      dmg = Math.floor(dmg * 0.75);
    }
    
    const defVulnerable = defender.statuses ? (defender.statuses.vulnerable || 0) : 0;
    if (defVulnerable > 0) {
      dmg = Math.floor(dmg * 1.50);
    }
    
    if (defender.weaknesses && defender.weaknesses.includes(type)) {
      dmg = Math.floor(dmg * 1.50);
      this.log(`💥 Critical Weakness! Target is weak to <strong>${type}</strong>!`, 'system');
    }
    if (defender.resistances && defender.resistances.includes(type)) {
      dmg = Math.floor(dmg * 0.50);
      this.log(`🛡️ Resisted! Target is resistant to <strong>${type}</strong>.`, 'system');
    }
    
    if (defender.race === 'Dragonborn' && ['fire', 'ice', 'lightning'].includes(type)) {
      dmg = Math.floor(dmg * 0.90);
    }
    
    return Math.max(0, dmg);
  },

  applyDamage(amount, target) {
    let finalAmt = amount;
    const shield = target.statuses ? (target.statuses.shield || 0) : 0;
    
    if (shield > 0) {
      if (finalAmt <= shield) {
        target.statuses.shield -= finalAmt;
        this.log(`🛡️ Shield absorbed <strong>${finalAmt}</strong> damage!`, 'system');
        finalAmt = 0;
      } else {
        finalAmt -= shield;
        target.statuses.shield = 0;
        this.log(`🛡️ Shield absorbed <strong>${shield}</strong> damage and broke!`, 'system');
      }
    }
    
    target.hp = Math.max(0, target.hp - finalAmt);
    return finalAmt;
  },

  async handlePlayerAttack() {
    this.disableControls();
    this.ui.resultBanner.textContent = "Rolling Attack...";
    
    let natRoll = Math.floor(Math.random() * 20) + 1;
    this.ui.d20.className = "dice d20 player-dice";
    await this.animateDiceRoll(this.ui.d20, natRoll, true);
    
    // Lucky Trait Reroll
    if (natRoll === 1 && this.player.startingTrait === 'lucky') {
      this.log("🎲 <em>Lucky Gambler: Rerolling natural 1!</em>", "system");
      natRoll = Math.floor(Math.random() * 20) + 1;
      await this.animateDiceRoll(this.ui.d20, natRoll, true);
    }
    
    const attackTotal = natRoll + this.player.attackBonus;
    const isCrit = natRoll >= this.player.critRange;
    const isFumble = natRoll === 1;

    this.log(`🗡️ Attack: D20 (${natRoll}) + ${this.player.attackBonus} = <strong>${attackTotal}</strong> vs AC ${this.enemy.ac}`, 'player-roll');

    if (isFumble) {
      this.ui.resultBanner.textContent = "CRITICAL FUMBLE!";
      this.ui.resultBanner.className = "dice-result-banner fail";
      this.spawnFloatingText("FUMBLE!", false, true);
      SoundEffects.playMiss();
      await new Promise(r => setTimeout(r, 1200));
      this.triggerEnemyTurn();
    } else if (isCrit || attackTotal >= this.enemy.ac) {
      const isCritText = isCrit ? "CRITICAL HIT!" : "HIT!";
      this.ui.resultBanner.textContent = `${isCritText} Rolling Damage...`;
      this.ui.resultBanner.className = `dice-result-banner ${isCrit ? 'critical' : 'success'}`;

      this.ui.enemyHitFlash.style.opacity = '0.35';
      setTimeout(() => this.ui.enemyHitFlash.style.opacity = '0', 150);

      // Roll mixed damage dice count (increases with level)
      const count = this.player.level >= 3 ? 2 : 1;
      const diceList = [{ count: count, size: this.player.damageDice }];
      
      // BattleMaster bonus
      if (this.player.subclass === 'BattleMaster') {
        diceList.push({ count: 1, size: 4 });
      }

      const rollSum = await this.rollDamageDice(diceList, true);
      let baseDmg = rollSum + this.player.damageBonus;

      // Assassin bonus on turn 1
      if (this.player.subclass === 'Assassin' && this.combatTurnCount === 1) {
        baseDmg += 5;
        this.log(`🗡️ Assassin: First turn surprise strike deals +5 damage!`, 'system');
      }

      if (this.player.sneakAttackCharge) {
        baseDmg = Math.floor(baseDmg * this.player.skillBuffs.sneakMult);
        this.player.sneakAttackCharge = false;
      }

      let finalDmg = this.calculateFinalDamage(baseDmg, 'physical', this.player, this.enemy);
      if (isCrit) {
        finalDmg *= 2;
        SoundEffects.playCritical();
        this.ui.enemyPanel.classList.add('shake');
        setTimeout(() => this.ui.enemyPanel.classList.remove('shake'), 400);
      } else {
        SoundEffects.playHit();
      }

      finalDmg = Math.max(1, finalDmg);
      const dealt = this.applyDamage(finalDmg, this.enemy);
      this.spawnFloatingText(dealt, true, false);
      this.log(`🎯 Hit! Dealt <strong>${dealt}</strong> physical damage.`, 'player-hit');

      // Vampirism Heal
      if (this.player.vampirism > 0) {
        this.healPlayer(this.player.vampirism);
        this.log(`🧛 Vampiric Touch: Healed for <strong>${this.player.vampirism}</strong> HP.`, 'heal');
      }

      this.updateCombatScreenUI();

      if (this.enemy.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleCombatVictory();
      } else {
        await new Promise(r => setTimeout(r, 1200));
        this.triggerEnemyTurn();
      }
    } else {
      this.ui.resultBanner.textContent = "MISS!";
      this.ui.resultBanner.className = "dice-result-banner fail";
      this.spawnFloatingText("MISS", false, false);
      SoundEffects.playMiss();
      await new Promise(r => setTimeout(r, 1200));
      this.triggerEnemyTurn();
    }
  },

  async handlePlayerHeal() {
    if (this.player.potions <= 0) return;
    this.disableControls();
    this.player.potions--;
    this.ui.resultBanner.textContent = "Drinking Potion...";
    SoundEffects.playHeal();
    
    const r1 = Math.floor(Math.random() * 4) + 1;
    const r2 = Math.floor(Math.random() * 4) + 1;
    const heal = r1 + r2 + 2;
    this.healPlayer(heal);
    this.log(`🧪 Drink Healing Potion: Restore 2d4+2 (<strong>${heal}</strong>) HP.`, 'heal');
    
    this.updateCombatScreenUI();
    await new Promise(r => setTimeout(r, 1200));
    this.triggerEnemyTurn();
  },

  healPlayer(amount) {
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + amount);
    this.spawnFloatingText(amount, false, false, true);
  },

  disableControls() {
    this.ui.attackBtn.disabled = true;
    this.ui.healBtn.disabled = true;
    const skillBtns = this.ui.combatSkillsContainer.querySelectorAll('button');
    skillBtns.forEach(btn => btn.disabled = true);
  },

  enableControls() {
    if (!this.isPlayerTurn) return;
    this.ui.attackBtn.disabled = false;
    this.ui.healBtn.disabled = this.player.potions <= 0;
    
    const skillBtns = this.ui.combatSkillsContainer.querySelectorAll('button');
    skillBtns.forEach((btn, index) => {
      const skillId = this.player.activeSkills[index];
      const skill = SKILLS_DATABASE[skillId];
      if (skill) {
        if (skill.slots) {
          btn.disabled = this.player.spellSlots < skill.slots;
        } else {
          const currentCd = this.player.cooldowns ? (this.player.cooldowns[skillId] || 0) : 0;
          btn.disabled = currentCd > 0;
        }
      }
    });
  },

  triggerEnemyTurn() {
    this.isPlayerTurn = false;
    this.disableControls();
    
    // Decrement player cooldowns
    if (this.player.cooldowns) {
      Object.keys(this.player.cooldowns).forEach(key => {
        if (this.player.cooldowns[key] > 0) this.player.cooldowns[key]--;
      });
    }
    
    this.updateCombatScreenUI();
    setTimeout(() => this.handleEnemyTurnPhases(), 800);
  },
  
  async handleEnemyTurnPhases() {
    // 1. Enemy Burn end-of-turn check
    if (this.enemy.statuses && this.enemy.statuses.burn > 0) {
      const burnDmg = this.enemy.statuses.burn * 3;
      this.enemy.statuses.burn--;
      this.enemy.hp = Math.max(0, this.enemy.hp - burnDmg);
      this.spawnFloatingText(burnDmg, true, false);
      SoundEffects.playHit();
      this.log(`🔥 Burn: ${this.enemy.name} takes <strong>${burnDmg}</strong> fire damage.`, 'enemy-hit');
      this.updateCombatScreenUI();
      
      if (this.enemy.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleCombatVictory();
        return;
      }
      await new Promise(r => setTimeout(r, 800));
    }
    
    await this.handleEnemyAttack();
  },

  async handleEnemyAttack() {
    this.ui.resultBanner.textContent = "Enemy attacking...";
    
    // Red color dice theme
    this.ui.d20.className = "dice d20 enemy-dice";
    
    const natRoll = Math.floor(Math.random() * 20) + 1;
    await this.animateDiceRoll(this.ui.d20, natRoll, true);

    const totalAtk = natRoll + this.enemy.attackBonus;
    const isFumble = natRoll === 1;
    const isCrit = natRoll === 20;

    this.log(`👹 Enemy Roll: D20 (${natRoll}) + ${this.enemy.attackBonus} = <strong>${totalAtk}</strong> vs AC ${this.player.ac}`, 'enemy-roll');

    if (isFumble) {
      this.ui.resultBanner.textContent = "Enemy Fumbled!";
      this.ui.resultBanner.className = "dice-result-banner success";
      this.spawnFloatingText("MISS", true, false);
      SoundEffects.playMiss();
      await new Promise(r => setTimeout(r, 1200));
      this.handleEnemyTurnEnd();
    } else if (isCrit || totalAtk >= this.player.ac) {
      this.ui.resultBanner.textContent = "You were hit!";
      this.ui.resultBanner.className = "dice-result-banner fail";

      const diceCount = this.enemy.diceCount || 1;
      const diceList = [{ count: diceCount, size: this.enemy.dmgDice }];
      const dmgSum = await this.rollDamageDice(diceList, false);

      let finalDmg = this.calculateFinalDamage(dmgSum, 'physical', this.enemy, this.player);
      if (isCrit) {
        finalDmg *= 2;
        SoundEffects.playCritical();
      } else {
        SoundEffects.playHit();
      }

      document.body.classList.add('flash-red');
      setTimeout(() => document.body.classList.remove('flash-red'), 300);
      
      const container = document.getElementById('game-container');
      container.classList.add('shake');
      setTimeout(() => container.classList.remove('shake'), 400);

      const dealt = this.applyDamage(finalDmg, this.player);
      this.spawnFloatingText(dealt, false, false);
      this.log(`🩸 Take <strong>${dealt}</strong> damage from ${this.enemy.name}.`, 'enemy-hit');

      this.updateCombatScreenUI();

      if (this.player.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleGameOver();
      } else {
        await new Promise(r => setTimeout(r, 1200));
        this.handleEnemyTurnEnd();
      }
    } else {
      this.ui.resultBanner.textContent = "Enemy Missed!";
      this.ui.resultBanner.className = "dice-result-banner success";
      this.spawnFloatingText("MISS", false, false);
      SoundEffects.playMiss();
      await new Promise(r => setTimeout(r, 1200));
      this.handleEnemyTurnEnd();
    }
  },

  async handleEnemyTurnEnd() {
    // Player Burn check at the end of enemy turn
    if (this.player.statuses && this.player.statuses.burn > 0) {
      const burnDmg = this.player.statuses.burn * 3;
      this.player.statuses.burn--;
      this.player.hp = Math.max(0, this.player.hp - burnDmg);
      this.spawnFloatingText(burnDmg, false, false);
      SoundEffects.playHit();
      this.log(`🔥 Burn: You take <strong>${burnDmg}</strong> fire damage.`, 'enemy-hit');
      this.updateCombatScreenUI();
      
      if (this.player.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleGameOver();
        return;
      }
      await new Promise(r => setTimeout(r, 800));
    }
    
    this.startNextPlayerTurn();
  },

  async startNextPlayerTurn() {
    this.isPlayerTurn = true;
    this.combatTurnCount++;
    
    // Player Poison check at start of turn
    if (this.player.statuses && this.player.statuses.poison > 0) {
      const poisonDmg = this.player.statuses.poison * 2;
      this.player.statuses.poison--;
      this.player.hp = Math.max(0, this.player.hp - poisonDmg);
      this.spawnFloatingText(poisonDmg, false, false);
      SoundEffects.playHit();
      this.log(`💀 Poison: You take <strong>${poisonDmg}</strong> poison damage!`, 'enemy-hit');
      this.updateCombatScreenUI();
      
      if (this.player.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleGameOver();
        return;
      }
      await new Promise(r => setTimeout(r, 800));
    }

    // Player Regen check
    if (this.player.statuses && this.player.statuses.regen > 0) {
      this.player.statuses.regen--;
      this.healPlayer(3);
      this.log(`🌿 Regen: You heal <strong>3</strong> HP.`, 'heal');
      this.updateCombatScreenUI();
      await new Promise(r => setTimeout(r, 800));
    }
    
    // Enemy Poison check
    if (this.enemy.statuses && this.enemy.statuses.poison > 0) {
      const poisonDmg = this.enemy.statuses.poison * 2;
      this.enemy.statuses.poison--;
      this.enemy.hp = Math.max(0, this.enemy.hp - poisonDmg);
      this.spawnFloatingText(poisonDmg, true, false);
      SoundEffects.playHit();
      this.log(`💀 Poison: ${this.enemy.name} takes <strong>${poisonDmg}</strong> poison damage.`, 'player-hit');
      this.updateCombatScreenUI();
      
      if (this.enemy.hp <= 0) {
        await new Promise(r => setTimeout(r, 1000));
        this.handleCombatVictory();
        return;
      }
      await new Promise(r => setTimeout(r, 800));
    }
    
    this.enableControls();
    this.ui.resultBanner.textContent = "Your Turn! Attack!";
    this.ui.resultBanner.className = "dice-result-banner";
  },

  spawnFloatingText(value, isPlayerDealing, isCritText = false, isHeal = false) {
    const el = document.createElement('div');
    el.className = 'floating-damage';
    if (isCritText) {
      el.textContent = value;
      el.classList.add('miss');
    } else if (isHeal) {
      el.textContent = `+${value} HP`;
      el.classList.add('heal');
    } else if (value === "MISS") {
      el.textContent = "MISS";
      el.classList.add('miss');
    } else {
      el.textContent = value;
      el.classList.add(isPlayerDealing ? 'player-deal' : 'enemy-deal');
    }

    const xOffset = isPlayerDealing ? 60 + Math.random() * 20 : 30 + Math.random() * 20;
    const yOffset = isPlayerDealing ? 35 + Math.random() * 15 : 65 + Math.random() * 15;
    el.style.left = `${xOffset}%`;
    el.style.top = `${yOffset}%`;
    this.ui.damageTextLayer.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  },

  handleCombatVictory() {
    this.enemiesDefeatedCount++;
    SoundEffects.playVictory();
    
    // Apply Thief gold bonus (+20% gold from quests)
    let rewardText = `Victory over ${this.enemy.name}! `;
    if (this.selectedChoice && this.selectedChoice.reward) {
      let gold = this.selectedChoice.reward.gold || 0;
      const xp = this.selectedChoice.reward.xp || 0;
      
      if (this.player.subclass === 'Thief') {
        gold = Math.floor(gold * 1.20);
        this.log(`💰 Thief: Greed and agility awards you +20% Gold!`, 'system');
      }
      
      this.player.gold += gold;
      this.player.xp += xp;
      rewardText += `Gained <strong>${gold} Gold</strong> and <strong>${xp} XP</strong>.`;
      
      if (this.player.xp >= this.player.nextXp) {
        this.gainXP(0);
      }
    }
    
    this.log(rewardText, 'victory');

    // Save hero progress on victory
    this.saveActiveCharacter();

    // Hide combat controls during victory transition
    this.ui.attackBtn.style.display = 'none';
    this.ui.healBtn.style.display = 'none';
    this.ui.combatSkillsContainer.style.display = 'none';

    const contBtn = document.createElement('button');
    contBtn.className = 'btn btn-primary btn-action';
    contBtn.style.gridColumn = '1 / -1';
    contBtn.innerHTML = '🚶 Continue Journey';
    contBtn.addEventListener('click', () => {
      contBtn.remove();
      
      // Restore combat controls display
      this.ui.attackBtn.style.display = 'inline-flex';
      this.ui.healBtn.style.display = 'inline-flex';
      this.ui.combatSkillsContainer.style.display = 'flex';

      this.ui.gameScreen.classList.remove('active');
      this.ui.questScreen.classList.add('active');
      this.progressQuest();
    });

    this.ui.attackBtn.parentNode.appendChild(contBtn);
  },

  gainXP(amount) {
    this.player.xp += amount;
    if (this.player.xp >= this.player.nextXp) {
      this.player.xp -= this.player.nextXp;
      this.player.level++;
      this.player.nextXp = Math.floor(this.player.nextXp * 1.35);
      
      this.player.maxHp += 5;
      this.player.hp = this.player.maxHp;
      this.player.attackBonus += 1;
      
      // Award stat and skill points
      this.player.statPoints = (this.player.statPoints || 0) + 2;
      this.player.skillPoints = (this.player.skillPoints || 0) + 1;
      
      if (this.player.charClass === 'Wizard') {
        this.player.maxSpellSlots++;
        this.player.spellSlots = this.player.maxSpellSlots;
      }
      
      this.log(`🌟 <strong>LEVEL UP!</strong> Reached Level ${this.player.level}! +2 Attribute Points and +1 Skill Point awarded! HP restored.`, 'level-up');
    }
    this.saveActiveCharacter();
    this.updateQuestPanelUI();
  },

  handleGameOver() {
    SoundEffects.playGameOver();
    this.ui.gameScreen.classList.remove('active');
    this.ui.questScreen.classList.remove('active');
    this.ui.gameOverScreen.classList.add('active');
    
    this.ui.summaryClass.textContent = this.player.charClass;
    this.ui.summaryStage.textContent = this.questsCompletedCount;
    this.ui.summaryDefeated.textContent = this.enemiesDefeatedCount;
    this.ui.summaryGold.textContent = this.player.gold;
  },

  resetToTitle() {
    this.ui.gameOverScreen.classList.remove('active');
    this.ui.innScreen.classList.remove('active');
    this.ui.startScreen.classList.add('active');
  },

  log(message, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = message;
    this.ui.combatLog.appendChild(entry);
    this.ui.combatLog.scrollTop = this.ui.combatLog.scrollHeight;
  }
};

window.addEventListener('DOMContentLoaded', () => {
  GameState.init();
});
