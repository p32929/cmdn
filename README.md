# CMDN

A tiny command line tool that tells you when a long command is done. Put `cmdn` in front of any command and you hear a sound the moment it finishes. It can also send a webhook, write a log line or show a desktop notification.

Builds, installs and uploads can take minutes, and you either sit watching the terminal or forget about it and come back much later. With cmdn you start the command, go do something else, and it calls you back. It works with any command, on Windows, macOS and Linux.

```bash
cmdn npm install
cmdn docker build -t myapp .
```

## Setup

```bash
# Clone and install
git clone https://github.com/p32929/cmdn.git
cd cmdn
npm install

# Configure and install globally
npm run setup
```

The setup will ask you 3 questions:
1. **Enable sound notifications?** Plays `alarm.mp3` when a command finishes.
2. **Run a command after cmdn finishes?** Runs any command you like, such as a webhook or a log line. You can use `[[command]]` and `[[output]]` in it (see below).
3. **Install globally?** So you can use `cmdn` from anywhere.

## Usage

```bash
cmdn your command here
```

Examples:
```bash
cmdn ls
cmdn npm install
cmdn make build
cmdn git push
cmdn docker build -t myapp .
cmdn echo "hello world"
cmdn git commit -m "fix: nested quotes work perfectly!"
cmdn curl -H "Content-Type: application/json" -d '{"key": "value"}'
```

## Placeholders

When you set up the command that runs afterwards, you can use these placeholders:

1. `[[command]]`: the command that was run.
2. `[[output]]`: the full output of that command.

Example post-commands:
```bash
# Log to file
echo "$(date): [[command]] completed" >> ~/command.log

# Send webhook with command info
curl -X POST https://webhook.site/xyz -d "Command: [[command]], Output: [[output]]"

# Desktop notification on macOS
osascript -e 'display notification "[[command]] finished!" with title "CMDN"'
```

## Change your settings

```bash
cmdn --configure
```

## Platforms

1. **Windows:** plays the sound with PowerShell.
2. **macOS:** plays the sound with `afplay`.
3. **Linux:** uses the first audio player it finds (paplay, aplay, mpg123, mpv or vlc).

## Files

1. **`alarm.mp3`:** the notification sound. Replace it with your own if you like.
2. **`cmdn-config.json`:** your settings, created in the repo folder.

## License

MIT License — Copyright (c) 2020 Fayaz Bin Salam. See [LICENSE](LICENSE) for the full text.

## Contributing

Contributions are very welcome, thank you! Before you start on a pull request, please open an issue and tell me what you would like to add or change. That way we can agree on it first, and your time is not wasted on something that might not fit. Thanks for helping make CMDN better.

## You might also like

<p><a href="https://openstore.pfay.workers.dev/more/p32929/cmdn/0"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/more/p32929/cmdn/0-dark.svg"><img src="https://openstore.pfay.workers.dev/more/p32929/cmdn/0-light.svg" width="50%" align="top" alt="More apps by p32929 on OpenStore (1)"></picture></a><a href="https://openstore.pfay.workers.dev/more/p32929/cmdn/1"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/more/p32929/cmdn/1-dark.svg"><img src="https://openstore.pfay.workers.dev/more/p32929/cmdn/1-light.svg" width="50%" align="top" alt="More apps by p32929 on OpenStore (2)"></picture></a><br><a href="https://openstore.pfay.workers.dev/more/p32929/cmdn/2"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/more/p32929/cmdn/2-dark.svg"><img src="https://openstore.pfay.workers.dev/more/p32929/cmdn/2-light.svg" width="50%" align="top" alt="More apps by p32929 on OpenStore (3)"></picture></a><a href="https://openstore.pfay.workers.dev/more/p32929/cmdn/3"><picture><source media="(prefers-color-scheme: dark)" srcset="https://openstore.pfay.workers.dev/more/p32929/cmdn/3-dark.svg"><img src="https://openstore.pfay.workers.dev/more/p32929/cmdn/3-light.svg" width="50%" align="top" alt="More apps by p32929 on OpenStore (4)"></picture></a></p>

<p><a href="https://p32929.github.io/share/?repo=cmdn"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-share-dark.svg"><img src="https://p32929.github.io/readme/footer-share-light.svg" width="50%" align="top" alt="Share this project with your friends in one click"></picture></a><a href="https://p32929.github.io/support/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-support-dark.svg"><img src="https://p32929.github.io/readme/footer-support-light.svg" width="50%" align="top" alt="If you like my work and want to support me, feel free to support"></picture></a><br><a href="https://openstore.pfay.workers.dev/add"><picture><source media="(prefers-color-scheme: dark)" srcset="https://p32929.github.io/readme/footer-join-dark.svg"><img src="https://p32929.github.io/readme/footer-join-light.svg" width="100%" align="top" alt="Put your own apps on OpenStore: free, your listing lives in your own repo"></picture></a></p>
