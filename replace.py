import sys
import re

with open('frontend/public/landing-pages/kage.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = {
    'Kage — Where stillness reveals the unseen': 'Adhikar — Empowering the Citizens of India',
    'A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL.': 'Your personalized AI assistant for Indian Government Schemes. Navigate policies, check eligibility, and apply with confidence.',
    '<b>KAGE</b>': '<b>ADHIKAR</b>',
    'HIDDEN REALMS OF KYOTO': 'GOVERNMENT SCHEMES HUB',
    '<span>Temples</span>': '<span>Schemes</span>',
    '<span>Gardens</span>': '<span>Eligibility</span>',
    '<span>Rituals</span>': '<span>AI Assistant</span>',
    '<span>Afterlight</span>': '<span>Updates</span>',
    'Raising the mountain temple': 'Initializing Adhikar System',
    'Chapter 00 — The Hidden Gate': 'Chapter 00 — Welcome to Adhikar',
    'Where stillness<br>reveals the unseen.': 'Simplifying governance<br>for everyone.',
    'Where stillness<br>reveals the unseen': 'Simplifying governance<br>for everyone',
    'We walk the shadow paths': 'Navigating the complexity of policies',
    'of ancient Kyoto, where': 'for every Indian citizen, where',
    'every lantern is a memory': 'every scheme is an opportunity',
    'and every stone a silent teacher.': 'and every right is protected.',
    'Step into the courtyard': 'Explore your benefits',
    'Kage': 'Adhikar',
    'Kyoto': 'India'
}

for k, v in replacements.items():
    html = html.replace(k, v)

with open('frontend/public/landing-pages/kage.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Done replacing.')
