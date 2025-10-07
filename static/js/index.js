window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Remove tip interactions: no-op listeners cleanup
    $(document).off('click', '.input-toggle-btn');

    // Initialize video hover tooltips
    initializeVideoTooltips();

})

// Video hover tooltip functionality
function initializeVideoTooltips() {
    const tooltip = document.getElementById('global-tooltip');
    const tooltipImage = tooltip.querySelector('.tooltip-image');
    const tooltipText = tooltip.querySelector('.tooltip-text');
    let hoverTimeout;

    // Add hover listeners to all video items
    document.querySelectorAll('.video-item').forEach(videoItem => {
        videoItem.addEventListener('mouseenter', function(e) {
            clearTimeout(hoverTimeout);
            
            const conditionImage = this.getAttribute('data-condition-image');
            const conditionText = this.getAttribute('data-condition-text');
            
            // Update tooltip content
            if (conditionImage) {
                tooltipImage.src = conditionImage;
                tooltipImage.style.display = 'block';
            } else {
                tooltipImage.style.display = 'none';
            }
            
            if (conditionText) {
                tooltipText.textContent = conditionText;
            }
            
            // Position tooltip
            positionTooltip(e, tooltip);
            
            // Show tooltip with delay
            hoverTimeout = setTimeout(() => {
                tooltip.classList.add('show');
            }, 300);
        });

        videoItem.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            tooltip.classList.remove('show');
        });

        videoItem.addEventListener('mousemove', function(e) {
            if (tooltip.classList.contains('show')) {
                positionTooltip(e, tooltip);
            }
        });
    });
}

function positionTooltip(e, tooltip) {
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.bottom + 15; // 15px gap below video
    
    // Ensure tooltip stays within viewport
    if (left < 10) {
        left = 10;
    } else if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
    }
    
    // If tooltip would go below viewport, show it above the video
    if (top + tooltipRect.height > viewportHeight - 10) {
        top = rect.top - tooltipRect.height - 15;
        // Update arrow direction
        tooltip.style.setProperty('--arrow-direction', 'down');
    } else {
        tooltip.style.setProperty('--arrow-direction', 'up');
    }
    
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}
