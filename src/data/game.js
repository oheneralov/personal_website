// The obstacles the boy meets on his way home, in order. Every obstacle is solved by picking a
// sensible Polish reaction; `correct` marks the options that get him past it. An obstacle is
// pictured either by an emoji `icon` or, otherwise, by a drawn `figure` (see GameScene).
const ENCOUNTERS = [
  {
    id: 'angry-man',
    figure: 'angry-man',
    pl: 'Zły pan',
    en: 'An angry man',
    situation: 'An angry man blocks the road. He shouts that you trampled his flowers.',
    says: 'Hej! Podeptałeś moje kwiaty!',
    options: [
      {
        pl: 'Bardzo pana przepraszam!',
        en: 'I am very sorry, sir!',
        correct: true,
      },
      { pl: 'To nie mój problem.', en: 'That is not my problem.' },
      { pl: 'Jest pan brzydki.', en: 'You are ugly, sir.' },
      { pl: 'Dobranoc!', en: 'Good night!' },
    ],
    success: 'He calms down, smiles and lets you pass.',
  },
  {
    id: 'hungry-dog',
    icon: '🐕',
    pl: 'Głodny pies',
    en: 'A hungry dog',
    situation: 'A big dog growls at you. It is very hungry.',
    says: 'Hau, hau! Grrr…',
    options: [
      {
        pl: 'Daję psu kiełbasę.',
        en: 'I give the dog a sausage.',
        correct: true,
      },
      {
        pl: 'Daję psu książkę.',
        en: 'I give the dog a book.',
      },
      {
        pl: 'Ciągnę psa za ogon.',
        en: "I pull the dog's tail.",
      },
      { pl: 'Śpiewam psu piosenkę.', en: 'I sing the dog a song.' },
    ],
    success: 'The dog eats, wags its tail and lets you pass.',
  },
  {
    id: 'fire',
    icon: '🔥',
    pl: 'Ogień',
    en: 'Fire',
    situation: 'Fire is burning across the path. You are carrying a bucket.',
    says: null,
    options: [
      {
        pl: 'Gaszę ogień wodą.',
        en: 'I put out the fire with water.',
        correct: true,
      },
      {
        pl: 'Dokładam drewna do ognia.',
        en: 'I add wood to the fire.',
      },
      { pl: 'Dmucham na ogień.', en: 'I blow on the fire.' },
      { pl: 'Wchodzę w ogień.', en: 'I walk into the fire.' },
    ],
    success: 'The fire goes out and the path is clear.',
  },
  {
    id: 'angry-men',
    figure: 'angry-men',
    pl: 'Źli mężczyźni',
    en: 'Angry men',
    situation: 'Three angry men stand in your way. They have not eaten all day.',
    says: 'Jesteśmy głodni i źli!',
    options: [
      {
        pl: 'Proszę, mam dla was chleb i ser.',
        en: 'Here you are, I have bread and cheese for you.',
        correct: true,
      },
      { pl: 'Nie mam czasu.', en: 'I have no time.' },
      { pl: 'Idźcie do domu!', en: 'Go home!' },
      { pl: 'Jesteście śmieszni.', en: 'You are ridiculous.' },
    ],
    success: 'The men eat, thank you and step aside.',
  },
  {
    id: 'river',
    figure: 'river',
    pl: 'Rzeka',
    en: 'A river',
    situation:
      'A wide river crosses the path and there is no bridge. A small boat waits on the bank.',
    says: null,
    options: [
      {
        pl: 'Płynę łódką na drugi brzeg.',
        en: 'I take the boat to the other bank.',
        correct: true,
      },
      { pl: 'Piję całą rzekę.', en: 'I drink the whole river.' },
      {
        pl: 'Czekam, aż rzeka wyschnie.',
        en: 'I wait until the river dries up.',
      },
      {
        pl: 'Wrzucam plecak do wody.',
        en: 'I throw my backpack into the water.',
      },
    ],
    success: 'You row across and land safely.',
  },
  {
    id: 'guard',
    figure: 'guard',
    pl: 'Strażnik',
    en: 'A guard',
    situation: 'A guard stands at the town gate. He does not open it for rude people.',
    says: 'Stój! Kto idzie?',
    options: [
      {
        pl: 'Dzień dobry! Czy mogę przejść?',
        en: 'Good morning! May I pass?',
        correct: true,
      },
      {
        pl: 'To nie pana sprawa!',
        en: 'That is none of your business, sir!',
      },
      { pl: 'Daj mi pieniądze!', en: 'Give me money!' },
      { pl: 'Nie lubię pana.', en: 'I do not like you, sir.' },
    ],
    success: 'The guard salutes and opens the gate.',
  },
  {
    id: 'bear',
    figure: 'bear',
    pl: 'Niedźwiedź',
    en: 'A bear',
    situation: 'A bear sits in the middle of the path. It is looking for something sweet.',
    says: null,
    options: [
      {
        pl: 'Daję niedźwiedziowi miód.',
        en: 'I give the bear honey.',
        correct: true,
      },
      {
        pl: 'Daję niedźwiedziowi sól.',
        en: 'I give the bear salt.',
      },
      { pl: 'Krzyczę na niedźwiedzia.', en: 'I shout at the bear.' },
      {
        pl: 'Rzucam w niedźwiedzia kamieniem.',
        en: 'I throw a stone at the bear.',
      },
    ],
    success: 'The bear licks the honey and wanders off into the forest.',
  },
  {
    id: 'dragon',
    figure: 'dragon',
    pl: 'Smok',
    en: 'A dragon',
    situation:
      'A dragon lies in front of your house. After breathing fire all day it is terribly thirsty.',
    says: 'Chce mi się pić!',
    options: [
      {
        pl: 'Daję smokowi wodę.',
        en: 'I give the dragon water.',
        correct: true,
      },
      {
        pl: 'Daję smokowi zapałki.',
        en: 'I give the dragon matches.',
      },
      {
        pl: 'Ciągnę smoka za ogon.',
        en: "I pull the dragon's tail.",
      },
      {
        pl: 'Uciekam z krzykiem.',
        en: 'I run away screaming.',
      },
    ],
    success: 'The dragon drinks, sighs happily and flies away. The way home is free!',
  },
];

export default ENCOUNTERS;
