Smart Bill Reader is a web-based application that allows users to upload bill or invoice images and extract important information automatically using OCR and AI.

## Features

- Upload bill or invoice images
- Supports JPG, PNG, and PDF files
- Extracts important information such as:
  - Vendor name
  - Invoice date
  - Total amount
  - Line items, when available
- Displays extracted information in the web interface

## How to Run Locally

Install Docker Desktop on your computer.

Clone or download this repository:
git clone https://github.com/traceandmark/Smart-Bill-Reader.git
cd smart-bill-reader

Create a .env file in the project folder and add your Gemini API key:
GEMINI_API_KEY=your_api_key_here

Start the application:
docker compose up --build
Open http://localhost:5001 in your browser.

Test the application using the sample bills included in the repository. Example images of a Meralco bill and Manila Water bill are provided for testing.

When finished, stop the application:
docker compose down

## AI Service

The project uses Google Gemini as its AI service. I chose Gemini because, aside from ChatGPT, it is the AI service I am most familiar with. During development, I initially considered using ChatGPT, but I encountered limitations related to file/image processing and usage. Because the application is designed to process uploaded bills and invoices, I decided to switch to Gemini.

This required rewriting parts of the code to work with the Gemini API, but the switch allowed me to continue developing the application's document-processing functionality without relying on the limitations I encountered with my initial approach.

## Trade-Offs

I initially tested an OCR solution to extract text from the uploaded bills. The OCR was able to successfully read the contents of the documents, but I encountered difficulties determining which parts of the extracted text should be displayed as specific information.

For example, the OCR could read the name of the company from a bill, but it did not automatically identify whether that text represented the vendor name. Similarly, it could read multiple numbers from the document without knowing which one represented the total amount, billing period, account number, or other relevant information.

Because of this, I used Gemini to help interpret the OCR output and identify the information that should be presented to the user.

I used Python, Docker, HTML, CSS, and JavaScript for the project because these are technologies I am already familiar with and have previously worked with. I also explored other technologies mentioned in the project instructions, but ultimately decided to use the ones I was most comfortable with so I could focus on building and completing the application.

This was also a learning experience for me. While I was able to implement the application using technologies I already knew, working on the project showed me that there are still many areas of web development, Docker, OCR, and AI integration that I need to learn more about.
