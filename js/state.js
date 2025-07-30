// js/state.js
Decimal.set({ precision: 100 }); // 设定更高的精度以适应新GDD

// 游戏状态树 (Single Source of Truth)
export const game = {
    // 资源
    resources: {
        singularityPoints: new Decimal(0),
    },
    // 织者数组
    weavers: [],
    // 转生相关状态
    prestige: {
        folds: 0,
        singularities: 0,
    },
    // 因果流速 (Tickspeed)
    flow: {
        causalityFlow: new Decimal(1), // 全局速度乘数
    },
    // 统计数据与状态标志
    stats: {
        firstClickDone: false,
        sps: new Decimal(0), // 每秒SP产量，用于显示
    },
    // 游戏循环控制
    lastTick: Date.now(),
};
