const { writeFileSync, mkdirSync } = require('fs');

mkdirSync('./src/environments', { recursive: true });

const file = `
export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  supabaseUrl: "${process.env.SUPABASE_URL}",
  supabaseKey: "${process.env.SUPABASE_KEY}"
};
`;

writeFileSync('./src/environments/environment.ts', file);
console.log('Environment created.');
