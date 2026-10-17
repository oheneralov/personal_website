// The people of the tale and how the browser voices them: a higher pitch for the girl, a low and
// slow one for the wolf.
export const SPEAKERS = {
  girl: { pl: 'Czerwony Kapturek', en: 'Little Red Riding Hood', pitch: 1.5, rate: 0.9 },
  mother: { pl: 'Mama', en: 'Mum', pitch: 1.2, rate: 0.9 },
  wolf: { pl: 'Wilk', en: 'The wolf', pitch: 0.4, rate: 0.8 },
  grandma: { pl: 'Babcia', en: 'Grandma', pitch: 1.1, rate: 0.8 },
  hunter: { pl: 'Myśliwy', en: 'The hunter', pitch: 0.8, rate: 0.9 },
};

/**
 * The tale, scene by scene. A scene is one picture (`id` picks it in the scene drawing) and the
 * lines said in it, in order. The girl comments on what she sees in short A1-level sentences.
 */
const RED_HAT_SCENES = [
  {
    id: 'home',
    title: 'At home',
    lines: [
      {
        speaker: 'mother',
        pl: 'Kapturku, zanieś babci koszyk. Babcia jest chora.',
        en: 'Little Hood, take the basket to Grandma. Grandma is ill.',
      },
      {
        speaker: 'girl',
        pl: 'Dobrze, mamo! W koszyku są ciastka i sok.',
        en: 'All right, Mum! There are cookies and juice in the basket.',
      },
      {
        speaker: 'mother',
        pl: 'Idź prosto ścieżką i nie rozmawiaj z wilkiem!',
        en: 'Go straight along the path and do not talk to the wolf!',
      },
      { speaker: 'girl', pl: 'Do widzenia, mamo!', en: 'Goodbye, Mum!' },
    ],
  },
  {
    id: 'forest',
    title: 'In the forest',
    lines: [
      {
        speaker: 'girl',
        pl: 'Jaki piękny las! Drzewa są wysokie i zielone.',
        en: 'What a beautiful forest! The trees are tall and green.',
      },
      {
        speaker: 'girl',
        pl: 'O, ptaszek! Śpiewa bardzo ładnie.',
        en: 'Oh, a little bird! It sings very nicely.',
      },
    ],
  },
  {
    id: 'wolf',
    title: 'The wolf',
    lines: [
      {
        speaker: 'girl',
        pl: 'Oj, to jest wilk! Wilk jest czarny i duży.',
        en: 'Oh, it is a wolf! The wolf is black and big.',
      },
      {
        speaker: 'wolf',
        pl: 'Dzień dobry, dziewczynko. Dokąd idziesz?',
        en: 'Good morning, little girl. Where are you going?',
      },
      {
        speaker: 'girl',
        pl: 'Idę do babci. Babcia mieszka w lesie, w małym domu.',
        en: 'I am going to Grandma. Grandma lives in the forest, in a small house.',
      },
      {
        speaker: 'wolf',
        pl: 'Zobacz, tam są piękne kwiaty. Zerwij kwiaty dla babci!',
        en: 'Look, there are beautiful flowers over there. Pick some flowers for Grandma!',
      },
      {
        speaker: 'girl',
        pl: 'Dobry pomysł! Dziękuję, wilku.',
        en: 'Good idea! Thank you, wolf.',
      },
    ],
  },
  {
    id: 'flowers',
    title: 'The flowers',
    lines: [
      {
        speaker: 'girl',
        pl: 'Czerwone, żółte i różowe kwiaty. Babcia lubi kwiaty.',
        en: 'Red, yellow and pink flowers. Grandma likes flowers.',
      },
      {
        speaker: 'girl',
        pl: 'Mam bukiet! Teraz idę dalej.',
        en: 'I have a bouquet! Now I am going on.',
      },
    ],
  },
  {
    id: 'grandmas-house',
    title: "Grandma's house",
    lines: [
      {
        speaker: 'girl',
        pl: 'To jest dom babci. Puk, puk!',
        en: "This is Grandma's house. Knock, knock!",
      },
      {
        speaker: 'wolf',
        pl: 'Wejdź, kochanie. Drzwi są otwarte.',
        en: 'Come in, darling. The door is open.',
      },
      {
        speaker: 'girl',
        pl: 'Hmm… Babcia ma dziwny głos.',
        en: 'Hmm… Grandma has a strange voice.',
      },
    ],
  },
  {
    id: 'bed',
    title: "In Grandma's bed",
    lines: [
      {
        speaker: 'girl',
        pl: 'Babciu, jakie masz duże uszy!',
        en: 'Grandma, what big ears you have!',
      },
      { speaker: 'wolf', pl: 'Żeby cię lepiej słyszeć.', en: 'All the better to hear you with.' },
      {
        speaker: 'girl',
        pl: 'Babciu, jakie masz duże oczy!',
        en: 'Grandma, what big eyes you have!',
      },
      { speaker: 'wolf', pl: 'Żeby cię lepiej widzieć.', en: 'All the better to see you with.' },
      {
        speaker: 'girl',
        pl: 'Babciu, jakie masz duże zęby!',
        en: 'Grandma, what big teeth you have!',
      },
      { speaker: 'wolf', pl: 'Żeby cię zjeść!', en: 'All the better to eat you with!' },
      {
        speaker: 'girl',
        pl: 'Ratunku! To nie jest babcia, to wilk!',
        en: 'Help! That is not Grandma, that is the wolf!',
      },
    ],
  },
  {
    id: 'hunter',
    title: 'The hunter',
    lines: [
      {
        speaker: 'hunter',
        pl: 'Stój, wilku! Jestem myśliwym.',
        en: 'Stop, wolf! I am a hunter.',
      },
      {
        speaker: 'hunter',
        pl: 'Wilk ucieka do lasu i nie wróci.',
        en: 'The wolf is running away into the forest and will not come back.',
      },
      {
        speaker: 'girl',
        pl: 'Uff, dziękuję! Ale gdzie jest babcia?',
        en: 'Phew, thank you! But where is Grandma?',
      },
      {
        speaker: 'grandma',
        pl: 'Jestem tutaj, w szafie! Wilk mnie nie zjadł.',
        en: 'I am here, in the wardrobe! The wolf did not eat me.',
      },
    ],
  },
  {
    id: 'end',
    title: 'Happy ending',
    lines: [
      {
        speaker: 'grandma',
        pl: 'Dziękuję za ciastka i kwiaty, Kapturku!',
        en: 'Thank you for the cookies and the flowers, Little Hood!',
      },
      {
        speaker: 'girl',
        pl: 'Teraz wiem: nie rozmawiam z wilkiem w lesie!',
        en: 'Now I know: I do not talk to the wolf in the forest!',
      },
      { speaker: 'girl', pl: 'Koniec bajki!', en: 'The end of the tale!' },
    ],
  },
];

export default RED_HAT_SCENES;
