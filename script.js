const urlParams = new URLSearchParams(window.location.search);
const isDebug = urlParams.get("debug");

const channel = 'IlseEnAlaska';
const oauth = 'oauth:wlj0dvgqqvt1jtosyn7snn7srrfkgs';

const botName = "BotEnAlaska";

// Audio files
const files = {
    audio: {
        brocolazo: new Audio('./sounds/bonk.mp3'),
        finishhim: new Audio('./sounds/finish-him.mp3'),
        penguin: new Audio('./sounds/penguin-race.mp3'),
        joey: new Audio('./sounds/joey - how you doing.mp3'),
        mariopain: new Audio('./sounds/mario-pain.mp3'),
        sailormoon1: new Audio('./sounds/sailor_moon_sfx3.mp3'),
        sailormoon2: new Audio('./sounds/sailor_moon_sound_2.mp3'),
        ouch: new Audio('./sounds/super-thwomp.mp3'),
        toasty: new Audio('./sounds/toasty.mp3'),
        misterio: new Audio('./sounds/x-files.mp3'),
    },
    video: {
        fetch: './videos/mean girls - fetch.mp4',
    }
};

// DEBUG SECTION
if(isDebug) {
    const areaEl = document.getElementById('area');
    for(const audio of Object.keys(files.audio)) {
        const buttonEl = document.createElement('button');
        buttonEl.innerText = audio;
        buttonEl.onclick = () => processCommand(`!${audio}`, {});
        areaEl.appendChild(buttonEl);
    }
    areaEl.appendChild(document.createElement('hr'));
    for(const video of Object.keys(files.video)) {
        const buttonEl = document.createElement('button');
        buttonEl.innerText = video;
        buttonEl.onclick = () => processCommand(`!${video}`, {});
        areaEl.appendChild(buttonEl);
    }
}


// twitch bot settings
const config = {
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: botName,
        password: oauth || "oauth:jpp29hh7etadbvznq4l0ra5xhwf48i",
    },
    channels: [channel],
};
let client = null;

if (channel) {
    client = new tmi.client(config);
    client.connect();

    const videoPlayer = document.getElementById('video');
    
    processCommand = (message, user) => {
        const [command, arg1, arg2, arg3] = message.substring(1).toLowerCase().split(' ');

        // Audio
        if(files.audio[command]) {
            files.audio[command].play();
            return;
        }
        
        // Video
        videoPlayer.onended = () => {
            videoPlayer.pause();
            videoPlayer.src = '';
        }
        if(files.video[command]) {
            videoPlayer.src = files.video[command];
            videoPlayer.play();
            return;
        }
        
        // Custom commands
        switch(command) {
            case 'comandos':
                return { message: 
                    [
                        `Comandos disponibles`,
                        `AUDIO: ${Object.keys(files.audio).map(k => ` !${k}`)}`,
                        `VIDEO: ${Object.keys(files.video).map(k => ` !${k}`)}`,
                    ]
                };
                break;
        }
        return null;
    }

    client.on("chat", (channel, user, message, self) => {
        if (self) return;
        if (message.startsWith("!")) {
            const response = processCommand(message, user);
            if(response) {
                for(const m of response.message) {
                    client.say(channel, m)
                }
            }
        };
    });
}

