// js/features/prestige.js
import { game } from '../state.js';
import { recalculateMultipliers } from './weavers.js';

function resetForPrestige() {
    game.resources.singularityPoints = new Decimal(10); // 初始SP
    game.weavers.forEach(w => {
        w.amountOwned = new Decimal(0);
        w.amountProduced = new Decimal(0);
        w.totalAmount = new Decimal(0);
    });
}

// GDD: 当拥有20个“时间流”(织者4)时
export function dimensionalFold() {
    const requiredTier = 4;
    const weaver = game.weavers[requiredTier - 1];
    if (weaver.totalAmount.gte(20)) {
        resetForPrestige();
        game.prestige.folds++;
        recalculateMultipliers();
        console.log(`维度折叠! 次数: ${game.prestige.folds}`);
    }
}

// GDD: 当拥有20个“现实肌腱”(织者8)时
export function lawSingularity() {
    const requiredTier = 8;
    const weaver = game.weavers[requiredTier - 1];
    if (weaver.totalAmount.gte(20)) {
        resetForPrestige();
        game.prestige.folds = 0; // 法则奇点重置维度折叠
        game.prestige.singularities++;

        // GDD: 提升因果流速 (Tickspeed)
        // 简化公式: 每次奇点使基础速度提升 (1 + 0.1 * singularities)
        const baseFlowRate = 1;
        game.flow.causalityFlow = new Decimal(baseFlowRate + 0.1 * game.prestige.singularities);

        recalculateMultipliers(); // 折叠数重置后，需要重新计算乘数
        console.log(`法则奇点! 次数: ${game.prestige.singularities}`);
    }
}
