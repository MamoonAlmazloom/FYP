// Quick test to see current supervisors in the system
const API_BASE = 'http://localhost:5000/api';

async function listSupervisors() {
  try {
    const response = await fetch(`${API_BASE}/supervisors`);
    const data = await response.json();
    
    console.log('=== Current Supervisors in System ===');
    console.log(`Total supervisors: ${data.supervisors?.length || 0}`);
    console.log('');
    
    if (data.supervisors) {
      data.supervisors.forEach((supervisor, index) => {
        console.log(`${index + 1}. ${supervisor.name}`);
        console.log(`   Email: ${supervisor.email}`);
        console.log(`   User ID: ${supervisor.user_id}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listSupervisors();
