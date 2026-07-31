var quotes = [
  { t: 'You are here. That is enough for this minute.', m: 'grounded' },
  { t: 'Feel your feet on the floor. You are in this room, not every room.', m: 'grounded' },
  { t: 'One thing at a time is still progress.', m: 'grounded' },
  { t: 'You do not have to hold the whole day at once.', m: 'grounded' },
  { t: 'Name one thing that is real and near. Start there.', m: 'grounded' },
  { t: 'Rest if you must, but do not quit.', m: 'calm' },
  { t: 'You are allowed to take this one hour at a time.', m: 'calm' },
  { t: 'Be gentle with yourself. You are doing your best with what you have right now.', m: 'calm' },
  { t: 'You do not need to earn the right to breathe.', m: 'calm' },
  { t: 'Peace can begin with one quiet breath.', m: 'calm' },
  { t: 'Slow is still moving.', m: 'calm' },
  { t: 'The sun will rise again, even if tonight feels endless.', m: 'hopeful' },
  { t: 'Even a small light can make the dark feel less permanent.', m: 'hopeful' },
  { t: 'This moment is not the whole of your life.', m: 'hopeful' },
  { t: 'Tomorrow is allowed to be gentler than today.', m: 'hopeful' },
  { t: 'You are still becoming, even on the hardest days.', m: 'hopeful' },
  { t: 'Something good can still find you.', m: 'hopeful' },
  { t: 'Tired is not lazy. Tired is information.', m: 'tired' },
  { t: 'You can put some of this down for now.', m: 'tired' },
  { t: 'Rest counts. Even a short pause counts.', m: 'tired' },
  { t: 'You do not have to finish today.', m: 'tired' },
  { t: 'Softness is allowed when you are worn out.', m: 'tired' },
  { t: 'Heavy days do not mean you are broken.', m: 'heavy' },
  { t: 'You have carried hard things before. You are still here.', m: 'heavy' },
  { t: 'This weight is real. You do not have to pretend it is light.', m: 'heavy' },
  { t: 'You can ask for help without explaining everything.', m: 'heavy' },
  { t: 'Surviving today is enough of a goal.', m: 'heavy' }
];

var theme = {
  grounded: '#3d5c4a',
  calm: '#5b6b7c',
  hopeful: '#8a5a3b',
  tired: '#7a6e5f',
  heavy: '#5c4a55'
};

var currentMood = 'grounded';
var lastQuote = '';
var breathing = false;
var step = 0;
var timer = null;

function poolFor(mood) {
  var list = [];
  for (var q = 0; q < quotes.length; q++) {
    if (quotes[q].m === mood) list.push(quotes[q]);
  }
  return list.length ? list : quotes;
}

function randomQuote(mood) {
  var pool = poolFor(mood);
  var pick = pool[Math.floor(Math.random() * pool.length)];
  if (pool.length > 1) {
    var guard = 0;
    while (pick.t === lastQuote && guard < 12) {
      pick = pool[Math.floor(Math.random() * pool.length)];
      guard++;
    }
  }
  lastQuote = pick.t;
  return pick;
}

function showQuote(item) {
  var quoteEl = document.getElementById('quote-text');
  var tagEl = document.getElementById('tag');
  var moodQuoteEl = document.getElementById('mood-quote');
  if (quoteEl) quoteEl.textContent = item.t;
  if (tagEl) tagEl.textContent = item.m;
  if (moodQuoteEl) moodQuoteEl.textContent = item.t;
}

function pickMood(name) {
  var c = theme[name];
  if (!c) return;
  currentMood = name;

  var buttons = document.querySelectorAll('.mood');
  for (var k = 0; k < buttons.length; k++) {
    var b = buttons[k];
    var on = b.getAttribute('data-m') === name;
    if (on) {
      b.classList.add('on');
      b.style.background = c;
      b.style.borderColor = c;
      b.style.color = '#f6f0e6';
    } else {
      b.classList.remove('on');
      b.style.background = '';
      b.style.borderColor = '';
      b.style.color = '';
    }
  }

  var primaries = document.querySelectorAll('button.primary');
  for (var p = 0; p < primaries.length; p++) {
    primaries[p].style.background = c;
    primaries[p].style.borderColor = c;
  }

  showQuote(randomQuote(name));

  try { localStorage.setItem('softspace-mood', name); } catch (e) {}
}

function goTo(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function nextQuote() {
  showQuote(randomQuote(currentMood));
}

function copyQuote() {
  var quoteEl = document.getElementById('quote-text');
  var btn = document.getElementById('copy-btn');
  if (!quoteEl || !btn) return;
  var old = btn.textContent;
  var text = quoteEl.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = 'copied';
      setTimeout(function () { btn.textContent = old; }, 1100);
    }).catch(function () {
      btn.textContent = 'failed';
      setTimeout(function () { btn.textContent = old; }, 1100);
    });
  }
}

// breathing
function tickBreath() {
  var phases = [
    { label: 'breathe in', cls: 'in' },
    { label: 'hold', cls: 'hold' },
    { label: 'breathe out', cls: 'out' }
  ];
  var p = phases[step % 3];
  var breathTxt = document.getElementById('breath-txt');
  var orb = document.getElementById('orb');
  if (breathTxt) breathTxt.textContent = p.label;
  if (orb) orb.className = 'orb ' + p.cls;
  step++;
}
function startBreath() {
  if (breathing) return;
  breathing = true;
  var breatheBtn = document.getElementById('breathe-btn');
  if (breatheBtn) breatheBtn.textContent = 'pause';
  tickBreath();
  timer = setInterval(tickBreath, 3400);
}
function stopBreath() {
  breathing = false;
  clearInterval(timer);
  timer = null;
  var breatheBtn = document.getElementById('breathe-btn');
  if (breatheBtn) breatheBtn.textContent = 'start';
}
function resetBreath() {
  stopBreath();
  step = 0;
  var orb = document.getElementById('orb');
  var breathTxt = document.getElementById('breath-txt');
  if (orb) orb.className = 'orb';
  if (breathTxt) breathTxt.textContent = 'breathe in';
}
function toggleBreath() {
  if (breathing) stopBreath(); else startBreath();
}

// wire everything after DOM is ready
function init() {
  var navLinks = document.querySelectorAll('nav a');
  for (var n = 0; n < navLinks.length; n++) {
    navLinks[n].addEventListener('click', function (e) {
      e.preventDefault();
      var href = this.getAttribute('href') || '';
      if (href.charAt(0) === '#') goTo(href.slice(1));
    });
  }

  var goRem = document.getElementById('go-reminders');
  var goBre = document.getElementById('go-breathe');
  if (goRem) goRem.addEventListener('click', function () { goTo('reminders'); });
  if (goBre) goBre.addEventListener('click', function () { goTo('breathe'); });

  var nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextQuote);

  var copyBtn = document.getElementById('copy-btn');
  if (copyBtn) copyBtn.addEventListener('click', copyQuote);

  var breatheBtn = document.getElementById('breathe-btn');
  if (breatheBtn) breatheBtn.addEventListener('click', toggleBreath);

  var breatheReset = document.getElementById('breathe-reset');
  if (breatheReset) breatheReset.addEventListener('click', resetBreath);

  var checks = document.querySelectorAll('#checkin-list input');
  for (var c = 0; c < checks.length; c++) {
    (function (box, idx) {
      try {
        if (localStorage.getItem('soft-c' + idx) === '1') box.checked = true;
      } catch (e) {}
      box.addEventListener('change', function () {
        try { localStorage.setItem('soft-c' + idx, box.checked ? '1' : '0'); } catch (e) {}
      });
    })(checks[c], c);
  }

  var saved = 'grounded';
  try { saved = localStorage.getItem('softspace-mood') || 'grounded'; } catch (e) {}
  pickMood(saved);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
