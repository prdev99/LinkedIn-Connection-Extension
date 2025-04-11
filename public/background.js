let sendingRequests = false;
let requestCount = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    sendingRequests = true;
    requestCount = 0;
    sendResponse({ status: 'started' });
    sendConnectionRequests();
  } else if (request.action === 'stop') {
    sendingRequests = false;
    sendResponse({ status: 'stopped' });
  }
});

function sendConnectionRequests() {
  if (sendingRequests) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Replace with your own logic for sending connection requests
          const connectButtons = document.querySelectorAll('button[aria-label^="Invite"]');
          if (connectButtons.length > 0) {
            connectButtons[0].click();
            return true; // Indicate that a request was sent
          }
          return false; // No requests left to send
        }
      }, (results) => {
        if (results[0].result) {
          requestCount++;
          chrome.runtime.sendMessage({ action: 'updateCount', count: requestCount });
          setTimeout(sendConnectionRequests, 2000); // Delay between requests
        } else {
          sendingRequests = false; // Stop if no more connect buttons
        }
      });
    });
  }
}
