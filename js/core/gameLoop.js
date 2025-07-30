// js/core/gameLoop.js
import { game } from '../state.js';
import { GAME_TICK_MS } from '../constants.js';
import { calculateProduction } from './production.js';
import { updateUI } from './ui.js';

function loop() {
    const now = Date.now();
    const deltaTime = (now - game.lastTick) / 1000; // 秒
    game.lastTick = now;

    calculateProduction(deltaTime);
    updateUI();
}

export function startGameLoop() {
    setInterval(loop, GAME_TICK_MS);
}
