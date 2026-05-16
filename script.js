// EDITABLE INFOGRAPHIC DATA:
// These original values are used for the reset button and as the first page content.
const originalInfographicText = {
  mainTitle: "SOCIAL ISSUES",
  subtitle: "Understanding challenges in the IT Era",
  mainMessage: "USE TECHNOLOGY WISELY",
  supportingText: "Be responsible and informed in your online activities and interactions.",
  cyberTitle: "CYBERBULLYING",
  cyberDescription: "Cyberbullying is a severe issue, affecting mental health and causing emotional distress in young individuals.",
  misinformationTitle: "MISINFORMATION",
  misinformationDescription: "Misinformation spreads rapidly online, leading to confusion and mistrust among communities and individuals.",
  privacyTitle: "PRIVACY",
  privacyDescription: "Data privacy concerns arise as personal information becomes vulnerable to misuse by companies and cybercriminals.",
  footerText: "Promote a safer digital world!",
  representativeOne: "Josh Emmanuel T. Suarez",
  representativeTwo: "Kelvin Shan Giest"
};

const storageKey = "socialIssuesEditableInfographic";
let currentInfographicText = { ...originalInfographicText };
let activeIssueKey = null;

// MODAL CONTENT:
// Tips stay here, while titles and descriptions are updated from the editable form.
const issueDetails = {
  cyberbullying: {
    tag: "Social Issue",
    title: originalInfographicText.cyberTitle,
    body: originalInfographicText.cyberDescription,
    tips: [
      "Think carefully before posting messages, comments, or images.",
      "Save proof of harmful online behavior and report it to a trusted adult or platform.",
      "Support people who are targeted and avoid joining hurtful conversations."
    ]
  },
  misinformation: {
    tag: "Social Issue",
    title: originalInfographicText.misinformationTitle,
    body: originalInfographicText.misinformationDescription,
    tips: [
      "Check the source before sharing online posts or news.",
      "Compare information with reliable websites and official announcements.",
      "Pause before reposting content that seems shocking or suspicious."
    ]
  },
  privacy: {
    tag: "Social Issue",
    title: originalInfographicText.privacyTitle,
    body: originalInfographicText.privacyDescription,
    tips: [
      "Use strong passwords and avoid sharing private details publicly.",
      "Review app permissions before allowing access to personal information.",
      "Be careful with links, downloads, and messages asking for sensitive data."
    ]
  }
};

const issueModal = document.getElementById("issueModal");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalList = document.getElementById("modalList");
const editModeModal = document.getElementById("editModeModal");
const editModeOpenButton = document.getElementById("editModeOpen");
const editModeCloseButton = document.getElementById("editModeClose");
const modeToggle = document.getElementById("modeToggle");
const backToTop = document.getElementById("backToTop");
const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const resetQuiz = document.getElementById("resetQuiz");
const editForm = document.getElementById("editForm");
const editFields = document.querySelectorAll("[data-edit-field]");
const saveChangesButton = document.getElementById("saveChanges");
const resetOriginalButton = document.getElementById("resetOriginal");
const saveMessage = document.getElementById("saveMessage");

let lastFocusedElement = null;
let saveMessageTimer = null;

// EDITABLE INFOGRAPHIC:
// Each key updates one or more visible HTML text elements on the page.
const editableTargets = {
  mainTitle: ["heroTitle", "brandTitle"],
  subtitle: ["heroSubtitle"],
  mainMessage: ["mainMessage", "mainMessageReminder"],
  supportingText: ["supportingText", "supportingTextReminder"],
  cyberTitle: ["cyberTitle"],
  cyberDescription: ["cyberDescription"],
  misinformationTitle: ["misinformationTitle"],
  misinformationDescription: ["misinformationDescription"],
  privacyTitle: ["privacyTitle"],
  privacyDescription: ["privacyDescription"],
  footerText: ["footerText"],
  representativeOne: ["representativeOne"],
  representativeTwo: ["representativeTwo"]
};

// MODALS:
// Keep the page from scrolling while any popup is open.
function updateBodyModalState() {
  const modalIsOpen = issueModal.classList.contains("is-open") || editModeModal.classList.contains("is-open");
  document.body.classList.toggle("modal-open", modalIsOpen);
}

// ISSUE MODAL:
// Fill the popup with the selected card's current editable information.
function renderModalContent(issueKey) {
  const issue = issueDetails[issueKey];

  if (!issue) {
    return;
  }

  modalTag.textContent = issue.tag;
  modalTitle.textContent = issue.title;
  modalBody.textContent = issue.body;
  modalList.innerHTML = "";

  issue.tips.forEach(function (tip) {
    const item = document.createElement("li");
    item.textContent = tip;
    modalList.appendChild(item);
  });
}

// ISSUE MODAL:
// Open the popup and fill it with the selected card's information.
function openModal(issueKey) {
  activeIssueKey = issueKey;
  lastFocusedElement = document.activeElement;
  renderModalContent(issueKey);

  issueModal.classList.add("is-open");
  issueModal.setAttribute("aria-hidden", "false");
  updateBodyModalState();
  issueModal.querySelector(".modal-close").focus();
}

// ISSUE MODAL:
// Close the popup and return focus to the card or button that opened it.
function closeModal() {
  issueModal.classList.remove("is-open");
  issueModal.setAttribute("aria-hidden", "true");
  updateBodyModalState();
  activeIssueKey = null;

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// EDIT MODE MODAL:
// Open the edit fields in a popup instead of showing them on the page.
function openEditMode() {
  lastFocusedElement = document.activeElement;
  updateInfographicContent(true);
  saveMessage.textContent = "";

  editModeModal.classList.add("is-open");
  editModeModal.setAttribute("aria-hidden", "false");
  updateBodyModalState();
  editModeCloseButton.focus();
}

// EDIT MODE MODAL:
// Close the edit popup and return focus to the Edit Mode button.
function closeEditMode() {
  editModeModal.classList.remove("is-open");
  editModeModal.setAttribute("aria-hidden", "true");
  updateBodyModalState();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// EDITABLE INFOGRAPHIC:
// Keep modal titles/descriptions connected to the edited card text.
function updateIssueDetails() {
  issueDetails.cyberbullying.title = currentInfographicText.cyberTitle;
  issueDetails.cyberbullying.body = currentInfographicText.cyberDescription;
  issueDetails.misinformation.title = currentInfographicText.misinformationTitle;
  issueDetails.misinformation.body = currentInfographicText.misinformationDescription;
  issueDetails.privacy.title = currentInfographicText.privacyTitle;
  issueDetails.privacy.body = currentInfographicText.privacyDescription;
}

// EDITABLE INFOGRAPHIC:
// Update every visible infographic text area from the current editable values.
function updateInfographicContent(shouldUpdateFields = true) {
  Object.keys(editableTargets).forEach(function (key) {
    editableTargets[key].forEach(function (elementId) {
      const element = document.getElementById(elementId);

      if (element) {
        element.textContent = currentInfographicText[key];
      }
    });
  });

  if (shouldUpdateFields) {
    editFields.forEach(function (field) {
      field.value = currentInfographicText[field.dataset.editField];
    });
  }

  document.title = currentInfographicText.mainTitle + " | " + currentInfographicText.subtitle;
  document.querySelector(".brand").setAttribute("aria-label", currentInfographicText.mainTitle + " home");

  document.querySelector('.issue-card[data-issue="cyberbullying"]').setAttribute("aria-label", "Learn more about " + currentInfographicText.cyberTitle);
  document.querySelector('.issue-card[data-issue="misinformation"]').setAttribute("aria-label", "Learn more about " + currentInfographicText.misinformationTitle);
  document.querySelector('.issue-card[data-issue="privacy"]').setAttribute("aria-label", "Learn more about " + currentInfographicText.privacyTitle);

  updateIssueDetails();

  if (issueModal.classList.contains("is-open") && activeIssueKey) {
    renderModalContent(activeIssueKey);
  }
}

// EDITABLE INFOGRAPHIC:
// Load saved edits from localStorage when the page opens.
function loadSavedChanges() {
  let savedText = "";

  try {
    savedText = localStorage.getItem(storageKey);
  } catch (error) {
    updateInfographicContent(true);
    return;
  }

  if (!savedText) {
    updateInfographicContent(true);
    return;
  }

  try {
    currentInfographicText = {
      ...originalInfographicText,
      ...JSON.parse(savedText)
    };
  } catch (error) {
    currentInfographicText = { ...originalInfographicText };
  }

  updateInfographicContent(true);
}

// EDITABLE INFOGRAPHIC:
// Save current edits so they remain after refreshing the browser.
function saveChanges() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(currentInfographicText));
    saveMessage.textContent = "Changes saved successfully.";
  } catch (error) {
    saveMessage.textContent = "Changes could not be saved in this browser.";
  }

  clearTimeout(saveMessageTimer);
  saveMessageTimer = setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
}

// EDITABLE INFOGRAPHIC:
// Restore original infographic text and remove saved localStorage data.
function resetOriginalContent() {
  currentInfographicText = { ...originalInfographicText };

  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    saveMessage.textContent = "";
  }

  updateInfographicContent(true);
  saveMessage.textContent = "Original content restored.";

  clearTimeout(saveMessageTimer);
  saveMessageTimer = setTimeout(function () {
    saveMessage.textContent = "";
  }, 3000);
}

// EDITABLE INFOGRAPHIC:
// Update the visible page instantly whenever the user types in the edit panel.
editFields.forEach(function (field) {
  field.addEventListener("input", function () {
    currentInfographicText[field.dataset.editField] = field.value;
    updateInfographicContent(false);
    saveMessage.textContent = "";
  });
});

// EDITABLE INFOGRAPHIC:
// Open, save, and reset buttons for the editable version.
editModeOpenButton.addEventListener("click", openEditMode);
saveChangesButton.addEventListener("click", saveChanges);
resetOriginalButton.addEventListener("click", resetOriginalContent);

// EDIT MODE MODAL:
// Pressing Enter in a text input saves instead of refreshing the page.
editForm.addEventListener("submit", function (event) {
  event.preventDefault();
  saveChanges();
});

// EDIT MODE MODAL:
// Close the edit popup when the background or X button is clicked.
document.querySelectorAll("[data-close-edit-modal]").forEach(function (element) {
  element.addEventListener("click", closeEditMode);
});

loadSavedChanges();

// BUTTONS AND CARDS:
// Make the whole card clickable without double-opening from its Learn More button.
document.querySelectorAll(".issue-card").forEach(function (card) {
  card.addEventListener("click", function (event) {
    if (event.target.closest(".learn-btn")) {
      return;
    }

    openModal(card.dataset.issue);
  });

  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(card.dataset.issue);
    }
  });
});

// BUTTONS:
// Each Learn More button opens the matching modal content.
document.querySelectorAll(".learn-btn").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.stopPropagation();
    openModal(button.dataset.issue);
  });
});

// MODAL:
// Close the popup when the background or X button is clicked.
document.querySelectorAll("[data-close-modal]").forEach(function (element) {
  element.addEventListener("click", closeModal);
});

// MODAL:
// Close whichever popup is open with the Escape key.
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (editModeModal.classList.contains("is-open")) {
    closeEditMode();
    return;
  }

  if (issueModal.classList.contains("is-open")) {
    closeModal();
  }
});

// MODE BUTTON:
// Toggle between the animated Cyber Mode look and the calmer Simple Mode look.
modeToggle.addEventListener("click", function () {
  document.body.classList.toggle("simple-mode");
  const simpleModeIsOn = document.body.classList.contains("simple-mode");

  modeToggle.textContent = simpleModeIsOn ? "Cyber Mode" : "Simple Mode";
  modeToggle.setAttribute("aria-pressed", simpleModeIsOn.toString());
});

// SCROLL ANIMATION:
// Fade sections in as they enter the screen.
const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach(function (element) {
  if (element.getBoundingClientRect().top < window.innerHeight * 0.95) {
    element.classList.add("is-visible");
  }
});

// SCROLL ANIMATION:
// If a nav link opens a section directly, make that section visible right away.
function revealHashTarget() {
  if (!window.location.hash) {
    return;
  }

  const target = document.querySelector(window.location.hash);

  if (target && target.classList.contains("reveal")) {
    target.classList.add("is-visible");
  }
}

revealHashTarget();
setTimeout(revealHashTarget, 50);
window.addEventListener("hashchange", revealHashTarget);

// SCROLL ANIMATION:
// IntersectionObserver watches each section and adds the visible class.
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
} else {
  revealElements.forEach(function (element) {
    element.classList.add("is-visible");
  });
}

// BACK-TO-TOP BUTTON:
// Show and hide the button while scrolling.
window.addEventListener("scroll", function () {
  if (window.scrollY > 420) {
    backToTop.classList.add("is-visible");
  } else {
    backToTop.classList.remove("is-visible");
  }
});

// BACK-TO-TOP BUTTON:
// Smoothly return to the top of the infographic.
backToTop.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// QUIZ:
// Correct answers for the three questions.
const correctAnswers = {
  q1: "b",
  q2: "a",
  q3: "a"
};

// QUIZ:
// Check selected answers, highlight each question, and show the score.
quizForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(quizForm);
  const questions = quizForm.querySelectorAll(".question-card");
  let score = 0;
  let answered = 0;

  questions.forEach(function (question) {
    question.classList.remove("is-correct", "is-wrong");
  });

  Object.keys(correctAnswers).forEach(function (questionName, index) {
    const userAnswer = formData.get(questionName);
    const questionCard = questions[index];

    if (userAnswer) {
      answered++;
    }

    if (userAnswer === correctAnswers[questionName]) {
      score++;
      questionCard.classList.add("is-correct");
    } else {
      questionCard.classList.add("is-wrong");
    }
  });

  if (answered < Object.keys(correctAnswers).length) {
    quizResult.textContent = "Please answer all 3 questions. Current score: " + score + "/3.";
    return;
  }

  quizResult.textContent = "Your score is " + score + "/3. Keep using technology wisely!";
});

// QUIZ BUTTON:
// Clear selected answers and feedback.
resetQuiz.addEventListener("click", function () {
  quizForm.reset();
  quizResult.textContent = "";

  quizForm.querySelectorAll(".question-card").forEach(function (question) {
    question.classList.remove("is-correct", "is-wrong");
  });
});
