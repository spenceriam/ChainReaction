import { supabase } from './supabase';

/**
 * Simple utility to test the Supabase connection
 * Run this with: npx ts-node src/utils/test-connection.ts
 */
async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  console.log(`URL configured: ${process.env.APP_SUPABASE_URL ? 'Yes ✓' : 'No ✕'}`);
  console.log(`Key configured: ${process.env.APP_SUPABASE_ANON_KEY ? 'Yes ✓' : 'No ✕'}`);
  
  try {
    const { data, error } = await supabase.from('words').select('word').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    console.log('Sample data:', data);
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err instanceof Error ? err.message : String(err));
    return false;
  }
}

// Execute the test if this file is run directly
if (require.main === module) {
  testSupabaseConnection()
    .then(success => {
      if (!success) {
        console.log('\nTroubleshooting tips:');
        console.log('1. Check that APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY are set in your .env file');
        console.log('2. Verify these values match what you see in your Supabase dashboard');
        console.log('3. Ensure the "words" table exists in your Supabase project');
      }
      process.exit(success ? 0 : 1);
    });
}

export { testSupabaseConnection }; 