/* ============================================================
   Eco Catch — catch the recyclables, dodge the trash.
   Canvas game with paddle (recycling bin), falling objects,
   score, hearts, rising difficulty, and achievements.
   ============================================================ */
(function () {
  document.addEventListener("shellReady", init);

  function init() {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const scoreEl = document.getElementById("gameScore");
    const heartsEl = document.getElementById("gameHearts");
    const msgEl = document.getElementById("gameMsg");
    const startBtn = document.getElementById("gameStart");
    const muteBtn = document.getElementById("gameMute");
    const achievementsWrap = document.getElementById("gameAchievements");

    // ---- logical resolution ----
    const W = 350, H = 450;
    canvas.width = W;
    canvas.height = H;

    // ---- sound hooks ----
    let muted = false;
    const sounds = {
      catch: new Audio("sounds/catch.wav"),
      miss: new Audio("sounds/miss.wav"),
      gameover: new Audio("sounds/gameover.wav"),
      levelup: new Audio("sounds/levelup.wav")
    };
    function play(name) {
      if (muted) return;
      const s = sounds[name];
      if (!s) return;
      try { s.currentTime = 0; s.play().catch(() => {}); } catch (e) {}
    }

    const RECYCLABLES = ["🍾", "📦", "🥫", "📰"];
    const TRASH = ["🍕", "🚬", "🪫", "🍬"];
    const EMOJI_FONT = "26px 'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji',sans-serif";
    const RECYCLE_COLOR = "#4b7cff";
    const TRASH_COLOR = "#e0455f";

    const ACHIEVEMENTS = [
      { id: "first10", label: "First 10", test: s => s.score >= 10 },
      { id: "combo20", label: "20 Catch Streak", test: s => s.bestStreak >= 20 },
      { id: "survivor", label: "Survivor", test: s => s.elapsed >= 45 },
      { id: "score100", label: "Century Sorter", test: s => s.score >= 100 }
    ];
    const earned = new Set(JSON.parse(localStorage.getItem("ecoCatchAchievements") || "[]"));

    function renderAchievements() {
      if (!achievementsWrap) return;
      achievementsWrap.innerHTML = ACHIEVEMENTS.map(a =>
        `<span class="badge${earned.has(a.id) ? " earned" : ""}">${a.label}</span>`
      ).join("");
    }
    renderAchievements();

    let state, paddleX, items, running, rafId, lastSpawn, startTime;

    function resetState() {
      state = { score: 0, hearts: 3, streak: 0, bestStreak: 0, elapsed: 0, caughtSinceHeart: 0 };
      paddleX = W / 2 - 30;
      items = [];
      lastSpawn = 0;
      startTime = performance.now();
      running = false;
    }
    resetState();

    function difficulty() {
      const speed = 2.2 + state.score * 0.04;
      const spawnEvery = Math.max(380, 950 - state.score * 12);
      return { speed: Math.min(speed, 7), spawnEvery };
    }

    function spawnItem() {
      const isTrash = Math.random() < 0.4;
      const glyph = isTrash
        ? TRASH[Math.floor(Math.random() * TRASH.length)]
        : RECYCLABLES[Math.floor(Math.random() * RECYCLABLES.length)];
      items.push({
        x: 20 + Math.random() * (W - 50),
        y: -30,
        glyph,
        trash: isTrash,
        radius: 18
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      
      // Draw ground
      ctx.fillStyle = "rgba(46,125,50,0.12)";
      ctx.fillRect(0, H - 50, W, 50);
      
      // Draw grid lines for depth
      ctx.strokeStyle = "rgba(46,125,50,0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, H - 50);
        ctx.lineTo(i, H);
        ctx.stroke();
      }

      // Draw paddle (recycling bin)
      const paddleWidth = 60;
      const paddleHeight = 44;
      const px = paddleX;
      const py = H - paddleHeight - 6;
      
      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      
      // Bin body
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#4b7cff";
      ctx.roundRect(px, py, paddleWidth, paddleHeight, 8);
      ctx.fill();
      
      // Bin lid
      ctx.fillStyle = "#3a6adf";
      ctx.roundRect(px + 5, py - 6, paddleWidth - 10, 8, 4);
      ctx.fill();
      
      // Recycle symbol
      ctx.shadowBlur = 0;
      ctx.font = "28px 'Segoe UI Emoji','Noto Color Emoji',sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.fillText("♻️", px + paddleWidth/2, py + paddleHeight/2 - 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      // Draw items
      items.forEach(it => {
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        
        // Colored disc behind emoji
        ctx.beginPath();
        ctx.arc(it.x + 15, it.y - 4, it.radius, 0, Math.PI * 2);
        ctx.fillStyle = it.trash ? TRASH_COLOR : RECYCLE_COLOR;
        ctx.fill();
        
        // Border ring
        ctx.shadowBlur = 0;
        ctx.strokeStyle = it.trash ? "#c0392b" : "#2e7d32";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Emoji
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.font = EMOJI_FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(it.glyph, it.x + 15, it.y);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
      });
      
      ctx.shadowBlur = 0;
    }

    function loop(now) {
      if (!running) return;
      const { speed, spawnEvery } = difficulty();
      state.elapsed = (now - startTime) / 1000;

      if (now - lastSpawn > spawnEvery) {
        spawnItem();
        lastSpawn = now;
      }

      items.forEach(it => (it.y += speed));

      // Collision detection
      const paddleLeft = paddleX;
      const paddleRight = paddleX + 60;
      const paddleTop = H - 50 - 6;
      
      items = items.filter(it => {
        const itemCenterX = it.x + 15;
        const itemCenterY = it.y - 4;
        
        // Check if item is within paddle area
        if (itemCenterY >= paddleTop - 10 && itemCenterY <= paddleTop + 50 &&
            itemCenterX >= paddleLeft - 10 && itemCenterX <= paddleRight + 10) {
          
          if (it.trash) {
            state.hearts -= 1;
            state.streak = 0;
            play("miss");
            flashMsg("❌ Oops — that was trash!");
            if (state.hearts <= 0) {
              state.hearts = 0;
              endGame();
              return false;
            }
          } else {
            state.score += 1;
            state.streak += 1;
            state.caughtSinceHeart += 1;
            state.bestStreak = Math.max(state.bestStreak, state.streak);
            play("catch");
            
            if (state.hearts < 3 && state.caughtSinceHeart >= 20) {
              state.hearts += 1;
              state.caughtSinceHeart = 0;
              flashMsg("❤️ Heart regained!");
              play("levelup");
            }
          }
          return false;
        }
        
        // Remove if off screen
        if (it.y > H + 30) {
          if (!it.trash) {
            state.streak = 0;
            flashMsg("💨 Missed a recyclable!");
          }
          return false;
        }
        return true;
      });

      updateHud();
      checkAchievements();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    let msgTimer;
    function flashMsg(text) {
      if (!msgEl) return;
      msgEl.textContent = text;
      clearTimeout(msgTimer);
      msgTimer = setTimeout(() => (msgEl.textContent = ""), 1500);
    }

    function updateHud() {
      if (scoreEl) scoreEl.textContent = "Score: " + state.score;
      if (heartsEl) {
        let hearts = "";
        for (let i = 0; i < 3; i++) {
          hearts += i < state.hearts ? "❤️" : "🖤";
        }
        heartsEl.textContent = hearts;
      }
    }

    function checkAchievements() {
      ACHIEVEMENTS.forEach(a => {
        if (!earned.has(a.id) && a.test(state)) {
          earned.add(a.id);
          localStorage.setItem("ecoCatchAchievements", JSON.stringify([...earned]));
          renderAchievements();
          flashMsg("🏆 Achievement: " + a.label);
          play("levelup");
        }
      });
    }

    function endGame() {
      running = false;
      cancelAnimationFrame(rafId);
      play("gameover");
      flashMsg("💀 Game Over — Score: " + state.score);
      startBtn.textContent = "Play Again";
      startBtn.disabled = false;
      draw();
    }

    function startGame() {
      resetState();
      updateHud();
      running = true;
      startBtn.textContent = "Restart";
      draw();
      lastSpawn = performance.now();
      startTime = performance.now();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }

    startBtn.addEventListener("click", startGame);
    
    if (muteBtn) {
      muteBtn.addEventListener("click", () => {
        muted = !muted;
        muteBtn.textContent = muted ? "🔇 Sound Off" : "🔊 Sound On";
      });
    }

    // ---- controls ----
    function movePaddleTo(clientX) {
      const rect = canvas.getBoundingClientRect();
      const scale = W / rect.width;
      const x = (clientX - rect.left) * scale;
      paddleX = Math.max(0, Math.min(W - 60, x - 30));
    }
    
    canvas.addEventListener("mousemove", e => {
      if (!running) return;
      movePaddleTo(e.clientX);
    });
    
    canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      if (!running) return;
      movePaddleTo(e.touches[0].clientX);
    }, { passive: false });
    
    document.addEventListener("keydown", e => {
      if (!running) return;
      if (e.key === "ArrowLeft") paddleX = Math.max(0, paddleX - 28);
      if (e.key === "ArrowRight") paddleX = Math.min(W - 60, paddleX + 28);
      e.preventDefault();
    });

    // roundRect polyfill for older browsers
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (typeof r === "number") r = [r];
        const radii = r.map(v => Math.min(v, Math.min(w, h) / 2));
        this.moveTo(x + radii[0], y);
        this.lineTo(x + w - radii[0], y);
        this.quadraticCurveTo(x + w, y, x + w, y + radii[0]);
        this.lineTo(x + w, y + h - radii[0]);
        this.quadraticCurveTo(x + w, y + h, x + w - radii[0], y + h);
        this.lineTo(x + radii[0], y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radii[0]);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
        this.closePath();
        return this;
      };
    }

    draw();
    updateHud();
    startBtn.textContent = "Start Game";
  }
})();
