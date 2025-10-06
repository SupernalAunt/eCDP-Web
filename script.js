function startModule(moduleName) {
  window.location.href = `modules/${moduleName}.html`;
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Stop intro music and video
    const introMusic = document.getElementById('introMusic');
    const introVideo = document.getElementById('introVideo');
    introMusic.pause();
    introMusic.currentTime = 0;
    introVideo.pause();
    introVideo.currentTime = 0;

    // Hide intro, show title screen
    document.getElementById('intro').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'block';

    // Start looping background music
    document.getElementById('loopMusic').play();
  }, 30000); // 30 seconds
});
