let chart = null;
        function resetCanvas() {
    // Get the canvas and reset its width and height
            const canvas = document.getElementById('televisionChart');
            canvas.width = 1600;  // Set fixed width
            canvas.height = 800; // Set fixed height
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        }

document.addEventListener('DOMContentLoaded', function() {
    
    const tilesContainer = document.querySelector('.tiles');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const tiles = document.querySelectorAll('.tile');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closeBtn');
    const submitBtn = document.getElementById('submitBtn');
    let isPopupOpen = false; // To track if the popup is open
    
    if (leftArrow && rightArrow && tilesContainer) {
        leftArrow.addEventListener('click', () => {
            tilesContainer.scrollLeft -= 1000; // Scroll left
        });

        rightArrow.addEventListener('click', () => {
            tilesContainer.scrollLeft += 1000; // Scroll right
        });
    } else {
        console.error('Elements not found!');
    }

    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            if (!isPopupOpen) {
                // Change background on hover if no popup is open
                document.body.style.backgroundImage = this.getAttribute('data-image');
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            }
        });

        tile.addEventListener('mouseleave', function() {
            if (!isPopupOpen) {
                // Reset background when mouse leaves if no popup is open
                document.body.style.backgroundImage = '';
            }
        });

        tile.addEventListener('click', function() {
            const CH = this.getAttribute('CH'); // Get the game ID
            openPopup(CH); // Open the popup for the specific game

            // Set the background on click
            document.body.style.backgroundImage = this.getAttribute('data-image');
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            // Mark popup as open
            isPopupOpen = true; 
        });
    });

    // Close button for the popup
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none'; // Close the popup
        document.querySelector('.switch-home').classList.remove('blur'); // Remove blur if applied
        isPopupOpen = false; // Reset popup state when closing
        // Optionally reset background to default or a specific state
    });

    // Submit button for the popup
    submitBtn.addEventListener('click', function() {
        const inputValue = userInput.value;
        alert(`You entered: ${inputValue}`);
        popup.style.display = 'none'; 
        isPopupOpen = false; // Reset popup state when submitting
        // Optionally reset background to default or a specific state
        userInput.value = ''; 
    });


    // Function to open the popup with specific game content
    function openPopup(CH) {
        // Use if statements to check which game was clicked
        if (CH === 'CH7') {
            popup.innerHTML = ` <h2>CH7</h2>
                <h1>Television Viewer Prediction</h1>
            <label for="endMonth">End Month:</label>
            <input type="number" id="endMonth" min="1" max="12" maxlength="2" required><br>
        <label for="endYear">End Year:</label>
        <input type="number" id="endYear" min="2024" maxlength="4" required>
        <br>
         <label>*note* "Prediction Start from October 2024"</label>
         <br><br>
        <button id="submitBtn" onclick="ch7()" >Predict</button> <button onclick="closePopup()" id="closeBtn">Close</button>`;
        }
        else if (CH === 'Mono29') {
            popup.innerHTML = ` <h2>MONO29</h2>
                <h1>Television Viewer Prediction</h1>
            <label for="endMonth">End Month:</label>
            <input type="number" id="endMonth" min="1" max="12" maxlength="2" required><br>
        <label for="endYear">End Year:</label>
        <input type="number" id="endYear" min="2024" maxlength="4" required>
        <br>
         <label>*note* "Prediction Start from October 2024"</label>
        <br><br>
        <button id="submitBtn" onclick="mono()" >Predict</button> <button onclick="closePopup()" id="closeBtn">Close</button>`;
        } 
        else if (CH === 'TNN') {
            popup.innerHTML = ` <h2>TNN24</h2>
                <h1>Television Viewer Prediction</h1>
            <label for="endMonth">End Month:</label>
            <input type="number" id="endMonth" min="1" max="12" maxlength="2" required><br>
        <label for="endYear">End Year:</label>
        <input type="number" id="endYear" min="2024" maxlength="4" required>
        <br>
         <label>*note* "Prediction Start from October 2024"</label>
        <br><br>
        <button id="submitBtn" onclick="tnn()" >Predict</button> <button onclick="closePopup()" id="closeBtn">Close</button>`;
        } 
        else if (CH === 'WP') {
            popup.innerHTML = ` <h2>Workpoint</h2>
                <h1>Television Viewer Prediction</h1>
            <label for="endMonth">End Month:</label>
            <input type="number" id="endMonth" min="1" max="12" maxlength="2" required><br>
        <label for="endYear">End Year:</label>
        <input type="number" id="endYear" min="2024" maxlength="4" required>
        <br>
         <label>*note* "Prediction Start from October 2024"</label>
        <br><br>
        <button id="submitBtn" onclick="wp()" >Predict</button> <button onclick="closePopup()" id="closeBtn">Close</button>`;
        } 
        else {
            popup.innerHTML = `<br><br><br><br><br><h2>COMING SOON</h2> <button onclick="closePopup()" id="closeBtn">Close</button>`;
            document.getElementById('closeBtn')?.addEventListener('click', function() {
                popup.style.display = 'none'; // Close the popup
                document.querySelector('.switch-home').classList.remove('blur'); // Remove blur if applied
                isPopupOpen = false; // Reset popup state when closing
            });
        }
        popup.style.display = 'block'; // Show the popup
        document.querySelector('.switch-home').classList.add('blur');

       
        // Reassign the event listeners for the new buttons
        document.getElementById('submitBtn')?.addEventListener('click', function() {
            popup.style.display = 'none'; 
            //isPopupOpen = false; // Reset popup state when submitting
            document.querySelector('.switch-home').classList.remove('blur');    
            isPopupOpen = false;
        });

        document.getElementById('closeBtn')?.addEventListener('click', function() {
            popup.style.display = 'none'; // Close the popup
            document.querySelector('.switch-home').classList.remove('blur'); // Remove blur if applied
            //isPopupOpen = false; // Reset popup state when closing
        });
        
        
    }
});

window.addEventListener('scroll', function () {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let windowHeight = window.innerHeight;
    let maxScroll = document.body.scrollHeight - windowHeight;
    
    // Calculate opacity based on scroll position
    let opacity = scrollTop / maxScroll;

    // Apply the opacity to the background div
    document.querySelector('.background').style.backgroundColor = `rgba(37, 37, 37, ${opacity})`;
});