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
    situationTl:
      'Hinarangan ng isang galit na lalaki ang daan. Sumisigaw siya na tinapakan mo ang kanyang mga bulaklak.',
    says: 'Hej! Podeptałeś moje kwiaty!',
    options: [
      {
        pl: 'Bardzo pana przepraszam!',
        en: 'I am very sorry, sir!',
        tl: 'Paumanhin po talaga!',
        correct: true,
      },
      { pl: 'To nie mój problem.', en: 'That is not my problem.', tl: 'Hindi ko problema iyan.' },
      { pl: 'Jest pan brzydki.', en: 'You are ugly, sir.', tl: 'Pangit po kayo.' },
      { pl: 'Dobranoc!', en: 'Good night!', tl: 'Magandang gabi!' },
    ],
    success: 'He calms down, smiles and lets you pass.',
    successTl: 'Kumalma siya, ngumiti at pinadaan ka.',
  },
  {
    id: 'hungry-dog',
    icon: '🐕',
    pl: 'Głodny pies',
    en: 'A hungry dog',
    situation: 'A big dog growls at you. It is very hungry.',
    situationTl: 'Umuungol sa iyo ang isang malaking aso. Gutom na gutom ito.',
    says: 'Hau, hau! Grrr…',
    options: [
      {
        pl: 'Daję psu kiełbasę.',
        en: 'I give the dog a sausage.',
        tl: 'Binibigyan ko ang aso ng longganisa.',
        correct: true,
      },
      {
        pl: 'Daję psu książkę.',
        en: 'I give the dog a book.',
        tl: 'Binibigyan ko ang aso ng libro.',
      },
      {
        pl: 'Ciągnę psa za ogon.',
        en: "I pull the dog's tail.",
        tl: 'Hinihila ko ang buntot ng aso.',
      },
      { pl: 'Śpiewam psu piosenkę.', en: 'I sing the dog a song.', tl: 'Kinakantahan ko ang aso.' },
    ],
    success: 'The dog eats, wags its tail and lets you pass.',
    successTl: 'Kumain ang aso, ikinawag ang buntot at pinadaan ka.',
  },
  {
    id: 'fire',
    icon: '🔥',
    pl: 'Ogień',
    en: 'Fire',
    situation: 'Fire is burning across the path. You are carrying a bucket.',
    situationTl: 'May apoy na nakaharang sa daan. May dala kang timba.',
    says: null,
    options: [
      {
        pl: 'Gaszę ogień wodą.',
        en: 'I put out the fire with water.',
        tl: 'Pinapatay ko ang apoy gamit ang tubig.',
        correct: true,
      },
      {
        pl: 'Dokładam drewna do ognia.',
        en: 'I add wood to the fire.',
        tl: 'Dinadagdagan ko ng kahoy ang apoy.',
      },
      { pl: 'Dmucham na ogień.', en: 'I blow on the fire.', tl: 'Hinihipan ko ang apoy.' },
      { pl: 'Wchodzę w ogień.', en: 'I walk into the fire.', tl: 'Pumapasok ako sa apoy.' },
    ],
    success: 'The fire goes out and the path is clear.',
    successTl: 'Namatay ang apoy at wala nang harang sa daan.',
  },
  {
    id: 'angry-men',
    figure: 'angry-men',
    pl: 'Źli mężczyźni',
    en: 'Angry men',
    situation: 'Three angry men stand in your way. They have not eaten all day.',
    situationTl: 'Tatlong galit na lalaki ang humarang sa iyo. Hindi pa sila kumakain buong araw.',
    says: 'Jesteśmy głodni i źli!',
    options: [
      {
        pl: 'Proszę, mam dla was chleb i ser.',
        en: 'Here you are, I have bread and cheese for you.',
        tl: 'Heto, may tinapay at keso ako para sa inyo.',
        correct: true,
      },
      { pl: 'Nie mam czasu.', en: 'I have no time.', tl: 'Wala akong oras.' },
      { pl: 'Idźcie do domu!', en: 'Go home!', tl: 'Umuwi na kayo!' },
      { pl: 'Jesteście śmieszni.', en: 'You are ridiculous.', tl: 'Katawa-tawa kayo.' },
    ],
    success: 'The men eat, thank you and step aside.',
    successTl: 'Kumain ang mga lalaki, nagpasalamat at tumabi.',
  },
  {
    id: 'river',
    figure: 'river',
    pl: 'Rzeka',
    en: 'A river',
    situation:
      'A wide river crosses the path and there is no bridge. A small boat waits on the bank.',
    situationTl: 'May malapad na ilog sa daan at walang tulay. May maliit na bangka sa pampang.',
    says: null,
    options: [
      {
        pl: 'Płynę łódką na drugi brzeg.',
        en: 'I take the boat to the other bank.',
        tl: 'Sumasakay ako sa bangka papunta sa kabilang pampang.',
        correct: true,
      },
      { pl: 'Piję całą rzekę.', en: 'I drink the whole river.', tl: 'Iniinom ko ang buong ilog.' },
      {
        pl: 'Czekam, aż rzeka wyschnie.',
        en: 'I wait until the river dries up.',
        tl: 'Naghihintay ako hanggang matuyo ang ilog.',
      },
      {
        pl: 'Wrzucam plecak do wody.',
        en: 'I throw my backpack into the water.',
        tl: 'Itinatapon ko ang aking backpack sa tubig.',
      },
    ],
    success: 'You row across and land safely.',
    successTl: 'Nakatawid ka sakay ng bangka at ligtas kang nakarating.',
  },
  {
    id: 'guard',
    figure: 'guard',
    pl: 'Strażnik',
    en: 'A guard',
    situation: 'A guard stands at the town gate. He does not open it for rude people.',
    situationTl:
      'May bantay sa tarangkahan ng bayan. Hindi niya ito binubuksan para sa mga bastos.',
    says: 'Stój! Kto idzie?',
    options: [
      {
        pl: 'Dzień dobry! Czy mogę przejść?',
        en: 'Good morning! May I pass?',
        tl: 'Magandang araw po! Maaari po ba akong dumaan?',
        correct: true,
      },
      {
        pl: 'To nie pana sprawa!',
        en: 'That is none of your business, sir!',
        tl: 'Wala po kayong pakialam!',
      },
      { pl: 'Daj mi pieniądze!', en: 'Give me money!', tl: 'Bigyan mo ako ng pera!' },
      { pl: 'Nie lubię pana.', en: 'I do not like you, sir.', tl: 'Hindi ko po kayo gusto.' },
    ],
    success: 'The guard salutes and opens the gate.',
    successTl: 'Sumaludo ang bantay at binuksan ang tarangkahan.',
  },
  {
    id: 'bear',
    figure: 'bear',
    pl: 'Niedźwiedź',
    en: 'A bear',
    situation: 'A bear sits in the middle of the path. It is looking for something sweet.',
    situationTl: 'May osong nakaupo sa gitna ng daan. Naghahanap ito ng matamis.',
    says: null,
    options: [
      {
        pl: 'Daję niedźwiedziowi miód.',
        en: 'I give the bear honey.',
        tl: 'Binibigyan ko ang oso ng pulot.',
        correct: true,
      },
      {
        pl: 'Daję niedźwiedziowi sól.',
        en: 'I give the bear salt.',
        tl: 'Binibigyan ko ang oso ng asin.',
      },
      { pl: 'Krzyczę na niedźwiedzia.', en: 'I shout at the bear.', tl: 'Sinisigawan ko ang oso.' },
      {
        pl: 'Rzucam w niedźwiedzia kamieniem.',
        en: 'I throw a stone at the bear.',
        tl: 'Binabato ko ang oso.',
      },
    ],
    success: 'The bear licks the honey and wanders off into the forest.',
    successTl: 'Dinilaan ng oso ang pulot at pumunta sa gubat.',
  },
  {
    id: 'dragon',
    figure: 'dragon',
    pl: 'Smok',
    en: 'A dragon',
    situation:
      'A dragon lies in front of your house. After breathing fire all day it is terribly thirsty.',
    situationTl:
      'May dragon na nakahiga sa harap ng iyong bahay. Matapos bumuga ng apoy buong araw, uhaw na uhaw ito.',
    says: 'Chce mi się pić!',
    options: [
      {
        pl: 'Daję smokowi wodę.',
        en: 'I give the dragon water.',
        tl: 'Binibigyan ko ang dragon ng tubig.',
        correct: true,
      },
      {
        pl: 'Daję smokowi zapałki.',
        en: 'I give the dragon matches.',
        tl: 'Binibigyan ko ang dragon ng posporo.',
      },
      {
        pl: 'Ciągnę smoka za ogon.',
        en: "I pull the dragon's tail.",
        tl: 'Hinihila ko ang buntot ng dragon.',
      },
      {
        pl: 'Uciekam z krzykiem.',
        en: 'I run away screaming.',
        tl: 'Tumatakbo ako palayo habang sumisigaw.',
      },
    ],
    success: 'The dragon drinks, sighs happily and flies away. The way home is free!',
    successTl: 'Uminom ang dragon, natuwa at lumipad palayo. Malaya na ang daan pauwi!',
  },
];

export default ENCOUNTERS;
