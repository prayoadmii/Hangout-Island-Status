let JAVA_IP;
let BEDROCK_IP;

const REFRESH_INTERVAL = 60;
let countdown = REFRESH_INTERVAL;

async function loadConfig() {
    const response = await fetch("info.json");
    const config = await response.json();

    document.querySelector("h1").textContent =
        config["server-name"] + " Server Status";

    JAVA_IP = config["java-ip"];
    BEDROCK_IP = config["bedrock-ip"];
}

async function fetchServer(ip, type) {
    try {

        let apiURL;

        if (type === "bedrock") {
            apiURL = `https://api.mcstatus.io/v2/status/bedrock/${ip}`;
        } else {
            apiURL = `https://api.mcstatus.io/v2/status/java/${ip}`;
        }

        const response = await fetch(apiURL);
        const data = await response.json();

        const statusBox = document.getElementById(`${type}-status-box`);
        const statusLabel = document.getElementById(`${type}-status-label`);
        const playerCount = document.getElementById(`${type}-player-count`);

        if (data.online) {
            statusBox.className = "status-label stat-online";
            statusLabel.textContent = "Online";

            if (data.players) {
                playerCount.textContent =
                    `${data.players.online}/${data.players.max}`;
            } else {
                playerCount.textContent = "-/-";
            }

        } else {
            statusBox.className = "status-label stat-offline";
            statusLabel.textContent = "Offline";
            playerCount.textContent = "-/-";
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

function refreshServers() {
    fetchServer(JAVA_IP, "java");
    fetchServer(BEDROCK_IP, "bedrock");
    countdown = REFRESH_INTERVAL;
}

function startCountdown() {
    setInterval(() => {
        document.getElementById("refresh-counter").innerHTML =
            `Will Refresh In: ${countdown}s `;

        if (countdown <= 0) {
            refreshServers();
        }

        countdown--;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadConfig();
    refreshServers();
    startCountdown();
});
