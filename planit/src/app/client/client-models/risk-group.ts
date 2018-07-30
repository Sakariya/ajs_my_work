export let RiskGroups: any = {
    'FM12-G1': 'Very Low',
    'FM12-G2': 'Low',
    'FM12-G3': 'Average',
    'FM12-G4': 'High',
    'FM12-G5': 'Very High'
};

export function riskScoreBadge(score) {
    let label;
    if (score >= 1 && score <= 34) {
        label = 'Very Low';
    } else if (score >= 35 && score <= 44) {
        label = 'Low';
    } else if (score >= 45 && score <= 54) {
        label = 'Average';
    } else if (score >= 55 && score <= 64) {
        label = 'High';
    } else if (score >= 65 && score <= 100) {
        label = 'Very High';
    } else {
        label = 'N/A';
    }
    return label;
}
