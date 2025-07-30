// js/utils/format.js
export default function format(decimal) {
    if (!(decimal instanceof Decimal)) {
        decimal = new Decimal(decimal);
    }
    if (decimal.lt(1000)) {
        return decimal.toDP(2).toFixed();
    }
    return decimal.toExponential(2).replace('e+', 'e');
}
