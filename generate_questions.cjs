const fs = require('fs');

const triviaQuestions = [
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'What color is formed by mixing blue and yellow?',opts:['Green','Purple','Orange','Brown'],ans:0,expl:'Blue + Yellow = Green'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'A poet writes one poem every 2 days. How many in June?',opts:['12','15','30','6'],ans:1,expl:'June has 30 days. 30/2 = 15.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'Who painted the Mona Lisa?',opts:['Van Gogh','Da Vinci','Picasso','Michelangelo'],ans:1,expl:'Leonardo da Vinci painted the Mona Lisa.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Which art movement did Salvador Dalí belong to?',opts:['Impressionism','Surrealism','Cubism','Baroque'],ans:1,expl:'Dalí was a leading Surrealist painter.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'In music, how many beats are in a measure of 3/4 time?',opts:['2','3','4','6'],ans:1,expl:'3/4 time has 3 beats per measure.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'What is the complementary color of blue?',opts:['Green','Red','Orange','Yellow'],ans:2,expl:'On the color wheel, orange is opposite blue.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'Which Nigerian author wrote "Things Fall Apart"?',opts:['Wole Soyinka','Chinua Achebe','Chimamanda Adichie','Ben Okri'],ans:1,expl:'Chinua Achebe published it in 1958.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'If a canvas costs ₦1,200 and paint costs 3× the canvas, total?',opts:['₦3,600','₦4,800','₦4,200','₦6,000'],ans:1,expl:'Paint = ₦3,600. Total = ₦1,200 + ₦3,600 = ₦4,800.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:8,q:'A gallery sells 40% of 250 paintings. How many remain?',opts:['100','150','160','110'],ans:1,expl:'40% of 250 = 100 sold. 250 - 100 = 150 remain.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:8,q:'Which pigment was made from crushed lapis lazuli?',opts:['Vermilion','Ultramarine','Ochre','Sienna'],ans:1,expl:'Ultramarine blue.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'What is a haiku?',opts:['A type of brush','A 3-line Japanese poem','A painting technique','A wine variety'],ans:1,expl:'A haiku is a Japanese poetic form consisting of three phrases.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Which artist cut off his own ear?',opts:['Monet','Picasso','Van Gogh','Rembrandt'],ans:2,expl:'Vincent van Gogh famously cut off part of his left ear.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'If you mix red and white, what color do you get?',opts:['Orange','Pink','Peach','Maroon'],ans:1,expl:'Red + White = Pink.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'How many lines does a sonnet have?',opts:['10','12','14','16'],ans:2,expl:'A traditional sonnet consists of 14 lines.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'What is the primary ingredient in wine?',opts:['Apples','Grapes','Barley','Wheat'],ans:1,expl:'Wine is made from fermented grapes.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Who wrote "Romeo and Juliet"?',opts:['Charles Dickens','Jane Austen','William Shakespeare','Mark Twain'],ans:2,expl:'William Shakespeare wrote Romeo and Juliet.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'What type of painting is applied directly to a wall?',opts:['Fresco','Watercolor','Oil','Pastel'],ans:0,expl:'Fresco is a technique of mural painting upon freshly laid plaster.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Which of these is NOT a primary color?',opts:['Red','Blue','Green','Yellow'],ans:2,expl:'Green is a secondary color (Blue + Yellow).'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'What literary device compares two things using "like" or "as"?',opts:['Metaphor','Simile','Personification','Hyperbole'],ans:1,expl:'A simile uses "like" or "as" for comparison.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'Which wine is typically served chilled?',opts:['Cabernet Sauvignon','Merlot','White Zinfandel','Shiraz'],ans:2,expl:'White and rose wines like White Zinfandel are usually served chilled.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Who painted "The Starry Night"?',opts:['Claude Monet','Vincent van Gogh','Pablo Picasso','Edvard Munch'],ans:1,expl:'Vincent van Gogh painted The Starry Night in 1889.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'What is a stanza in poetry?',opts:['A rhyme scheme','A type of poem','A group of lines','A hidden meaning'],ans:2,expl:'A stanza is a grouped set of lines within a poem.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:12,q:'Which of these is a famous museum in Paris?',opts:['The Prado','The Louvre','The Uffizi','The Met'],ans:1,expl:'The Louvre is the world\'s largest art museum, located in Paris.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:15,q:'What gives red wine its color?',opts:['The grape juice','Food coloring','The grape skins','The barrel'],ans:2,expl:'The color of red wine comes from the grape skins during fermentation.'},
  {type:'Trivia',icon:'<i class="ri-question-fill"></i>',time:10,q:'"Peter Piper picked a peck of pickled peppers" is an example of:',opts:['Alliteration','Metaphor','Onomatopoeia','Simile'],ans:0,expl:'Alliteration is the occurrence of the same letter or sound at the beginning of adjacent or closely connected words.'}
];

const emojiQuestions = [
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the phrase:',pattern:['🎨','🍷','✍️'],opts:['Paint and Sip','Art Class','Sip, Paint & Poetry','Wine Tasting'],ans:2,expl:'Sip (wine), Paint (palette), Poetry (writing).'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the movie:',pattern:['🦁','👑'],opts:['Lion King','King Kong','Jungle Book','Madagascar'],ans:0,expl:'Lion + Crown = Lion King'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the concept:',pattern:['❤️','💔','🩹'],opts:['Hospital','Heartbreak & Healing','Romance','Cardiology'],ans:1,expl:'Heart -> Broken -> Healing'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the saying:',pattern:['🐦','✌️','🌳'],opts:['Two birds one stone','A bird in the hand','Free as a bird','Early bird'],ans:1,expl:'A bird in the hand is worth two in the bush.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the activity:',pattern:['🎭','🎤','👏'],opts:['Karaoke','Poetry Slam','Theatre','Concert'],ans:1,expl:'Performance mask + mic + applause = Poetry Slam.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the place:',pattern:['🇳🇬','🏔️','⛰️'],opts:['Jos Plateau','Mount Cameroon','Abuja','Obudu Ranch'],ans:0,expl:'Nigeria + mountains = Jos Plateau.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:8,q:'Guess the song:',pattern:['🌧️','💜','☔'],opts:['Purple Rain','Umbrella','Singing in the Rain','Riders on the Storm'],ans:0,expl:'Rain + Purple = Purple Rain.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:8,q:'Guess the phrase:',pattern:['🖌️','🗣️','💡','🔥'],opts:['Creative spark','Art speaks louder','Brush with genius','Painting words on fire'],ans:3,expl:'Brush + speech + idea + fire = Painting words on fire.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the phrase:',pattern:['🍎','👨‍⚕️','🚫'],opts:['An apple a day keeps the doctor away','Bad apple','Doctor\'s orders','Healthy eating'],ans:0,expl:'Apple + Doctor + No = An apple a day keeps the doctor away.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the movie:',pattern:['🕷️','👨','🕸️'],opts:['Spider-Man','Ant-Man','Iron Man','Batman'],ans:0,expl:'Spider + Man + Web = Spider-Man.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the phrase:',pattern:['🤐','🤫','🤐'],opts:['Secret','Quiet please','My lips are sealed','No talking'],ans:2,expl:'Zipped lips = My lips are sealed.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the feeling:',pattern:['🦋','🦋','🦋','🤤'],opts:['Butterflies in stomach','Hungry','Happy','Confused'],ans:0,expl:'Butterflies + Stomach/Drool = Butterflies in my stomach.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:15,q:'Guess the phrase:',pattern:['🌧️','🐱','🐶'],opts:['Raining cats and dogs','Pet shop','Thunderstorm','Animal shelter'],ans:0,expl:'Rain + Cat + Dog = Raining cats and dogs.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the book:',pattern:['⚡','👦','👓','🪄'],opts:['Percy Jackson','Harry Potter','The Hobbit','Eragon'],ans:1,expl:'Lightning + Boy + Glasses + Wand = Harry Potter.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the song:',pattern:['👁️','🐯'],opts:['Eye of the Tiger','Tiger King','See the Cat','Jungle Book'],ans:0,expl:'Eye + Tiger = Eye of the Tiger.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the phrase:',pattern:['🔥','👖','🤥'],opts:['Liar liar pants on fire','Hot pants','Burning clothes','Tell the truth'],ans:0,expl:'Fire + Pants + Pinocchio(Liar) = Liar liar pants on fire.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the movie:',pattern:['👽','🚲','🌕'],opts:['Star Wars','E.T.','Alien','Apollo 13'],ans:1,expl:'Alien + Bike + Moon = E.T. the Extra-Terrestrial.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:10,q:'Guess the idiom:',pattern:['Piece','🍰'],opts:['Piece of cake','Have your cake','Bake a cake','Sweet tooth'],ans:0,expl:'Piece + Cake = Piece of cake (easy).'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:15,q:'Guess the phrase:',pattern:['⏰','💰'],opts:['Time is money','Wake up','Time to pay','Alarm clock'],ans:0,expl:'Clock/Time + Money = Time is money.'},
  {type:'Charades',icon:'<i class="ri-emotion-fill"></i>',time:12,q:'Guess the saying:',pattern:['😢','🥛','💦'],opts:['Cry over spilled milk','Drink milk','Sad cow','Thirsty'],ans:0,expl:'Cry + Milk + Splash = Don\'t cry over spilled milk.'}
];

const rhymeQuestions = [
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "ART"?',opts:['Paint','Heart','Canvas','Color'],ans:1,expl:'Art and Heart.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "WINE"?',opts:['Dine','Sip','Glass','Grape'],ans:0,expl:'Wine and Dine.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "SOUL"?',opts:['Spirit','Goal','Mind','Heart'],ans:1,expl:'Soul and Goal.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "VERSE"?',opts:['Poetry','Curse','Line','Word'],ans:1,expl:'Verse and Curse.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "STAGE"?',opts:['Show','Page','Act','Light'],ans:1,expl:'Stage and Page.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "BRUSH"?',opts:['Paint','Crush','Stroke','Draw'],ans:1,expl:'Brush and Crush.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "SPEAK"?',opts:['Talk','Unique','Voice','Tongue'],ans:1,expl:'Speak and Unique.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "NIGHT"?',opts:['Dark','Moonlight','Shadow','Evening'],ans:1,expl:'Night and Moonlight.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:5,q:'What rhymes with "EMOTION"?',opts:['Feeling','Devotion','Passion','Sentiment'],ans:1,expl:'Emotion and Devotion.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "DREAM"?',opts:['Sleep','Beam','Idea','Thought'],ans:1,expl:'Dream and Beam.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "SONG"?',opts:['Sing','Along','Music','Note'],ans:1,expl:'Song and Along.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "FIRE"?',opts:['Burn','Desire','Hot','Flame'],ans:1,expl:'Fire and Desire.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "MIND"?',opts:['Brain','Find','Thought','Think'],ans:1,expl:'Mind and Find.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "TEAR"?',opts:['Cry','Fear','Sad','Drop'],ans:1,expl:'Tear and Fear.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "GLOW"?',opts:['Shine','Flow','Light','Bright'],ans:1,expl:'Glow and Flow.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:10,q:'What rhymes with "STORY"?',opts:['Tale','Glory','Book','Read'],ans:1,expl:'Story and Glory.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "SMILE"?',opts:['Happy','Style','Grin','Laugh'],ans:1,expl:'Smile and Style.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "RHYME"?',opts:['Poem','Time','Verse','Word'],ans:1,expl:'Rhyme and Time.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:6,q:'What rhymes with "WORD"?',opts:['Speak','Heard','Say','Letter'],ans:1,expl:'Word and Heard.'},
  {type:'Rhyme',icon:'<i class="ri-mic-line"></i>',time:8,q:'What rhymes with "PEN"?',opts:['Write','Ten','Ink','Paper'],ans:1,expl:'Pen and Ten.'}
];

const fastestQuestions = [
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: TIYPORE',opts:['POETRY','PAINTER','TROPHY','RIOTER'],ans:0,expl:'TIYPORE -> POETRY'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: SNCAVA',opts:['VACANS','CANVAS','SAVANC','VANCAS'],ans:1,expl:'SNCAVA -> CANVAS'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: RCOLU',opts:['COLOR','LOUCR','ROCUL','CLURO'],ans:0,expl:'RCOLU -> COLOR'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: HSUBR',opts:['SHRUB','BRUSH','CRUSH','BURST'],ans:1,expl:'HSUBR -> BRUSH'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: TSIRAT',opts:['ARTIST','TRAITS','STAIRS','STARTS'],ans:0,expl:'TSIRAT -> ARTIST'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: YMEODL',opts:['MODELY','YODLEM','MELODY','MOLEDY'],ans:2,expl:'YMEODL -> MELODY'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: LAYRLEG',opts:['GALLERY','LARGELY','ALLERGY','LEGALLY'],ans:0,expl:'LAYRLEG -> GALLERY'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:5,q:'Unscramble: HAPMTERO',opts:['METAPHOR','MARATHON','CHAPTERS','MORPHATE'],ans:0,expl:'HAPMTERO -> METAPHOR'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:5,q:'Unscramble: CIMORHNA',opts:['ROMANTIC','HARMONIC','CHROMANI','CHAIRMAN'],ans:1,expl:'CIMORHNA -> HARMONIC'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: GINPNTIA',opts:['PANTING','PAINTING','PIGNTAIL','PINTINGA'],ans:1,expl:'GINPNTIA -> PAINTING'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: TANRUE',opts:['NATURE','NEURAL','TUNERA','URNATE'],ans:0,expl:'TANRUE -> NATURE'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: YBUTEA',opts:['BUTEYA','BEAUTY','TUBEYA','ABUTEY'],ans:1,expl:'YBUTEA -> BEAUTY'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: MHYRHT',opts:['RHYTHM','MYRHTH','THMRHY','YHMTHR'],ans:0,expl:'MHYRHT -> RHYTHM'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: NOSESA',opts:['REASON','SEASON','SONEAS','NOSAES'],ans:1,expl:'NOSESA -> SEASON'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: LUOS',opts:['SOLU','OULS','SOUL','LOUS'],ans:2,expl:'LUOS -> SOUL'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: ZNAATS',opts:['STANZA','ZANAST','NATZAS','TAZANS'],ans:0,expl:'ZNAATS -> STANZA'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:7,q:'Unscramble: ENIOS',opts:['NOISE','SONIE','ENSOI','INESO'],ans:0,expl:'ENIOS -> NOISE'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:6,q:'Unscramble: COUFS',opts:['FOUCS','FOCUS','SUCOF','CUFOS'],ans:1,expl:'COUFS -> FOCUS'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:5,q:'Unscramble: CILPNE',opts:['PENCIL','CLIPEN','NELPIC','PICNEL'],ans:0,expl:'CILPNE -> PENCIL'},
  {type:'Unscramble',icon:'<i class="ri-speed-fill"></i>',time:8,q:'Unscramble: EIVCDO',opts:['VOICED','DIVOCE','COVIED','VODICE'],ans:0,expl:'EIVCDO -> VOICED'}
];

const newGameModesString = `const GAME_MODES = {
  trivia: {
    title: 'Paint by Trivia',
    desc: 'Answer correctly to reveal the hidden masterpiece!',
    icon: '<i class="ri-palette-fill"></i>',
    questions: ${JSON.stringify(triviaQuestions, null, 6).replace(/\"([a-zA-Z]+)\":/g, '$1:')}
  },
  emoji: {
    title: 'Emoji Charades',
    desc: 'Can you guess the phrase from the emojis?',
    icon: '<i class="ri-emotion-laugh-fill"></i>',
    questions: ${JSON.stringify(emojiQuestions, null, 6).replace(/\"([a-zA-Z]+)\":/g, '$1:')}
  },
  rhyme: {
    title: 'Rhyme Time',
    desc: 'Quickly find the perfect rhyme!',
    icon: '<i class="ri-mic-fill"></i>',
    questions: ${JSON.stringify(rhymeQuestions, null, 6).replace(/\"([a-zA-Z]+)\":/g, '$1:')}
  },
  fastest: {
    title: 'Fastest Finger',
    desc: 'Unscramble words under extreme time pressure!',
    icon: '<i class="ri-flashlight-fill"></i>',
    questions: ${JSON.stringify(fastestQuestions, null, 6).replace(/\"([a-zA-Z]+)\":/g, '$1:')}
  }
};`;

let html = fs.readFileSync('game.html', 'utf8');

// 1. Replace GAME_MODES
const startModes = html.indexOf('const GAME_MODES = {');
const endModes = html.indexOf('const POEM_WORDS =');
html = html.substring(0, startModes) + newGameModesString + '\n\n' + html.substring(endModes);

fs.writeFileSync('game.html', html);
console.log('done');
