"use strict";

import sdk from "microsoft-cognitiveservices-speech-sdk";
import dotenv from "dotenv";
import readline from "readline";
import fs from "fs";
import path from "path";



// Environment variables
dotenv.config();

const SPEECH_KEY = process.env.SPEECH_KEY;
const SPEECH_REGION = process.env.SPEECH_REGION;
const SPEECH_VOICE_NAME = process.env.SPEECH_VOICE_NAME;

const INPUT_FILE = process.env.INPUT_FILE;
const OUTPUT_DIR = process.env.OUTPUT_DIR;
const OUTPUT_FILE_PREFIX = process.env.OUTPUT_FILE_PREFIX;
const OUTPUT_FILE_EXTENSION = process.env.OUTPUT_FILE_EXTENSION;


// stdin to read input from terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



// Read all the contents of input file
// split it into sentences separated by newlines, 
// and remove the blank lines.
const lines = fs.readFileSync(INPUT_FILE)
    .toString()
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);


// Confirm with the user
await new Promise((resolve) => {
    const confirmMsg = `\nText to Speech Azure Cognitive Services\n\n` +
        `${lines.length} voice sentence(s) found. \n` +
        `Example Output Format: ${path.join(OUTPUT_DIR, OUTPUT_FILE_PREFIX )}_LINE000.${OUTPUT_FILE_EXTENSION}\n\n` +
        `Do you want to continue? (y/n) > `;

    rl.question(confirmMsg, (res)=> {
        if (res.toLowerCase() !== "y") process.exit(0);
        resolve();
    });
});

    
console.log("\nStarting synthesis...\n");



// Make the output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`Creating output directory: ${OUTPUT_DIR} because it doesn't exist.`);
    fs.mkdirSync(OUTPUT_DIR);
}

// Setup azure speech config
const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = SPEECH_VOICE_NAME;


// Generate audio for each line
for (let index = 0; index < lines.length; ++index) {
    const line = lines[index];
    const numbering = index.toString().padStart(3, "0");

    // Set the output file destination
    const dest = path.join(OUTPUT_DIR, `${OUTPUT_FILE_PREFIX}_LINE${numbering}.${OUTPUT_FILE_EXTENSION}`);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(dest);

    // Create the speech synthesizer.
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    await new Promise((resolve, reject) => {
        synthesizer.speakTextAsync(line, (result)=> {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) 
                resolve();
            else 
                reject("Speech synthesis failed, " + result.errorDetails + "\nDid you set the speech resource key and region values?");
        }, reject);
    })
    .then(()=> {
        console.log(`Synthesis of ${dest} completed successfully.`);
    })
    .finally(() => {
        synthesizer.close();
        synthesizer = null;
    });
}


console.log("\nSynthesis completed successfully.\n");

// Wait for a while for the file writing to complete.
setTimeout(() => {
    rl.question("Press any key to exit.\n", ()=> {
        rl.close();
        process.exit(0);
    });
}, 1000);