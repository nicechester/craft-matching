const fileInput = document.getElementById("csvFile");

function loadCSV(file) {
    if (!file || file.type !== "text/csv") {
        alert("Please select a CSV file first.");
        return;
    }
    CSV.fetch({ file: file }).then(function (dataset) {
        const participants = dataset.records.map(row => parseParticipant(row, dataset.fields));
        const matches = matchParticipants(participants);
        renderResults(matches);
    });
}

function renderResults(matches) {
    const results = document.getElementById("results");
    if (matches.length === 0) {
        results.innerHTML = "<p>No matches found.</p>";
        return;
    }
    const tbody = document.getElementById("match-tbody");
    const template = document.getElementById("match-row-template");
    for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        const clone = template.content.cloneNode(true);
        const td = clone.querySelectorAll("td");
        td[0].textContent = m.volunteer.name;
        td[1].textContent = m.volunteer.email;
        td[2].textContent = m.senior ? m.senior.name : "—";
        td[3].textContent = m.senior ? m.senior.email : "—";
        td[4].textContent = m.score;
        tbody.appendChild(clone);
    }
}

function parseParticipant(row, headers) {
    const isVolunteer = row[3].includes("Volunteer");
    const party = isVolunteer ? "VOLUNTEER" : "SENIOR";
    const base = isVolunteer ? parseVolunteer(row, headers) : parseSenior(row, headers);
    return {
        ...base,
        name: row[2],
        email: row[1],
        dates: row[4].split(";").map(d => new Date(d.trim())),
        party,
    };
}

function parseSenior(row, headers) {
    const languages = row[5].split(";").map(l => l.trim());
    const answers = {};
    for (let i = 6; i < 9; i++)
        answers[headers[i]] = row[i];
    return { languages, answers };
}

function parseVolunteer(row, headers) {
    const languages = row[12].split(";").map(l => l.trim());
    const answers = {};
    for (let i = 13; i < 16; i++)
        answers[headers[i]] = row[i];
    return { languages, answers };
}
