document.addEventListener('DOMContentLoaded', () => {
  // AOS animations initialization removed

  // DOM Elements
  const btnLocate = document.getElementById('btnLocate');
  const locText = document.getElementById('locText');
  const mapFrame = document.getElementById('mapFrame');
  const btnSubscribe = document.getElementById('btnSubscribe');
  const msgEmail = document.getElementById('msgEmail');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('form-status');
  const faqToggles = document.querySelectorAll('.faq-toggle');

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header if needed
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Interactive Rating System
  const setupRatingSystem = () => {
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';
    ratingContainer.innerHTML = `
      <h3>Rate Your Experience</h3>
      <div class="stars-container">
        <i class="far fa-star" data-rating="1"></i>
        <i class="far fa-star" data-rating="2"></i>
        <i class="far fa-star" data-rating="3"></i>
        <i class="far fa-star" data-rating="4"></i>
        <i class="far fa-star" data-rating="5"></i>
      </div>
      <p class="rating-text">Click to rate</p>
    `;
    
    // Add to page after the contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.parentNode.insertBefore(ratingContainer, contactForm.nextSibling);
      
      // Add event listeners to stars
      const stars = ratingContainer.querySelectorAll('.fa-star');
      const ratingText = ratingContainer.querySelector('.rating-text');
      
      stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseover', () => {
          const rating = parseInt(star.getAttribute('data-rating'));
          updateStars(stars, rating, 'hover');
          updateRatingText(ratingText, rating, 'hover');
        });
        
        // Mouse leave effect
        star.addEventListener('mouseleave', () => {
          const selectedRating = ratingContainer.getAttribute('data-selected-rating');
          if (selectedRating) {
            updateStars(stars, parseInt(selectedRating), 'selected');
            updateRatingText(ratingText, parseInt(selectedRating), 'selected');
          } else {
            resetStars(stars);
            ratingText.textContent = 'Click to rate';
          }
        });
        
        // Click to rate
        star.addEventListener('click', () => {
          const rating = parseInt(star.getAttribute('data-rating'));
          ratingContainer.setAttribute('data-selected-rating', rating);
          updateStars(stars, rating, 'selected');
          updateRatingText(ratingText, rating, 'selected');
          
          // Show thank you message with animation
          ratingText.textContent = 'Thank you for your feedback!';
          ratingText.classList.add('thanks-animation');
          setTimeout(() => ratingText.classList.remove('thanks-animation'), 1000);
        });
      });
    }
  };
  
  // Helper functions for rating system
  const updateStars = (stars, rating, state) => {
    stars.forEach(star => {
      const starRating = parseInt(star.getAttribute('data-rating'));
      if (starRating <= rating) {
        star.className = 'fas fa-star';
        if (state === 'hover') {
          star.classList.add('star-hover');
        } else {
          star.classList.add('star-selected');
        }
      } else {
        star.className = 'far fa-star';
      }
    });
  };
  
  const resetStars = (stars) => {
    stars.forEach(star => {
      star.className = 'far fa-star';
    });
  };
  
  const updateRatingText = (element, rating, state) => {
    const texts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    
    element.textContent = texts[rating] || 'Click to rate';
    if (state === 'selected') {
      element.textContent += ' - Thanks for rating!';
    }
  };
  
  // Initialize rating system
  setupRatingSystem();
  
  // Animate elements when they come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.contact-info-card, .service-card, .faq-item');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
      }
    });
  };
  
  // Run on scroll
  window.addEventListener('scroll', animateOnScroll);
  // Run once on page load
  animateOnScroll();

  // Handle FAQ accordion functionality
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      // Toggle active class on the button
      toggle.classList.toggle('active');
      
      // Find the parent FAQ item
      const faqItem = toggle.closest('.faq-item');
      
      // Find the answer section
      const answer = faqItem.querySelector('.faq-answer');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').classList.remove('active');
          item.querySelector('.faq-toggle').classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      
      // Toggle the answer visibility with enhanced animation
      if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Email subscription with enhanced validation and feedback
  btnSubscribe?.addEventListener('click', () => {
    if (!msgEmail.value) return;
    
    // Email validation
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    if (!isValidEmail(msgEmail.value)) {
      msgEmail.classList.add('shake');
      setTimeout(() => msgEmail.classList.remove('shake'), 500);
      locText.textContent = 'Please enter a valid email address';
      return;
    }
    
    const prev = btnSubscribe.textContent;
    btnSubscribe.disabled = true;
    btnSubscribe.textContent = 'Sent!';
    locText.textContent = 'Directions sent to your email!';
    msgEmail.classList.add('valid');
    
    setTimeout(() => { 
      btnSubscribe.disabled = false; 
      btnSubscribe.textContent = prev; 
      msgEmail.value = ''; 
      msgEmail.classList.remove('valid');
    }, 1500);
  });

  // Handle geolocation
  btnLocate?.addEventListener('click', () => {
    if (!navigator.geolocation) { 
      locText.textContent = 'Geolocation is not supported by your browser.'; 
      return; 
    }
    
    locText.textContent = 'Locating your position...';
    btnLocate.disabled = true;
    
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      locText.textContent = `Your location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      mapFrame.src = `https://www.google.com/maps?q=${latitude},${longitude}&hl=auto&z=12&output=embed`;
      btnLocate.disabled = false;
    }, (err) => {
      locText.textContent = `Unable to retrieve your location (${err.message})`;
      btnLocate.disabled = false;
    }, { 
      enableHighAccuracy: true, 
      timeout: 10000, 
      maximumAge: 30000 
    });
  });

  // Form validation and submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic form validation
      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      if (!fullName.value || !email.value || !message.value) {
        showFormStatus('Please fill in all required fields', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showFormStatus('Please enter a valid email address', 'error');
        return;
      }
      
      // Disable submit button during submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span><i class="ri-loader-4-line ri-spin"></i>';
      
      // Collect form data
      const formData = new FormData(contactForm);
      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      const json = JSON.stringify(object);
      
      // Send form data
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          showFormStatus('Thank you! Your message has been sent successfully.', 'success');
          contactForm.reset();
        } else {
          console.log(response);
          showFormStatus('Oops! Something went wrong. Please try again later.', 'error');
        }
      })
      .catch(error => {
        console.log(error);
        showFormStatus('Oops! There was a problem submitting your form', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
    });
  }
  
  // Helper function to show form status messages
  function showFormStatus(message, type) {
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = 'form-status';
    formStatus.classList.add(type);
    formStatus.style.display = 'block';
    
    // Scroll to form status
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide status message after 5 seconds
    setTimeout(() => {
      formStatus.style.display = 'none';
    }, 5000);
  }
});

