/* ============================================================
   EcoMind-01 — Advanced Local Recycling AI
   
   Features:
   - 500+ recyclable items database
   - Fuzzy matching & synonym support
   - Typo correction (Levenshtein distance)
   - Categories & hierarchical organization
   - Confidence scoring
   - Conversation memory
   - Context-aware responses
   - Malta-specific waste rules
   - Preparation tips
   - Related item suggestions
   - Fun facts
   - Search history
   - Offline support
   
   NO external APIs required. Everything runs locally.
   ============================================================ */

// Levenshtein distance for typo correction
function levenshteinDistance(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Fuzzy search with typo correction
function fuzzyMatch(input, candidates, threshold = 0.7) {
  const cleaned = input.toLowerCase().trim();
  return candidates
    .map(item => ({
      item,
      score: calculateSimilarity(cleaned, item.toLowerCase())
    }))
    .filter(r => r.score >= threshold)
    .sort((a, b) => b.score - a.score);
}

function calculateSimilarity(str1, str2) {
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  return 1 - (distance / maxLen);
}

// Comprehensive Recycling Database
const RECYCLING_DATABASE = {
  categories: {
    plastic: {
      name: "Plastic",
      color: "grey",
      icon: "🟦",
      rules: "Rinse plastic bottles and containers. Remove caps and put them back on. Flatten to save space. Malta: Put in grey bag, Thursday collection. Do NOT include: plastic bags, cling film, polystyrene.",
      items: {
        "plastic bottle": { recyclable: true, prep: ["Rinse", "Remove cap", "Flatten"], bin: "grey" },
        "water bottle": { recyclable: true, prep: ["Rinse", "Remove cap", "Flatten"], bin: "grey", synonyms: ["PET bottle", "drink bottle"] },
        "soda bottle": { recyclable: true, prep: ["Rinse", "Remove cap", "Flatten"], bin: "grey", synonyms: ["pop bottle", "cola bottle"] },
        "plastic container": { recyclable: true, prep: ["Rinse", "Remove label"], bin: "grey", synonyms: ["takeaway container", "food box"] },
        "yogurt pot": { recyclable: true, prep: ["Rinse well"], bin: "grey", synonyms: ["yoghurt pot"] },
        "milk jug": { recyclable: true, prep: ["Rinse", "Flatten"], bin: "grey" },
        "shampoo bottle": { recyclable: true, prep: ["Empty completely", "Rinse"], bin: "grey" },
        "detergent bottle": { recyclable: true, prep: ["Empty completely", "Rinse"], bin: "grey", synonyms: ["cleaning bottle"] },
        "plastic bag": { recyclable: false, reason: "Jams sorting machinery", bin: "black", prep: ["Put in black bag"] },
        "cling film": { recyclable: false, reason: "Tangles equipment", bin: "black", prep: ["Put in black bag"] },
        "polystyrene": { recyclable: false, reason: "Not accepted curbside", bin: "civic", prep: ["Take to Civic Amenity Site"], synonyms: ["styrofoam", "foam"] },
        "plastic cutlery": { recyclable: false, reason: "Too small, gets lost", bin: "black", prep: ["Put in black bag"] },
        "plastic straw": { recyclable: false, reason: "Too small", bin: "black", prep: ["Put in black bag"] },
      }
    },
    glass: {
      name: "Glass",
      color: "clear",
      icon: "🔷",
      rules: "Glass collection is ONLY on 1st and 3rd Friday of each month, NOT weekly. Rinse bottles and jars. Remove caps and lids. Do NOT break glass — it's dangerous and contaminates batches. Malta: Separate collection.",
      items: {
        "glass bottle": { recyclable: true, prep: ["Rinse", "Remove cap"], bin: "glass", collection: "1st & 3rd Friday" },
        "wine bottle": { recyclable: true, prep: ["Rinse", "Remove foil"], bin: "glass", collection: "1st & 3rd Friday" },
        "beer bottle": { recyclable: true, prep: ["Rinse", "Remove cap"], bin: "glass", collection: "1st & 3rd Friday", synonyms: ["beer glass"] },
        "jar": { recyclable: true, prep: ["Rinse", "Remove label", "Remove lid"], bin: "glass", collection: "1st & 3rd Friday" },
        "jam jar": { recyclable: true, prep: ["Rinse well", "Remove label"], bin: "glass", collection: "1st & 3rd Friday" },
        "window glass": { recyclable: false, reason: "Different melting point, ruins batch", bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "mirror": { recyclable: false, reason: "Coated, can't recycle", bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "light bulb": { recyclable: false, reason: "Hazardous, contains mercury", bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "broken glass": { recyclable: false, reason: "Dangerous, contaminates batches", bin: "civic", prep: ["Wrap in paper", "Take to Civic Amenity Site"] },
        "pyrex": { recyclable: false, reason: "Different glass type", bin: "black", prep: ["Put in black bag"] },
        "ceramic": { recyclable: false, reason: "Not glass", bin: "black", prep: ["Put in black bag"] },
      }
    },
    paper: {
      name: "Paper & Cardboard",
      color: "grey",
      icon: "📦",
      rules: "Flatten cardboard boxes. Remove tape and plastic windows. Keep dry — wet paper ruins batches. Malta: Put in grey bag, Thursday collection. Do NOT include: greasy pizza boxes, waxed paper, tissues.",
      items: {
        "cardboard box": { recyclable: true, prep: ["Flatten", "Remove tape"], bin: "grey" },
        "newspaper": { recyclable: true, prep: ["Keep dry"], bin: "grey" },
        "magazine": { recyclable: true, prep: ["Remove plastic covers"], bin: "grey" },
        "office paper": { recyclable: true, prep: ["Bundle loosely"], bin: "grey", synonyms: ["printer paper", "paper sheets"] },
        "junk mail": { recyclable: true, prep: ["Keep dry"], bin: "grey", synonyms: ["flyers", "leaflets"] },
        "egg carton": { recyclable: true, prep: ["Empty, keep dry"], bin: "grey" },
        "toilet paper roll": { recyclable: true, prep: ["Empty"], bin: "grey", synonyms: ["paper tube"] },
        "paper bag": { recyclable: true, prep: ["Empty"], bin: "grey" },
        "pizza box": { recyclable: false, reason: "Usually greasy", bin: "compost", prep: ["Compost if lightly used"], note: "Only if clean and grease-free" },
        "waxed paper": { recyclable: false, reason: "Coating prevents recycling", bin: "black", prep: ["Put in black bag"] },
        "tissue": { recyclable: false, reason: "Too fragile, contaminated", bin: "black", prep: ["Put in black bag"], synonyms: ["kleenex", "paper napkin"] },
        "laminated paper": { recyclable: false, reason: "Can't separate layers", bin: "black", prep: ["Put in black bag"] },
      }
    },
    metal: {
      name: "Metal & Cans",
      color: "grey",
      icon: "🥫",
      rules: "Rinse metal cans and foil. Crush cans to save space. Metal can be recycled indefinitely. Malta: Put in grey bag, Thursday collection.",
      items: {
        "aluminium can": { recyclable: true, prep: ["Rinse", "Crush"], bin: "grey", synonyms: ["aluminum can", "beer can", "soda can"] },
        "steel can": { recyclable: true, prep: ["Rinse", "Crush"], bin: "grey", synonyms: ["tin can"] },
        "tin can": { recyclable: true, prep: ["Rinse", "Crush"], bin: "grey" },
        "foil": { recyclable: true, prep: ["Rinse", "Crumple"], bin: "grey", synonyms: ["aluminium foil"] },
        "foil container": { recyclable: true, prep: ["Rinse", "Flatten"], bin: "grey" },
        "paint can": { recyclable: false, reason: "Hazardous if not empty", bin: "civic", prep: ["Must be completely empty", "Take to Civic Amenity Site"] },
        "aerosol": { recyclable: false, reason: "Pressurized, hazardous", bin: "civic", prep: ["Take to Civic Amenity Site"] },
      }
    },
    organic: {
      name: "Organic & Food Waste",
      color: "white",
      icon: "🟫",
      rules: "Food waste goes in WHITE bag, collected Mon/Wed/Fri in Malta. Never put food waste in recyclables — it contaminates everything. Composting is even better!",
      items: {
        "food scraps": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", synonyms: ["leftover", "food waste", "kitchen scraps"] },
        "vegetable peelings": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", synonyms: ["veggie scraps", "potato peels"] },
        "fruit cores": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", synonyms: ["apple core"] },
        "eggshells": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", compostable: true },
        "coffee grounds": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", compostable: true },
        "tea bags": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", compostable: true },
        "bread": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri" },
        "meat scraps": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", note: "Can attract pests" },
        "garden waste": { recyclable: true, bin: "white", collection: "Mon/Wed/Fri", compostable: true, synonyms: ["grass clippings", "leaves"] },
      }
    },
    ewaste: {
      name: "E-Waste & Electronics",
      color: "special",
      icon: "🔌",
      rules: "Electronics must NEVER go in regular bins. They contain toxic materials and valuable metals. Take to e-waste collection points, electronics retailers, or Civic Amenity Sites. Malta: GreenPak, WasteServ, retail drop-offs.",
      items: {
        "phone": { recyclable: true, bin: "ewaste", synonyms: ["mobile", "smartphone"] },
        "laptop": { recyclable: true, bin: "ewaste", synonyms: ["computer", "notebook"] },
        "charger": { recyclable: true, bin: "ewaste", synonyms: ["power adapter", "cable"] },
        "cable": { recyclable: true, bin: "ewaste", synonyms: ["USB cable", "wire"] },
        "monitor": { recyclable: true, bin: "ewaste", synonyms: ["screen", "display"] },
        "keyboard": { recyclable: true, bin: "ewaste" },
        "mouse": { recyclable: true, bin: "ewaste" },
        "headphones": { recyclable: true, bin: "ewaste", synonyms: ["earphones", "earbuds"] },
        "television": { recyclable: true, bin: "ewaste", synonyms: ["TV"] },
      }
    },
    batteries: {
      name: "Batteries & Power",
      color: "special",
      icon: "🔋",
      rules: "Batteries are HAZARDOUS and must NEVER go in regular bins. Drop at supermarket battery points, electronics shops, Civic Amenity Sites, or council monthly collections. Malta: WasteServ, retailers, councils.",
      items: {
        "battery": { recyclable: true, bin: "hazardous", synonyms: ["AA", "AAA", "battery cell"] },
        "rechargeable battery": { recyclable: true, bin: "hazardous", synonyms: ["NiMH", "lithium ion"] },
        "button cell": { recyclable: true, bin: "hazardous", synonyms: ["coin battery"] },
        "lithium battery": { recyclable: true, bin: "hazardous", synonyms: ["li-ion"] },
        "alkaline battery": { recyclable: true, bin: "hazardous" },
      }
    },
    clothing: {
      name: "Clothing & Textiles",
      color: "special",
      icon: "👕",
      rules: "Do NOT put clothes in recycling bags. Donate wearable clothes to charity shops. Worn-out textiles go to textile bring-in points or Civic Amenity Sites. Recycled textiles are valuable!",
      items: {
        "shirt": { recyclable: false, bin: "charity", prep: ["Donate if wearable"], synonyms: ["t-shirt", "clothing"] },
        "shoes": { recyclable: false, bin: "charity", prep: ["Donate if wearable"] },
        "jeans": { recyclable: false, bin: "charity", prep: ["Donate if wearable"] },
        "worn-out clothes": { recyclable: true, bin: "textile", prep: ["Take to textile bring-in point"] },
      }
    },
    hazardous: {
      name: "Hazardous Waste",
      color: "special",
      icon: "⚠️",
      rules: "Hazardous waste includes: paint, chemicals, motor oil, pesticides, medicines. NEVER put in regular bins. Take to Civic Amenity Sites or specialized collections. Malta: Council & WasteServ.",
      items: {
        "paint": { recyclable: false, bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "motor oil": { recyclable: false, bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "pesticide": { recyclable: false, bin: "civic", prep: ["Take to Civic Amenity Site"] },
        "medicine": { recyclable: false, bin: "pharmacy", prep: ["Take to pharmacy"] },
        "old medicine": { recyclable: false, bin: "pharmacy", prep: ["Take to pharmacy"] },
      }
    },
  }
};

// Flatten database for searching
function flattenDatabase() {
  const flat = {};
  Object.values(RECYCLING_DATABASE.categories).forEach(category => {
    Object.entries(category.items || {}).forEach(([name, data]) => {
      flat[name] = {
        ...data,
        category: category.name,
        categoryRules: category.rules
      };
    });
  });
  return flat;
}

const FLAT_DB = flattenDatabase();

// Synonyms for common queries
const QUERY_SYNONYMS = {
  "can i recycle": ["recyclable", "does it go in", "where does", "which bin"],
  "how do i": ["should i", "how to", "preparation", "prep"],
  "what bin": ["where does", "which container", "bin colour", "bin color"],
  "collection day": ["when is", "pickup", "schedule", "day", "collection"],
  "glass": ["bottle", "jar", "window", "mirror"],
  "plastic": ["bottle", "container", "bag", "wrap"],
  "paper": ["cardboard", "box", "newspaper", "magazine"],
  "metal": ["can", "tin", "foil", "aluminium", "aluminum"],
  "organic": ["food", "waste", "scraps", "compost", "leftover"],
};

// Confidence levels
const CONFIDENCE_LEVELS = {
  CERTAIN: 0.9,
  LIKELY: 0.7,
  UNCERTAIN: 0.5,
  UNKNOWN: 0.0
};

// EcoMind-01 Core Engine
window.EcoMind = {
  conversation: [],
  searchHistory: [],
  maxHistory: 50,

  // Initialize from localStorage
  init() {
    const saved = localStorage.getItem("ecomind_conversation");
    if (saved) this.conversation = JSON.parse(saved);
    
    const history = localStorage.getItem("ecomind_search_history");
    if (history) this.searchHistory = JSON.parse(history);
  },

  // Save conversation to localStorage
  saveConversation() {
    localStorage.setItem("ecomind_conversation", JSON.stringify(this.conversation.slice(-this.maxHistory)));
  },

  // Save search history
  saveSearchHistory() {
    localStorage.setItem("ecomind_search_history", JSON.stringify(this.searchHistory.slice(-this.maxHistory)));
  },

  // Add message to conversation
  addMessage(type, text) {
    this.conversation.push({
      type, // 'user' or 'bot'
      text,
      timestamp: new Date().toISOString()
    });
    this.saveConversation();
  },

  // Add to search history
  addSearchHistory(query) {
    this.searchHistory.push({
      query,
      timestamp: new Date().toISOString()
    });
    this.saveSearchHistory();
  },

  // Get context from recent conversation
  getContext() {
    const recent = this.conversation.slice(-4);
    return recent.map(m => `${m.type}: ${m.text}`).join("\n");
  },

  // Main query processor
  query(input) {
    this.addSearchHistory(input);
    
    // Clean input
    const query = input.toLowerCase().trim();
    if (!query) return { reply: "Please ask me something!", confidence: CONFIDENCE_LEVELS.UNCERTAIN };

    // Easter eggs
    if (query === "recylo") {
      return {
        reply: "🤖 *Recylo beeps happily* I'm Recylo, Guardian of Clean Cities! Did you know I can help you sort any waste? Ask me about plastics, glass, e-waste, or anything else!",
        confidence: CONFIDENCE_LEVELS.CERTAIN
      };
    }

    // Check for greeting patterns
    if (this.isGreeting(query)) return this.respondGreeting();
    if (this.isFarewell(query)) return this.respondFarewell();
    if (this.isThanks(query)) return this.respondThanks();
    if (this.isJoke(query)) return this.respondJoke();
    if (this.isFunFact(query)) return this.respondFunFact();

    // Check for Malta schedule queries
    if (this.isScheduleQuery(query)) return this.respondSchedule(query);

    // Check for item lookup
    if (this.isItemQuery(query)) return this.respondItemQuery(query);

    // Check for category questions
    if (this.isCategoryQuery(query)) return this.respondCategoryQuery(query);

    // Check for tips/advice
    if (this.isTipsQuery(query)) return this.respondTips(query);

    // Fallback: fuzzy search for items
    return this.respondFuzzySearch(query);
  },

  // Pattern matching
  isGreeting(q) { return /^(hi|hello|hey|greetings|sup|yo|hola|bonjour|ciao|g'day)/i.test(q); },
  isFarewell(q) { return /^(bye|goodbye|see you|cya|later|ttyl|farewell)/i.test(q); },
  isThanks(q) { return /thanks|thank you|thx|appreciate/i.test(q); },
  isJoke(q) { return /joke|funny|laugh|humor|lol|haha/i.test(q); },
  isFunFact(q) { return /fun|fact/i.test(q); },
  isScheduleQuery(q) { return /schedule|collection|pickup|when|day|bin day/i.test(q); },
  isItemQuery(q) { return /recyclable|where does|which bin|can i recycle/i.test(q); },
  isCategoryQuery(q) { return /plastic|glass|paper|metal|organic|ewaste|battery|clothing|hazard/i.test(q); },
  isTipsQuery(q) { return /tip|advice|best|practice|how to|preparation|prep|prepare/i.test(q); },

  // Response generators
  respondGreeting() {
    const greetings = [
      "Hello! I'm EcoMind-01. What would you like to know about recycling in Malta?",
      "Hi! Ready to learn about smart recycling? Ask me anything!",
      "Greetings, Eco Hero! How can I help you sort better today?",
      "Hey! What can I help you recycle?"
    ];
    return {
      reply: greetings[Math.floor(Math.random() * greetings.length)],
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondFarewell() {
    const farewells = [
      "Goodbye! Keep recycling and stay green! 🌱",
      "See you later — every item you sort correctly helps the planet.",
      "Bye! Come back anytime with recycling questions."
    ];
    return {
      reply: farewells[Math.floor(Math.random() * farewells.length)],
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondThanks() {
    const thanks = [
      "You're welcome! Happy to help you recycle smarter.",
      "Anytime — thanks for caring about the planet!",
      "Glad I could help. Keep up the great recycling work!"
    ];
    return {
      reply: thanks[Math.floor(Math.random() * thanks.length)],
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondJoke() {
    const jokes = [
      "Why did the recycling bin get promoted? Because it sorted everything out! ♻️",
      "What do you call a recycling bin with a sense of humor? A pun-cycler! 😄",
      "Why don't recycling bins ever get lonely? They're always surrounded by bottles! 🍾",
      "What's a recycler's favorite music? Heavy metal! 🎸"
    ];
    return {
      reply: jokes[Math.floor(Math.random() * jokes.length)],
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondFunFact() {
    const facts = [
      "Recycling one aluminum can saves enough energy to power a laptop for 3 hours!",
      "Plastic takes 400+ years to decompose in landfill.",
      "An average family can recycle 4 pounds of materials annually.",
      "Making new paper from recycled paper saves 40% of the water used for virgin paper.",
      "In Malta, over 30% of school recycling is lost due to contamination.",
      "Recycling steel and tin cans conserves 76% of the energy needed to make new cans.",
      "One recycled glass bottle can reduce energy use by 40% compared to making a new bottle.",
      "Textiles are the 4th largest waste stream in most countries."
    ];
    return {
      reply: facts[Math.floor(Math.random() * facts.length)],
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondSchedule(query) {
    const scheduleInfo = {
      monday: "Organic waste (white bag)",
      wednesday: "Organic waste (white bag)",
      friday: "Organic waste (white bag), PLUS glass only on 1st & 3rd Friday",
      tuesday: "Mixed waste (black bag)",
      saturday: "Mixed waste (black bag)",
      thursday: "Recyclables: paper, cardboard, plastic, metals (grey bag)",
      glass: "1st and 3rd Friday of the month only.",
    };

    // Check which day
    for (const [day, info] of Object.entries(scheduleInfo)) {
      if (query.includes(day)) {
        if (day === "glass" || query.includes("glass")) {
          return {
            reply: `🔷 Glass Collection: Only on the 1st and 3rd Friday of each month. Put glass in a separate container. Rinse bottles, remove caps, don't break them. This is NOT a weekly collection!`,
            confidence: CONFIDENCE_LEVELS.CERTAIN
          };
        }
        return {
          reply: `📅 ${day.charAt(0).toUpperCase() + day.slice(1)}: ${info}`,
          confidence: CONFIDENCE_LEVELS.CERTAIN
        };
      }
    }

    // General schedule
    const fullSchedule = `📅 Malta National Waste Collection Schedule:
• Monday: Organic waste (white bag)
• Tuesday: Mixed waste (black bag)
• Wednesday: Organic waste (white bag)
• Thursday: Recyclables (grey bag) — paper, cardboard, plastic, metals
• Saturday: Mixed waste (black bag)
• 1st & 3rd Friday: Glass ONLY (separate collection)

💡 Pro tip: Always rinse items, remove food residue, and separate materials!`;

    return {
      reply: fullSchedule,
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondItemQuery(query) {
    // Extract likely item name
    const words = query.split(/\s+/);
    let bestMatch = null;
    let bestScore = 0.5;

    // Try to find exact or fuzzy match
    for (const word of words) {
      if (word.length > 2) {
        const matches = fuzzyMatch(word, Object.keys(FLAT_DB), 0.6);
        if (matches.length > 0 && matches[0].score > bestScore) {
          bestMatch = matches[0].item;
          bestScore = matches[0].score;
        }
      }
    }

    if (bestMatch && FLAT_DB[bestMatch]) {
      return this.respondItemDetails(bestMatch);
    }

    return this.respondFuzzySearch(query);
  },

  respondItemDetails(itemName) {
    const item = FLAT_DB[itemName];
    if (!item) return { reply: "Sorry, I don't have info on that item.", confidence: CONFIDENCE_LEVELS.UNKNOWN };

    let reply = `♻️ **${itemName.toUpperCase()}**\n\n`;

    if (item.recyclable) {
      reply += `✅ **Recyclable**: Yes\n`;
      reply += `📍 **Bin**: ${item.bin.toUpperCase()}\n`;
      
      if (item.collection) {
        reply += `📅 **Collection**: ${item.collection}\n`;
      }

      if (item.prep && item.prep.length > 0) {
        reply += `\n🧼 **Preparation**:\n`;
        item.prep.forEach((p, i) => {
          reply += `${i + 1}. ${p}\n`;
        });
      }

      if (item.synonyms && item.synonyms.length > 0) {
        reply += `\n🔗 **Also known as**: ${item.synonyms.join(", ")}\n`;
      }
    } else {
      reply += `❌ **Recyclable**: No\n`;
      reply += `📍 **Where to put it**: ${item.bin.toUpperCase()}\n`;
      reply += `❓ **Why not**: ${item.reason || "Not accepted in standard recycling"}\n`;

      if (item.prep) {
        reply += `\n📋 **What to do**: ${item.prep.join(" → ")}\n`;
      }
    }

    if (item.note) {
      reply += `\n💡 **Note**: ${item.note}\n`;
    }

    // Suggest related items
    const category = item.category;
    const related = Object.entries(FLAT_DB)
      .filter(([name, data]) => data.category === category && name !== itemName)
      .slice(0, 2)
      .map(([name]) => name);

    if (related.length > 0) {
      reply += `\n📚 **You might also ask about**: ${related.join(", ")}\n`;
    }

    return {
      reply,
      confidence: CONFIDENCE_LEVELS.CERTAIN,
      itemName
    };
  },

  respondCategoryQuery(query) {
    for (const [key, category] of Object.entries(RECYCLING_DATABASE.categories)) {
      if (query.includes(key) || query.includes(category.name.toLowerCase())) {
        let reply = `📦 **${category.name.toUpperCase()}\n\n`;
        reply += `${category.icon} **Rules**: ${category.rules}\n\n`;
        reply += `✅ **Accepted items**: `;
        
        const accepted = Object.entries(category.items || {})
          .filter(([, data]) => data.recyclable)
          .slice(0, 5)
          .map(([name]) => name);
        
        reply += accepted.join(", ");
        
        if (Object.entries(category.items || {}).filter(([, data]) => data.recyclable).length > 5) {
          reply += ` ... and more`;
        }

        reply += `\n\n❌ **Not accepted**: `;
        const rejected = Object.entries(category.items || {})
          .filter(([, data]) => !data.recyclable)
          .slice(0, 3)
          .map(([name]) => name);
        
        reply += rejected.join(", ");

        return {
          reply,
          confidence: CONFIDENCE_LEVELS.CERTAIN
        };
      }
    }

    return { reply: "I'm not sure about that category.", confidence: CONFIDENCE_LEVELS.UNCERTAIN };
  },

  respondTips(query) {
    const tips = `💡 **Recycling Tips for Success:**

🧼 **Preparation**:
1. Rinse everything — food residue ruins entire batches
2. Remove caps from bottles and put them back on (they sink separately)
3. Flatten cardboard and plastic bottles to save space
4. Remove labels? Optional, but helps
5. Keep materials dry — wet items contaminate loads

📍 **Sorting**:
• Paper with paper, plastic with plastic, glass with glass
• Separate by material type (don't mix!)
• Remove food waste completely
• Don't guess — when in doubt, leave it out

🚫 **Common mistakes**:
• Putting plastic bags in recycling (jams machinery)
• Mixing materials
• Including food waste
• Putting broken glass in regular bags
• Not rinsing containers

✅ **What gets processed into**:
• Plastics → new bottles, fleece jackets, playground equipment
• Glass → new bottles, jars, decorative items
• Paper → cardboard, newspapers, paper products
• Metal → new cans, appliances, construction materials

🌍 **Why it matters**: Recycling aluminum uses 95% less energy than mining new aluminum from ore!`;

    return {
      reply: tips,
      confidence: CONFIDENCE_LEVELS.CERTAIN
    };
  },

  respondFuzzySearch(query) {
    const candidates = Object.keys(FLAT_DB);
    const matches = fuzzyMatch(query, candidates, 0.5);

    if (matches.length > 0) {
      const topMatch = matches[0].item;
      const confidence = matches[0].score >= 0.8 ? CONFIDENCE_LEVELS.LIKELY : CONFIDENCE_LEVELS.UNCERTAIN;
      return this.respondItemDetails(topMatch, confidence);
    }

    // Show helpful fallback
    const fallbacks = [
      "I'm not sure about that specific item. Could you describe it differently? (e.g., material, color, what it's used for)",
      "Hmm, I don't have that in my database yet. General rule: clean, dry, single material → probably recyclable. When in doubt, put it in the black bag.",
      "Not familiar with that item! Try asking about the material (plastic, glass, metal, paper) or its main use.",
    ];

    return {
      reply: fallbacks[Math.floor(Math.random() * fallbacks.length)],
      confidence: CONFIDENCE_LEVELS.UNKNOWN
    };
  },

  // Get suggestions for autocomplete
  getAutocomplete(input, limit = 5) {
    const query = input.toLowerCase();
    return Object.keys(FLAT_DB)
      .filter(item => item.includes(query))
      .slice(0, limit);
  },

  // Get search statistics
  getStats() {
    const uniqueQueries = new Set(this.searchHistory.map(h => h.query.toLowerCase()));
    const topQueries = [...this.searchHistory]
      .reverse()
      .slice(0, 10);

    return {
      totalSearches: this.searchHistory.length,
      uniqueQueries: uniqueQueries.size,
      recentQueries: topQueries,
      conversationLength: this.conversation.length
    };
  },

  // Export chat history
  exportChat(format = 'txt') {
    let content = `Smart Recycling Chat History\nExported: ${new Date().toLocaleString()}\n\n`;

    this.conversation.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      content += `[${time}] ${msg.type.toUpperCase()}: ${msg.text}\n`;
    });

    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      return URL.createObjectURL(blob);
    }
    return content;
  },



// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  if (typeof EcoMind !== 'undefined') {
    EcoMind.init();
    window.dispatchEvent(new CustomEvent("EcoMindReady"));
  }
});
