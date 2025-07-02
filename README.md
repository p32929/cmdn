# CMDN
A simple CLI notification tool - just run any command with `cmdn "command"` and get notified when it's done!

## Setup

```bash
# Clone and install
git clone https://github.com/your-username/cmdn.git
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
cmdn "your command here"
```

Examples:
```bash
cmdn "ls"
cmdn "npm install"
cmdn "make build"
cmdn "git push"
cmdn "docker build -t myapp ."
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

# LICENSE
```
MIT License

Copyright (c) 2020 Fayaz Bin Salam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.