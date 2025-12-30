// ===== 標題動畫 =====
const title = document.getElementById("title");
const text = title.textContent;
title.textContent = "";

// 先建立每個 span
[...text].forEach(char => {
  const span = document.createElement("span");
  span.textContent = char;
  span.className = "title-char";
  if (char === "💃") span.dataset.emoji = "true";
  title.appendChild(span);
});

function animateTitle() {
  const spans = document.querySelectorAll(".title-char");

  // 移除先前動畫類別，準備重新播放
  title.classList.remove("title-jump");
  spans.forEach(span => {
    span.classList.remove("title-char-jump", "emoji-barrel");
  });

  // 每個字依序跳
  spans.forEach((span, i) => {
    setTimeout(() => {
      if (span.dataset.emoji) {
        span.classList.add("emoji-barrel");
      } else {
        span.classList.add("title-char-jump");
      }
    }, 800 + i * 120);
  });
}

// 先執行一次
animateTitle();

// 設定每次動畫完成後隔 2 秒再執行
const totalDuration = 800 + text.length * 120 + 100;
setInterval(animateTitle, totalDuration + 2000);

// ===== 原本 #content 拆字 + 滑鼠互動 =====
const content = document.getElementById('content');
const htmlContent = content.innerHTML;
content.innerHTML = '';

const letters = [];
let isLeftMouseDown = false;

const tempDiv = document.createElement('div');
tempDiv.innerHTML = htmlContent;

function processNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    const fragment = document.createDocumentFragment();
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char;
      fragment.appendChild(span);
      letters.push(span);
    });
    node.parentNode.replaceChild(fragment, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    Array.from(node.childNodes).forEach(child => processNode(child));
  }
}

Array.from(tempDiv.childNodes).forEach(child => processNode(child));
content.appendChild(tempDiv);

// 左鍵監聽
document.addEventListener('mousedown', e => {
  if (e.button === 0) {
    isLeftMouseDown = true;
    document.body.classList.add('right-clicking');
    e.preventDefault();
  }
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) {
    isLeftMouseDown = false;
    document.body.classList.remove('right-clicking');
  }
});

// 滑鼠移動尾煙
document.addEventListener('mousemove', e => {
  if (isLeftMouseDown && Math.random() > 0.3) {
    const trail = document.createElement('div');
    trail.className = 'magic-trail';
    
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.position = 'fixed';
    
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  }
});

// 每個字母滑鼠互動
letters.forEach(letter => {
  letter.addEventListener('mouseenter', () => {
    if (!letter.classList.contains('bounce')) {
      letter.classList.add('bounce');
      setTimeout(() => {
        letter.classList.remove('bounce');
      }, 1000);
    }
    if (isLeftMouseDown) {
      letter.classList.remove('colorful');
      void letter.offsetWidth;
      letter.classList.add('colorful');
      setTimeout(() => {
        letter.classList.remove('colorful');
      }, 5000);
    }
  });
});

// 隨機文字跳動
setInterval(() => {
  if (!isLeftMouseDown) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    randomLetter.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      randomLetter.style.transform = '';
    }, 300);
  }
}, 2000);

// ===== 下雪效果 =====
const exportBtn = document.getElementById('exportWordBtn');
let snowInterval = null;

exportBtn.addEventListener('click', () => {
  startSnowFor5Seconds();
});

function startSnowFor5Seconds() {
  // 如果已經在下雪，先清掉（避免狂點）
  stopSnow();
  snowInterval = setInterval(createSnowflake, 120);
}

function stopSnow() {
  if (snowInterval) {
    clearInterval(snowInterval);
    snowInterval = null;
  }
  document.querySelectorAll('.snowflake').forEach(flake => flake.remove());
}

function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.className = 'snowflake';
  snowflake.textContent = '❄';

  const size = Math.random() * 10 + 10;
  const startX = Math.random() * window.innerWidth;
  const duration = Math.random() * 3 + 4;

  snowflake.style.left = startX + 'px';
  snowflake.style.fontSize = size + 'px';
  snowflake.style.animationDuration = duration + 's';

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}