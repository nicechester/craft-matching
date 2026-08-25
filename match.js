function evalScore(vol, sen) {
    const matchedDates = vol.dates.filter(d =>
        sen.dates.some(sd => sd.getTime() === d.getTime())
    ).length;
    if (matchedDates < 3) return 0;

    const matchedLang = vol.languages.filter(l =>
        sen.languages.includes(l)
    ).length;
    if (matchedLang < 1) return 0;

    let score = 0;
    for (const [key, val] of Object.entries(vol.answers)) {
        if (sen.answers[key] === val) score++;
    }
    return score;
}

function matchParticipants(participants) {
    const volunteers = participants.filter(p => p.party === "VOLUNTEER");
    const seniors = participants.filter(p => p.party === "SENIOR");

    return volunteers.map(vol => {
        let bestSenior = null, bestScore = 0;
        for (const sen of seniors) {
            const score = evalScore(vol, sen);
            if (score > bestScore) {
                bestScore = score;
                bestSenior = sen;
            }
        }
        return { volunteer: vol.name, senior: bestSenior.name, score: bestScore };
    });
}
