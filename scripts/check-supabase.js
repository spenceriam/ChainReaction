#!/usr/bin/env node

/**
 * Supabase Connection Checker
 * 
 * A simple script to verify that your Supabase connection is working.
 * Run with: node scripts/check-supabase.js
 */

// Load environment variables
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Get connection details from environment
const supabaseUrl = process.env.APP_SUPABASE_URL;
const supabaseKey = process.env.APP_SUPABASE_ANON_KEY;

// Print header
console.log('\n=== Supabase Connection Check ===\n');

// Check if environment variables are set
if (!supabaseUrl) {
  console.error('❌ Missing APP_SUPABASE_URL environment variable');
  process.exit(1);
}

if (!supabaseKey) {
  console.error('❌ Missing APP_SUPABASE_ANON_KEY environment variable');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`URL: ${supabaseUrl.substring(0, 15)}...`);
console.log(`Key: ${supabaseKey.substring(0, 5)}...${supabaseKey.substring(supabaseKey.length - 5)}`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function runTests() {
  console.log('\nTesting database connection...');
  
  try {
    // Test basic query
    const { data, error } = await supabase.from('words').select('word').limit(1);
    
    if (error) {
      console.error(`❌ Database query failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Successfully connected to database');
    console.log(`Sample data: ${JSON.stringify(data)}`);
    
    // Test auth service
    console.log('\nTesting auth service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error(`❌ Auth service connection failed: ${authError.message}`);
      return false;
    }
    
    console.log('✅ Successfully connected to auth service');
    console.log(`Session: ${authData.session ? 'Active' : 'None'}`);
    
    return true;
  } catch (err) {
    console.error(`❌ Connection error: ${err.message}`);
    return false;
  }
}

// Run tests and output result
runTests()
  .then(success => {
    console.log('\n=== Summary ===');
    if (success) {
      console.log('✅ All tests passed! Your Supabase connection is working correctly.');
    } else {
      console.log('❌ Some tests failed. Please check your Supabase configuration.');
      console.log('\nTroubleshooting tips:');
      console.log('1. Verify your APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY values');
      console.log('2. Check that your Supabase instance is running');
      console.log('3. Ensure the "words" table exists in your database');
      console.log('4. Check network connectivity and firewall settings');
    }
    console.log('');
  })
  .catch(err => {
    console.error(`\n❌ Unexpected error: ${err.message}`);
    process.exit(1);
  }); 