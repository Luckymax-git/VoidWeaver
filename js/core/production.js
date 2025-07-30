// js/core/production.js
import { game } from '../state.js';

export function calculateProduction(deltaTime) {
    const effectiveDelta = deltaTime * game.flow.causalityFlow.toNumber();

    // 1. 从高阶到低阶计算层叠生产
    for (let i = game.weavers.length - 1; i > 0; i--) {
        const producer = game.weavers[i];
        const produced = game.weavers[i - 1];
        if (producer.totalAmount.gt(0)) {
            const gain = producer.totalAmount.times(producer.multiplier).times(effectiveDelta);
            produced.amountProduced = produced.amountProduced.plus(gain);
        }
    }

    // 2. 更新所有织者的总量
    game.weavers.forEach(w => {
        w.totalAmount = w.amountOwned.plus(w.amountProduced);
    });

    // 3. 计算SP生产
    const weaver1 = game.weavers[0];
    const spGain = weaver1.totalAmount.times(weaver1.multiplier).times(effectiveDelta);
    game.resources.singularityPoints = game.resources.singularityPoints.plus(spGain);

    // 4. 更新SPS统计数据用于UI显示
    game.stats.sps = weaver1.totalAmount.times(weaver1.multiplier).times(game.flow.causalityFlow);
}
