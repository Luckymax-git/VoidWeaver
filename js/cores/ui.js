// js/core/ui.js
import { game } from '../state.js';
import format from '../utils/format.js';
import { buyWeaver } from '../features/weavers.js';
import { dimensionalFold, lawSingularity } from '../features/prestige.js';

// 获取所有DOM元素
const elements = {
    spDisplay: document.getElementById('sp-display'),
    spsDisplay: document.getElementById('sps-display'),
    narrativeText: document.getElementById('narrative-text'),
    manualClickButton: document.getElementById('manual-click-button'),
    weaversContainer: document.getElementById('weavers-container'),
    prestigeContainer: document.getElementById('prestige-container'),
};

// 初始化UI，创建所有动态元素
export function initializeUI() {
    // 创建织者行
    game.weavers.forEach(weaver => {
        const row = document.createElement('div');
        row.className = 'weaver-row';
        row.id = `weaver-row-${weaver.tier}`;
        row.style.display = 'none'; // 初始隐藏
        row.innerHTML = `
            <span>${weaver.name} (x${format(weaver.multiplier)})</span>
            <div class="weaver-info">
                <span>数量: <span id="weaver-amount-${weaver.tier}">0</span></span>
                <button id="buy-weaver-${weaver.tier}">购买 (成本: <span id="weaver-cost-${weaver.tier}">0</span>)</button>
            </div>
        `;
        elements.weaversContainer.appendChild(row);
        document.getElementById(`buy-weaver-${weaver.tier}`).onclick = () => buyWeaver(weaver.tier);
    });

    // 手动点击事件
    elements.manualClickButton.onclick = () => {
        if (!game.stats.firstClickDone) {
            game.stats.firstClickDone = true;
            elements.narrativeText.textContent = "我。";
        }
        game.resources.singularityPoints = game.resources.singularityPoints.plus(1);
    };
}

// 每一帧更新UI的函数
export function updateUI() {
    // 更新资源
    elements.spDisplay.textContent = format(game.resources.singularityPoints);
    elements.spsDisplay.textContent = format(game.stats.sps);

    // 更新叙事和手动按钮可见性
    if (!game.stats.firstClickDone) {
        elements.narrativeText.textContent = "中央有一个脉动的光点...";
    } else if (game.weavers[0].totalAmount.isZero()) {
        elements.manualClickButton.style.display = 'inline-block';
    } else {
        elements.manualClickButton.style.display = 'none';
    }

    // 更新织者列表
    game.weavers.forEach(weaver => {
        const row = document.getElementById(`weaver-row-${weaver.tier}`);
        const canAfford = game.resources.singularityPoints.gte(weaver.currentPrice);

        // 解锁逻辑
        let isVisible = false;
        if (weaver.tier === 1) {
            isVisible = game.resources.singularityPoints.gte(10) || weaver.totalAmount.gt(0);
        } else {
            const prevWeaver = game.weavers[weaver.tier - 2];
            isVisible = prevWeaver && prevWeaver.totalAmount.gt(0);
        }

        row.style.display = isVisible ? 'flex' : 'none';

        if (isVisible) {
            document.getElementById(`weaver-amount-${weaver.tier}`).textContent = format(weaver.totalAmount);
            document.getElementById(`weaver-cost-${weaver.tier}`).textContent = format(weaver.currentPrice);
            document.getElementById(`buy-weaver-${weaver.tier}`).disabled = !canAfford;
        }
    });

    // 更新转生区
    updatePrestigeUI();
}

function updatePrestigeUI() {
    elements.prestigeContainer.innerHTML = ''; // 简单清空

    // 维度折叠
    const foldWeaver = game.weavers[3]; // T4
    if (foldWeaver && foldWeaver.totalAmount.gt(0)) {
        const canFold = foldWeaver.totalAmount.gte(20);
        const div = document.createElement('div');
        div.className = 'prestige-action';
        div.innerHTML = `
            <span>维度折叠 (需要20个时间流): 重置并获得x2生产力加成。当前加成: x${format(Decimal.pow(2, game.prestige.folds))}</span>
            <button id="fold-button" ${canFold ? '' : 'disabled'}>折叠</button>
        `;
        elements.prestigeContainer.appendChild(div);
        document.getElementById('fold-button').onclick = dimensionalFold;
    }

    // 法则奇点
    const singularityWeaver = game.weavers[7]; // T8
    if (singularityWeaver && singularityWeaver.totalAmount.gt(0)) {
        const canSingularity = singularityWeaver.totalAmount.gte(20);
        const div = document.createElement('div');
        div.className = 'prestige-action';
        div.innerHTML = `
            <span>法则奇点 (需要20个现实肌腱): 重置一切，但提升因果流速。当前流速: x${format(game.flow.causalityFlow)}</span>
            <button id="singularity-button" ${canSingularity ? '' : 'disabled'}>奇点</button>
        `;
        elements.prestigeContainer.appendChild(div);
        document.getElementById('singularity-button').onclick = lawSingularity;
    }
}
