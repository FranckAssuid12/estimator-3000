// Function to round up to the nearest 15 minutes and format as XhXXmn
function formatTimeInHoursAndMinutes(hours) {
  const totalMinutes = Math.ceil(hours * 60 / 15) * 15; // Round to nearest 15 minutes
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}mn`;
}

// Function to update the progress bar and outputs
function ABT_updateProgress() {
  const ABT_timeSpent = parseFloat(document.getElementById('ABT-time-spent').value) || 0;
  const ABT_devTime = parseFloat(document.getElementById('ABT-dev-time').value) || 0;
  const ABT_feasTime = parseFloat(document.getElementById('ABT-feasibility-time').value) || 0;

  // Calcul de la marge de développement (30% sur le temps de dev uniquement)
  const ABT_devMargin = Math.round((ABT_devTime * 0.3) * 4) / 4; // arrondi au quart d'heure le plus proche
  
  // Calcul du temps pour CSM/BA (50% de (dev + feasibility) avec marge de dev incluse)
  const ABT_csmTime = Math.round(((ABT_devTime + ABT_devMargin + ABT_feasTime) * 0.5) * 4) / 4;

  // Calcul du total final en additionnant les composants arrondis
  const ABT_totalTime = ABT_timeSpent + ABT_devTime + ABT_devMargin + ABT_feasTime + ABT_csmTime;

  const ABT_mandays = Math.floor((ABT_totalTime + 4) / 4) * 0.5;


  // Calcul de la deadline avec incréments de 2 jours après 3 mandays
  const ABT_deadline = ABT_mandays < 3 
    ? 8 
    : 10 + Math.floor(ABT_mandays - 3) * 2;

  // Mettre à jour les sorties affichées
  document.getElementById('ABT-margin-output').textContent = formatTimeInHoursAndMinutes(ABT_devMargin);
  document.getElementById('ABT-csm-output').textContent = formatTimeInHoursAndMinutes(ABT_csmTime);
  document.getElementById('ABT-total-output').textContent = formatTimeInHoursAndMinutes(ABT_totalTime);
  document.getElementById('ABT-dev-time').textContent = formatTimeInHoursAndMinutes(ABT_devTime);
  document.getElementById('ABT-feasibility-time').textContent = formatTimeInHoursAndMinutes(ABT_feasTime);
  document.getElementById('ABT-time-spent').textContent = formatTimeInHoursAndMinutes(ABT_timeSpent);
  document.getElementById('ABT-mandays-output').textContent = `${ABT_mandays}`;

  const deadlineOutput = document.getElementById('ABT-deadline-output');
  deadlineOutput.textContent = `${ABT_deadline} days`;
  deadlineOutput.style.color = ABT_deadline > 8 ? 'var(--danger-color)' : 'inherit';

  const highPlusMessage = document.getElementById('high-plus-message');
  highPlusMessage.style.visibility = ABT_totalTime >= 16 ? 'visible' : 'hidden';

  const ABT_progressBar = document.getElementById('ABT-progress-bar');
  const ABT_progressPercentage = Math.min((ABT_totalTime / 16) * 100, 100);
  ABT_progressBar.style.width = `${ABT_progressPercentage}%`;

  if (ABT_totalTime === 0) {
    ABT_progressBar.textContent = '';
    ABT_progressBar.style.width = '0';
  } else if (ABT_totalTime < 4) {
    ABT_progressBar.style.backgroundColor = 'var(--low-color)';
    ABT_progressBar.textContent = 'Low';
  } else if (ABT_totalTime < 8) {
    ABT_progressBar.style.backgroundColor = 'var(--medium-color)';
    ABT_progressBar.textContent = 'Medium';
  } else if (ABT_totalTime < 12) {
    ABT_progressBar.style.backgroundColor = 'var(--medium-plus-color)';
    ABT_progressBar.textContent = 'Medium+';
  } else if (ABT_totalTime < 16) {
    ABT_progressBar.style.backgroundColor = 'var(--high-color)';
    ABT_progressBar.textContent = 'High';
  } else {
    ABT_progressBar.style.backgroundColor = 'var(--high-plus-color)';
    ABT_progressBar.textContent = 'High+';
  }
}



// Toggle accordion content for Dev Time
function toggleAccordion() {
  const content = document.getElementById("dev-detail-section");
  const icon = document.querySelector(".accordion-icon");

  content.classList.toggle("open");
  icon.style.transform = content.classList.contains("open") ? "rotate(180deg)" : "rotate(0deg)";
}

// Update dev time based on feature times
function updateDevTimeFromDetails() {
  const feature1 = parseFloat(document.getElementById('ABT-dev-feature1').value) || 0;
  const feature2 = parseFloat(document.getElementById('ABT-dev-feature2').value) || 0;
  const feature3 = (parseFloat(document.getElementById('ABT-dev-feature3').value) || 0) * 0.25; // Multiply by 15 mins per tracker
  const feature4 = parseFloat(document.getElementById('ABT-dev-feature4').value) || 0;

  const totalDevTime = feature1 + feature2 + feature3 + feature4;
  document.getElementById('ABT-dev-time').value = totalDevTime;

  ABT_updateProgress(); // Recalculate progress with the updated dev time
}

// Reset values to default, including the subcategories of Dev Time
function ABT_resetValues() {
  // Main input fields
  document.getElementById('ABT-time-spent').value = '';
  document.getElementById('ABT-dev-time').value = '';
  document.getElementById('ABT-feasibility-time').value = '';

  // Subcategory fields
  document.getElementById('ABT-dev-feature1').value = '';
  document.getElementById('ABT-dev-feature2').value = '';
  document.getElementById('ABT-dev-feature3').value = '';
  document.getElementById('ABT-dev-feature4').value = '';

  // Output fields
  document.getElementById('ABT-margin-output').textContent = '0h00mn';
  document.getElementById('ABT-csm-output').textContent = '0h00mn';
  document.getElementById('ABT-total-output').textContent = '0h00mn';
  document.getElementById('ABT-mandays-output').textContent = '0';
  document.getElementById('ABT-deadline-output').textContent = '8 days';
  document.getElementById('ABT-deadline-output').style.color = 'inherit';
  document.getElementById('high-plus-message').style.visibility = 'hidden';
  document.getElementById('copy-confirm').style.display = 'none';

  // Reset progress bar
  const ABT_progressBar = document.getElementById('ABT-progress-bar');
  ABT_progressBar.style.width = '0';
  ABT_progressBar.textContent = '';
  ABT_progressBar.style.backgroundColor = 'var(--low-color)';

  // Ensure accordion is closed
  const devDetailSection = document.getElementById('dev-detail-section');
  devDetailSection.classList.remove('open');
  const icon = document.querySelector(".accordion-icon");
  icon.style.transform = 'rotate(0deg)';
}

// Real-time calculation for main inputs
document.getElementById('ABT-time-spent').addEventListener('input', ABT_updateProgress);
document.getElementById('ABT-dev-time').addEventListener('input', ABT_updateProgress);
document.getElementById('ABT-feasibility-time').addEventListener('input', ABT_updateProgress);

// Attach update function to each dev detail input
document.getElementById('ABT-dev-feature1').addEventListener('input', updateDevTimeFromDetails);
document.getElementById('ABT-dev-feature2').addEventListener('input', updateDevTimeFromDetails);
document.getElementById('ABT-dev-feature3').addEventListener('input', updateDevTimeFromDetails);
document.getElementById('ABT-dev-feature4').addEventListener('input', updateDevTimeFromDetails);

// Function to copy output values to clipboard with error handling
function ABT_copyToClipboard() {
  const ABT_timeSpentValue = document.getElementById('ABT-time-spent').value || '0';
  const ABT_timeSpent = document.getElementById('ABT-time-spent').textContent;
  const ABT_devTime = document.getElementById('ABT-dev-time').textContent;
  const ABT_margin = document.getElementById('ABT-margin-output').textContent;
  const ABT_feasTime = document.getElementById('ABT-feasibility-time').textContent;
  const ABT_csm = document.getElementById('ABT-csm-output').textContent;
  const ABT_total = document.getElementById('ABT-total-output').textContent;
  const ABT_mandays = document.getElementById('ABT-mandays-output').textContent;
  const ABT_mandaysLabel = ABT_mandays === "1.0" ? "Manday" : "Mandays";
  const ABT_category = document.getElementById('ABT-progress-bar').textContent;
  const ABT_deadlineValue = document.getElementById('ABT-deadline-output').textContent.match(/\d+/)[0];
  const ABT_deadline = document.getElementById('ABT-deadline-output').textContent;
  const ABT_textToCopy = 
    `${ABT_timeSpentValue > 0 ? `Time already spent : ${ABT_timeSpent}\n   + ` : ''}` + // Affiche seulement si ABT_timeSpent > 0
    `Development time : ${ABT_devTime}\n   + Feasibility analysis : ${ABT_feasTime}\n   + Dev margin (+30%): ${ABT_margin}\n   + For CSM/BA (+50%) : ${ABT_csm} \n= ${ABT_total} / **${ABT_mandays} ${ABT_mandaysLabel}**\n\n=> **${ABT_category}**` +
    `${ABT_deadlineValue > 8 ? `\n\nPlease note that the deadline for this test will be **${ABT_deadline}**.` : ''}`
    navigator.clipboard.writeText(ABT_textToCopy).then(() => {
    const copyConfirm = document.getElementById('copy-confirm');
    copyConfirm.style.display = 'block';
    setTimeout(() => {
      copyConfirm.style.display = 'none';
    }, 2000); // Hide the message after 2 seconds
  }).catch((err) => {
    console.error('Failed to copy text: ', err);
    alert('Copying to clipboard failed. Please try again or use HTTPS.');
  });
}
