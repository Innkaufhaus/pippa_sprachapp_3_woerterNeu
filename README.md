# Speech Learning Application

A Next.js application designed to help users learn words and sentences through speech synthesis. The application provides an interactive interface for practicing pronunciation with separate controls for words and complete sentences.

## Features

- Word and sentence practice with speech synthesis
- Separate controls for word and full sentence pronunciation
- Random word selection for varied practice
- Admin interface for managing word-sentence pairs
- Modern, responsive UI with Comic Neue font
- Detailed logging for speech synthesis events

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Innkaufhaus/pippa_sprachapp_3woerter.git
cd pippa_sprachapp_3woerter
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

1. **Main Interface**
   - Click "Start" to begin practicing
   - Use "Word Only" button to hear the current word
   - Use "Full Sentence" button to hear the complete sentence
   - Click "Next" to move to a different word-sentence pair

2. **Admin Interface**
   - Access the admin panel via the "Admin" button
   - Add, edit, or remove word-sentence pairs
   - Configure speech settings (rate, pitch)

## Deployment

The application is configured for deployment on render.com:

1. Connect your GitHub repository to render.com
2. Create a new Web Service
3. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Node.js environment

## Technology Stack

- [Next.js 14](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Speech Synthesis

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/Innkaufhaus/pippa_sprachapp_3woerter](https://github.com/Innkaufhaus/pippa_sprachapp_3woerter)
