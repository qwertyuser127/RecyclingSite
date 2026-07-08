/* ============================================================
   Recylo's Recycling Adventure — an interactive story by Matteo.
   Setting: Msida. Recylo, Guardian of Clean Cities, needs help
   fixing an overflowing, contaminated recycling bin. Three
   opening paths, each with three options, all reconverging on
   one shared epilogue.
   ============================================================ */
(function () {
  document.addEventListener("shellReady", init);

  const STORY = {
    prologue: {
      text: "You step outside on a bright morning in Msida. The recycling bin on your street is overflowing, bottles rolling onto the pavement. A sticky pizza box sits on top. A small sign reads: \u201cHelp keep Msida clean. Sort your waste properly.\u201d\n\nSuddenly, a tiny green creature jumps out from behind the bin. It's Recylo, Guardian of Clean Cities.\n\n\u201c{name}! The recycling system is breaking down. People are mixing waste, bins are overflowing, and pollution is rising. I need your help.\u201d",
      choices: [
        { label: "Investigate the bin", next: "investigate" },
        { label: "Follow Recylo", next: "follow" },
        { label: "Start sorting waste yourself", next: "sort" }
      ]
    },

    /* ---------------- PATH 1: Investigate the Bin ---------------- */
    investigate: {
      path: "Path 1 · Investigate the Bin",
      text: "You peek inside the bin. It's chaos. Plastic bottles mixed with food waste. Glass thrown in with cardboard. A greasy pizza box contaminates everything.\n\nRecylo groans. \u201cContamination! When dirty items mix with recyclables, the whole batch gets thrown away.\u201d",
      choices: [
        { label: "Clean the recyclables", next: "clean" },
        { label: "Teach nearby people", next: "teach" },
        { label: "Report the issue", next: "report" }
      ]
    },
    clean: {
      path: "Path 1A · Clean the Recyclables",
      text: "You roll up your sleeves. You wash bottles, flatten cardboard, and remove food scraps. Recylo beams.\n\n\u201cPerfect! Clean recyclables can be reused to make new products.\u201d\n\nA passer-by says, \u201cWow, you're doing a great job. I'll start sorting my waste too.\u201d Msida becomes cleaner, and recycling rates rise.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    teach: {
      path: "Path 1B · Teach Nearby People",
      text: "You gather a few neighbours and explain:\n\u2022 Plastic bottles \u2192 blue bin\n\u2022 Glass \u2192 green bin\n\u2022 Paper & cardboard \u2192 grey bin\n\u2022 Food waste \u2192 brown bin\n\nPeople nod, surprised they didn't know. Recylo whispers, \u201cEducation is powerful.\u201d Soon, the whole street starts sorting properly.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    report: {
      path: "Path 1C · Report the Issue",
      text: "You contact the local council. They send workers to clean the area and add clearer signs to the bins.\n\nRecylo says, \u201cSometimes the best action is asking for help.\u201d The neighbourhood becomes tidier, and bins stop overflowing.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },

    /* ---------------- PATH 2: Follow Recylo ---------------- */
    follow: {
      path: "Path 2 · Follow Recylo",
      text: "You follow Recylo into a narrow alley. There, a group of mischievous Trash Goblins toss waste everywhere, giggling as they throw plastic bags into the air.\n\n\u201cThey're causing the mess!\u201d Recylo says. \u201cBut maybe they can change.\u201d",
      choices: [
        { label: "Confront the goblins", next: "confront" },
        { label: "Teach the goblins recycling", next: "teachGoblins" },
        { label: "Set up a recycling trap", next: "trap" }
      ]
    },
    confront: {
      path: "Path 2A · Confront the Goblins",
      text: "You step forward bravely. \u201cStop! You're making Msida dirty.\u201d\n\nThe goblins freeze. They look guilty. \u201cWe didn't know it was bad,\u201d one says. You show them how to sort waste. They nod eagerly and start helping clean the alley.\n\nRecylo smiles. \u201cYou turned troublemakers into helpers.\u201d",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    teachGoblins: {
      path: "Path 2B · Teach the Goblins Recycling",
      text: "You sit with the goblins and explain recycling. They listen carefully.\n\n\u201cWe want to help!\u201d they shout. They become Recycling Goblins, collecting bottles and sorting waste around the neighbourhood.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    trap: {
      path: "Path 2C · Set Up a Recycling Trap",
      text: "You place colourful bins around the alley with signs like: \u201cThrow trash here for a prize!\u201d\n\nThe goblins love it. They toss waste into the correct bins and receive shiny stickers from Recylo. Soon, the alley becomes spotless.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },

    /* ---------------- PATH 3: Start Sorting Waste Yourself ---------------- */
    sort: {
      path: "Path 3 · Start Sorting Waste Yourself",
      text: "You begin picking up bottles, flattening cardboard, and separating glass. People walking by stop and watch.\n\nA woman says, \u201cYou're inspiring us. Maybe we should help.\u201d Recylo nods proudly.",
      choices: [
        { label: "Organize a community cleanup", next: "cleanup" },
        { label: "Create a recycling poster", next: "poster" },
        { label: "Ask Recylo for more missions", next: "missions" }
      ]
    },
    cleanup: {
      path: "Path 3A · Organize a Community Cleanup",
      text: "You gather volunteers. Together, you clean streets, beaches, and parks. Kids join in, learning how to sort waste.\n\nMsida becomes one of the cleanest towns in Malta.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    poster: {
      path: "Path 3B · Create a Recycling Poster",
      text: "You design a colourful poster: \u201cSort Smart. Recycle Right.\u201d You hang it near the bins. People stop to read it and start sorting correctly.\n\nRecylo says, \u201cArt can change behaviour.\u201d",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },
    missions: {
      path: "Path 3C · Ask Recylo for More Missions",
      text: "Recylo gives you a list:\n\u2022 Reduce plastic use\n\u2022 Start composting\n\u2022 Help schools recycle\n\u2022 Teach kids about waste sorting\n\nYou become Msida's official Eco Hero.",
      choices: [{ label: "Continue to the epilogue", next: "epilogue" }]
    },

    /* ---------------- EPILOGUE ---------------- */
    epilogue: {
      path: "Epilogue · The Future You Created",
      text: "No matter which path you chose:\n\u2022 Bins are cleaner\n\u2022 People recycle properly\n\u2022 Trash Goblins become helpers\n\u2022 Msida shines\n\u2022 Recylo is proud of you\n\n\u201c{name},\u201d Recylo says, \u201cevery action you take shapes the planet. Keep choosing wisely.\u201d",
      end: true
    }
  };

  function init() {
    const introEl = document.getElementById("storyIntro");
    const textEl = document.getElementById("storyText");
    if (!textEl) return; // not on this page
    const choicesEl = document.getElementById("storyChoices");
    const restartBtn = document.getElementById("storyRestart");
    const progressEl = document.getElementById("storyProgress");
    const pathLabel = document.getElementById("storyPathLabel");
    const nameForm = document.getElementById("storyNameForm");
    const nameInput = document.getElementById("storyNameInput");

    let playerName = localStorage.getItem("storyPlayerName") || "";

    function fill(text) {
      return text.replace(/\{name\}/g, playerName || "Explorer");
    }

    function render(nodeId) {
      const node = STORY[nodeId];
      // paragraphs -> separate <p> so line breaks in the source read cleanly
      textEl.innerHTML = "";
      fill(node.text).split("\n\n").forEach(block => {
        const p = document.createElement("p");
        p.style.marginBottom = "12px";
        p.innerHTML = block.replace(/\n/g, "<br>");
        textEl.appendChild(p);
      });

      pathLabel.textContent = node.path || "";

      choicesEl.innerHTML = "";
      if (node.end) {
        restartBtn.style.display = "inline-block";
        const done = document.createElement("p");
        done.style.marginTop = "16px";
        done.style.fontWeight = "600";
        done.textContent = "\ud83c\udf31 The End \u2014 thanks for helping Recylo clean up Msida.";
        choicesEl.appendChild(done);
      } else {
        restartBtn.style.display = "none";
        node.choices.forEach(choice => {
          const btn = document.createElement("button");
          btn.textContent = choice.label;
          btn.onclick = () => render(choice.next);
          choicesEl.appendChild(btn);
        });
      }
      updateProgress(nodeId);
      textEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function updateProgress(nodeId) {
      const stage = nodeId === "prologue" ? 0
        : nodeId === "epilogue" ? 3
        : ["investigate", "follow", "sort"].includes(nodeId) ? 1
        : 2;
      [...progressEl.children].forEach((s, i) => s.classList.toggle("done", i <= stage));
    }

    function beginStory() {
      playerName = (nameInput.value || "").trim() || "Explorer";
      localStorage.setItem("storyPlayerName", playerName);
      introEl.style.display = "none";
      textEl.style.display = "";
      choicesEl.style.display = "";
      render("prologue");
    }

    if (nameInput) nameInput.value = playerName;
    nameForm.addEventListener("submit", e => { e.preventDefault(); beginStory(); });

    restartBtn.onclick = () => render("prologue");
  }
})();
