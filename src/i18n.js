const LANG_KEY = 'tictac-lang';

const translations = {
  en: {
    // Menu
    playerVsAi: 'Player vs AI',
    twoPlayers: 'Two Players',
    mode: 'Mode',
    board: 'Board',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    play: 'PLAY',
    stats: 'Statistics',
    settings: 'Settings',
    rules: 'Rules',
    player: 'Player',
    draws: 'Draws',
    games: 'Games',

    // Game
    aiThinking: 'AI thinking...',
    xTurn: '<span class="mark-x">X</span> turn',
    oTurn: '<span class="mark-o">O</span> turn',
    draw: 'Draw',
    boardFull: 'Board is full',
    youWin: 'You Win!',
    aiWins: 'AI Wins',
    xWins: 'X Wins!',
    oWins: 'O Wins!',
    greatGame: 'Great game!',
    tryAgain: 'Try again',
    goodMatch: 'Good match',
    worthyGame: 'A worthy game. Again?',
    playAgain: 'Play Again',
    menu: 'Menu',

    // Stats modal
    statsTitle: 'Statistics',
    pvp: 'PvP',
    vsAi: 'vs AI',
    reset: 'Reset',
    close: 'Close',
    winRate: 'Win Rate',
    totalGames: 'Total Games',

    // Settings
    settingsTitle: 'Settings',
    language: 'Language',
    theme: 'Theme',
    sound: 'Sound',
    on: 'On',
    off: 'Off',
    dark: 'Dark',
    light: 'Light',
    auto: 'Auto',

    // Rules
    rulesTitle: 'How to Play',
    rulesIntro: 'TicTac Universe is the classic tic-tac-toe game with extended board sizes.',
    rule1title: 'Classic 3\u00d73',
    rule1text: 'Place 3 of your marks in a row (horizontally, vertically, or diagonally) to win.',
    rule2title: 'Extended 5\u00d75',
    rule2text: 'Place 4 marks in a row to win on the 5\u00d75 board.',
    rule3title: 'Pro 10\u00d710',
    rule3text: 'Place 5 marks in a row to win on the 10\u00d710 board.',
    rule4title: 'Game Modes',
    rule4text: 'Play against a friend (1 vs 1) or challenge the AI at three difficulty levels: Easy, Medium, or Hard.',
    rule5title: 'First Move',
    rule5text: 'X always goes first. After a game ends, the winner starts the next round.',
    gotIt: 'Got It',
  },

  ru: {
    playerVsAi: '\u0418\u0433\u0440\u043E\u043A vs AI',
    twoPlayers: '\u0414\u0432\u0430 \u0438\u0433\u0440\u043E\u043A\u0430',
    mode: '\u0420\u0435\u0436\u0438\u043C',
    board: '\u041F\u043E\u043B\u0435',
    difficulty: '\u0421\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u044C',
    easy: '\u041B\u0451\u0433\u043A\u0438\u0439',
    medium: '\u0421\u0440\u0435\u0434\u043D\u0438\u0439',
    hard: '\u0421\u043B\u043E\u0436\u043D\u044B\u0439',
    play: '\u0418\u0413\u0420\u0410\u0422\u042C',
    stats: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430',
    settings: '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
    rules: '\u041F\u0440\u0430\u0432\u0438\u043B\u0430',
    player: '\u0418\u0433\u0440\u043E\u043A',
    draws: '\u041D\u0438\u0447\u044C\u0438',
    games: '\u0418\u0433\u0440',

    aiThinking: 'AI \u0434\u0443\u043C\u0430\u0435\u0442...',
    xTurn: '<span class="mark-x">X</span> \u0445\u043E\u0434\u0438\u0442',
    oTurn: '<span class="mark-o">O</span> \u0445\u043E\u0434\u0438\u0442',
    draw: '\u041D\u0438\u0447\u044C\u044F',
    boardFull: '\u041F\u043E\u043B\u0435 \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043E',
    youWin: '\u041F\u043E\u0431\u0435\u0434\u0430!',
    aiWins: 'AI \u043F\u043E\u0431\u0435\u0434\u0438\u043B',
    xWins: 'X \u043F\u043E\u0431\u0435\u0434\u0438\u043B!',
    oWins: 'O \u043F\u043E\u0431\u0435\u0434\u0438\u043B!',
    greatGame: '\u041E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0438\u0433\u0440\u0430!',
    tryAgain: '\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451',
    goodMatch: '\u041A\u0440\u0430\u0441\u0438\u0432\u0430\u044F \u043F\u0430\u0440\u0442\u0438\u044F',
    worthyGame: '\u0414\u043E\u0441\u0442\u043E\u0439\u043D\u0430\u044F \u043F\u0430\u0440\u0442\u0438\u044F. \u0415\u0449\u0451 \u0440\u0430\u0437?',
    playAgain: '\u0415\u0449\u0451 \u0440\u0430\u0437',
    menu: '\u041C\u0435\u043D\u044E',

    statsTitle: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430',
    pvp: 'PvP',
    vsAi: 'vs AI',
    reset: '\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C',
    close: '\u0417\u0430\u043A\u0440\u044B\u0442\u044C',
    winRate: '\u041F\u0440\u043E\u0446\u0435\u043D\u0442 \u043F\u043E\u0431\u0435\u0434',
    totalGames: '\u0412\u0441\u0435\u0433\u043E \u0438\u0433\u0440',

    settingsTitle: '\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
    language: '\u042F\u0437\u044B\u043A',
    theme: '\u0422\u0435\u043C\u0430',
    sound: '\u0417\u0432\u0443\u043A',
    on: '\u0412\u043A\u043B',
    off: '\u0412\u044B\u043A\u043B',
    dark: '\u0422\u0451\u043C\u043D\u0430\u044F',
    light: '\u0421\u0432\u0435\u0442\u043B\u0430\u044F',
    auto: '\u0410\u0432\u0442\u043E',

    rulesTitle: '\u041A\u0430\u043A \u0438\u0433\u0440\u0430\u0442\u044C',
    rulesIntro: 'TicTac Universe \u2014 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u043A\u0440\u0435\u0441\u0442\u0438\u043A\u0438-\u043D\u043E\u043B\u0438\u043A\u0438 \u0441 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u043C\u0438 \u043F\u043E\u043B\u044F\u043C\u0438.',
    rule1title: '\u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430 3\u00d73',
    rule1text: '\u041F\u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 3 \u0441\u0432\u043E\u0438\u0445 \u0437\u043D\u0430\u043A\u0430 \u0432 \u0440\u044F\u0434 (\u043F\u043E \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u0438, \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438 \u0438\u043B\u0438 \u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u0438), \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u044C.',
    rule2title: '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0435 5\u00d75',
    rule2text: '\u041F\u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 4 \u0437\u043D\u0430\u043A\u0430 \u0432 \u0440\u044F\u0434 \u043D\u0430 \u043F\u043E\u043B\u0435 5\u00d75.',
    rule3title: '\u041F\u0440\u043E 10\u00d710',
    rule3text: '\u041F\u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 5 \u0437\u043D\u0430\u043A\u043E\u0432 \u0432 \u0440\u044F\u0434 \u043D\u0430 \u043F\u043E\u043B\u0435 10\u00d710.',
    rule4title: '\u0420\u0435\u0436\u0438\u043C\u044B \u0438\u0433\u0440\u044B',
    rule4text: '\u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u0441 \u0434\u0440\u0443\u0433\u043E\u043C (1 vs 1) \u0438\u043B\u0438 \u043F\u0440\u043E\u0442\u0438\u0432 AI \u043D\u0430 \u0442\u0440\u0451\u0445 \u0443\u0440\u043E\u0432\u043D\u044F\u0445 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438.',
    rule5title: '\u041F\u0435\u0440\u0432\u044B\u0439 \u0445\u043E\u0434',
    rule5text: 'X \u0432\u0441\u0435\u0433\u0434\u0430 \u0445\u043E\u0434\u0438\u0442 \u043F\u0435\u0440\u0432\u044B\u043C. \u041F\u043E\u0441\u043B\u0435 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u043F\u0430\u0440\u0442\u0438\u0438 \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439 \u0440\u0430\u0443\u043D\u0434.',
    gotIt: '\u041F\u043E\u043D\u044F\u0442\u043D\u043E',
  },

  es: {
    playerVsAi: 'Jugador vs IA',
    twoPlayers: 'Dos Jugadores',
    mode: 'Modo',
    board: 'Tablero',
    difficulty: 'Dificultad',
    easy: 'F\u00e1cil',
    medium: 'Medio',
    hard: 'Dif\u00edcil',
    play: 'JUGAR',
    stats: 'Estad\u00edsticas',
    settings: 'Ajustes',
    rules: 'Reglas',
    player: 'Jugador',
    draws: 'Empates',
    games: 'Partidas',

    aiThinking: 'IA pensando...',
    xTurn: '<span class="mark-x">X</span> turno',
    oTurn: '<span class="mark-o">O</span> turno',
    draw: 'Empate',
    boardFull: 'Tablero lleno',
    youWin: '\u00a1Ganaste!',
    aiWins: 'IA Gana',
    xWins: '\u00a1X Gana!',
    oWins: '\u00a1O Gana!',
    greatGame: '\u00a1Gran juego!',
    tryAgain: 'Int\u00e9ntalo de nuevo',
    goodMatch: 'Buena partida',
    worthyGame: 'Digna partida. \u00bfOtra vez?',
    playAgain: 'Otra vez',
    menu: 'Men\u00fa',

    statsTitle: 'Estad\u00edsticas',
    pvp: 'PvP',
    vsAi: 'vs IA',
    reset: 'Borrar',
    close: 'Cerrar',
    winRate: 'Victorias',
    totalGames: 'Total partidas',

    settingsTitle: 'Ajustes',
    language: 'Idioma',
    theme: 'Tema',
    sound: 'Sonido',
    on: 'S\u00ed',
    off: 'No',
    dark: 'Oscuro',
    light: 'Claro',
    auto: 'Auto',

    rulesTitle: 'C\u00f3mo jugar',
    rulesIntro: 'TicTac Universe es el cl\u00e1sico tres en raya con tableros extendidos.',
    rule1title: 'Cl\u00e1sico 3\u00d73',
    rule1text: 'Coloca 3 marcas en l\u00ednea (horizontal, vertical o diagonal) para ganar.',
    rule2title: 'Extendido 5\u00d75',
    rule2text: 'Coloca 4 marcas en l\u00ednea en el tablero 5\u00d75.',
    rule3title: 'Pro 10\u00d710',
    rule3text: 'Coloca 5 marcas en l\u00ednea en el tablero 10\u00d710.',
    rule4title: 'Modos de juego',
    rule4text: 'Juega contra un amigo (1 vs 1) o desaf\u00eda a la IA en tres niveles de dificultad.',
    rule5title: 'Primer turno',
    rule5text: 'X siempre empieza. Tras una partida, el ganador inicia la siguiente ronda.',
    gotIt: 'Entendido',
  }
};

const supportedLangs = ['en', 'ru', 'es'];

function detectLanguage() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && supportedLangs.includes(stored)) return stored;

  const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (nav.startsWith('ru')) return 'ru';
  if (nav.startsWith('es')) return 'es';
  return 'en';
}

let currentLang = detectLanguage();

export function t(key) {
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (!supportedLangs.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

export function getSupportedLangs() {
  return supportedLangs;
}

export function getLangLabel(lang) {
  const labels = { en: 'English', ru: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', es: 'Espa\u00f1ol' };
  return labels[lang] || lang;
}
