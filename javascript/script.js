document.addEventListener("DOMContentLoaded", function () {
  highlightCurrentPage();
  connectButtons();
  prepareForms();
  prepareContactForm();
  prepareModal();
  initializeContactMap();
  initializeScrollAnimations();
});

if (window.jQuery) {
  jQuery(function ($) {
    enhanceDomWithJQuery($);
    initializeJQueryAccordion($);
    initializeJQueryTabs($);
    initializeProjectSorting($);
    loadDynamicCommunityContent($);
    initializeGalleryLightbox($);
    initializeJQueryFormFeedback($);
  });
}

function highlightCurrentPage() {
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function connectButtons() {
  var linkedButtons = document.querySelectorAll("button[data-link]");

  linkedButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.location.href = button.dataset.link;
    });
  });
}

function prepareForms() {
  var forms = document.querySelectorAll("form");

  forms.forEach(function (form) {
    if (form.id === "contactForm") {
      return;
    }

    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFormFeedback(form);

      if (!form.checkValidity()) {
        showFormErrors(form);
        return;
      }

      showSuccessMessage(form);
      form.reset();
    });
  });
}

function prepareContactForm() {
  var form = document.querySelector("#contactForm");

  if (!form) {
    return;
  }

  var fields = form.querySelectorAll("input, select, textarea");

  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      validateContactField(field);
    });

    field.addEventListener("blur", function () {
      validateContactField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    handleContactSubmit(form);
  });
}

function validateContactForm(form) {
  var fields = form.querySelectorAll("input, select, textarea");
  var isValid = true;

  fields.forEach(function (field) {
    if (!validateContactField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateContactField(field) {
  var message = "";
  var value = field.value.trim();

  if (field.required && value === "") {
    message = "Please complete this field.";
  } else if (field.type === "email" && value !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Please enter a valid email address.";
  } else if (field.name === "phone" && value !== "" && !/^[0-9+() -]{10,20}$/.test(value)) {
    message = "Please enter a valid phone number.";
  } else if (field.minLength > 0 && value !== "" && value.length < field.minLength) {
    message = "Please enter at least " + field.minLength + " characters.";
  }

  setContactFieldError(field, message);
  return message === "";
}

function setContactFieldError(field, message) {
  var error = document.querySelector("#" + field.id + "Error");

  field.classList.toggle("field-error", message !== "");
  field.setAttribute("aria-invalid", message !== "" ? "true" : "false");

  if (error) {
    error.textContent = message;
  }
}

function handleContactSubmit(form) {
  var submitButton = form.querySelector("button[type='submit']");

  if (!validateContactForm(form)) {
    showModal("Please Check the Form", "Some details need attention before your message can be sent.");
    return;
  }

  setSubmitState(submitButton, true);

  processContactForm(form)
    .then(function () {
      showModal("Message Sent", "Thank you for contacting us. We will get back to you soon.");
      form.reset();
    })
    .catch(function () {
      showModal("Message Not Sent", "Something went wrong while sending your message. Please try again.");
    })
    .finally(function () {
      setSubmitState(submitButton, false);
    });
}

function processContactForm(form) {
  var data = Object.fromEntries(new FormData(form).entries());
  var savedMessages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
  var payload = {
    id: Date.now(),
    submittedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    reason: data.reason,
    subject: data.subject,
    message: data.message
  };

  savedMessages.push(payload);
  localStorage.setItem("contactMessages", JSON.stringify(savedMessages));

  return fetch("data:application/json," + encodeURIComponent(JSON.stringify({ success: true, data: payload })))
    .then(function (response) {
    if (!response.ok) {
      throw new Error("Contact form request failed.");
    }

    return response.json();
  });
}

function setSubmitState(button, isSubmitting) {
  if (!button) {
    return;
  }

  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? "Sending..." : "Send Message";
}

function prepareModal() {
  var closeButton = document.querySelector("#modalClose");
  var okButton = document.querySelector("#modalOk");
  var modal = document.querySelector("#contactModal");

  if (!modal) {
    return;
  }

  [closeButton, okButton].forEach(function (button) {
    if (button) {
      button.addEventListener("click", closeModal);
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

function showModal(title, message) {
  var modal = document.querySelector("#contactModal");
  var modalTitle = document.querySelector("#modalTitle");
  var modalMessage = document.querySelector("#modalMessage");

  if (!modal || !modalTitle || !modalMessage) {
    alert(message);
    return;
  }

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  var closeButton = document.querySelector("#modalClose");

  if (closeButton) {
    closeButton.focus();
  }
}

function closeModal() {
  var modal = document.querySelector("#contactModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function initializeContactMap() {
  var mapElement = document.querySelector("#contactMap");

  if (!mapElement || typeof L === "undefined") {
    return;
  }

  var gauteng = [-26.2041, 28.0473];
  var map = L.map("contactMap").setView(gauteng, 10);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  L.marker(gauteng)
    .addTo(map)
    .bindPopup("<strong>Helping Hands Community</strong><br>Gauteng, South Africa")
    .openPopup();
}

function clearFormFeedback(form) {
  var messages = form.querySelectorAll(".field-error-message, .form-message");
  var fields = form.querySelectorAll(".field-error");

  messages.forEach(function (message) {
    message.remove();
  });

  fields.forEach(function (field) {
    field.classList.remove("field-error");
  });
}

function showFormErrors(form) {
  var invalidFields = form.querySelectorAll(":invalid");

  invalidFields.forEach(function (field) {
    var message = document.createElement("p");
    message.className = "field-error-message";
    message.textContent = getErrorMessage(field);

    field.classList.add("field-error");
    field.insertAdjacentElement("afterend", message);
  });
}

function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    return "Please complete this field.";
  }

  if (field.validity.typeMismatch) {
    return "Please enter a valid email address.";
  }

  if (field.validity.rangeUnderflow) {
    return "Please enter a larger amount.";
  }

  return "Please check this field.";
}

function showSuccessMessage(form) {
  var message = document.createElement("p");
  var isDonationForm = form.querySelector("#amount") !== null;

  message.className = "form-message";
  message.textContent = isDonationForm
    ? "Thank you for your support. Your donation details have been received."
    : "Thank you for contacting us. We will get back to you soon.";

  form.appendChild(message);
}

function enhanceDomWithJQuery($) {
  $("body").addClass("js-enhanced");
  $("section").each(function (index) {
    $(this).attr("data-section-number", index + 1);
  });

  $("section img").not(".leaflet-container img").attr("title", "Open image");
}

function initializeJQueryAccordion($) {
  $(".jquery-accordion .accordion-panel").hide();
  $(".jquery-accordion .accordion-toggle").attr("aria-expanded", "false");

  $(".jquery-accordion .accordion-toggle").on("click", function () {
    var $button = $(this);
    var $panel = $button.next(".accordion-panel");
    var isOpen = $panel.is(":visible");

    $(".jquery-accordion .accordion-panel").slideUp(200);
    $(".jquery-accordion .accordion-toggle").attr("aria-expanded", "false");

    if (!isOpen) {
      $panel.slideDown(200);
      $button.attr("aria-expanded", "true");
    }
  });
}

function initializeJQueryTabs($) {
  $(".jquery-tabs .tab-button").on("click", function () {
    var $button = $(this);
    var tabId = $button.data("tab");
    var $tabs = $button.closest(".jquery-tabs");

    $tabs.find(".tab-button").removeClass("active").attr("aria-selected", "false");
    $tabs.find(".tab-panel").removeClass("active");

    $button.addClass("active").attr("aria-selected", "true");
    $tabs.find("#" + tabId).addClass("active");
  });
}

function initializeProjectSorting($) {
  var $list = $("#sortableProjects");
  var $sort = $("#projectSort");

  if (!$list.length || !$sort.length) {
    return;
  }

  var projects = [
    {
      name: "Food Relief Programme",
      category: "Food",
      priority: 5,
      text: "Food parcels and meal support for families facing food insecurity."
    },
    {
      name: "Education Support Programme",
      category: "Education",
      priority: 4,
      text: "School supplies, learning materials, and tutoring support for learners."
    },
    {
      name: "Community Clean-Up Campaign",
      category: "Environment",
      priority: 3,
      text: "Clean-up initiatives for safer and healthier shared spaces."
    },
    {
      name: "Awareness & Outreach Programme",
      category: "Outreach",
      priority: 2,
      text: "Community education about health, wellbeing, and support services."
    }
  ];

  function renderProjects(items) {
    $list.empty();

    $.each(items, function (_, project) {
      $("<article>", { class: "project-card" })
        .append($("<span>").text(project.category + " | Priority " + project.priority))
        .append($("<h3>").text(project.name))
        .append($("<p>").text(project.text))
        .appendTo($list);
    });
  }

  $sort.on("change", function () {
    var value = $(this).val();
    var sortedProjects = projects.slice();

    if (value === "name") {
      sortedProjects.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    if (value === "priority") {
      sortedProjects.sort(function (a, b) {
        return b.priority - a.priority;
      });
    }

    renderProjects(sortedProjects);
  });

  renderProjects(projects);
}

function loadDynamicCommunityContent($) {
  var $updates = $("#dynamicUpdates");

  if (!$updates.length) {
    return;
  }

  var fallbackUpdates = [
    {
      title: "Food Relief Drive",
      category: "Donations",
      text: "Food parcels are being prepared for families who need extra support this month."
    },
    {
      title: "Volunteer Sign-Ups",
      category: "Volunteering",
      text: "New volunteers can join outreach, clean-up, and awareness activities."
    },
    {
      title: "School Support",
      category: "Education",
      text: "Learning materials are being collected for learners in local communities."
    }
  ];

  function renderUpdates(updates) {
    $updates.empty();

    $.each(updates, function (_, update) {
      $("<article>", { class: "dynamic-card" })
        .append($("<span>").text(update.category))
        .append($("<h3>").text(update.title))
        .append($("<p>").text(update.text))
        .appendTo($updates);
    });
  }

  $updates.html("<p>Loading updates...</p>");

  $.getJSON("data/community-content.json")
    .done(function (content) {
      renderUpdates(content.updates || fallbackUpdates);
    })
    .fail(function () {
      renderUpdates(fallbackUpdates);
    });
}

function initializeGalleryLightbox($) {
  var $lightbox = $("<div>", {
    class: "lightbox",
    role: "dialog",
    "aria-hidden": "true",
    "aria-label": "Image preview"
  });
  var $close = $("<button>", {
    type: "button",
    class: "lightbox-close",
    text: "x",
    "aria-label": "Close image preview"
  });
  var $image = $("<img>", { alt: "" });

  $lightbox.append($close, $image).appendTo("body");

  $("section img").not(".leaflet-container img").css("cursor", "pointer").on("click", function () {
    var $clickedImage = $(this);

    $image.attr("src", $clickedImage.attr("src"));
    $image.attr("alt", $clickedImage.attr("alt") || "Gallery image");
    $lightbox.addClass("open").attr("aria-hidden", "false");
    $close.trigger("focus");
  });

  $close.on("click", function () {
    closeLightbox($, $lightbox);
  });

  $lightbox.on("click", function (event) {
    if (event.target === this) {
      closeLightbox($, $lightbox);
    }
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && $lightbox.hasClass("open")) {
      closeLightbox($, $lightbox);
    }
  });
}

function closeLightbox($, $lightbox) {
  $lightbox.removeClass("open").attr("aria-hidden", "true");
}

function initializeJQueryFormFeedback($) {
  $("form input, form textarea, form select").on("input change", function () {
    $(this).toggleClass("has-value", $(this).val().trim() !== "");
  });
}

function initializeScrollAnimations() {
  var animatedElements = document.querySelectorAll("section, footer");

  animatedElements.forEach(function (element, index) {
    element.classList.add("animate-on-scroll");
    element.style.transitionDelay = Math.min(index * 40, 240) + "ms";
  });

  if (!("IntersectionObserver" in window)) {
    animatedElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  animatedElements.forEach(function (element) {
    observer.observe(element);
  });
}
