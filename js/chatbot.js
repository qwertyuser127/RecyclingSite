/* ============================================================
   EcoMind-01 — the Smart Recycling chat assistant.
   Rule-based (no training/learning), answers from a fixed
   knowledge base that includes Malta's official waste rules,
   the national collection schedule, and real local recycling
   schemes (WasteServ, GreenPak, GreenMT, BCRS).
   Sources: wastecollection.mt, wsm.com.mt, greenpak.com.mt,
   ERA/EEA municipal waste country profile, publicservice.gov.mt.
   ============================================================ */
(function () {
  document.addEventListener("shellReady", init);

  function init() {
    const chatWindow = document.getElementById("chatWindow");
    if (!chatWindow) return;
    const chatMessage = document.getElementById("chatMessage");
    const chatSend = document.getElementById("chatSend");
    const chatClear = document.getElementById("chatClear");
    const suggestions = document.querySelectorAll(".chat-suggestions button");

    function botReply(text) {
      const msg = document.createElement("div");
      msg.className = "chat-message bot";
      msg.textContent = text;
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function userReply(text) {
      const msg = document.createElement("div");
      msg.className = "chat-message user";
      msg.textContent = text;
      chatWindow.appendChild(msg);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function aiProcess(input) {
      const q = input.toLowerCase().trim();

      // --- GREETINGS & SOCIAL ---
      if (/^(hi|hello|hey|greetings|sup|yo|hola|bonjour|ciao)/i.test(q)) {
        return pick([
          "Hello! I'm EcoMind-01, your recycling assistant. How can I help you sort better today?",
          "Hi there! Ready to learn about recycling? Ask me anything.",
          "Greetings, Eco Hero. What would you like to know about recycling?",
          "Hey! I'm here to help you recycle smarter. What's on your mind?"
        ]);
      }
      
      if (/^(fun|fact)/i.test(q)) {
        return pick([
          "Recycling one aluminum can saves enough energy to power a laptop for 3 hours!",
          "Plastic takes 400+ years to decompose in landfill.",
          "An average family can recycle 4 pounds of materials annually.",
          "Making new paper from recycled paper saves 40% of the water used for virgin paper.",
          "In Malta, over 30% of school recycling is lost due to contamination.",
          "Recycling steel and tin cans conserves 76% of the energy needed to make new cans.",
          "One recycled glass bottle can reduce energy use by 40% compared to making a new bottle.",
          "Textiles are the 4th largest waste stream in most countries."
        ]);
      }

      if (/^(bye|goodbye|see you|cya|later|ttyl)/i.test(q)) {
        return pick([
          "Goodbye! Keep recycling and stay green.",
          "See you later — every item you sort correctly helps the planet.",
          "Bye for now. Come back anytime you have recycling questions."
        ]);
      }

      if (/thanks|thank you|thx|appreciate/i.test(q)) {
        return pick([
          "You're welcome! Happy to help you recycle smarter.",
          "Anytime — thanks for caring about the planet.",
          "Glad I could help. Keep up the great recycling work!"
        ]);
      }

      if (/joke|funny|laugh|humor/i.test(q)) {
        return pick([
          "Why did the recycling bin get promoted? Because it sorted everything out.",
          "What do you call a recycling bin with a sense of humour? A pun-cycler.",
          "Why don't recycling bins ever get lonely? They're always surrounded by bottles.",
          "What's a recycler's favourite music? Heavy metal."
        ]);
      }

      if (/time|clock|hour|minute/i.test(q) && !/plastic|bottle|recycle/i.test(q)) {
        return "The current time is " + new Date().toLocaleTimeString() + ". Time to recycle!";
      }

      if (/date|day|today|calendar/i.test(q) && !/recycle/i.test(q)) {
        return "Today is " + new Date().toLocaleDateString(undefined, {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        }) + ". A great day to sort your waste properly.";
      }

      // --- MALTA NATIONAL WASTE COLLECTION SCHEDULE ---
      // Source: WasteServ / ERA national door-to-door schedule (wastecollection.mt)
      if (/schedule|collection day|bin ?day|what day|which day|pick[\s-]?up|kerbside|council.*collect|when.*(collect|taken|pick)/i.test(q)) {
        if (/glass/i.test(q)) {
          return "Glass collection (Malta & Gozo): glass bottles and jars are only collected on the 1st and 3rd Friday of every month, not weekly like the other streams. Put glass out in a reusable container rather than a bag so it can be tipped straight into the truck.";
        }
        return "Malta & Gozo National Waste Collection Schedule (kerbside, door-to-door):\n• Monday — Organic waste (white bag)\n• Tuesday — Mixed waste (black bag)\n• Wednesday — Organic waste (white bag)\n• Thursday — Recyclable waste (grey/green bag: paper, plastic & metal together)\n• Friday — Organic waste (white bag)\n• Saturday — Mixed waste (black bag)\n• Glass — 1st & 3rd Friday of the month only\n\nBags can go out up to 4 hours before your locality's collection time. Exact times vary by locality — check wastecollection.mt or call WasteServ Customer Care on 8007 2200. Commercial premises with their own contracts may follow a different schedule.";
      }

      // --- FINES FOR NOT SEPARATING WASTE ---
      if (/fine|penalty|fined|caught.*(separat|sorting)/i.test(q)) {
        return "Fines in Malta: waste separation has been mandatory since 14 April 2023. After an initial warning, households caught not separating waste face a €25 fine (€50 for a repeat offence); businesses and other entities face €75 (€150 for a repeat offence). Checks are carried out by ERA, LESA and the Police.";
      }

      // --- BEVERAGE CONTAINER REFUND SCHEME (BCRS) ---
      if (/deposit|refund|reverse vending|bcrs|beverage container/i.test(q)) {
        return "Beverage Container Refund Scheme (BCRS): since November 2022, Malta has a nationwide deposit-return scheme for PET plastic, aluminium, steel and glass drink containers. Pay a small deposit when you buy the drink, then get it back by returning the empty container to a reverse vending machine at participating shops. It's separate from your kerbside recycling bag — don't put deposit-marked containers in the grey/green bag, take them back instead.";
      }

      // --- GREENPAK / GREENMT SMART BINS & BUSINESS COMPLIANCE ---
      if (/greenpak|greenmt|ibin|smart bin|bring-in|bring in site/i.test(q)) {
        return "GreenPak & GreenMT: these are ERA-authorised recovery schemes that businesses use to meet their legal recycling obligations for packaging, WEEE and batteries. GreenPak also runs a network of 800+ smart \"iBiNs\" around Malta and Gozo — sensor-equipped public recycling bins you can use any time, which report their fill level so collection trucks only visit when needed. Look for a Bring-In Site near you if you don't have kerbside collection.";
      }

      // --- MALTA'S RECYCLING PROGRESS / STATISTICS ---
      if (/statistic|recycling rate|how (much|well).*(malta|recycl)|progress|how (are|is) malta doing/i.test(q)) {
        return "Malta's recycling progress: mixed (black bag) waste fell by over 30% in 2025, from about 141 million kg to 95.5 million kg, while organic waste separation hit a record 30 million kg. All of that organic waste was turned into renewable energy and compost — enough electricity to power roughly 1,200 households for a year. Still, Malta's municipal waste generation (618 kg per person in 2022) remains above the EU average, and Malta has historically struggled to hit EU recycling targets — so every household sorting correctly genuinely moves the needle.";
      }

      // --- RECYCLING KNOWLEDGE BASE ---

      // GLASS (checked before plastics, since "bottle"/"container" overlap)
      if (/glass|jar|window|mirror/i.test(q)) {
        if (/can|recyclable|recycle/i.test(q) || !/not|can't|no/i.test(q)) {
          return "Glass: bottles and jars are recyclable. Remove caps and lids, rinse them out, and don't break them — broken glass is dangerous and contaminates other materials. In Malta, glass is collected separately from the grey/green bag, only on the 1st and 3rd Friday of the month.";
        }
        return "Glass that's NOT recyclable in the normal glass stream: window glass, mirrors, light bulbs, Pyrex and ceramics — these have different melting points and ruin the recycling process. Take them to a Civic Amenity Site instead.";
      }

      // PLASTICS
      if (/plastic|bottle|container|packaging|wrap|film|\bbag\b/i.test(q) && !/glass/i.test(q)) {
        if (/can|recyclable|recycle/i.test(q) || !/not|can't|no|bad|wrong/i.test(q)) {
          return "Plastics: most plastic bottles, containers and packaging are recyclable. Rinse them first. Check the resin code (1–7) — #1 (PET) and #2 (HDPE) are the most widely recycled. Put the cap back on the bottle before recycling it. In Malta, clean plastic goes in the grey/green recyclable bag, collected on Thursdays.";
        }
        return "Some plastics cause problems in recycling: plastic bags and cling film often jam sorting machinery, and polystyrene is rarely accepted curbside. Malta's mixed-recyclables stream does accept clean plastic bags and food packets — but check wastecollection.mt if you're unsure about a specific item.";
      }

      // PAPER & CARDBOARD
      if (/paper|cardboard|box|newspaper|magazine|office|printer/i.test(q)) {
        if (/can|recyclable|recycle/i.test(q) || !/not|can't|no/i.test(q)) {
          return "Paper & cardboard: recyclable, including newspapers, magazines and office paper. Flatten boxes, remove tape and plastic windows, and keep it dry — wet paper contaminates the whole batch. In Malta, clean paper and cardboard go in the grey/green bag on Thursdays.";
        }
        return "Paper that's NOT recyclable: greasy pizza boxes, waxed or laminated paper, and used tissues. Food-soiled paper ruins the batch — a lightly greasy pizza box can often be composted with organic waste instead.";
      }

      // METAL
      if (/metal|\bcan\b|tin|aluminium|aluminum|foil|steel|iron|copper/i.test(q)) {
        if (/can|recyclable|recycle/i.test(q) || !/not|can't|no/i.test(q)) {
          return "Metal: aluminium cans, steel/tin cans and clean foil are all recyclable — and metal can be recycled indefinitely without losing quality. Rinse and crush cans to save space. In Malta they go in the grey/green bag on Thursdays; drink cans with a deposit mark should go back through the BCRS instead.";
        }
        return "Metal that needs special handling: paint cans and aerosols (unless completely empty), and anything heavily contaminated with food. Take these to a Civic Amenity Site rather than the regular recycling bag.";
      }

      // ELECTRONICS (E-WASTE)
      if (/electronic|e-waste|computer|phone|laptop|charger|cable|wire|\btv\b|monitor|device/i.test(q)) {
        return "E-waste: electronics and cables must go to a dedicated e-waste collection point, never a regular bin — they contain toxic materials and recoverable metals. In Malta, drop them off at a WasteServ Civic Amenity Site, hand them to a GreenPak/GreenMT collection point, or wait for the Roadshow Truck, which visits every locality at least monthly.";
      }

      // BATTERIES (specific)
      if (/battery|batteries|\baa\b|aaa|button cell|lithium/i.test(q)) {
        return "Batteries: never in regular bins — they're hazardous waste. In Malta, drop them at a supermarket battery collection point, an electronics store, a Civic Amenity Site, or the monthly Roadshow Truck. Damaged lithium batteries can catch fire, so tape the terminals before disposal.";
      }

      // FOOD WASTE
      if (/food|organic|compost|leftover|kitchen|scrap|peel|core/i.test(q)) {
        return "Food waste: this is organic waste and goes in the white bag, collected Monday, Wednesday and Friday in Malta — never in the recyclable bag, since it contaminates everything it touches. In 2025, all organic waste collected nationally was converted into renewable energy and compost.";
      }

      // CLOTHING & TEXTILES
      if (/clothing|clothes|fabric|textile|shoe|garment/i.test(q)) {
        return "Textiles: don't put clothes in your recycling bag. Donate wearable clothes and shoes to a charity shop, or use a textile bring-in point or Civic Amenity Site for worn-out items. Reuse Centres at WasteServ's Civic Amenity Sites also accept good-condition textiles.";
      }

      // FURNITURE & LARGE ITEMS
      if (/furniture|chair|table|sofa|bed|mattress|wardrobe|shelf|bulky|civic amenity/i.test(q)) {
        return "Furniture & bulky waste: Local Councils in Malta offer a free bulky waste collection by appointment — contact your Council directly. You can also drop items off yourself at a Civic Amenity Site, open every day (including public holidays) from 07:30–17:30. Still usable? Donate it at a Reuse Centre, found at the Luqa, Ħal Far, Mrieħel or Tal-Kus (Gozo) sites.";
      }

      // HAZARDOUS WASTE
      if (/hazardous|chemical|paint|\boil\b|medicine|pesticide|solvent|toxic|dangerous/i.test(q)) {
        return "Hazardous waste: paint, chemicals, motor oil, solvents and pesticides must never go in regular or recycling bins. Take them to a Civic Amenity Site. Old medicines can be dropped at any pharmacy — but sharps and other biohazardous items must go to a Civic Amenity Site, never a pharmacy.";
      }

      // BIN COLOURS (general guide — Malta's actual bag/bin system)
      if (/bin|colour|color|what bin|which bin/i.test(q) && !/plastic|paper|glass|metal/i.test(q)) {
        return "Malta's waste separation system uses bags, not coloured bins:\n• White bag — organic waste\n• Black bag — mixed (non-recyclable) waste\n• Grey/green bag — recyclable paper, plastic & metal together\n• Separate container — glass (1st & 3rd Friday only)\nElectronics, batteries and hazardous waste never go in any of these — they go to a Civic Amenity Site or collection point instead.";
      }

      // RECYCLING TIPS
      if (/tip|advice|best|practice|how to|improve|better|guide/i.test(q)) {
        return "Top recycling tips:\n• Rinse everything — food residue ruins whole batches\n• Put caps back on plastic bottles before recycling them\n• Flatten cardboard to save space\n• Keep paper dry\n• When in doubt, leave it out of the recyclable bag rather than contaminate it\n• Reduce and reuse first — recycling is the last resort";
      }

      // ENVIRONMENTAL IMPACT
      if (/impact|why|important|benefit|save|planet|earth|environment|climate/i.test(q)) {
        return "Why recycle: it saves raw resources (less mining, logging and drilling), cuts energy use dramatically (recycling aluminium uses about 95% less energy than making it from scratch), reduces landfill waste and greenhouse gas emissions, and supports local jobs. Every item sorted correctly makes a real difference.";
      }

      // COMPOSTING
      if (/compost|composting|worm|soil|fertilizer/i.test(q)) {
        return "Composting: food scraps and garden waste can be composted, reducing methane emissions from landfill and producing nutrient-rich soil. In Malta, organic waste collected nationally is processed into compost and renewable energy — in 2025 that generated about 8.5 GWh of electricity, enough for roughly 1,200 households.";
      }

      // ZERO WASTE
      if (/zero waste|reduce|reuse|minimal|eco friendly|sustainable/i.test(q)) {
        return "Zero waste living: bring reusable bags, bottles and containers, buy in bulk to cut packaging, choose less-packaged products, repair instead of replacing, compost food scraps, and say no to single-use plastics where you can. Small changes add up.";
      }

      // --- SMART FALLBACK: still gives useful, honest guidance ---
      return pick([
        "I'm not sure about that specific item. General rule: clean, dry, and separated — if in doubt, check wastecollection.mt or put it in the black (mixed) bag rather than contaminate the recyclable bag.",

        "Good question. If you're unsure about an item: rinse it, check for a recycling symbol, and when in doubt, leave it out of the recyclable bag. Contamination ruins entire batches.",

        "I don't have a specific answer for that, but here's a rule of thumb: paper with paper, plastic with plastic, glass with glass, and keep it all clean.",

        "Not sure about that item? Check the packaging for a recycling symbol, look up wastecollection.mt, or call WasteServ on 8007 2200. When uncertain, one wrong item can contaminate a whole truckload.",

        "Rules can vary slightly by council, so wastecollection.mt is the best source. In general, if an item is clean, dry and made of a single material, it's probably recyclable.",

        "I'm not certain about that one, but most kerbside schemes accept paper, cardboard, glass, plastic containers and metal cans. Electronics, batteries and hazardous waste always need special disposal points.",

        "For now, remember the order: reduce, reuse, recycle. The best waste is the waste you never create in the first place.",

        "When in doubt about an item, ask: is it clean, is it dry, is it a single material? If the answer to any of those is no, it probably belongs in the black (mixed) bag."
      ]);
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function typingIndicator(show) {
      let el = document.getElementById("chatTyping");
      if (show) {
        if (!el) {
          el = document.createElement("div");
          el.id = "chatTyping";
          el.className = "chat-message bot";
          el.textContent = "EcoMind-01 is thinking...";
          chatWindow.appendChild(el);
          chatWindow.scrollTop = chatWindow.scrollHeight;
        }
      } else if (el) {
        el.remove();
      }
    }

    // Tries the real OpenAI-backed /api/chat endpoint (only works once deployed
    // with an OPENAI_API_KEY environment variable set server-side, e.g. on Vercel).
    // Falls back to the built-in rule-based knowledge base if that endpoint
    // isn't available — so the chatbot always works, even on plain static hosting.
    async function getReply(text) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });
        if (!res.ok) throw new Error("api/chat unavailable");
        const data = await res.json();
        if (!data.reply) throw new Error("no reply in response");
        return data.reply;
      } catch (e) {
        return aiProcess(text);
      }
    }

    async function send(text) {
      text = text.trim();
      if (!text) return;
      userReply(text);
      chatMessage.value = "";
      const count = parseInt(localStorage.getItem("ecomindConversations") || "0", 10) + 1;
      localStorage.setItem("ecomindConversations", String(count));

      typingIndicator(true);
      const reply = await getReply(text);
      typingIndicator(false);
      botReply(reply);
    }

    chatSend.onclick = () => send(chatMessage.value);
    chatMessage.addEventListener("keypress", e => { if (e.key === "Enter") send(chatMessage.value); });
    chatClear.onclick = () => {
      chatWindow.innerHTML = "";
      botReply("Chat cleared. Ask me anything about recycling — I'll do my best to help.");
    };
    suggestions.forEach(btn => btn.addEventListener("click", () => send(btn.textContent)));

    botReply("Hi! I'm EcoMind-01 — your Smart Recycling assistant.\n\nAsk me about plastics, paper, glass, metals, electronics, batteries, food waste, Malta's bin collection schedule, the deposit refund scheme, or anything else recycling-related.");
  }
})();
