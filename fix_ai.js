const fs = require('fs');

let content = fs.readFileSync('backend/src/routes/ai.ts', 'utf-8');

// First remove the old error throw
content = content.replace(/    if \(\!aiResponse\.ok\) \{\n      const detail = await aiResponse\.text\(\)\.catch\(\(\) => ''\)\n      throw new AppError\(\`AI service error\: \$\{detail \|\| aiResponse\.statusText\}\`, 502\)\n    \}/, "");

// Then replace the success handler
const target = `    const data = await aiResponse.json()
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})`;

const replacement = `    let data;
    if (aiResponse.ok) {
      data = await aiResponse.json();
    } else {
      // Fallback to direct Gemini API call
      console.log('AI Service offline, falling back to direct Gemini API...');
      if (!env.geminiApiKey) {
        throw new AppError('AI service offline and no fallback Gemini Key found', 502);
      }
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(env.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = \`You are Adhikar AI, a helpful government scheme assistant for Indian citizens.
User profile: \${JSON.stringify(user.profile)}
User question: \${query}
Provide a clear, helpful, and concise response in markdown.\`;
      
      const result = await model.generateContent(prompt);
      data = { answer: result.response.text(), sources: [] };
    }
    
    res.status(200).json(data)
  } catch (err) {
    console.error('AI Route Error:', err);
    next(err)
  }
})`;

content = content.replace(target, replacement);
fs.writeFileSync('backend/src/routes/ai.ts', content);
