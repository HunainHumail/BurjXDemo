import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

const superscriptMap: Record<string, string> = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
};

const toSuperscript = (numStr: string) => {
    return numStr.split('').map(char => superscriptMap[char] || char).join('');
};

export const formatCurrency = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0.00';

    if (value >= 1000) {
        const thousands = (value / 1000).toFixed(0);
        return `$${thousands}K`;
    }

    if (value >= 1) {
        return `$${value.toFixed(2)}`;
    }

    if (value > 0 && value < 0.001) {
        const [coefficient, exponent] = value.toExponential(2).split('e');
        return `$${coefficient}×10${toSuperscript(exponent)}`;
    }

    return `$${value.toFixed(4).replace(/\.?0+$/, '')}`;
};

export const formatCurrentPrice = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '$0';

    if (value >= 1) {
        return '$' + value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
        });
    } else if (value >= 0.0001) {
        return '$' + value.toFixed(4);
    } else {
        // Dynamically show decimals till we hit non-zero
        const str = value.toPrecision(8); // Precision shows meaningful digits
        return '$' + parseFloat(str).toString();
    }
};

export const measureYAxisWidth = (labels: string[], fontSize = moderateScale(12), padding = 20) => {
    const longest = labels.reduce((a, b) => a.length > b.length ? a : b, '');
    return Math.ceil(longest.length * fontSize * 0.6) + padding;
};

export const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return value.toLocaleString();
};

export const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
};

export const SCREEN_HEIGHT = Dimensions.get('window').height;

