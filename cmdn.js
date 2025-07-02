#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, exec } = require('child_process');

// Try to import optional dependencies
let inquirer, chalk;
try {
    inquirer = require('inquirer');
    chalk = require('chalk');
} catch (error) {
    // Will handle gracefully if not available
}

// Configuration storage - always in the same directory as the script
const configPath = path.join(__dirname, 'cmdn-config.json');

// Default configuration
const defaultConfig = {
    soundEnabled: true,
    runCommand: false,   // Whether to run a command after notification
    command: ''          // Command to run after notification (can use [[command]] and [[output]])
};

// Load configuration
function loadConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return { ...defaultConfig, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
        }
    } catch (error) {
        console.error('Error loading config:', error.message);
    }
    return defaultConfig;
}

// Save configuration
function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config:', error.message);
        return false;
    }
}

// Get the directory where the script/executable is located
function getScriptDir() {
    if (process.pkg) {
        return path.dirname(process.execPath);
    }
    return __dirname;
}

// Find the alarm sound file
function findSoundFile() {
    const scriptDir = getScriptDir();
    const possiblePaths = [
        path.join(scriptDir, 'alarm.mp3'),
        path.join(__dirname, 'alarm.mp3'),
        path.join(process.cwd(), 'alarm.mp3')
    ];

    for (const soundPath of possiblePaths) {
        if (fs.existsSync(soundPath)) {
            return soundPath;
        }
    }
    
    throw new Error('alarm.mp3 not found. Make sure it\'s in the same directory as the executable.');
}

// Execute a command and capture its output with real-time streaming
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        // Use shell: true for automatic cross-platform shell handling
        const child = spawn(command, {
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true
        });
        
        let stdoutData = '';
        let stderrData = '';
        
        // Stream stdout to console and capture for later
        child.stdout.on('data', (data) => {
            const text = data.toString();
            process.stdout.write(text);
            stdoutData += text;
        });
        
        // Stream stderr to console and capture for later
        child.stderr.on('data', (data) => {
            const text = data.toString();
            process.stderr.write(text);
            stderrData += text;
        });
        
        child.on('close', (exitCode) => {
            const output = (stdoutData + stderrData).trim();
            
            resolve({
                command,
                output,
                exitCode: exitCode || 0,
                success: exitCode === 0
            });
        });
        
        child.on('error', (error) => {
            resolve({
                command,
                output: error.message,
                exitCode: 1,
                success: false
            });
        });
    });
}

// Platform-specific sound playing functions
function playWindowsSound(soundFile) {
    return new Promise((resolve, reject) => {
        const psCommand = `(New-Object Media.SoundPlayer "${soundFile}").PlaySync()`;
        exec(`powershell -Command "${psCommand}"`, (error) => {
            if (error) {
                exec(`start "" "${soundFile}"`, { shell: true }, (startError) => {
                    if (startError) {
                        reject(new Error('Failed to play sound on Windows'));
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    });
}

function playMacSound(soundFile) {
    return new Promise((resolve, reject) => {
        const afplay = spawn('afplay', [soundFile]);
        
        afplay.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                const open = spawn('open', [soundFile]);
                open.on('close', (openCode) => {
                    if (openCode === 0) {
                        resolve();
                    } else {
                        reject(new Error('Failed to play sound on macOS'));
                    }
                });
            }
        });
        
        afplay.on('error', () => {
            const open = spawn('open', [soundFile]);
            open.on('close', (openCode) => {
                if (openCode === 0) {
                    resolve();
                } else {
                    reject(new Error('Failed to play sound on macOS'));
                }
            });
            open.on('error', () => {
                reject(new Error('Failed to play sound on macOS'));
            });
        });
    });
}

function playLinuxSound(soundFile) {
    const players = ['paplay', 'aplay', 'mpg123', 'mpv', 'vlc', 'xdg-open'];
    
    return new Promise((resolve, reject) => {
        let playerIndex = 0;
        
        function tryNextPlayer() {
            if (playerIndex >= players.length) {
                reject(new Error('No suitable audio player found on Linux'));
                return;
            }
            
            const player = players[playerIndex];
            let args = [soundFile];
            
            if (player === 'vlc') {
                args = ['--intf', 'dummy', '--play-and-exit', soundFile];
            } else if (player === 'mpv') {
                args = ['--no-video', soundFile];
            }
            
            const process = spawn(player, args, { stdio: 'ignore' });
            
            process.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    playerIndex++;
                    tryNextPlayer();
                }
            });
            
            process.on('error', () => {
                playerIndex++;
                tryNextPlayer();
            });
        }
        
        tryNextPlayer();
    });
}

// Play notification sound
async function playNotificationSound() {
    const config = loadConfig();
    
    if (!config.soundEnabled) {
        return;
    }

    try {
        const soundFile = findSoundFile();
        console.log('🔔 Playing notification sound...');
        
        const platform = os.platform();
        
        switch (platform) {
            case 'win32':
                await playWindowsSound(soundFile);
                break;
            case 'darwin':
                await playMacSound(soundFile);
                break;
            case 'linux':
                await playLinuxSound(soundFile);
                break;
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    } catch (error) {
        console.error(`Sound error: ${error.message}`);
    }
}

// Run configured command with template replacement
async function runConfiguredCommand(commandData) {
    const config = loadConfig();
    
    if (!config.runCommand || !config.command.trim()) {
        return;
    }
    
    try {
        // Replace template variables
        let commandToRun = config.command
            .replace(/\[\[command\]\]/g, commandData.command)
            .replace(/\[\[output\]\]/g, commandData.output);
        
        console.log(`🚀 Running: ${commandToRun}`);
        
        const result = await executeCommand(commandToRun);
        if (!result.success) {
            console.error(`Post-command failed with exit code ${result.exitCode}`);
        }
        
    } catch (error) {
        console.error(`Error running post-command: ${error.message}`);
    }
}

// Install cmdn globally so it works from anywhere
async function installGlobally() {
    try {
        console.log('🔄 Installing cmdn globally...');
        
        await new Promise((resolve, reject) => {
            exec('npm install -g .', { cwd: getScriptDir() }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
        
        console.log('✅ cmdn installed globally!');
        console.log('💡 Now you can run: cmdn your command');
        console.log('🚀 Try it: cmdn echo hello world');
        
    } catch (error) {
        console.error(`Failed to install globally: ${error.message}`);
        console.log('\n📋 Manual installation:');
        console.log('Run: npm install -g .');
        console.log('Then use: cmdn your command');
    }
}

// Configuration interface
async function runConfiguration() {
    if (!inquirer || !chalk) {
        console.error('Configuration requires additional dependencies. Please run: npm install');
        return;
    }
    
    const config = loadConfig();
    
    console.log(chalk.blue.bold('\n🔧 CMDN Configuration\n'));
    
    const questions = [
        {
            type: 'confirm',
            name: 'soundEnabled',
            message: 'Enable sound notifications?',
            default: config.soundEnabled
        },
        {
            type: 'confirm',
            name: 'runCommand',
            message: 'Run a command after cmdn finishes?',
            default: config.runCommand
        },
        {
            type: 'input',
            name: 'command',
            message: 'Which command to run? (Use [[command]] and [[output]] for dynamic values)',
            default: config.command,
            when: (answers) => answers.runCommand
        },
        {
            type: 'confirm',
            name: 'installGlobally',
            message: 'Install cmdn globally so you can use "cmdn command" from anywhere?',
            default: true
        }
    ];
    
    try {
        const answers = await inquirer.prompt(questions);
        
        // Save configuration
        const newConfig = {
            soundEnabled: answers.soundEnabled,
            runCommand: answers.runCommand,
            command: answers.command || ''
        };
        
        if (saveConfig(newConfig)) {
            console.log(chalk.green('\n✅ Configuration saved successfully!\n'));
        } else {
            console.log(chalk.red('\n❌ Failed to save configuration\n'));
        }
        
        if (answers.installGlobally) {
            await installGlobally();
        }
        
        // Show current configuration
        console.log(chalk.blue('Current settings:'));
        console.log(`Sound: ${newConfig.soundEnabled ? '✅' : '❌'}`);
        console.log(`Run command: ${newConfig.runCommand ? '✅' : '❌'}`);
        if (newConfig.runCommand && newConfig.command) {
            console.log(`Command: ${newConfig.command}`);
            console.log(chalk.gray('  Template variables: [[command]] [[output]]'));
        }
        console.log('');
        
    } catch (error) {
        console.error('Configuration error:', error.message);
    }
}

// Main function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--configure') || args.includes('-c')) {
        await runConfiguration();
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log(`
CMDN - Universal CLI Notification Tool

Usage:
  cmdn command            Run command and notify when done
  cmdn --configure        Configure notification settings
  cmdn --help            Show this help

Examples:
  cmdn ls                 Run ls and notify when done
  cmdn npm install        Run npm install and notify when done
  cmdn make build         Run make build and notify when done
  cmdn git push           Run git push and notify when done
  cmdn echo "hello world" Handles quotes naturally - no escaping needed!
  cmdn git commit -m "fix: nested quotes"
  cmdn curl -H "Content-Type: application/json" -d '{"key": "value"}'

Template Variables:
  In post-commands, you can use:
  [[command]] - The original command that was run
  [[output]]  - The output of the command
`);
    } else if (args.length === 0) {
        console.log('❌ No command specified. Use: cmdn your command');
        console.log('   Or use: cmdn --help for more info');
        process.exit(1);
    } else {
        // Raw mode by default - just join all arguments
        const commandToRun = args.join(' ');
        
        console.log(`🚀 Running: ${commandToRun}`);
        console.log('━'.repeat(50));
        
        // Execute the command and capture output (with real-time streaming)
        const result = await executeCommand(commandToRun);
        
        console.log('━'.repeat(50));
        console.log(`✅ Command finished with exit code ${result.exitCode}`);
        
        // Play notification sound
        await playNotificationSound();
        
        // Run configured post-command
        await runConfiguredCommand(result);
        
        // Exit with the same code as the original command
        process.exit(result.exitCode);
    }
}

// Run main function if this script is called directly
if (require.main === module) {
    main();
}

module.exports = { executeCommand, playNotificationSound, runConfiguredCommand }; 