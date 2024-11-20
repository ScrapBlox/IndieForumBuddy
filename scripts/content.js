

console.log("Content script loaded!");
        
// Attempt to fetch forums.json
fetch(chrome.runtime.getURL("../data/forums.json"))
    .then(response => {
    console.log("Fetch response status:", response.status);
    if (!response.ok) throw new Error(`Failed to load forums.json: ${response.status}`);
    return response.json();
    })
    .then(data => {
    console.log("Loaded ../data/forums.json:", data);
    })
    .catch(err => {
    console.error("Error loading ../data/forums.json:", err);
    });


// Fetch forums.json from the extension directory
fetch(chrome.runtime.getURL("../data/forums.json"))
.then(response => {
if (!response.ok) throw new Error(`Failed to load forums.json: ${response.status}`);
    return response.json();
})
.then(data => {
const forums = data; // Extract forums data from JSON
const currentDomain = window.location.hostname;

// Look for the current domain in the forums list
const forumEntry = forums.find(forum => forum.domain === currentDomain);

if (forumEntry) {
    // Create and display an alert banner
    const indieAlternative = forumEntry.alternative || "No alternative listed.";

    const AlertBox = document.createElement("div");
    AlertBox.id = "IndieForumBuddy-banner";
    AlertBox.style = `
    position: fixed;
    z-index: 2000;
    background: tan;
    color: black;
    width: 100%;
    border-bottom: 2px solid yellow;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    top: 0;
    left: 0;
    `;
    

    const message = `
    This forum is corporate-owned (by ${forumEntry.owner}).
    Check out an indie alternative: 
    <a href="${indieAlternative}" target="_blank">${indieAlternative}</a>.
    `;

    AlertBox.innerHTML = message;

    document.body.prepend(AlertBox);
}
})
.catch(err => {
console.error("Error loading ../data/forums.json:", err);
});  