const fileInput = document.getElementById("csvFile");
const matchBtn = document.getElementById("matchBtn");

matchBtn.addEventListener("click", function () {
    const file = fileInput.files[0];
    if (!file || file.type !== "text/csv") {
        alert("Please select a CSV file first.");
        return;
    }
    CSV.fetch({ file: file }).then(function (dataset) {
        const participants = dataset.records.map(row => parseParticipant(row, dataset.fields));
        const matches = matchParticipants(participants);
        renderResults(matches);
    });
});

function renderResults(matches) {
    const results = document.getElementById("results");
    if (matches.length === 0) {
        results.innerHTML = "<p>No matches found.</p>";
        return;
    }
    const rows = matches.map(m => `
        <tr>
            <td>${m.volunteer.name}</td>
            <td>${m.volunteer.email}</td>
            <td>${m.senior ? m.senior.name : "—"}</td>
            <td>${m.senior ? m.senior.email : "—"}</td>
            <td>${m.score}</td>
        </tr>
    `).join("");
    results.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Volunteer</th>
                    <th>Volunteer Email</th>
                    <th>Senior</th>
                    <th>Senior Email</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
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
    for (let i = 6; i < 9; i++) answers[headers[i]] = row[i];
    return { languages, answers };
}

function parseVolunteer(row, headers) {
    const languages = row[12].split(";").map(l => l.trim());
    const answers = {};
    for (let i = 13; i < 16; i++) answers[headers[i]] = row[i];
    return { languages, answers };
}
