// Enhanced AI logic with more sophisticated guessing capabilities
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
    
    // Analyze semantic meaning and connections between words
    analyzeSemanticConnection: function(target, hints) {
      const targetLower = target.toLowerCase();
      const associations = gameData.wordAssociations[target] || [];
      
      // Track semantic connections between hints and associations
      let semanticScore = 0;
      let directMatches = 0;
      let indirectMatches = 0;
      
      // Check for semantic relationships across all hints
      for (const hint of hints) {
        // Check each word in the hint
        const hintWords = hint.toLowerCase().split(/\s+/);
        
        for (const word of hintWords) {
          // Direct partial matches to target (e.g., "coff" for "coffee")
          if (targetLower.includes(word) || word.includes(targetLower.substring(0, 3))) {
            directMatches += 2;
          }
          
          // Association matches
          for (const association of associations) {
            // Direct association match
            if (word === association.toLowerCase()) {
              directMatches++;
            }
            // Partial association match
            else if (word.length > 3 && 
                    (association.toLowerCase().includes(word) || 
                     word.includes(association.toLowerCase().substring(0, 3)))) {
              indirectMatches++;
            }
          }
        }
        
        // Check for contextual pairs
        const contextualizationScore = this.analyzeContextualPairs(hint, target);
        semanticScore += contextualizationScore;
      }
      
      // Calculate final semantic score
      semanticScore += (directMatches * 2) + indirectMatches;
      
      return {
        score: semanticScore,
        directMatches,
        indirectMatches
      };
    },
    
    // Analyze contextual pairs in a hint
    analyzeContextualPairs: function(hint, target) {
      const contextPairs = {
        // Examples of word pairs that strongly suggest target words
        "COFFEE": [["morning", "routine"], ["hot", "beverage"], ["black", "drink"], ["roasted", "beans"]],
        "PIANO": [["black", "white"], ["grand", "instrument"], ["classical", "music"], ["play", "keys"]],
        "BOOK": [["reading", "pages"], ["author", "wrote"], ["chapter", "end"], ["story", "tell"]],
        "OCEAN": [["deep", "blue"], ["salt", "water"], ["tides", "waves"], ["swim", "depth"]],
        "PIZZA": [["delivery", "order"], ["round", "slice"], ["italian", "food"], ["toppings", "favorite"]],
        "INTERNET": [["connect", "online"], ["web", "search"], ["wireless", "signal"], ["browser", "site"]],
        "SOCCER": [["team", "sport"], ["field", "game"], ["score", "goal"], ["kick", "ball"]],
        "CAMERA": [["take", "picture"], ["flash", "photo"], ["lens", "focus"], ["digital", "memory"]],
        "BUTTERFLY": [["beautiful", "wings"], ["flower", "landing"], ["colorful", "insect"], ["cocoon", "transform"]],
        "CHOCOLATE": [["sweet", "treat"], ["dark", "milk"], ["dessert", "favorite"], ["melted", "fondue"]],
        "DOCTOR": [["medical", "professional"], ["hospital", "visit"], ["health", "check"], ["sick", "examination"]],
        "DIAMOND": [["sparkle", "shine"], ["jewelry", "expensive"], ["ring", "propose"], ["gem", "stone"]],
        "APPLE": [["fruit", "bite"], ["red", "green"], ["grow", "tree"], ["juicy", "sweet"]],
        "TELEPHONE": [["make", "call"], ["answer", "ring"], ["hello", "conversation"], ["number", "dial"]],
        "BASKETBALL": [["tall", "players"], ["shoot", "basket"], ["court", "game"], ["team", "tournament"]],
        "BICYCLE": [["ride", "pedal"], ["two", "wheels"], ["helmet", "safety"], ["exercise", "transportation"]],
        "ELEPHANT": [["large", "animal"], ["memory", "remember"], ["trunk", "tusks"], ["gentle", "giant"]],
        "GUITAR": [["play", "instrument"], ["string", "sound"], ["rock", "band"], ["acoustic", "melody"]],
        "UMBRELLA": [["wet", "protection"], ["open", "close"], ["shelter", "cover"], ["handle", "carry"]],
        "VOLCANO": [["eruption", "lava"], ["mountain", "crater"], ["hot", "dangerous"], ["smoke", "explode"]]
      };
      
      const pairs = contextPairs[target] || [];
      const hintLower = hint.toLowerCase();
      let pairScore = 0;
      
      // Check for contextual word pairs in the hint
      for (const pair of pairs) {
        if (pair.every(word => hintLower.includes(word))) {
          pairScore += 3; // Strong indicator if both words of a pair appear
        } else if (pair.some(word => hintLower.includes(word))) {
          pairScore += 1; // Weaker indicator if only one word appears
        }
      }
      
      return pairScore;
    },
    
    // More sophisticated decision on whether AI should guess correctly
    shouldGuessCorrectly: function(target, attempt) {
      const semanticAnalysis = this.analyzeSemanticConnection(target, this.contextMemory);
      const semanticScore = semanticAnalysis.score;
      
      // Progressive threshold for guessing, becomes more lenient as attempts increase
      let threshold = 7 - (attempt * 1.5);
      
      // Debug: You might want to log this in development
      // console.log(`Attempt ${attempt}: Score ${semanticScore}, Threshold ${threshold}`);
      
      // Clear threshold met - confident guess
      if (semanticScore >= threshold) {
        return true;
      }
      
      // Last attempt, be more generous
      if (attempt >= maxAttempts - 1) {
        return semanticScore >= 1 || Math.random() < 0.9;
      }
      
      // Later attempts, be somewhat generous
      if (attempt >= 2) {
        return semanticScore >= Math.max(threshold - 1, 1) || Math.random() < 0.3 * attempt;
      }
      
      // Early attempts, be more strict
      return semanticScore >= threshold;
    },
    
    // Generate intelligent intermediate incorrect guesses
    getIntelligentGuess: function(target) {
      // Create more contextually relevant guesses based on context memory
      const semanticAnalysis = this.analyzeSemanticConnection(target, this.contextMemory);
      
      // First approach: use the pre-defined contextual guesses
      const contextualGuesses = {
        "COFFEE": ["tea", "espresso", "cappuccino", "latte", "beverage", "breakfast", "energy"],
        "PIANO": ["guitar", "violin", "keyboard", "organ", "instrument", "symphony", "concert"],
        "BOOK": ["novel", "magazine", "newspaper", "literature", "journal", "textbook", "story"],
        "OCEAN": ["sea", "lake", "river", "beach", "water", "pacific", "atlantic"],
        "PIZZA": ["pasta", "sandwich", "burger", "dinner", "italian", "restaurant", "delivery"],
        "INTERNET": ["wifi", "website", "network", "connection", "computer", "digital", "cyber"],
        "SOCCER": ["football", "basketball", "sport", "game", "team", "field", "tournament"],
        "CAMERA": ["photograph", "video", "picture", "snapshot", "selfie", "lens", "film"],
        "BUTTERFLY": ["dragonfly", "insect", "moth", "bee", "wings", "garden", "flower"],
        "CHOCOLATE": ["candy", "dessert", "fudge", "cocoa", "sweet", "dark", "flavor"],
        "DOCTOR": ["nurse", "physician", "surgeon", "medical", "hospital", "clinic", "patient"],
        "DIAMOND": ["ruby", "emerald", "jewel", "gem", "crystal", "ring", "precious"],
        "APPLE": ["orange", "banana", "fruit", "pear", "orchard", "cider", "iphone"],
        "TELEPHONE": ["phone", "cell", "mobile", "communication", "call", "device", "contact"],
        "BASKETBALL": ["football", "tennis", "sport", "court", "hoop", "team", "player"],
        "BICYCLE": ["car", "motorcycle", "vehicle", "transportation", "bike", "ride", "cycle"],
        "ELEPHANT": ["animal", "mammal", "giraffe", "lion", "jungle", "trunk", "large"],
        "GUITAR": ["drum", "piano", "instrument", "music", "band", "string", "acoustic"],
        "UMBRELLA": ["raincoat", "protection", "shade", "shelter", "weather", "rain", "cover"],
        "VOLCANO": ["mountain", "crater", "eruption", "lava", "magma", "island", "geology"]
      };
      
      // Second approach: create smart guesses based on semantic connections detected in hints
      const hintPhrases = this.contextMemory.join(' ').toLowerCase();
      
      // If any hint referenced something specific from our wordAssociations, use related words
      const associations = gameData.wordAssociations[target] || [];
      const relatedGuesses = [];
      
      for (const word of associations) {
        if (hintPhrases.includes(word.toLowerCase())) {
          // Find related alternative
          const alternativeCategories = {
            // Group related concepts
            "coffee": ["tea", "cocoa", "cappuccino", "latte"],
            "java": ["python", "javascript", "programming", "code"],
            "espresso": ["americano", "macchiato", "mocha"],
            "piano": ["keyboard", "organ", "synthesizer", "harpsichord"],
            "melody": ["rhythm", "harmony", "tune", "song"],
            "book": ["magazine", "journal", "article", "publication"],
            "library": ["bookstore", "archive", "collection"],
            "ocean": ["sea", "lake", "bay", "gulf"],
            "beach": ["shore", "coast", "sand", "boardwalk"],
            "mountain": ["hill", "peak", "range", "cliff"]
            // ...more could be added
          };
          
          // Find the category this word belongs to
          for (const [category, alternatives] of Object.entries(alternativeCategories)) {
            if (word.toLowerCase().includes(category) || category.includes(word.toLowerCase())) {
              // Add alternatives to our guesses
              relatedGuesses.push(...alternatives);
            }
          }
        }
      }
      
      // Combine all possible guesses and select one
      const possibleGuesses = [
        ...contextualGuesses[target] || [],
        ...relatedGuesses
      ];
      
      // If no contextual guesses available, return a thematically relevant common word
      if (possibleGuesses.length === 0) {
        const commonWords = ["thing", "place", "person", "idea", "time", "way", "item", "concept", "event"];
        return commonWords[Math.floor(Math.random() * commonWords.length)];
      }
      
      // Return a guess, prioritizing ones that haven't been used before
      const previousGuesses = new Set(this.contextMemory.map(hint => hint.toLowerCase()));
      const unusedGuesses = possibleGuesses.filter(guess => !previousGuesses.has(guess.toLowerCase()));
      
      if (unusedGuesses.length > 0) {
        return unusedGuesses[Math.floor(Math.random() * unusedGuesses.length)];
      }
      
      return possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)];
    }
  };