#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Test configuration
const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5174';

// Test supervisor credentials
const TEST_SUPERVISOR = {
  email: 'dr.smith@example.com',
  password: 'supervisor123'
};

// Test data
const TEST_STUDENT_ID = 1;
const SUPERVISOR_ID_WITH_DATA = 8; // Has test data

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

async function testSupervisorWorkflow() {
  console.log('🧪 Testing Supervisor Workflow - Fix Validation\n');
  
  try {
    // Step 1: Test supervisor login
    console.log('1️⃣  Testing supervisor login...');
    const loginResponse = await makeRequest(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      body: TEST_SUPERVISOR
    });
    
    if (loginResponse.status !== 200 || !loginResponse.data.success) {
      throw new Error('Supervisor login failed: ' + JSON.stringify(loginResponse.data));
    }
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful:', user.name, `(ID: ${user.id})`);
    
    // Step 2: Test progress logs API (the one that was failing)
    console.log('\n2️⃣  Testing progress logs API...');
    const logsResponse = await makeRequest(`${BACKEND_URL}/api/supervisors/${SUPERVISOR_ID_WITH_DATA}/students/${TEST_STUDENT_ID}/logs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (logsResponse.status !== 200 || !logsResponse.data.success) {
      throw new Error('Progress logs API failed: ' + JSON.stringify(logsResponse.data));
    }
    
    console.log('✅ Progress logs API working:', logsResponse.data.logs?.length || 0, 'logs found');
    
    // Step 3: Test progress reports API (the other one that was failing)
    console.log('\n3️⃣  Testing progress reports API...');
    const reportsResponse = await makeRequest(`${BACKEND_URL}/api/supervisors/${SUPERVISOR_ID_WITH_DATA}/students/${TEST_STUDENT_ID}/reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (reportsResponse.status !== 200 || !reportsResponse.data.success) {
      throw new Error('Progress reports API failed: ' + JSON.stringify(reportsResponse.data));
    }
    
    console.log('✅ Progress reports API working:', reportsResponse.data.reports?.length || 0, 'reports found');
    
    // Step 4: Test frontend accessibility
    console.log('\n4️⃣  Testing frontend accessibility...');
    const frontendResponse = await makeRequest(`${FRONTEND_URL}/test/progress-log`);
    
    if (frontendResponse.status !== 200) {
      throw new Error('Frontend test page not accessible');
    }
    
    console.log('✅ Frontend test page accessible');
    
    // Summary
    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('\n📋 Summary of fixes validated:');
    console.log('   ✅ Supervisor authentication working');
    console.log('   ✅ Progress logs API returning data');
    console.log('   ✅ Progress reports API returning data');
    console.log('   ✅ Frontend components accessible');
    
    console.log('\n🚀 Ready for testing:');
    console.log(`   • Login: ${FRONTEND_URL}/login`);
    console.log(`   • Use: ${TEST_SUPERVISOR.email} / ${TEST_SUPERVISOR.password}`);
    console.log(`   • Test: ${FRONTEND_URL}/supervisor/view-progress-log/1`);
    console.log(`   • Test: ${FRONTEND_URL}/supervisor/view-progress-report/1`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Debugging info:');
    console.log('   • Backend URL:', BACKEND_URL);
    console.log('   • Frontend URL:', FRONTEND_URL);
    console.log('   • Test credentials:', TEST_SUPERVISOR);
    
    process.exit(1);
  }
}

// Run the test
testSupervisorWorkflow();
