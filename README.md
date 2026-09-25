# CMDN

A tiny CLI notification tool — prefix any long command with `cmdn` and get a sound (and optionally a webhook, a log line or a desktop notification) the moment it finishes. Stop babysitting builds.

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
1. **Enable sound notifications?** - Plays alarm.mp3 when commands finish
2. **Run a command after cmdn finishes?** - Execute any command (webhooks, logging, etc.)
   - You can use `[[command]]` and `[[output]]` in your command string
   - `[[command]]` gets replaced with the original command that was run
   - `[[output]]` gets replaced with the command's output
3. **Install globally?** - So you can use `cmdn` from anywhere

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

## Template Variables

When configuring a post-command, you can use these template variables:
- `[[command]]` - The original command that was run
- `[[output]]` - The full output of the command

Example post-commands:
```bash
# Log to file
echo "$(date): [[command]] completed" >> ~/command.log

# Send webhook with command info
curl -X POST https://webhook.site/xyz -d "Command: [[command]], Output: [[output]]"

# Desktop notification on macOS
osascript -e 'display notification "[[command]] finished!" with title "CMDN"'
```

## Reconfigure anytime

```bash
cmdn --configure
```

## Platform Support

- **Windows**: PowerShell SoundPlayer for audio
- **macOS**: afplay for audio  
- **Linux**: Multiple audio players (paplay, aplay, mpg123, mpv, vlc)

## Files

- **`alarm.mp3`**: The notification sound file (replace with your own if desired)
- **`cmdn-config.json`**: Your configuration file (created in repo folder)

## License

MIT License — Copyright (c) 2020 Fayaz Bin Salam. See [LICENSE](LICENSE) for the full text.
## Contributing

Contributions are warmly welcomed and greatly appreciated! Whether it's a bug fix, new feature, or improvement, your input helps make this project better for everyone.

Before submitting a pull request, please:

1. Create an issue describing the feature or bug fix you'd like to work on
2. Wait for discussion and approval to ensure alignment with project goals
3. Fork the repository and create your feature branch
4. Submit your pull request with a clear description of changes

This approach helps avoid duplicate efforts and ensures smooth collaboration. Thank you for considering contributing!

## Share

Sharing this repository with your friends is just one click away from here

[![facebook](https://user-images.githubusercontent.com/6418354/179013321-ac1d1452-0689-493f-9066-940cf2302b6e.png)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/p32929/cmdn/)
[![twitter](https://user-images.githubusercontent.com/6418354/179013351-7d8d6d1c-4ce2-46ab-bef8-4c4765a1b888.png)](https://twitter.com/intent/tweet?url=https://github.com/p32929/cmdn/)
[![tumblr](https://user-images.githubusercontent.com/6418354/179013343-3111f55a-3b90-40c7-8487-9777348672b0.png)](https://www.tumblr.com/share?v=3&u=https://github.com/p32929/cmdn/)
[![pocket](https://user-images.githubusercontent.com/6418354/179013334-b095c45f-becf-49f4-9ee1-5a731a9b1f85.png)](https://getpocket.com/save?url=https://github.com/p32929/cmdn/)
[![pinterest](https://user-images.githubusercontent.com/6418354/179013331-44cd9206-11b1-4b65-becb-5863b61c828f.png)](https://pinterest.com/pin/create/button/?url=https://github.com/p32929/cmdn/)
[![reddit](https://user-images.githubusercontent.com/6418354/179013338-7416ae3f-73ba-4522-86e1-1374d7082d22.png)](https://www.reddit.com/submit?url=https://github.com/p32929/cmdn/)
[![linkedin](https://user-images.githubusercontent.com/6418354/179013327-ca7b7102-1da8-4b1c-858f-1a6e5f21bd70.png)](https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/p32929/cmdn/)
[![whatsapp](https://user-images.githubusercontent.com/6418354/179013353-f477fa0b-3e6f-4138-a357-c9991b23ff88.png)](https://api.whatsapp.com/send?text=https://github.com/p32929/cmdn/)

<!-- hire-block -->

---

## 💼 Using this at a company?

I do fixed-price delivery work on my own projects. One invoice, one date, no hourly billing:

| | |
|---|---|
| **White-label build** — this project rebranded, extended and deployed as yours | **$6,500** · 3 weeks |
| **Custom app from scratch** on my own stack, signed and auto-updating | **$12,500** · 6 weeks |
| **Production-hardening sprint** — 72 hours on this project, for your load and your security review | **$999** |
| **Ongoing capacity** — one project-week of my time reserved every month | **$9,000 / month** |

Full details → **[p32929.github.io/hire](https://p32929.github.io/hire/)** · Email **[fayazdevinbox@uberip.com](mailto:fayazdevinbox@uberip.com)** — scoping and quotes are free and I answer within one business day.
