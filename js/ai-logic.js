// Enhanced AI logic
const AILogic = {
// Context memory of previous hints in the current round
contextMemory: [],

// Reset context memory
resetMemory: function() {
    this.contextMemory = [];
},

// Add hint to memory
rememberHint: function(hint) {
    this.contextMemory.push(hint.toLowerCase());
},

// Analyze all hints to determine if AI should guess correctly
shouldGuessCorrectly: function(target, attempt) {
    const targetLower = target.toLowerCase();
    const associations = gameData.wordAssociations[target] || [];
    
    // Direct hint (almost cheating)
    for (const hint of this.contextMemory) {
    if (hint.includes(targetLower)) {
        return true;
    }
    }
    
    // Check for strong associations across all hints
    let associationMatches = 0;
    for (const hint of this.contextMemory) {
    for (const association of associations) {
        if (hint.includes(association.toLowerCase())) {
        associationMatches++;
        }
    }
    }
    
    // Progressive guessing logic
    if (associationMatches >= 2) return true;
    if (attempt >= maxAttempts - 1) return true; // Last attempt, be generous
    if (attempt >= 3 && Math.random() < 0.5) return true; // Higher chance later
    if (Math.random() < 0.15 * attempt) return true; // Increasing random chance
    
    return false;
},

// Get a smarter alternative guess based on context
getIntelligentGuess: function(target) {
    // Create a list of contextually related words but not the target
    const contextualGuesses = {
    "COFFEE": ["tea", "espresso", "cappuccino", "latte", "drink", "beverage"],
    "PIANO": ["guitar", "violin", "keyboard", "organ", "instrument", "symphony"],
    "BOOK": ["novel", "magazine", "newspaper", "publication", "literature", "journal"],
    "OCEAN": ["sea", "lake", "river", "beach", "coast", "pacific"],
    "PIZZA": ["pasta", "sandwich", "burger", "food", "meal", "dinner"],
    "INTERNET": ["wifi", "website", "network", "connection", "email", "computer"],
    "SOCCER": ["football", "basketball", "baseball", "sport", "game", "athletics"],
    "CAMERA": ["photograph", "video", "picture", "snapshot", "selfie", "film"],
    "BUTTERFLY": ["dragonfly", "insect", "moth", "bee", "bird", "flower"],
    "CHOCOLATE": ["candy", "dessert", "fudge", "cocoa", "sweet", "treat"],
    "DOCTOR": ["nurse", "physician", "surgeon", "medical", "healthcare", "hospital"],
    "DIAMOND": ["ruby", "emerald", "jewel", "gem", "crystal", "necklace"],
    "APPLE": ["orange", "banana", "fruit", "pear", "snack", "phone"],
    "TELEPHONE": ["phone", "cell", "communication", "mobile", "device", "caller"],
    "BASKETBALL": ["football", "tennis", "sport", "game", "team", "athlete"],
    "BICYCLE": ["car", "motorcycle", "vehicle", "transportation", "scooter", "transit"],
    "ELEPHANT": ["animal", "mammal", "giraffe", "lion", "tiger", "wildlife"],
    "GUITAR": ["drum", "piano", "instrument", "music", "band", "musician"],
    "UMBRELLA": ["raincoat", "protection", "shade", "weather", "rain", "storm"],
    "VOLCANO": ["mountain", "crater", "eruption", "nature", "disaster", "geology"]
    };
    
    const possibleGuesses = contextualGuesses[target] || [];
    
    // If no contextual guesses available, return a random common word
    if (possibleGuesses.length === 0) {
    const commonWords = ["chair", "table", "car", "house", "computer", "tree", "flower", "sky", "water", "time"];
    return commonWords[Math.floor(Math.random() * commonWords.length)];
    }
    
    return possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
}
};