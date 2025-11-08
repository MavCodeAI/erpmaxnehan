// Quick API Key Fix Script
// Run this in your browser console on the test-supabase.html page

// This will copy the exact working API key format
const workingKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4bXZnZGxvZ25vcnBwbWdldXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTg1NzcsImV4cCI6MjA3ODE3NDU3N30.SECRET_KEY_HERE';

// Copy this line and replace line 5 in lib/supabase.ts:
const codeToCopy = `const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '${workingKey}'`;

console.log('Copy this line and replace line 5 in lib/supabase.ts:');
console.log(codeToCopy);

// Copy to clipboard
navigator.clipboard.writeText(codeToCopy);
console.log('✅ Copied to clipboard!');
