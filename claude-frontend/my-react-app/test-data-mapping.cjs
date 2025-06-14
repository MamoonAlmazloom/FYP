#!/usr/bin/env node

const http = require("http");

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = http.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testDataMapping() {
  console.log("🧪 Testing Data Mapping Fix\n");

  try {
    // Test logs API
    console.log("1️⃣  Testing Progress Logs API...");
    const logsResponse = await makeRequest(
      "http://localhost:5000/api/supervisors/8/students/1/logs"
    );

    if (logsResponse.status === 200 && logsResponse.data.success) {
      const logs = logsResponse.data.logs;
      console.log("✅ Logs API working");
      console.log(`   Found ${logs.length} logs`);

      if (logs.length > 0) {
        const firstLog = logs[0];
        console.log("   Sample log data:");
        console.log(`   • log_id: ${firstLog.log_id}`);
        console.log(`   • submission_date: ${firstLog.submission_date}`);
        console.log(
          `   • details: ${
            firstLog.details
              ? firstLog.details.substring(0, 50) + "..."
              : "null"
          }`
        );
        console.log(`   • project_title: ${firstLog.project_title}`);
      }
    } else {
      throw new Error("Logs API failed");
    }

    // Test reports API
    console.log("\n2️⃣  Testing Progress Reports API...");
    const reportsResponse = await makeRequest(
      "http://localhost:5000/api/supervisors/8/students/1/reports"
    );

    if (reportsResponse.status === 200 && reportsResponse.data.success) {
      const reports = reportsResponse.data.reports;
      console.log("✅ Reports API working");
      console.log(`   Found ${reports.length} reports`);

      if (reports.length > 0) {
        const firstReport = reports[0];
        console.log("   Sample report data:");
        console.log(`   • report_id: ${firstReport.report_id}`);
        console.log(`   • submission_date: ${firstReport.submission_date}`);
        console.log(`   • title: ${firstReport.title}`);
        console.log(
          `   • details: ${
            firstReport.details
              ? firstReport.details.substring(0, 50) + "..."
              : "null"
          }`
        );
        console.log(`   • project_title: ${firstReport.project_title}`);
      }
    } else {
      throw new Error("Reports API failed");
    }

    console.log("\n🎉 DATA MAPPING VERIFICATION COMPLETE!");
    console.log("\n📋 Expected UI Display:");
    console.log("   ✅ Student Name: Should show from student data");
    console.log("   ✅ Submitted On: Should show formatted date");
    console.log("   ✅ Project: Should show project_title");
    console.log("   ✅ Details: Should show actual content");
    console.log("   ✅ IDs: Should show log_id/report_id");

    console.log("\n🚀 Test the UI now:");
    console.log("   • http://localhost:5174/supervisor/view-progress-log/1");
    console.log("   • http://localhost:5174/supervisor/view-progress-report/1");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testDataMapping();
