// tailwind-init.js
import { init } from 'tailwindcss/lib/cli/init.js';
import fs from 'fs';

// Génère tailwind.config.js
init({ postcss: true }).then(() => console.log('Tailwind config created!'));