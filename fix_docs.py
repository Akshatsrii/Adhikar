import re

with open('backend/src/routes/documents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "import { aiFetch } from '../utils/aiClient.js'",
    "import { aiFetch } from '../utils/aiClient.js'\nimport { fileTypeFromBuffer } from 'file-type'"
)

validation = """
    if (!req.file) {
      throw new AppError('No file uploaded', 422)
    }

    const type = await fileTypeFromBuffer(req.file.buffer)
    if (!type || !['image/jpeg', 'image/png', 'application/pdf'].includes(type.mime)) {
      throw new AppError('Invalid file type. Only JPEG, PNG, and PDF are allowed.', 415)
    }
"""

text = text.replace(
    "    if (!req.file) {\n      throw new AppError('No file uploaded', 422)\n    }",
    validation.strip()
)

with open('backend/src/routes/documents.ts', 'w', encoding='utf-8') as f:
    f.write(text)
