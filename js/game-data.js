// Game data with improved word associations and better AI logic
const gameData = {
words: [
    {
    target: "COFFEE",
    taboo: ["Drink", "Cup", "Bean", "Caffeine", "Morning", "Brew", "Hot"]
    },
    {
    target: "PIANO",
    taboo: ["Keys", "Music", "Instrument", "Play", "Notes", "Keyboard", "Classical"]
    },
    {
    target: "BOOK",
    taboo: ["Read", "Pages", "Author", "Library", "Novel", "Story", "Cover"]
    },
    {
    target: "OCEAN",
    taboo: ["Water", "Sea", "Wave", "Fish", "Beach", "Blue", "Deep"]
    },
    {
    target: "PIZZA",
    taboo: ["Food", "Cheese", "Slice", "Topping", "Italy", "Round", "Crust"]
    },
    {
    target: "INTERNET",
    taboo: ["Web", "Online", "Computer", "Browser", "Website", "Connect", "Network"]
    },
    {
    target: "SOCCER",
    taboo: ["Sport", "Ball", "Goal", "Team", "Field", "Football", "Players"]
    },
    {
    target: "CAMERA",
    taboo: ["Photo", "Picture", "Lens", "Flash", "Image", "Capture", "Shoot"]
    },
    {
    target: "BUTTERFLY",
    taboo: ["Wings", "Insect", "Fly", "Caterpillar", "Cocoon", "Beautiful", "Flutter"]
    },
    {
    target: "CHOCOLATE",
    taboo: ["Sweet", "Candy", "Cocoa", "Dessert", "Brown", "Bar", "Milk"]
    },
    {
    target: "DOCTOR",
    taboo: ["Hospital", "Patient", "Medicine", "Health", "Nurse", "Sick", "Treat"]
    },
    {
    target: "DIAMOND",
    taboo: ["Ring", "Jewel", "Gem", "Carat", "Engagement", "Crystal", "Sparkle"]
    },
    {
    target: "APPLE",
    taboo: ["Fruit", "Red", "Core", "Orchard", "Pie", "Seeds", "Tree"]
    },
    {
    target: "TELEPHONE",
    taboo: ["Call", "Talk", "Number", "Mobile", "Ring", "Hello", "Voice"]
    },
    {
    target: "BASKETBALL",
    taboo: ["Sport", "Court", "Hoop", "Ball", "Dribble", "NBA", "Tall"]
    },
    {
    target: "BICYCLE",
    taboo: ["Wheel", "Pedal", "Ride", "Bike", "Chain", "Helmet", "Cycle"]
    },
    {
    target: "ELEPHANT",
    taboo: ["Animal", "Trunk", "Gray", "Tusk", "Big", "Africa", "Zoo"]
    },
    {
    target: "GUITAR",
    taboo: ["Music", "String", "Play", "Band", "Electric", "Acoustic", "Strum"]
    },
    {
    target: "UMBRELLA",
    taboo: ["Rain", "Open", "Cover", "Wet", "Handle", "Shield", "Storm"]
    },
    {
    target: "VOLCANO",
    taboo: ["Erupt", "Lava", "Mountain", "Ash", "Magma", "Fire", "Hawaii"]
    }
],
aiResponses: {
    greeting: [
    "I'm ready to guess! Give me your best hint.",
    "Let's play! I'll try to guess the word from your hints.",
    "New round! Give me a hint without using the taboo words.",
    "I'm eager to play! What hint can you give me?"
    ],
    thinking: [
    "Hmm, analyzing your hint...",
    "Thinking about what you could mean...",
    "Processing your clue...",
    "Let me consider what you're suggesting..."
    ],
    incorrect: [
    "Is it {guess}?",
    "Could it be {guess}?",
    "Based on your hint, I'm thinking {guess}.",
    "I'm guessing {guess}. Am I close?",
    "My best guess is {guess}."
    ],
    giveUp: [
    "I need more specific clues to guess this one.",
    "That's a tricky hint! Can you try a different approach?",
    "I'm not connecting the dots yet. Another hint?",
    "I'm stumped by that hint. Can you give me another clue?"
    ],
    guessed: [
    "Got it! It's {word}!",
    "Aha! The word is {word}!",
    "I've figured it out - {word}!",
    "Yes, it must be {word}!"
    ],
    tabooUsed: [
    "Oops! You used '{taboo}' which is a taboo word!",
    "Watch out! '{taboo}' is one of the taboo words.",
    "I caught you using '{taboo}' - that's on the taboo list!"
    ]
},
// Enhanced word associations for better AI guessing
wordAssociations: {
    "COFFEE": ["java", "espresso", "roast", "arabica", "cafe", "mug", "grind", "filter", "barista", "latte", "mocha", "cappuccino", "aroma", "bitter", "starbucks", "plantation", "black", "stimulant", "grounds", "percolator"],
    "PIANO": ["grand", "melody", "concert", "sonata", "ivory", "bench", "pedal", "chord", "composer", "steinway", "recital", "symphony", "orchestra", "beethoven", "mozart", "jazz", "tune", "concert", "musician", "keys"],
    "BOOK": ["chapter", "literature", "fiction", "binding", "publication", "paperback", "text", "shelf", "print", "spine", "hardcover", "bookmark", "bestseller", "encyclopedia", "dictionary", "bibliography", "illustration", "prologue", "epilogue", "volume"],
    "OCEAN": ["deep", "marine", "salt", "tide", "shore", "pacific", "atlantic", "coral", "dive", "blue", "shark", "whale", "sailor", "vessel", "navigation", "underwater", "coast", "island", "horizon", "current"],
    "PIZZA": ["crust", "pepperoni", "delivery", "oven", "round", "pie", "sauce", "restaurant", "dinner", "takeout", "dominos", "papa johns", "margherita", "italian", "new york", "mozzarella", "thin", "deep dish", "toppings", "slice"],
    "INTERNET": ["wifi", "connection", "digital", "search", "network", "server", "email", "social", "download", "data", "router", "broadband", "fiber", "wifi", "modem", "google", "facebook", "streaming", "browser", "upload"],
    "SOCCER": ["kick", "player", "match", "referee", "FIFA", "goalkeeper", "stadium", "cleats", "tournament", "striker", "world cup", "penalty", "corner", "midfielder", "defender", "coach", "yellow card", "offside", "header", "pass"],
    "CAMERA": ["shutter", "photograph", "film", "digital", "zoom", "focus", "capture", "photography", "shoot", "canon", "nikon", "sony", "polaroid", "tripod", "megapixel", "memory card", "aperture", "exposure", "viewfinder", "resolution"],
    "BUTTERFLY": ["monarch", "beautiful", "garden", "transformation", "flutter", "moth", "colorful", "delicate", "lifecycle", "swallowtail", "chrysalis", "migration", "pollinator", "nectar", "antenna", "pattern", "species", "tropical", "butterfly"],
    "CHOCOLATE": ["cake", "bar", "dark", "milk", "chips", "fondue", "cacao", "truffle", "temper", "melted", "hershey", "godiva", "belgian", "swiss", "decadent", "rich", "confection", "valentine", "ganache", "fudge"],
    "DOCTOR": ["physician", "medical", "stethoscope", "clinic", "diagnosis", "treatment", "appointment", "prescription", "specialist", "surgeon", "pediatrician", "office", "white coat", "practice", "md", "checkup", "exam", "degree", "profession"],
    "DIAMOND": ["sparkle", "clarity", "cut", "precious", "stone", "brilliant", "forever", "karat", "jewelry", "mine", "engagement", "tiffany", "solitaire", "princess cut", "carat", "clarity", "setting", "anniversary", "luxury", "gemologist"],
    "APPLE": ["cider", "tree", "seed", "orchard", "juice", "green", "crisp", "bite", "grower", "variety", "macintosh", "honeycrisp", "gala", "fuji", "pie", "cinnamon", "autumn", "harvest", "fruit basket", "johnny appleseed"],
    "TELEPHONE": ["dial", "receiver", "conversation", "voice", "booth", "landline", "wireless", "telephone", "speaker", "signal", "rotary", "touchtone", "answering machine", "cord", "payphone", "extension", "switchboard", "operator", "busy signal"],
    "BASKETBALL": ["player", "slam dunk", "NBA", "rebound", "jump shot", "backboard", "basket", "points", "coach", "team", "lebron", "jordan", "kobe", "lakers", "celtics", "bulls", "shoot", "foul", "timeout", "free throw"],
    "BICYCLE": ["two-wheeler", "cycling", "gears", "spokes", "racing", "mountain", "tour de france", "handlebar", "brakes", "frame", "tire", "pump", "saddle", "derailleur", "lock", "path", "commute", "recreational", "exercise", "eco-friendly"],
    "ELEPHANT": ["mammal", "ivory", "conservation", "herd", "memory", "safari", "endangered", "india", "thailand", "circus", "dumbo", "babar", "pachyderm", "savanna", "wildlife", "bull", "cow", "calf", "ears", "wilderness"],
    "GUITAR": ["amplifier", "musician", "riff", "solo", "fender", "gibson", "pick", "fret", "chords", "acoustic", "rock", "blues", "jazz", "hendrix", "clapton", "stage", "amp", "whammy bar", "tuning", "headstock"],
    "UMBRELLA": ["protection", "canopy", "downpour", "puddle", "shade", "portable", "fold", "monsoon", "shelter", "parasol", "weather", "drizzle", "lightning", "waterproof", "windproof", "forecast", "clouds", "precipitation", "accessories"],
    "VOLCANO": ["crater", "dormant", "active", "vesuvius", "pompeii", "eruption", "geologist", "tectonic", "island", "smoke", "ash", "disaster", "molten", "pressure", "geothermal", "cone", "vent", "plume", "pyroclastic", "flow"]
}
};