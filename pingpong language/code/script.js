document.addEventListener('DOMContentLoaded', () => {
  // prevent scroll restoration from browser
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ensure scroll to top
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, 10); // slight delay to ensure layout is ready
});


// Get elements
var inputField = document.getElementById('input');
var outputDiv = document.querySelector('.output');
const translateBtn = document.querySelector('.translate-b');

const clearBtn = document.querySelector('.click');



clearBtn.addEventListener('click', () => {
    inputField.value = '';
    outputDiv.textContent = '......';
});

// On button click
translateBtn.addEventListener('click', translateInput);

// On Enter key press
inputField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        translateInput();
    }
});

function textToBinary(text) {
    return text
        .split('')
        .map(char => {
            const binary = char.charCodeAt(0).toString(2); // convert to binary
            return binary.padStart(8, '0'); // make sure it’s 8 bits
        })
        .join('');
}

function binaryToPingPong(binaryStr) {
    return binaryStr
        .split('')
        .map(bit => (bit === '1' ? 'ping' : 'pong'))
        .join(' ');
}

function translateInput() {
    const userInput = inputField.value;
    if (userInput.trim() === '') return;

    const binaryStr = textToBinary(userInput);
    const pingPongWords = binaryToPingPong(binaryStr).split(' ');

    outputDiv.textContent = ''; // Clear current output

    let i = 0;
    const typingInterval = setInterval(() => {
        if (i < pingPongWords.length) {
            outputDiv.textContent += pingPongWords[i] + ' ';
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, 25); // 150ms per word — adjust speed as needed
}

function rearrangeForDesktop() {
    const isDesktop = window.matchMedia("(min-width: 601px)").matches;

    const master = document.querySelector('.master-container');
    const head = document.querySelector('.head');
    const top = document.querySelector('.top');
    const bottom = document.querySelector('.bottom');

    if (isDesktop && master && head && top && bottom) {
        // Only proceed if main-content isn't already added
        if (!master.querySelector('.main-content')) {
            // Remove head from top and insert it above top
            if (top.contains(head)) {
                top.removeChild(head);
                master.insertBefore(head, top);
            }

            // Create main-content wrapper
            const mainContent = document.createElement('div');
            mainContent.classList.add('main-content');

            // Insert mainContent before top
            master.insertBefore(mainContent, top);

            // Move top and bottom into mainContent
            mainContent.appendChild(top);
            mainContent.appendChild(bottom);
        }
    } else if (!isDesktop && master && !top.contains(head)) {
        // Revert to mobile structure

        const mainContent = master.querySelector('.main-content');
        if (mainContent) {
            // Move top and bottom back to master
            master.insertBefore(top, mainContent);
            master.insertBefore(bottom, mainContent);
            master.removeChild(mainContent);
        }

        // Move head back inside top at the beginning
        top.insertBefore(head, top.firstChild);
    }
}

window.addEventListener('resize', rearrangeForDesktop);
window.addEventListener('DOMContentLoaded', rearrangeForDesktop);

window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);

    const delayBeforeStart = 3000; // 3 seconds before transforming
    const wordChangeDelay = 400; // delay between each word
    const comingTextElements = document.querySelectorAll('.coming-soon .text-dejanire');

    setTimeout(() => {
        comingTextElements.forEach(el => {
            const originalText = el.textContent;
            const words = originalText.split(/\s+/);

            const scrollDelayAfterWords = 1500; // ← you can adjust this (in milliseconds)

            words.forEach((_, index) => {
                setTimeout(() => {
                    words[index] = Math.random() > 0.5 ? 'ping' : 'pong';
                    el.textContent = words.join(' ');

                    // Trigger scroll after the last word changes, with delay
                    if (index === words.length - 1) {
                        setTimeout(() => {
                            scrollToTypingSection();
                        }, scrollDelayAfterWords);
                    }
                }, wordChangeDelay * index);
            });
        });
    }, delayBeforeStart);

    function scrollToTypingSection() {
        const typingSection = document.querySelector('.typing');
        typingSection.scrollIntoView({ behavior: 'smooth' });

        // Lock scroll back to intro
        document.body.style.overflow = 'hidden'; // temporarily disable scrolling
        setTimeout(() => {
            window.scrollTo(0, typingSection.offsetTop);
            document.body.style.overflowY = 'auto'; // re-enable scroll below only
            window.addEventListener('scroll', preventScrollUp);
        }, 2000); // wait for scroll animation to complete
    }

    function preventScrollUp() {
        const typingTop = document.querySelector('.typing').offsetTop;
        if (window.scrollY < typingTop) {
            window.scrollTo({ top: typingTop });
        }
    }
});