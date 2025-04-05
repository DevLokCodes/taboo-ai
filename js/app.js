// Game state
let currentWordIndex = 0;
let currentRound = 1;
let score = 0;
let attempts = 0;
let maxAttempts = 5;
const usedWordIndices = new Set();
let isThinking = false;
let timerInterval = null;
let timeRemaining = 60; // 60 seconds per round
let tabooWords = [];
let unlockingTabooWords = []; // Track which taboo words will unlock

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
const timerCountElement = document.getElementById('timer-count');
const timerBarElement = document.getElementById('timer-bar');
const tabooWarningElement = document.getElementById('taboo-warning');

// Initialize game
function initGame() {
  currentWordIndex = getRandomWordIndex();
  updateWordCard();
  updateScore();
  resetConversation();
  resetFeedback();
  AILogic.resetMemory();
  startTimer();
  setupTabooWordDetection();
  
  // Make card stick to top on mobile
  makeCardSticky();
}

// Make card stick to top for mobile devices
function makeCardSticky() {
  // Add sticky class to the card container
  cardElement.classList.add('sticky-card');
  
  // Adjust the conversation container to not be hidden
  const cardHeight = cardElement.offsetHeight;
  conversationElement.style.marginTop = `${cardHeight + 20}px`;
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
  tabooWords = wordData.taboo.map(word => word.toLowerCase());
  
  // Clear and update taboo words
  tabooWordsElement.innerHTML = '';
  wordData.taboo.forEach(word => {
    const tabooWordElement = document.createElement('div');
    tabooWordElement.className = 'taboo-word forbidden';
    tabooWordElement.textContent = word;
    tabooWordsElement.appendChild(tabooWordElement);
  });
  
  // Reset attempts and taboo word unlocking
  attempts = 0;
  unlockingTabooWords = [];
  selectTabooWordsToUnlock();
}

// Select which taboo words will gradually unlock as timer progresses
function selectTabooWordsToUnlock() {
  // Get all taboo word elements
  const tabooWordElements = tabooWordsElement.querySelectorAll('.taboo-word');
  
  // Determine how many words to unlock (40-60% of words)
  const numWords = tabooWordElements.length;
  const numToUnlock = Math.floor(numWords * (0.4 + Math.random() * 0.2));
  
  // Randomly select which words to unlock
  const indices = Array.from({ length: numWords }, (_, i) => i);
  shuffleArray(indices);
  
  // Store the indices of words to unlock
  unlockingTabooWords = indices.slice(0, numToUnlock);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

// Get a random response from an array
function getRandomResponse(responses) {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
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
  avatar.className = 'message-avatar player';
  avatar.textContent = 'You';
  
  messageWrapper.appendChild(messageElement);
  messageWrapper.appendChild(avatar);
  conversationElement.appendChild(messageWrapper);
  conversationElement.scrollTop = conversationElement.scrollHeight;
}

// Setup detection of taboo words in input
function setupTabooWordDetection() {
  hintInputElement.addEventListener('input', function() {
    const inputText = this.value.toLowerCase();
    let containsTabooWord = false;
    let tabooWordFound = '';
    
    // Check if input contains any taboo word
    for (const tabooWord of tabooWords) {
      if (inputText.includes(tabooWord.toLowerCase())) {
        containsTabooWord = true;
        tabooWordFound = tabooWord;
        break;
      }
    }
    
    // Handle UI feedback if taboo word is detected
    if (containsTabooWord) {
      this.classList.add('has-taboo-word');
      tabooWarningElement.textContent = `Warning! "${tabooWordFound}" is a taboo word.`;
      tabooWarningElement.classList.add('visible');
    } else {
      this.classList.remove('has-taboo-word');
      tabooWarningElement.classList.remove('visible');
    }
  });
}

// Start timer for the round
function startTimer() {
  // Reset timer
  timeRemaining = 60;
  timerCountElement.textContent = timeRemaining;
  timerBarElement.style.width = '100%';
  
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerCountElement.textContent = timeRemaining;
    
    // Update timer bar
    const percentRemaining = (timeRemaining / 60) * 100;
    timerBarElement.style.width = `${percentRemaining}%`;
    
    // Add critical class when time is running low
    if (timeRemaining <= 10) {
      document.querySelector('.timer-progress').classList.add('timer-critical');
    } else {
      document.querySelector('.timer-progress').classList.remove('timer-critical');
    }
    
    // Gradually unlock taboo words as time decreases
    updateTabooWordsUnlocking();
    
    // Time's up
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timeExpired();
    }
  }, 1000);
}

// Update which taboo words are allowed as time passes
function updateTabooWordsUnlocking() {
  if (unlockingTabooWords.length === 0) return;
  
  // Calculate how many words should be unlocked at this time
  const timePercentage = 1 - (timeRemaining / 60);
  const wordsToUnlock = Math.floor(unlockingTabooWords.length * timePercentage);
  
  // Get all taboo word elements
  const tabooWordElements = tabooWordsElement.querySelectorAll('.taboo-word');
  
  // Loop through taboo words to update their status
  for (let i = 0; i < unlockingTabooWords.length; i++) {
    if (i < wordsToUnlock) {
      // Unlock this word
      const wordIndex = unlockingTabooWords[i];
      const wordElement = tabooWordElements[wordIndex];
      
      // Only change if it's not already allowed
      if (wordElement.classList.contains('forbidden')) {
        wordElement.classList.remove('forbidden');
        wordElement.classList.add('allowed');
        
        // Also remove from the taboo words array
        const word = wordElement.textContent.toLowerCase();
        const index = tabooWords.indexOf(word);
        if (index !== -1) {
          tabooWords.splice(index, 1);
        }
      }
    }
  }
}

// Handle when time expires
function timeExpired() {
  feedbackElement.textContent = "Time's up! The AI couldn't guess the word.";
  feedbackElement.className = 'feedback incorrect';
  
  // End current round and move to next word
  setTimeout(() => {
    currentRound++;
    initGame();
  }, 2000);
}

// Handle AI guessing logic
function handleAIGuess(hint) {
  // Add the hint to AI's memory
  AILogic.rememberHint(hint);
  
  // Start "thinking" animation
  isThinking = true;
  showThinkingMessage();
  
  // Simulate AI thinking time (1-3 seconds)
  const thinkingTime = 1000 + Math.random() * 2000;
  
  setTimeout(() => {
    isThinking = false;
    
    // Determine if AI should guess correctly
    const currentWord = gameData.words[currentWordIndex].target;
    const shouldGuessCorrectly = AILogic.shouldGuessCorrectly(currentWord, attempts);
    
    if (shouldGuessCorrectly) {
      // AI guesses correctly
      const successMessage = getRandomResponse(gameData.aiResponses.guessed)
        .replace('{word}', currentWord);
      addAIMessage(successMessage);
      
      // Update feedback
      feedbackElement.textContent = "Correct! The AI guessed the word!";
      feedbackElement.className = 'feedback correct';
      
      // Update score and move to next round
      score += (timeRemaining > 30) ? 2 : 1; // Bonus point for quick rounds
      updateScore();
      
      // Start next round after a delay
      setTimeout(() => {
        currentRound++;
        initGame();
      }, 2000);
    } else {
      // AI makes an incorrect guess
      attempts++;
      
      if (attempts >= maxAttempts) {
        // AI gives up after max attempts
        const giveUpMessage = getRandomResponse(gameData.aiResponses.giveUp);
        addAIMessage(giveUpMessage);
        
        // Update feedback
        feedbackElement.textContent = "The AI couldn't guess the word.";
        feedbackElement.className = 'feedback incorrect';
        
        // Move to next round after a delay
        setTimeout(() => {
          currentRound++;
          initGame();
        }, 2000);
      } else {
        // AI makes a wrong guess
        const guess = AILogic.getIntelligentGuess(currentWord);
        const wrongGuessMessage = getRandomResponse(gameData.aiResponses.incorrect)
          .replace('{guess}', guess);
        addAIMessage(wrongGuessMessage);
      }
    }
  }, thinkingTime);
}

// Show thinking animation
function showThinkingMessage() {
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'AI';
  
  const messageElement = document.createElement('div');
  messageElement.className = 'ai-message thinking';
  messageElement.textContent = getRandomResponse(gameData.aiResponses.thinking);
  
  // Add thinking dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    messageElement.appendChild(dot);
  }
  
  messageWrapper.appendChild(avatar);
  messageWrapper.appendChild(messageElement);
  conversationElement.appendChild(messageWrapper);
  conversationElement.scrollTop = conversationElement.scrollHeight;
  
  // Remove thinking message after AI responds
  setTimeout(() => {
    try {
      conversationElement.removeChild(messageWrapper);
    } catch (e) {
      // Message might have been removed already
    }
  }, 1000 + Math.random() * 2000);
}

// Check if hint contains taboo words
function containsTabooWord(hint) {
  const hintLower = hint.toLowerCase();
  
  for (const tabooWord of tabooWords) {
    if (hintLower.includes(tabooWord.toLowerCase())) {
      return tabooWord;
    }
  }
  
  return null;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the game when page loads
  initGame();
  
  // Submit hint button
  submitHintButton.addEventListener('click', function() {
    submitHint();
  });
  
  // Submit on Enter key
  hintInputElement.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      submitHint();
    }
  });
  
  // New word button
  newWordButton.addEventListener('click', function() {
    clearInterval(timerInterval);
    currentWordIndex = getRandomWordIndex();
    updateWordCard();
    resetConversation();
    resetFeedback();
    AILogic.resetMemory();
    startTimer();
  });
  
  // Skip word button
  skipWordButton.addEventListener('click', function() {
    clearInterval(timerInterval);
    feedbackElement.textContent = "Word skipped!";
    feedbackElement.className = 'feedback';
    currentWordIndex = getRandomWordIndex();
    updateWordCard();
    resetConversation();
    resetFeedback();
    AILogic.resetMemory();
    startTimer();
  });
});

// Submit hint function
function submitHint() {
  const hint = hintInputElement.value.trim();
  
  // Empty hint check
  if (hint === '') {
    return;
  }
  
  // Check for taboo words
  const tabooWord = containsTabooWord(hint);
  
  if (tabooWord) {
    // Player used a taboo word
    const tabooMessage = getRandomResponse(gameData.aiResponses.tabooUsed)
      .replace('{taboo}', tabooWord);
    
    addPlayerMessage(hint);
    addAIMessage(tabooMessage);
    
    feedbackElement.textContent = `Oops! "${tabooWord}" is a taboo word.`;
    feedbackElement.className = 'feedback incorrect';
  } else {
    // Valid hint
    addPlayerMessage(hint);
    
    // Clear input field
    hintInputElement.value = '';
    
    // Only handle AI guess if not already thinking
    if (!isThinking) {
      handleAIGuess(hint);
    }
  }
}