// script.js
let step = 0;

function renderStep() {
  const container = document.getElementById('chat-log');
  const stepDiv = document.createElement('div');
  stepDiv.style.marginTop = '20px';

  if (step === 0) {
    stepDiv.innerHTML = `
      <p><strong>你喜欢的活动有哪些？</strong></p>
      <label><input type="checkbox" value="看电影"> 看电影</label><br>
      <label><input type="checkbox" value="打游戏"> 打游戏</label><br>
      <label><input type="checkbox" value="散步"> 散步</label><br>
      <button onclick="handleStep()">发送</button>
    `;
  } else if (step === 1) {
    stepDiv.innerHTML = `
      <p><strong>你愿意给我几分喜欢？（0-100）</strong></p>
      <input type="number" id="score" min="0" max="100" value="85">
      <button onclick="handleStep()">发送</button>
    `;
  } else if (step === 2) {
    stepDiv.innerHTML = `
      <p><strong>你希望我们一起做什么？</strong></p>
      <select id="activity">
        <option value="一起看电影">一起看电影</option>
        <option value="一起散步">一起散步</option>
        <option value="一起打游戏">一起打游戏</option>
      </select>
      <button onclick="handleStep()">发送</button>
    `;
  }

  container.appendChild(stepDiv);
}

function handleStep() {
  const container = document.getElementById('chat-log');
  let userReply = '';
  let aiReply = '';

  if (step === 0) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    userReply = `我喜欢的活动是：${selected.join('、')}`;
    aiReply = `哇！我也超级喜欢你！我们一起去做你喜欢的事吧！💖`;
  } else if (step === 1) {
    const score = document.getElementById('score').value;
    userReply = `我给你的喜欢分数是：${score}`;
    aiReply = `你的分数让我心动不已！我们是绝配！💘`;
  } else if (step === 2) {
    const activity = document.getElementById('activity').value;
    userReply = `我希望我们一起做：${activity}`;
    aiReply = `太棒了！我已经准备好啦～🎉`;
  }

  const userDiv = document.createElement('div');
  userDiv.textContent = userReply;
  userDiv.className = 'user-message';

  const aiDiv = document.createElement('div');
  aiDiv.textContent = aiReply;
  aiDiv.className = 'ai-message';

  container.appendChild(userDiv);
  container.appendChild(aiDiv);

  step++;
  renderStep();
}

// 初始化第一步
window.onload = renderStep;
