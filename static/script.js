const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const uploadBox = document.getElementById("uploadBox");
const fileName = document.getElementById("fileName");
const processButton = document.getElementById("processButton");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const results = document.getElementById("results");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
];


// When a file is selected
fileInput.addEventListener("change", () => {
    handleFile(fileInput.files[0]);
});


// Drag and drop
uploadBox.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadBox.classList.add("dragging");
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("dragging");
});

uploadBox.addEventListener("drop", (event) => {
    event.preventDefault();

    uploadBox.classList.remove("dragging");

    const file = event.dataTransfer.files[0];

    if (file) {
        fileInput.files = event.dataTransfer.files;
        handleFile(file);
    }
});


// File validation
function handleFile(file) {

    if (!file) {
        return;
    }

    clearError();

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        showError(
            "Invalid file type. Please upload a JPG, PNG, or PDF file."
        );

        fileInput.value = "";
        fileName.textContent = "";

        return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        showError(
            "File is too large. Please upload a file smaller than 10 MB."
        );

        fileInput.value = "";
        fileName.textContent = "";

        return;
    }

    fileName.textContent = `Selected file: ${file.name}`;
}


// Submit form
uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
        showError("Please select a bill or invoice first.");
        return;
    }

    clearError();

    // Show loading state
    loading.classList.remove("hidden");
    results.classList.add("hidden");

    processButton.disabled = true;
    processButton.textContent = "Processing...";

    const formData = new FormData();

    formData.append("file", file);

    try {

        const response = await fetch("/api/process-bill", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Something went wrong while processing the document."
            );
        }

        displayResults(result.data);

    } catch (error) {

        showError(error.message);

    } finally {

        loading.classList.add("hidden");

        processButton.disabled = false;
        processButton.textContent = "Process Document";
    }
});


// Display extracted information
function displayResults(data) {

    document.getElementById("vendorName").textContent =
        data.vendor_name || "Not found";

    document.getElementById("invoiceDate").textContent =
        data.invoice_date || "Not found";

    document.getElementById("totalAmount").textContent =
        formatAmount(data.total_amount);

    document.getElementById("taxAmount").textContent =
        formatAmount(data.tax_amount);


    const lineItems = document.getElementById("lineItems");

    lineItems.innerHTML = "";

    if (!data.line_items || data.line_items.length === 0) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="2">No line items found.</td>
        `;

        lineItems.appendChild(row);

    } else {

        data.line_items.forEach(item => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHtml(item.description)}</td>
                <td>${formatAmount(item.amount)}</td>
            `;

            lineItems.appendChild(row);
        });
    }

    results.classList.remove("hidden");
}


// Format money
function formatAmount(amount) {

    if (amount === null || amount === undefined) {
        return "Not found";
    }

    return Number(amount).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}


// Display an error
function showError(message) {

    error.textContent = message;
    error.classList.remove("hidden");
}


// Clear error
function clearError() {

    error.textContent = "";
    error.classList.add("hidden");
}


// Prevent HTML from being inserted into the page
function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}