// Game state
let currentWordIndex = 0;
let currentRound = 1;
let score = 0;
let attempts = 0;
let maxAttempts = 5;
const usedWordIndices = new Set();
let isThinking = false;


// DOM elements
const targetWordElement = document.getElementById('target-word');
const tabooWordsElement = document.getElementById('taboo-words');
const scoreElement = document.getElementById('score');
const roundElement = document.getElementById('round-count');
const feedbackElement = document.getElementById('feedback');
const conversationElement = document.getElementById('conversation');
const hintInputElement = document.getElementById('hint-input');
const submitHintButton = document.getElementById('submit-hint');
const newWordButton = document.getElementById('new-word');
const skipWordButton = document.getElementById('skip-word');
const cardElement = document.getElementById('card');

// Initialize game
function initGame() {
  currentWordIndex = getRandomWordIndex();
  updateWordCard();
  updateScore();
  resetConversation();
  resetFeedback();
  AILogic.resetMemory();
}

// Get a random word index that hasn't been used yet
function getRandomWordIndex() {
  // Reset used indices if all words have been used
  if (usedWordIndices.size >= gameData.words.length) {
    usedWordIndices.clear();
  }
  
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * gameData.words.length);
  } while (usedWordIndices.has(randomIndex));
  
  usedWordIndices.add(randomIndex);
  return randomIndex;
}

// Update the word card
function updateWordCard() {
  cardElement.classList.add('card-change');
  setTimeout(() => {
    cardElement.classList.remove('card-change');
  }, 500);
  
  const wordData = gameData.words[currentWordIndex];
  targetWordElement.textContent = wordData.target;
  
  // Clear and update taboo words
  tabooWordsElement.innerHTML = '';
  
  // Add target word to taboo words
  const targetTabooElement = document.createElement('div');
  targetTabooElement.className = 'taboo-word target-taboo';
  targetTabooElement.textContent = wordData.target;
  tabooWordsElement.appendChild(targetTabooElement);
  
  // Add other taboo words
  wordData.taboo.forEach(word => {
    const tabooWordElement = document.createElement('div');
    tabooWordElement.className = 'taboo-word';
    tabooWordElement.textContent = word;
    tabooWordsElement.appendChild(tabooWordElement);
  });
  
  // Reset attempts
  attempts = 0;
}

// Update score display
function updateScore() {
  scoreElement.textContent = score;
  roundElement.textContent = currentRound;
}

// Reset conversation
function resetConversation() {
  conversationElement.innerHTML = '';
  addAIMessage(getRandomResponse(gameData.aiResponses.greeting));
}

// Reset feedback
function resetFeedback() {
  feedbackElement.textContent = '';
  feedbackElement.className = 'feedback';
}

// Add AI message to conversation
function addAIMessage(message) {
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'AI';
  
  const messageElement = document.createElement('div');
  messageElement.className = 'ai-message';
  messageElement.textContent = message;
  
  messageWrapper.appendChild(avatar);
  messageWrapper.appendChild(messageElement);
  conversationElement.appendChild(messageWrapper);
  conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Add player message to conversation
function addPlayerMessage(message) {
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper player';
  
  const messageElement = document.createElement('div');
  messageElement.className = 'player-message';
  messageElement.textContent = message;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar player-avatar';
  avatar.textContent = 'You';
  
  messageWrapper.appendChild(messageElement);
  messageWrapper.appendChild(avatar);
  conversationElement.appendChild(messageWrapper);
  conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Get random response from response array
function getRandomResponse(responseArray) {
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Check if a string contains any taboo words
function containsTabooWord(inputString) {
  const wordData = gameData.words[currentWordIndex];
  const input = inputString.toLowerCase();
  
  // Check target word first
  if (input.includes(wordData.target.toLowerCase())) {
    return wordData.target;
  }
  
  for (const tabooWord of wordData.taboo) {
    if (input.includes(tabooWord.toLowerCase())) {
      return tabooWord;
    }
  }
  
  return null;
}

// Handle hint submission
function handleHintSubmission() {
  const hint = hintInputElement.value.trim();
  if (hint === '') return;
  
  // Add player message to conversation
  addPlayerMessage(hint);
  
  // Check for taboo words
  const tabooWord = containsTabooWord(hint);
  if (tabooWord) {
    const response = getRandomResponse(gameData.aiResponses.tabooUsed).replace('{taboo}', tabooWord);
    feedbackElement.textContent = response;
    feedbackElement.className = 'feedback incorrect';
    addAIMessage(response);
    hintInputElement.value = '';
    return;
  }
  
  // Add hint to AI memory
  AILogic.rememberHint(hint);
  
  // Simulate AI thinking
  showThinking();
  
  // Process AI's response after a delay
  setTimeout(() => {
    attempts++;
    hideThinking();
    
    // Decide if AI should guess correctly
    const wordData = gameData.words[currentWordIndex];
    const target = wordData.target;
    
    if (AILogic.shouldGuessCorrectly(target, attempts)) {
      // Correct guess - provide just the guess without follow-up questions
      const response = getRandomResponse(gameData.aiResponses.guessedSimple).replace('{word}', target);
      addAIMessage(response);
      
      // Update feedback and score
      feedbackElement.textContent = 'Correct! +1 point';
      feedbackElement.className = 'feedback correct';
      
      // Play correct answer animation
      playCorrectAnimation();
      
      score++;
      updateScore();
      
      // Move to next round after a delay
      setTimeout(() => {
        currentRound++;
        currentWordIndex = getRandomWordIndex();
        updateWordCard();
        resetConversation();
        resetFeedback();
        AILogic.resetMemory();
      }, 3000);
    } else {
      // Incorrect guess - just the guess, no follow-up questions
      const alternativeGuess = AILogic.getIntelligentGuess(target);
      const response = getRandomResponse(gameData.aiResponses.incorrectSimple).replace('{guess}', alternativeGuess);
      addAIMessage(response);
      
      // If max attempts reached, AI gives up
      if (attempts >= maxAttempts) {
        setTimeout(() => {
          addAIMessage(getRandomResponse(gameData.aiResponses.giveUp));
          // No score update, just move to next word
          setTimeout(() => {
            currentRound++;
            currentWordIndex = getRandomWordIndex();
            updateWordCard();
            resetConversation();
            resetFeedback();
            AILogic.resetMemory();
          }, 2000);
        }, 1500);
      }
    }
    
    hintInputElement.value = '';
  }, 1500);
}

// Play correct answer animation
function playCorrectAnimation() {
  // Create confetti effect
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  document.body.appendChild(confettiContainer);
  
  // Add multiple confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    confettiContainer.appendChild(confetti);
  }
  
  // Card celebration animation
  cardElement.classList.add('celebrate');
  
  // Remove effects after animation completes
  setTimeout(() => {
    cardElement.classList.remove('celebrate');
    confettiContainer.remove();
  }, 3000);
}

// Show AI thinking animation
function showThinking() {
  if (isThinking) return;
  isThinking = true;
  
  const thinkingElement = document.createElement('div');
  thinkingElement.className = 'message-wrapper';
  thinkingElement.id = 'thinking-wrapper';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'AI';
  
  const messageElement = document.createElement('div');
  messageElement.className = 'ai-message thinking';
  messageElement.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  
  thinkingElement.appendChild(avatar);
  thinkingElement.appendChild(messageElement);
  conversationElement.appendChild(thinkingElement);
  conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Hide AI thinking animation
function hideThinking() {
  isThinking = false;
  const thinkingElement = document.getElementById('thinking-wrapper');
  if (thinkingElement) {
    thinkingElement.remove();
  }
}

// Event listeners
submitHintButton.addEventListener('click', handleHintSubmission);
hintInputElement.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    handleHintSubmission();
  }
});

newWordButton.addEventListener('click', function() {
  currentRound++;
  currentWordIndex = getRandomWordIndex();
  updateWordCard();
  resetConversation();
  resetFeedback();
  AILogic.resetMemory();
});

skipWordButton.addEventListener('click', function() {
  // Skip without increasing score
  currentRound++;
  currentWordIndex = getRandomWordIndex();
  updateWordCard();
  resetConversation();
  resetFeedback();
  AILogic.resetMemory();
});

// Initialize game
initGame();
