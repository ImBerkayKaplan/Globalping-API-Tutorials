// Import the required library
const axios = require("axios");

// Globalping API URL
const GLOBALPING_API_URL = "https://api.globalping.io/v1";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to perform a ping test using Globalping
async function performPingTest(target, locations) {
  try {
    // Step 1: Create a ping task
    const createTaskResponse = await axios.post(
      `${GLOBALPING_API_URL}/measurements`,
      {
        type: "ping",
        target: target,
        locations: locations,
      },
    );

    // Extract task ID from the response
    const taskId = createTaskResponse.data.id;
    console.log(`Ping Task Created Successfully! Task ID: ${taskId}`);

    // Step 2: Wait for 3 seconds for the task to finish and fetch results using the Task ID
    console.log("Fetching results...");
    await sleep(3000);
    const resultResponse = await axios.get(
      `${GLOBALPING_API_URL}/measurements/${taskId}`,
    );

    // Display results
    console.log(
      `Results for Ping to ${target} from ${locations.length} locations:`,
    );
    resultResponse.data.results.forEach((result, index) => {
      console.log(`\n--- Location ${index + 1} ---`);
      console.log(`Region: ${result.probe.country}, ${result.probe.city}`);
      console.log(`Probe AS: ${result.probe.asn}`);
      console.log(
        `Packet Statistics (milliseconds): ${JSON.stringify(result.result.stats)}`,
      );
      console.log(
        `Each Packet's TTL and RTT (milliseconds): ${JSON.stringify(result.result.timings)}`,
      );
    });
  } catch (error) {
    console.error(`Error performing ping test: ${error.message}`);
  }
}

// Example usage of the function
// Target domain to test and location filter (optional)
const targetDomain = "example.com";
const testLocations = [
  { country: "US" }, // Test from the United States
  { country: "DE" }, // Test from Germany
];

// Run the ping test
performPingTest(targetDomain, testLocations);
