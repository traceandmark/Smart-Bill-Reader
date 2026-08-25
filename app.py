from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
import os
import json

app = Flask(__name__)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/process-bill", methods=["POST"])
def process_bill():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "No file was uploaded."
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "Please select a file."
        }), 400

    try:

        file_bytes = file.read()

        prompt = """
Analyze this bill or invoice.

Extract the information into JSON.

Use this exact structure:

{
    "vendor_name": null,
    "invoice_date": null,
    "total_amount": null,
    "tax_amount": null,
    "line_items": [
        {
            "description": "string",
            "amount": 0
        }
    ]
}

Rules:
- Return ONLY valid JSON.
- Do not include markdown or ```json.
- Use null if vendor name, invoice date, total amount, or tax amount cannot be found.
- total_amount and tax_amount must be numbers, not strings.
- Extract all visible line items when possible.
- Each line item must contain its description and final amount.
- Do not invent information that is not visible in the document.
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=file_bytes,
                    mime_type=file.mimetype
                )
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        data = json.loads(response.text)

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as error:

        print("Gemini Error:", repr(error), flush=True)

        return jsonify({
            "success": False,
            "message": "Unable to process the document."
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )