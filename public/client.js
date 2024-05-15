document.addEventListener('DOMContentLoaded', () => {
  let captions = window.document.getElementById("captions");
  let audio = document.getElementById('myAudio');
  let ssid1;
  let ssid2;
  let audioData = [];
  let audioSourceBuffer;
  let mediaSource;

  if (audio) {
    setupMediaSource();
  } else {
    console.error('Audio element not found');
  }

  function setupMediaSource() {
    mediaSource = new MediaSource();
    audio.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      audioSourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      audioSourceBuffer.addEventListener('updateend', playBufferedAudio);
      // Now we're safe to start processing buffered audio data
      if (audioData.length > 0 && !audioSourceBuffer.updating) {
        playBufferedAudio();
      }
    });
  }

  function resetMediaSource() {
    if (audioSourceBuffer && !audioSourceBuffer.updating) {
      const buffered = audioSourceBuffer.buffered;
      // Ensure there's buffered data to remove
      if (buffered.length > 0) {
        try {
          // Optionally, abort current operations before removing buffer
          audioSourceBuffer.abort();
          audioSourceBuffer.remove(buffered.start(0), buffered.end(buffered.length - 1));
        } catch (error) {
          console.error('Failed to clear buffer', error);
        }
      }

      // Attach an event listener that waits for the above removal to finish
      audioSourceBuffer.addEventListener('updateend', () => {
        mediaSource.endOfStream(); // End the stream to properly reset
        mediaSource.removeSourceBuffer(audioSourceBuffer); // Remove the SourceBuffer

        // Recreate and setup the MediaSource and SourceBuffer
        setupMediaSource();
      }, { once: true });

    } else if(audioSourceBuffer) {
      console.error('Buffer is updating, try resetting later.');
    }
  }

  function playBufferedAudio() {
    if (!audioSourceBuffer.updating && audioData.length > 0) {
      let allData = new Uint8Array(audioData.reduce((acc, val) => [...acc, ...val], []));
      audioSourceBuffer.appendBuffer(allData);
      audioData = []; // Clear the buffer once appended.
    }
  }
  function stopAudio() {
    /*
    if (audio && mediaSource && audioSourceBuffer && !audioSourceBuffer.updating) {
      // Remove all buffered audio data to prevent playing outdated audio
      const buffered = audioSourceBuffer.buffered;
      if (buffered.length > 0) {
        // Since this operation is asynchronous, it should be surrounded by checks to ensure the state allows it
        try {
          audioSourceBuffer.abort(); // Abort any ongoing appending processes
          // Remove the buffered ranges; assuming buffered.start(0) and buffered.end(0) will get the first (and likely only) range
          audioSourceBuffer.remove(buffered.start(0), buffered.end(0));
        } catch (error) {
          console.error('Failed to clear buffer', error);
        }
      }

      //audio.pause();
      //audio.currentTime = 0; // Reset current time to ensure playback starts from the beginning next time
      audioData = []; // Empty the audio data array to discard any pending data
    }
    */
    resetMediaSource();
  }
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", async () => {
    console.log("WebSocket connection opened");
    await start(socket);
  });

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'caption'){
      captions.innerHTML = data.output ? `<span>${data.output}</span>` : "";
    }else if (data.type === 'audio_stop'){
      console.log('1stopping previous  audio')
      stopAudio()
    }
    else if (data.type === 'audio_session'){
      if(data.sid1){
        console.log('ssid1 updated')
        ssid1 = data.sid1;
      }
      if(data.sid2){
        console.log('ssid2 updated')
        ssid2 = data.sid2
      }

      if (ssid1 !== ssid2 && audio) {
console.log('2stopping previous audio')
        stopAudio(); // Stop and clear previous audio
      }

      console.log('currentsid:' + ssid1+ 'sessionid:'+ ssid2)
    }
    else if (data.type === 'audio') {
      if (ssid1 === ssid2) {
        console.log('ssids matched and pushing into audiodata')
        audioData.push(new Uint8Array(data.output));
        if (audioSourceBuffer && mediaSource.readyState === "open" && !audioSourceBuffer.updating) {
          playBufferedAudio();
        }
      }
      else{
        stopAudio();
      }
    }
    else if (data.type === 'audio_neets'){
      const audioData = data.output;
      const audioBlob = new Blob([new Uint8Array(atob(audioData).split("").map(function(c) {
        return c.charCodeAt(0);
      }))], {type: 'audio/mp3'});
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }

  });

  socket.addEventListener("close", () => {
    console.log("WebSocket connection closed");
  });

  async function start(socket) {
    const listenButton = document.querySelector("#record");
    let microphone;

    listenButton.addEventListener("click", async () => {
      if (!microphone) {
        try {
          microphone = await getMicrophone();
          await openMicrophone(microphone, socket);
        } catch (error) {
          console.error("Error opening microphone:", error);
        }
      } else {
        await closeMicrophone(microphone);
        microphone = undefined;
      }
    });
  }

  async function getMicrophone() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return new MediaRecorder(stream);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }

  async function openMicrophone(microphone, socket) {
    return new Promise((resolve) => {
      microphone.onstart = () => {
        console.log("WebSocket connection opened");
        document.body.classList.add("recording");
        resolve();
      };

      microphone.onstop = () => {
        console.log("WebSocket connection closed");
        document.body.classList.remove("recording");
      };

      microphone.ondataavailable = (event) => {
        if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
          socket.send(event.data);
        }
      };

      microphone.start(1000);
    });
  }

  async function closeMicrophone(microphone) {
    microphone.stop();
  }
});