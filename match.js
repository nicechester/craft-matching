function evalScore(vol, sen) {
    let matchedDates = 0;
    for (let i = 0; i < vol.dates.length; i++) {
        for (let j = 0; j < sen.dates.length; j++) {
            if (vol.dates[i].getTime() === sen.dates[j].getTime()) matchedDates++;
        }
    }
    if (matchedDates < 3) return 0;

    let matchedLang = 0;
    for (let i = 0; i < vol.languages.length; i++) {
        if (sen.languages.includes(vol.languages[i])) matchedLang++;
    }
    if (matchedLang < 1) return 0;

    let score = 0;
    for (const [key, val] of Object.entries(vol.answers)) {
        if (sen.answers[key] === val) score++;
    }
    return score;
}

function matchParticipants(participants) {
    const volunteers = [];
    const seniors = [];
    for (let i = 0; i < participants.length; i++) {
        if (participants[i].party === "VOLUNTEER") volunteers.push(participants[i]);
        else seniors.push(participants[i]);
    }

    const matches = [];
    for (let i = 0; i < volunteers.length; i++) {
        let bestSenior = null, bestScore = 0;
        for (let j = 0; j < seniors.length; j++) {
            const score = evalScore(volunteers[i], seniors[j]);
            if (score > bestScore) {
                bestScore = score;
                bestSenior = seniors[j];
            }
        }
        matches.push({ volunteer: volunteers[i], senior: bestSenior, score: bestScore });
    }
    return matches;
}
