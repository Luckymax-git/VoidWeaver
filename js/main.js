// js/main.js
import { initializeWeavers } from './features/weavers.js';
import { initializeUI } from './core/ui.js';
import { startGameLoop } from './core/gameLoop.js';

// 初始化游戏
function init() {
    console.log("虚空织者 v0.4 (重构版) - 初始化...");

    // 1. 初始化数据结构
    initializeWeavers();

    // 2. 创建UI元素并绑定事件
    initializeUI();

    // 3. 启动游戏循环
    startGameLoop();

    console.log("初始化完成，游戏开始。");
}

// 启动游戏
init();
