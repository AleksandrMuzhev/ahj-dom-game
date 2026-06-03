require('./css/style.css');

const GoblinGame = require('./js/app');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    const game = new GoblinGame(4);
    game.init();
});