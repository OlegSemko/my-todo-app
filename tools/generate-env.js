const { writeFileSync } = require('fs');

const file = `
export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  supabaseUrl: "${process.env.SUPABASE_URL}",
  supabaseAnonKey: "${process.env.SUPABASE_ANON_KEY}"
};
`;

writeFileSync('./src/environments/environment.ts', file);
console.log('Environment created.');
