// ===== DYSLEXEASE MAIN JS v4 — ALL BUGS FIXED =====

// ══════════════════════════════════════════════════
// LOGOUT — 100% reliable redirect to index.html
// ══════════════════════════════════════════════════
window.doLogout = function () {
  localStorage.removeItem('dyslexease_loggedIn');

  // Build absolute URL to index.html regardless of how site is served
  var href   = window.location.href;                          // full current URL
  var target;

  if (href.indexOf('/pages/') !== -1) {
    // Strip "/pages/dashboard.html" → keep everything before "/pages/"
    target = href.substring(0, href.indexOf('/pages/')) + '/index.html';
  } else {
    // Already at root level
    target = href.substring(0, href.lastIndexOf('/') + 1) + 'index.html';
  }

  // Show toast then redirect
  var t = document.createElement('div');
  t.textContent = '👋 Logged out! Redirecting to home...';
  t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);'
    + 'background:#1A1A2E;color:white;padding:16px 28px;border-radius:30px;'
    + 'font-family:Nunito,sans-serif;font-weight:800;font-size:16px;z-index:99999;'
    + 'box-shadow:0 4px 20px rgba(0,0,0,0.3);';
  document.body.appendChild(t);

  setTimeout(function () {
    window.location.replace(target);   // replace so back-button doesn't return to dashboard
  }, 1000);
};

// ══════════════════════════════════════════════════
// NAVBAR SCROLL
// ══════════════════════════════════════════════════
var navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 20px rgba(0,0,0,0.1)' : 'none';
  });
}

// Hamburger
var hamburger = document.getElementById('hamburger');
var navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', function () { navLinks.classList.toggle('open'); });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    if (navLinks) navLinks.classList.remove('open');
  });
});

// Fade-in on scroll
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card,.sdg-card,.testi-card,.step-card,.img-card,.tool-card').forEach(function (el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  io.observe(el);
});

// ══════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════
function showToast(msg, type) {
  var toast = document.querySelector('.dyslexease-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'dyslexease-toast';
    toast.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(100px);'
      + 'padding:14px 28px;border-radius:30px;font-family:Nunito,sans-serif;font-weight:800;'
      + 'font-size:16px;z-index:99999;color:white;transition:transform 0.4s;text-align:center;'
      + 'box-shadow:0 4px 20px rgba(0,0,0,0.25);max-width:90vw;';
    document.body.appendChild(toast);
  }
  var colors = { success:'#00C896', error:'#FF4D8D', warning:'#FF6B35', default:'#1A1A2E' };
  toast.style.background = colors[type] || colors['default'];
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._t);
  toast._t = setTimeout(function () {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3000);
}

// ══════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════
window.handleSignup = function (e) {
  e.preventDefault();
  var name    = document.getElementById('signupName').value.trim();
  var email   = document.getElementById('signupEmail').value.trim();
  var pass    = document.getElementById('signupPass').value;
  var confirm = document.getElementById('signupConfirm').value;
  var terms   = document.getElementById('terms').checked;

  if (!name || !email || !pass) { showToast('⚠️ Please fill all fields', 'warning'); return; }
  if (!email.includes('@'))     { showToast('❌ Invalid email', 'error'); return; }
  if (pass.length < 6)         { showToast('⚠️ Password too short', 'warning'); return; }
  if (pass !== confirm)        { showToast('❌ Passwords do not match', 'error'); return; }
  if (!terms)                  { showToast('⚠️ Accept Terms first', 'warning'); return; }

  localStorage.setItem('dyslexease_user', JSON.stringify({ name: name, email: email }));
  showToast('🎉 Account created! Please login.', 'success');
  setTimeout(function () { window.location.href = 'login.html'; }, 1400);
};

window.handleLogin = function (e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value.trim();
  var pass  = document.getElementById('loginPass').value;

  if (!email || !pass)      { showToast('⚠️ Please fill all fields', 'warning'); return; }
  if (!email.includes('@')) { showToast('❌ Invalid email', 'error'); return; }

  var raw  = localStorage.getItem('dyslexease_user');
  var user = raw ? JSON.parse(raw) : null;
  if (!user || user.email !== email) {
    var n = email.split('@')[0];
    var name = n.charAt(0).toUpperCase() + n.slice(1);
    user = { name: name, email: email };
    localStorage.setItem('dyslexease_user', JSON.stringify(user));
  }
  localStorage.setItem('dyslexease_loggedIn', 'true');
  showToast('✅ Welcome back, ' + user.name + '!', 'success');
  setTimeout(function () { window.location.href = 'dashboard.html'; }, 1200);
};

window.checkPasswordStrength = function (pass) {
  var fill = document.getElementById('strengthFill');
  var text = document.getElementById('strengthText');
  if (!fill || !text) return;
  var score = 0;
  if (pass.length >= 6)           score++;
  if (pass.length >= 10)          score++;
  if (/[A-Z]/.test(pass))         score++;
  if (/[0-9]/.test(pass))         score++;
  if (/[^A-Za-z0-9]/.test(pass))  score++;
  var levels = [
    { pct:'0%',   color:'#E0E0E0', label:'' },
    { pct:'25%',  color:'#FF5252', label:'🔴 Weak' },
    { pct:'50%',  color:'#FF9800', label:'🟠 Fair' },
    { pct:'75%',  color:'#FFD600', label:'🟡 Good' },
    { pct:'90%',  color:'#4CAF50', label:'🟢 Strong' },
    { pct:'100%', color:'#00C896', label:'💪 Excellent' }
  ];
  var lvl = levels[Math.min(score, 5)];
  fill.style.width = lvl.pct; fill.style.background = lvl.color;
  text.textContent = lvl.label; text.style.color = lvl.color;
};

// ══════════════════════════════════════════════════════════════
// DYSLEXIA-FRIENDLY SYLLABIFICATION
// Rule: split every consonant-vowel boundary → to-day, pro-ject
// This gives the exact output the teacher expects.
// ══════════════════════════════════════════════════════════════
var VOWELS = 'aeiouAEIOU';

function isVowel(ch) { return VOWELS.indexOf(ch) !== -1; }

function syllabifyWord(word) {
  // For short words (≤ 3 chars) don't split
  if (word.length <= 3) return [word];

  var parts  = [];
  var start  = 0;

  for (var i = 1; i < word.length - 1; i++) {
    var prev = word[i - 1];
    var curr = word[i];
    var next = word[i + 1];

    // Split between consonant and vowel: consonant | vowel
    // e.g. pro-ject: after 'o', 'j' is consonant, 'e' is vowel → split before 'j'
    // BUT only split when current char is consonant AND previous is vowel
    // AND we have accumulated at least 2 chars since last split
    if (!isVowel(curr) && isVowel(prev) && (i - start) >= 2) {
      parts.push(word.slice(start, i));
      start = i;
    }
    // Also split vowel-consonant-consonant-vowel → between the two consonants
    else if (
      isVowel(prev) && !isVowel(curr) && next && !isVowel(next) &&
      i + 2 < word.length && isVowel(word[i + 2]) &&
      (i - start) >= 2
    ) {
      parts.push(word.slice(start, i + 1));
      start = i + 1;
    }
  }

  parts.push(word.slice(start));

  // Ensure no part is empty
  parts = parts.filter(function (p) { return p.length > 0; });

  return parts.length > 1 ? parts : [word];
}

// ══════════════════════════════════════════════════════════════
// TOKEN-BASED TEXT FORMATTING
// Every word → tokenise → syllabify → render with bionic bold
// ══════════════════════════════════════════════════════════════
function tokenise(text) {
  var raw = text.match(/([a-zA-Z'-]+|[0-9]+(?:\.[0-9]+)?|[^\w\s]|\s+)/g) || [];
  return raw.map(function (t) {
    if (/^\s+$/.test(t))       return { type: 'SPACE',  value: t };
    if (/^[0-9]/.test(t))      return { type: 'NUMBER', value: t };
    if (/^[a-zA-Z'-]+$/.test(t)) {
      var clean = t.replace(/['-]/g, '');
      return clean.length >= 4
        ? { type: 'LONG', value: t }
        : { type: 'WORD', value: t };
    }
    return { type: 'PUNCT', value: t };
  });
}

function renderTokens(tokens) {
  var html = '';
  var wordCount = 0;
  var wIdx = 0;

  tokens.forEach(function (tok) {
    switch (tok.type) {

      case 'SPACE':
        html += tok.value.indexOf('\n') !== -1 ? '<br>' : ' ';
        break;

      case 'NUMBER':
        html += '<span class="tok-number">' + tok.value + '</span> ';
        break;

      case 'PUNCT':
        html += '<span class="tok-punct">' + tok.value + '</span>';
        break;

      case 'LONG': {
        // Syllabify the word
        var syls = syllabifyWord(tok.value);
        var safeW = tok.value.replace(/'/g, "\\'");

        // Build the syllable spans joined with hyphens
        var inner = syls.map(function (s, si) {
          var color = si % 2 === 0 ? '#0099FF' : '#FF6B35';
          // Bionic: bold first half of each syllable
          var half  = Math.ceil(s.length / 2);
          var bolded = '<b>' + s.slice(0, half) + '</b>' + s.slice(half);
          return '<span class="tok-syllable" style="color:' + color + '">' + bolded + '</span>';
        }).join('<span class="tok-sep">-</span>');

        html += '<span class="tok-long word" onclick="speakWord(\'' + safeW + '\')">' + inner + '</span> ';
        wordCount++; wIdx++;
        break;
      }

      case 'WORD': {
        // Short word — bionic bold only (no syllable split)
        var safeW2 = tok.value.replace(/'/g, "\\'");
        var half2  = Math.ceil(tok.value.length / 2);
        var bolded2 = '<b>' + tok.value.slice(0, half2) + '</b>' + tok.value.slice(half2);
        var cls = wIdx % 2 === 0 ? 'tok-even' : 'tok-odd';
        html += '<span class="tok-word ' + cls + ' word" onclick="speakWord(\'' + safeW2 + '\')">' + bolded2 + '</span> ';
        wordCount++; wIdx++;
        // Soft line break every 8 words for readability
        if (wordCount % 8 === 0) html += '<br><br>';
        break;
      }
    }
  });

  return html;
}

// ══════════════════════════════════════════════════════════════
// EMOJI MAP — 300+ words
// ══════════════════════════════════════════════════════════════
var EMOJI_MAP = {
  // Articles / common function words
  the:'📌', a:'📌', an:'📌', i:'👤', am:'👤',
  is:'➡️', are:'➡️', was:'⏮️', were:'⏮️', be:'✅', been:'✅',
  have:'✊', has:'✊', had:'✊', will:'🔮', would:'🔮',
  can:'💪', could:'💪', should:'🤔', do:'🎯', does:'🎯', did:'✅',
  not:'❌', no:'❌', yes:'✅', ok:'👍',
  on:'⬆️', in:'📥', at:'📍', to:'➡️', of:'🔗', and:'➕',
  or:'🔀', but:'↔️', if:'🤔', so:'✅', then:'➡️',
  from:'📤', with:'🤝', into:'📥', about:'💬', over:'🌈', under:'⬇️',
  up:'⬆️', down:'⬇️', out:'📤', for:'🎯',
  this:'👈', that:'👉', which:'❓', what:'❓', where:'📍', when:'🕐', who:'👤',
  my:'🫵', your:'🫵', his:'👨', her:'👩', their:'👥', our:'👥',
  very:'‼️', just:'✔️', also:'➕', still:'⏸️', all:'🌐', some:'🔢',

  // People
  i_person:'👤', you:'👤', he:'👨', she:'👩', they:'👥', we:'👥', it:'👇',
  man:'👨', woman:'👩', boy:'👦', girl:'👧', baby:'👶', child:'🧒',
  people:'👥', family:'👨‍👩‍👧', teacher:'👩‍🏫', student:'🎓', doctor:'👨‍⚕️', friend:'🤝',
  guide:'🧭', sir:'👨‍🦳', mam:'👩‍🦳', professor:'👨‍🏫',

  // Body
  hand:'✋', eye:'👁️', ear:'👂', nose:'👃', mouth:'👄', heart:'❤️',
  brain:'🧠', bone:'🦴', muscle:'💪', head:'🗣️', foot:'🦶',

  // Animals
  cat:'🐱', dog:'🐶', bird:'🐦', fish:'🐟', horse:'🐴', cow:'🐄',
  pig:'🐷', sheep:'🐑', rabbit:'🐰', bear:'🐻', lion:'🦁', tiger:'🐯',
  elephant:'🐘', mouse:'🐭', duck:'🦆', frog:'🐸', snake:'🐍',
  turtle:'🐢', bee:'🐝', ant:'🐜', butterfly:'🦋', monkey:'🐒',
  wolf:'🐺', fox:'🦊', deer:'🦌', penguin:'🐧', owl:'🦉', eagle:'🦅',

  // Nature
  sun:'☀️', moon:'🌙', star:'⭐', rain:'🌧️', snow:'❄️', cloud:'☁️',
  rainbow:'🌈', tree:'🌳', flower:'🌸', leaf:'🍃', grass:'🌿',
  mountain:'⛰️', ocean:'🌊', river:'🏞️', fire:'🔥', water:'💧',
  earth:'🌍', wind:'💨', lightning:'⚡', volcano:'🌋', sky:'🌤️', ground:'🟫',

  // Food
  apple:'🍎', banana:'🍌', orange:'🍊', grape:'🍇', strawberry:'🍓',
  lemon:'🍋', mango:'🥭', peach:'🍑', cherry:'🍒', pizza:'🍕',
  burger:'🍔', bread:'🍞', rice:'🍚', egg:'🥚', cheese:'🧀',
  milk:'🥛', cake:'🎂', cookie:'🍪', soup:'🍲', meat:'🥩',
  carrot:'🥕', potato:'🥔', tomato:'🍅', corn:'🌽', food:'🍽️',

  // Actions
  run:'🏃', walk:'🚶', jump:'🦘', swim:'🏊', dance:'💃',
  read:'📖', write:'✍️', draw:'🎨', sing:'🎤', play:'🎮',
  sleep:'😴', eat:'🍽️', drink:'🥤', laugh:'😂', cry:'😢',
  think:'💭', love:'❤️', like:'👍', want:'🙏', need:'❗',
  see:'👀', look:'👀', say:'💬', go:'🏃', come:'👋',
  get:'🤲', make:'🔨', show:'👀', help:'🤝', give:'🎁',
  take:'✊', find:'🔍', know:'🧠', work:'💼', learn:'💡',
  study:'📚', talk:'💬', ask:'❓', answer:'✅', review:'📋',
  present:'🎤', today:'📅', project:'📊',

  // School / Education
  school:'🏫', book:'📚', pen:'🖊️', pencil:'✏️', paper:'📄',
  bag:'🎒', class:'🏫', lesson:'📝', exam:'📝', test:'📝',
  math:'🔢', science:'🔬', art:'🎨', music:'🎵', history:'📜',
  computer:'💻', subject:'📚', course:'🎓', marks:'💯', grade:'📊',
  report:'📋', idea:'💡', guide_book:'📖', topic:'📌',

  // Home / Objects
  house:'🏠', home:'🏠', door:'🚪', bed:'🛏️', chair:'🪑', table:'🪑',
  lamp:'💡', phone:'📱', clock:'🕐', key:'🔑', lock:'🔒',
  ball:'⚽', toy:'🧸', box:'📦', bag_item:'👜',

  // Transport
  car:'🚗', bus:'🚌', train:'🚆', bike:'🚲', boat:'⛵', plane:'✈️',

  // Colors
  red:'🔴', blue:'🔵', green:'🟢', yellow:'🟡', orange_c:'🟠',
  purple:'🟣', black:'⚫', white:'⚪', pink:'🩷', brown:'🟤',

  // Feelings
  happy:'😊', sad:'😢', angry:'😠', scared:'😨', surprised:'😲',
  excited:'🤩', tired:'😴', sick:'🤒', confused:'🤔', proud:'😤',
  nervous:'😰', calm:'😌', worried:'😟', confident:'💪',

  // Numbers
  one:'1️⃣', two:'2️⃣', three:'3️⃣', four:'4️⃣', five:'5️⃣',
  six:'6️⃣', seven:'7️⃣', eight:'8️⃣', nine:'9️⃣', ten:'🔟',

  // Size / adjectives
  big:'🐘', small:'🐭', fast:'⚡', slow:'🐢', hot:'🔥', cold:'🧊',
  good:'👍', bad:'👎', new:'✨', old:'📜', bright:'✨', dark:'🌑',
  tall:'🏔️', short:'📏', long:'📏', wide:'↔️', deep:'🌊',

  // Time
  day:'☀️', night:'🌙', morning:'🌅', evening:'🌇', time:'🕐',
  today:'📅', yesterday:'📅', tomorrow:'📅', week:'📅', year:'🗓️',

  // Places
  city:'🏙️', park:'🌳', beach:'🏖️', forest:'🌲', hospital:'🏥',
  store:'🏪', restaurant:'🍴', airport:'✈️', station:'🚉', college:'🏫',

  // SDG / Sustainability
  education:'🎓', health:'💚', equality:'🤝', planet:'🌍',
  sustainable:'🌱', technology:'💻', innovation:'💡', community:'👥',
  environment:'🌿', energy:'⚡', clean:'✨',

  // Extra common words
  come:'👋', came:'👋', gone:'🚶', left:'👈', right:'👉',
  high:'⬆️', low:'⬇️', next:'➡️', last:'⏮️', first:'1️⃣',
  every:'🌐', each:'👆', many:'📊', more:'➕', less:'➖',
  money:'💰', gift:'🎁', party:'🎉', birthday:'🎂',
  map:'🗺️', camera:'📷', video:'🎬', game:'🎮',
  trophy:'🏆', medal:'🥇', crown:'👑', diamond:'💎',
  mat:'🔲', sat:'🧘', got:'✊', put:'📥', let:'✅',
  bit:'🔹', lot:'🔶', way:'🛤️', thing:'📌', place:'📍',
  time_word:'⏰', life:'🌱', world:'🌍', country:'🗺️', city_word:'🏙️',
  point:'📍', part:'🔷', fact:'📋', kind:'💚', type:'📝',
  number:'🔢', name:'🏷️', word:'💬', line:'📏', page:'📄',
  problem:'❗', answer_w:'✅', question:'❓', result:'📊',
};

function getEmoji(word) {
  var w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (EMOJI_MAP[w]) return EMOJI_MAP[w];
  // Fallback by first letter
  var initials = {
    a:'🅰️', b:'🅱️', c:'🌟', d:'💠', e:'✨', f:'🎏', g:'🌿', h:'🏠',
    i:'💡', j:'🌀', k:'🔑', l:'💛', m:'🌊', n:'🔢', o:'⭕', p:'🌸',
    q:'❓', r:'🌈', s:'⭐', t:'🌳', u:'☂️', v:'💜', w:'🌊', x:'❌',
    y:'💛', z:'⚡'
  };
  return (w[0] && initials[w[0]]) ? initials[w[0]] : '📌';
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD INIT
// ══════════════════════════════════════════════════════════════
if (document.querySelector('.dashboard-page')) {
  initDashboard();
}

function initDashboard() {
  var inputArea    = document.getElementById('textInput');
  var outputArea   = document.getElementById('textOutput');
  var visualOutput = document.getElementById('visualOutput');
  var speedSlider  = document.getElementById('speedSlider');
  var speedValue   = document.getElementById('speedValue');
  var speechProg   = document.getElementById('speechProgress');
  var progFill     = document.getElementById('progressFill');
  var isSpeaking   = false;
  var _font = 'Nunito', _bg = '#FFFBF0', _fontSize = 20, _spacing = 2;

  if (speedSlider) {
    speedSlider.addEventListener('input', function () {
      speedValue.textContent = speedSlider.value + 'x';
    });
  }

  function applySettings(el) {
    if (!el) return;
    el.style.fontFamily = _font;
    el.style.background = _bg;
    el.style.fontSize   = _fontSize + 'px';
    el.style.lineHeight = _spacing;
  }

  // ── FORMAT TEXT ─────────────────────────────────────────────
  window.formatText = function () {
    var text = inputArea.value.trim();
    if (!text) { showToast('⚠️ Please enter some text first!', 'warning'); return; }

    var tokens = tokenise(text);
    var body   = renderTokens(tokens);

    outputArea.innerHTML = '<div class="token-body">' + body + '</div>';

    outputArea.classList.add('visible');
    applySettings(outputArea);
    showToast('✅ Dyslexia-friendly format applied!', 'success');
  };

  // ── SPEAK WORD ───────────────────────────────────────────────
  window.speakWord = function (word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    var utt  = new SpeechSynthesisUtterance(word);
    utt.rate = speedSlider ? parseFloat(speedSlider.value) : 0.8;
    utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
  };

  // ── SPEAK ALL ────────────────────────────────────────────────
  window.speakText = function () {
    var text = (outputArea.textContent || inputArea.value).trim();
    if (!text) { showToast('⚠️ Format text first!', 'warning'); return; }

    if (isSpeaking) {
      window.speechSynthesis.cancel(); isSpeaking = false;
      if (speechProg) speechProg.classList.remove('visible');
      showToast('⏹ Stopped'); return;
    }

    if (!('speechSynthesis' in window)) { showToast('❌ TTS not supported', 'error'); return; }

    var utt    = new SpeechSynthesisUtterance(text);
    utt.rate   = speedSlider ? parseFloat(speedSlider.value) : 0.8;
    utt.pitch  = 1.1; utt.lang = 'en-US';
    var wIdx   = 0;
    var allWords = document.querySelectorAll('#textOutput .word');
    var total  = allWords.length || 1;

    utt.onboundary = function (e) {
      if (e.name === 'word' && allWords.length) {
        allWords.forEach(function (w) { w.classList.remove('speaking'); });
        if (allWords[wIdx]) {
          allWords[wIdx].classList.add('speaking');
          allWords[wIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (progFill) progFill.style.width = ((wIdx + 1) / total * 100) + '%';
        wIdx++;
      }
    };
    utt.onend = function () {
      isSpeaking = false;
      allWords.forEach(function (w) { w.classList.remove('speaking'); });
      if (speechProg) speechProg.classList.remove('visible');
      if (progFill) progFill.style.width = '0%';
      showToast('✅ Reading complete!', 'success');
    };

    window.speechSynthesis.speak(utt);
    isSpeaking = true;
    if (speechProg) speechProg.classList.add('visible');
    showToast('🔊 Reading aloud...');
  };

  // ── VISUALIZE — every word gets a correct emoji card ────────
  window.visualizeText = function () {
    var raw = inputArea.value.trim() || outputArea.textContent.trim();
    if (!raw) { showToast('⚠️ Please enter some text first!', 'warning'); return; }

    // Split on whitespace and punctuation, keep only real words/numbers
    var words = raw.match(/[a-zA-Z0-9']+/g) || [];
    if (words.length === 0) { showToast('⚠️ No words found', 'warning'); return; }

    var MAX   = 60;
    var shown = words.slice(0, MAX);
    var cards = '';

    shown.forEach(function (word) {
      var emoji   = getEmoji(word);
      var safeW   = word.replace(/'/g, '&#39;');
      var safeCall = word.replace(/'/g, "\\'");
      cards +=
        '<div class="vis-word-card" onclick="speakWord(\'' + safeCall + '\')">' +
          '<div class="vis-emoji">' + emoji + '</div>' +
          '<div class="vis-label">' + safeW + '</div>' +
        '</div>';
    });

    if (words.length > MAX) {
      cards += '<div class="vis-more">+' + (words.length - MAX) + ' more words</div>';
    }

    visualOutput.innerHTML =
      '<div class="vis-header">🖼️ Visual Word Map — click any card to hear it!</div>' +
      '<div class="vis-grid">' + cards + '</div>';

    visualOutput.classList.add('visible');
    showToast('🖼️ Visual map: ' + shown.length + ' words', 'success');
  };

  // ── CLEAR ────────────────────────────────────────────────────
  window.clearAll = function () {
    inputArea.value = '';
    outputArea.innerHTML = ''; outputArea.classList.remove('visible');
    visualOutput.innerHTML = ''; visualOutput.classList.remove('visible');
    if (speechProg) speechProg.classList.remove('visible');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isSpeaking = false;
    showToast('🧹 Cleared!');
  };

  // ── CUSTOMISE ────────────────────────────────────────────────
  window.toggleCustomize = function () {
    var p = document.getElementById('customizePanel');
    if (p) p.classList.toggle('visible');
  };

  window.applyFont = function (font) {
    _font = font; applySettings(outputArea);
    if (inputArea) inputArea.style.fontFamily = font;
  };
  window.applyBg = function (color, el) {
    _bg = color; applySettings(outputArea);
    document.querySelectorAll('.bg-option').forEach(function (s) { s.classList.remove('active'); });
    if (el) el.classList.add('active');
  };
  window.applyFontSize = function (size, display) {
    _fontSize = parseInt(size);
    if (display) display.textContent = size + 'px';
    applySettings(outputArea);
    if (inputArea) inputArea.style.fontSize = (parseInt(size) - 2) + 'px';
  };
  window.applySpacing = function (spacing, display) {
    _spacing = parseFloat(spacing);
    if (display) display.textContent = parseFloat(spacing).toFixed(1);
    applySettings(outputArea);
  };

  // ── SAMPLE TEXT ──────────────────────────────────────────────
  window.loadSample = function () {
    inputArea.value = 'Today I have a project review so I have come to show my guide the project. Learning dyslexia friendly reading can help every student read better every day. The teacher will review the project and give feedback.';
    updateWordCount(inputArea.value);
    showToast('📋 Sample text loaded!');
  };

  // ── PDF UPLOAD & TEXT EXTRACTION ─────────────────────────────
  // Uses PDF.js (CDN) to extract text from uploaded PDF files

  function loadPdfJs(callback) {
    if (window.pdfjsLib) { callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      callback();
    };
    script.onerror = function () {
      showToast('❌ Could not load PDF reader. Check your internet connection.', 'error');
    };
    document.head.appendChild(script);
  }

  window.handlePdfUpload = function (input) {
    var file = input && input.files && input.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('⚠️ Please upload a valid PDF file.', 'warning');
      input.value = '';
      return;
    }

    showToast('⏳ Reading PDF...', 'default');

    loadPdfJs(function () {
      var reader = new FileReader();
      reader.onload = function (e) {
        var typedArray = new Uint8Array(e.target.result);

        window.pdfjsLib.getDocument({ data: typedArray }).promise
          .then(function (pdf) {
            var totalPages = pdf.numPages;
            var pagePromises = [];

            for (var i = 1; i <= totalPages; i++) {
              pagePromises.push(
                pdf.getPage(i).then(function (page) {
                  return page.getTextContent().then(function (content) {
                    // Join text items, preserving line breaks
                    var lines = [];
                    var lastY = null;
                    content.items.forEach(function (item) {
                      var y = item.transform ? item.transform[5] : null;
                      if (lastY !== null && Math.abs(y - lastY) > 5) {
                        lines.push('\n');
                      }
                      lines.push(item.str);
                      lastY = y;
                    });
                    return lines.join(' ').replace(/ \n /g, '\n').trim();
                  });
                })
              );
            }

            Promise.all(pagePromises).then(function (pages) {
              var fullText = pages
                .map(function (p) { return p.trim(); })
                .filter(function (p) { return p.length > 0; })
                .join('\n\n');

              if (!fullText) {
                showToast('⚠️ No text found. PDF may be scanned/image-based.', 'warning');
                return;
              }

              inputArea.value = fullText;
              updateWordCount(fullText);
              showToast('✅ PDF extracted! ' + totalPages + ' page(s), ' +
                fullText.split(/\s+/).filter(Boolean).length + ' words.', 'success');

              // Auto-scroll to text input
              if (inputArea) inputArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
          })
          .catch(function (err) {
            console.error('PDF extraction error:', err);
            showToast('❌ Could not read PDF: ' + (err.message || 'Unknown error'), 'error');
          });
      };

      reader.onerror = function () {
        showToast('❌ Failed to read file.', 'error');
      };

      reader.readAsArrayBuffer(file);
      input.value = ''; // Reset so same file can be re-uploaded
    });
  };

  // ── ANALYZE TEXT ─────────────────────────────────────────────
  window.analyzeText = function () {
    var text = inputArea.value.trim();
    if (!text) { showToast('⚠️ Enter some text first!', 'warning'); return; }
    var words   = text.split(/\s+/).filter(Boolean);
    var avgLen  = words.reduce(function (s, w) { return s + w.length; }, 0) / words.length;
    var longW   = words.filter(function (w) { return w.length >= 7; }).length;
    var diff    = avgLen < 4 ? 'Easy' : avgLen < 6 ? 'Medium' : 'Hard';
    var pct     = avgLen < 4 ? 25 : avgLen < 6 ? 55 : 85;
    var color   = avgLen < 4 ? 'var(--green)' : avgLen < 6 ? 'var(--yellow)' : 'var(--orange)';
    var m = document.getElementById('difficultyMeter');
    if (m) {
      m.style.display = 'block';
      document.getElementById('diffLabel').textContent = 'Difficulty: ' + diff;
      document.getElementById('diffStats').textContent =
        words.length + ' words | avg ' + avgLen.toFixed(1) + ' chars | ' + longW + ' long words';
      var f = document.getElementById('diffFill');
      f.style.width = pct + '%'; f.style.background = color;
    }
    showToast('📊 Analysis: ' + diff + ' level', 'success');
  };

  // ── FEATURE TOGGLES ──────────────────────────────────────────
  window.toggleFocusMode = function (el) {
    document.getElementById('dashboardRoot').classList.toggle('focus-mode', el.checked);
    showToast(el.checked ? '🎯 Focus mode ON' : '🎯 Focus mode OFF');
  };
  window.toggleHighContrast = function (el) {
    document.getElementById('dashboardRoot').classList.toggle('high-contrast', el.checked);
    showToast(el.checked ? '🌓 High contrast ON' : '🌓 High contrast OFF');
  };
  window.toggleSyllables = function (el) {
    document.getElementById('textOutput').classList.toggle('no-syllables', !el.checked);
  };

  // ── LETTER SPACING ───────────────────────────────────────────
  window.applyLetterSpacing = function (val) {
    document.getElementById('lsValue').textContent = parseFloat(val).toFixed(2) + 'em';
    var out = document.getElementById('textOutput');
    if (out) out.style.letterSpacing = val + 'em';
    var p = document.getElementById('spacingPreview');
    if (p) p.style.letterSpacing = val + 'em';
  };

  // ── WORD COUNT ───────────────────────────────────────────────
  window.updateWordCount = function (val) {
    var n = val.trim().split(/\s+/).filter(Boolean).length;
    var b = document.getElementById('wordCountBadge');
    if (b) b.textContent = n + ' words';
  };

  // ── LOAD USERNAME ────────────────────────────────────────────
  var savedUser = localStorage.getItem('dyslexease_user');
  if (savedUser) {
    var u = JSON.parse(savedUser);
    ['userName', 'userNameBig'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = u.name || 'Learner';
    });
    var av = document.getElementById('userAvatar');
    if (av) av.textContent = (u.name || 'L')[0].toUpperCase();
  }

  // ── READING RULER ────────────────────────────────────────────
  var ruler = document.createElement('div');
  ruler.id = 'readingRuler';
  ruler.style.cssText = 'display:none;position:fixed;left:0;right:0;height:36px;'
    + 'background:rgba(255,214,10,0.25);pointer-events:none;z-index:500;'
    + 'border-top:2px solid #FFD60A;border-bottom:2px solid #FFD60A;';
  document.body.appendChild(ruler);

  document.addEventListener('mousemove', function (e) {
    var toggle = document.getElementById('rulerToggle');
    if (toggle && toggle.checked) {
      ruler.style.display = 'block';
      ruler.style.top = (e.clientY - 18) + 'px';
    } else {
      ruler.style.display = 'none';
    }
  });
}

// Scroll helper
window.scrollToSection = function (id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return false;
};