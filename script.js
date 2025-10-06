function handleLogin() {
  // Hide login screen
  document.getElementById('loginScreen').style.display = 'none';

  // Play intro music
  const introMusic = document.getElementById('introMusic');
  introMusic.play();

  // Wait a few seconds before showing main menu
  setTimeout(() => {
    introMusic.pause();
    introMusic.currentTime = 0;

    document.getElementById('mainMenu').style.display = 'block';
  }, 5000); // 5 seconds delay
}

function startModule(moduleName) {
  // Start looping background music
  const loopMusic = document.getElementById('loopMusic');
  if (loopMusic.paused) {
    loopMusic.play();
  }

  // Navigate to module
  window.location.href = `modules/${moduleName}.html`;
}
