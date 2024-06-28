document.addEventListener('DOMContentLoaded', function() {
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const learnMoreButton = card.querySelector('button');
        learnMoreButton.addEventListener('click', function() {
            const eventImgSrc = card.querySelector('img').src;
            const eventName = card.querySelector('h2').textContent;

            // Create a modal or popup to show event details
            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `
                <div class="popup-content">
                    <span class="close">&times;</span>
                    <img src="${eventImgSrc}" alt="${eventName}">
                    <h2>${eventName}</h2>
                    <p>Event details here...</p>
                </div>
            `;

            // Append popup to the body
            document.body.appendChild(popup);

            // Close popup when close button (x) is clicked
            const closeButton = popup.querySelector('.close');
            closeButton.addEventListener('click', function() {
                popup.remove();
            });
        });
    });

    const initialAppOptions = `
        <option value="" disabled selected>Select App</option>
        <option value="ECPAY">ECPAY</option>
        <option value="G-CASH">G-CASH</option>
        <option value="PAYMAYA">PAYMAYA</option>
    `;

    async function toggleReferenceNumber() {
        const paymentMethod = document.getElementById("paymentOptions").value;
        const referenceNumberInput = document.getElementById("referenceNumber");
        const appPayment = document.getElementById("appOptions");

        if (paymentMethod === "Cash") {
            referenceNumberInput.type = "text";
            referenceNumberInput.value = "Cash Payment";
            referenceNumberInput.disabled = true;
            referenceNumberInput.placeholder = "Cash Payment";
            appPayment.value = "Cash Payment";
            appPayment.disabled = true;
            appPayment.innerHTML = '<option disabled selected>Cash Payment</option>';
        } else {
            referenceNumberInput.value = "";
            referenceNumberInput.type = "number";
            referenceNumberInput.disabled = false;
            referenceNumberInput.placeholder = "Reference Number";
            appPayment.value = "";
            appPayment.innerHTML = initialAppOptions;
            appPayment.disabled = false;
        }
    }
    async function loading() {
        // Show the loader
        const loadingContainer = document.getElementById('loadingContainer');
        const verifyPopup = document.getElementById("verifyPopup");
        verifyPopup.style.visibility = "hidden";
        loadingContainer.style.visibility = "visible";
    
        // Simulate a delay of 2820 milliseconds
        await new Promise(resolve => setTimeout(resolve, 3000));
    
        // After the delay, hide the loader
        loadingContainer.style.visibility = "hidden";
    }
    

    function validateForm() {
        return document.getElementById("teacherOptions").value.trim() !== '' &&
            document.getElementById("eventOptions").value.trim() !== '' &&
            document.getElementById("studentNoInput").value.trim() !== '' &&
            document.getElementById("paymentOptions").value.trim() !== '' &&
            (document.getElementById("paymentOptions").value === "Cash" ? true : document.getElementById("appOptions").value.trim() !== '') &&
            document.getElementById("referenceNumber").value.trim() !== '';
    }
    function validateFormDetails(){
        return document.getElementById("studentNoInput").value.trim() !== '' &&
        document.getElementById("studentName").value.trim() !== '' &&
        document.getElementById("section").value.trim() !== '' &&
        document.getElementById("amount").value.trim() !== ''
    };

    function encodeData(data) {
        const mapping = {
            'a': 'x', 'b': 'y', 'c': 'z', 'd': 'a', 'e': 'b',
            'f': 'c', 'g': 'd', 'h': 'e', 'i': 'f', 'j': 'g',
            'k': 'h', 'l': 'i', 'm': 'j', 'n': 'k', 'o': 'l',
            'p': 'm', 'q': 'n', 'r': 'o', 's': 'p', 't': 'q',
            'u': 'r', 'v': 's', 'w': 't', 'x': 'u', 'y': 'v',
            'z': 'w', 'A': 'X', 'B': 'Y', 'C': 'Z', 'D': 'A',
            'E': 'B', 'F': 'C', 'G': 'D', 'H': 'E', 'I': 'F',
            'J': 'G', 'K': 'H', 'L': 'I', 'M': 'J', 'N': 'K',
            'O': 'L', 'P': 'M', 'Q': 'N', 'R': 'O', 'S': 'P',
            'T': 'Q', 'U': 'R', 'V': 'S', 'W': 'T', 'X': 'U',
            'Y': 'V', 'Z': 'W', '0': '9', '1': '8', '2': '7',
            '3': '6', '4': '5', '5': '4', '6': '3', '7': '2',
            '8': '1', '9': '0'
        };

        return data.split('').map(char => mapping[char] || char).join('');
    }

    async function generateQRCode() {
        const studentNo = document.getElementById("studentNoInput").value;
        const studentName = document.getElementById("studentName").value;
        const section = document.getElementById("section").value;
        const teacherName = document.getElementById("teacherOptions").value;
        const selectedEvent = document.getElementById("eventOptions").value;
        const amount = document.getElementById("amount").value;
        const paymentMethod = document.getElementById("paymentOptions").value;
        const paymentApp = paymentMethod === "Cash" ? "Cash Payment" : document.getElementById("appOptions").value;
        const referenceNumber = document.getElementById("referenceNumber").value;

        const studentData = `${studentNo},${studentName},${section},${teacherName},${selectedEvent},${amount},${paymentMethod},${paymentApp},${referenceNumber}`;
        const uniqueKey = "Hello123";
        const dataWithUniqueKey = `${studentData},${uniqueKey}`;

        if (studentData.length > 0) {
            const encodedData = encodeData(dataWithUniqueKey);
            document.getElementById("eventNamePlaceholder").textContent = selectedEvent;

            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
            document.getElementById("qrImage").src = qrCodeUrl;
            document.getElementById("qrPopup").classList.add("show-img");
        } else {
            alert("Please fill in all required fields.");
        }
    }

    function closePopup() {
        document.getElementById("studentDetailsForm").style.display = "none";
    }

    document.querySelector(".close-studNo-icon").addEventListener("click", closePopup);

    document.getElementById("paymentButton").addEventListener("click", function() {
        document.getElementById("studentDetailsForm").style.display = "block";
    });

    document.getElementById("paymentOptions").addEventListener("change", toggleReferenceNumber);

    document.getElementById("proceedButton").addEventListener("click", function() {
        event.preventDefault();
        if (!validateFormDetails()) {
            alert("Please fill in all required fields.");
            return;
        }
        document.getElementById("studentDetailsForm").style.display = "none";
        document.getElementById("overlay").style.visibility = "visible";
    });

    document.getElementById("closeBtnReceiptForm").addEventListener("click", function() {
        window.location.href = "index.html";
    });

    document.getElementById("submitButton").addEventListener("click", function(event) {
        event.preventDefault();
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }

        const studentNo = document.getElementById("studentNoInput").value;
        const studentName = document.getElementById("studentName").value;
        const section = document.getElementById("section").value;
        const teacherName = document.getElementById("teacherOptions").value;
        const paymentMethod = document.getElementById("paymentOptions").value;
        const referenceNumber = document.getElementById("referenceNumber").value;
        const selectedEvent = document.getElementById("eventOptions").value;
        const paymentApp = paymentMethod === "Cash" ? "Cash Payment" : document.getElementById("appOptions").value;
        const amount = document.getElementById("amount").value;

        document.getElementById("verifyStudentNo").innerText = studentNo;
        document.getElementById("verifyFullName").innerText = studentName;
        document.getElementById("verifySection").innerText = section;
        document.getElementById("verifyTeacher").innerText = teacherName;
        document.getElementById("verifyPaymentMethod").innerText = paymentMethod;
        document.getElementById("verifyReferenceNumber").innerText = referenceNumber;
        document.getElementById("verifyEvents").innerText = selectedEvent;
        document.getElementById("verifyPaymentApp").innerText = paymentApp;
        document.getElementById("verifyAmount").innerText = amount;

        document.getElementById("verifyPopup").style.visibility = "visible";
        document.getElementById("receipt-form-wrapper").style.visibility = "hidden";
    });

    document.getElementById("confirmSubmitButton").addEventListener("click",async function() {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        await loading();
        generateQRCode();
        document.getElementById("receipt-form-wrapper").style.visibility = "hidden";
        document.getElementById("verifyPopup").style.visibility = "hidden";
        document.getElementById("qrPopup").style.display = "block";
    });

    document.getElementById("cancelSubmitButton").addEventListener("click", function() {
        document.getElementById("verifyPopup").style.visibility = "hidden";
        document.getElementById("receipt-form-wrapper").style.visibility = "visible";
    });

    document.getElementById("downloadButton").addEventListener("click", function() {
        const studentNo = document.getElementById("studentNoInput").value;
        const qrImage = document.getElementById("qrImage");
    
        if (qrImage.src) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const img = new Image();
    
            img.crossOrigin = "anonymous"; // This is essential for handling cross-origin requests
    
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0);
    
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png");
                link.download = `${studentNo}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert("Downloaded successfully");
                window.location.href = "index.html"
            };
    
            img.onerror = function() {
                alert("Failed to load QR image. Please try again.");
            };
    
            img.src = qrImage.src;
        } else {
            alert("QR Code is not generated yet.");
        }
    });    
});
