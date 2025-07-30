// js/features/weavers.js
import { game } from '../state.js';
import { WEAVER_DATA } from '../constants.js';

// 初始化所有织者对象，并放入game.weavers数组
export function initializeWeavers() {
    game.weavers = WEAVER_DATA.map(data => ({
        ...data,
        basePrice: new Decimal(data.basePrice),
        priceGrowth: new Decimal(data.priceGrowth),
        amountOwned: new Decimal(0),
        amountProduced: new Decimal(0),
        totalAmount: new Decimal(0),
        multiplier: new Decimal(1),
        // 计算当前价格的getter
        get currentPrice() {
            return this.basePrice.times(this.priceGrowth.pow(this.amountOwned));
        },
    }));
}

// 购买织者的核心函数
export function buyWeaver(tier) {
    const weaver = game.weavers[tier - 1];
    if (game.resources.singularityPoints.gte(weaver.currentPrice)) {
        game.resources.singularityPoints = game.resources.singularityPoints.sub(weaver.currentPrice);
        weaver.amountOwned = weaver.amountOwned.plus(1);
    }
}

// 重新计算所有织者的乘数（转生后调用）
export function recalculateMultipliers() {
    // 维度折叠的加成: 2^folds
    const foldBonus = Decimal.pow(2, game.prestige.folds);

    // 未来在这里加入法则树等其他加成
    const totalMultiplier = foldBonus;

    game.weavers.forEach(w => {
        w.multiplier = totalMultiplier;
    });
}
