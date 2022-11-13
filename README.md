# Azure Text to Speech Utility

This is a simple Node.js utility to convert text to speech using Azure Cognitive Services. Before starting, you will need to create a Cognitive Services resource in Azure. You can find instructions on how to do this [here](https://learn.microsoft.com/en-gb/azure/cognitive-services/speech-service/get-started-text-to-speech).


---
<br>

## Getting Started
<br>

1. Once you clone the repository, run `npm i` to install the dependencies.
   
2. Create an `.env` file in the root of the project and add the following variables:

    | Variable | Description |
    | --- | --- |
    | `SPEECH_KEY` | The key for your Azure Cognitive Services resource. |
    | `SPEECH_REGION` | The region for your Azure Cognitive Services resource. Eg: `southeastasia` |
    | `SPEECH_VOICE_NAME` | The name of the voice you want to use. Eg: `en-US-JennyNeural` |
    | `INPUT_FILE` | The path to the file containing the text you want to convert to speech. Eg: `./input.txt` |
    | `OUTPUT_DIR` | The path to the directory where you want to save the audio files. Eg: `./output`. If the directory doesn't exist, it will be created. |
    | `OUTPUT_FILE_PREFIX` | The prefix for the audio files. Eg: `TEST`. The output files will be named `TEST_LINE001`, `TEST_LINE002`, etc. |
    | `OUTPUT_FILE_EXTENSION` | The file type for the audio files. Eg: `mp3` |
    
    <br>
    A template for the `.env` file: 

    <br>

    ```bash
    SPEECH_KEY=#Your Azure Service Key
    SPEECH_REGION=southeastasia
    SPEECH_VOICE_NAME=en-US-JennyNeural

    INPUT_FILE=./input.txt

    OUTPUT_DIR=./output
    OUTPUT_FILE_PREFIX=TEST
    OUTPUT_FILE_EXTENSION=mp3
    ```

1. Ensure that you have your text file as specificed in the `INPUT_FILE` variable. One sentence correspond to one audio file, separated by newlines. Blank lines will be ignored.
   
    For example:

    ```
    Hello World.

    I am Jenny, Your assistant for today.

    I am here to help you with your daily tasks.
    ```

    Line 2 and 4 are blank lines, and will be ignored. Line 1, 3 and 5 will be converted to audio files.

4. To start the script, run `npm start` or `node index.mjs` on the root directory.