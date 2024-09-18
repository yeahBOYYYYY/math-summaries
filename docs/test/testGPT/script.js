document.addEventListener('DOMContentLoaded', function() {
    const infoButtons = document.querySelectorAll('.info-button');
    const infoBoxOverlay = document.querySelector('.info-box-overlay');
    const infoContent = document.querySelector('.info-content');
    const closeButton = document.querySelector('.close-button');

    infoButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const infoFile = button.dataset.info;
            fetch(infoFile)
                .then(response => response.text())
                .then(data => {
                    infoContent.innerHTML = data;
                    infoBoxOverlay.style.display = 'flex';
                })
                .catch(error => console.error('Error fetching info:', error));
        });
    });

    closeButton.addEventListener('click', function() {
        infoBoxOverlay.style.display = 'none';
    });
});


/*
document.addEventListener('DOMContentLoaded', function() {
    const infoButtons = document.querySelectorAll('.info-button');
    const infoBoxOverlay = document.querySelector('.info-box-overlay');
    const infoContent = document.querySelector('.info-content');
    const closeButton = document.querySelector('.close-button');

    infoButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const course = button.dataset.course;
            fetch(`./coursesInfo/${course}.txt`)
                .then(response => response.text())
                .then(data => {
                    infoContent.textContent = data;
                    infoBoxOverlay.style.display = 'flex';
                })
                .catch(error => console.error('Error fetching info:', error));
        });
    });

    closeButton.addEventListener('click', function() {
        infoBoxOverlay.style.display = 'none';
    });
});
*/