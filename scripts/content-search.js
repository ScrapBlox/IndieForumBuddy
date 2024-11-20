async function startForumSearch() {
  console.log('Enhanced content-search.js initialized.');
  if (!isSearchResultsPage()) {
    console.log('This is not a search results page. Script will not run.');
    return; // Exit the script if it's not a search result page
  }
  try {
      // Fetch forum information from ../data/forums.json
      const forumsData = await fetchForumsData();
      console.log('Fetched forumsData:', forumsData);

      // Process each search result
      const searchResults = document.querySelectorAll('a[href*="http"]'); // General search result selector
      console.log(`Found ${searchResults.length} potential search results.`);

      searchResults.forEach((searchResult) => {
          const linkHostname = extractHostname(searchResult.href);

          // Match the hostname from the search result link with forums.json
          const matchedForum = forumsData.find(forum => linkHostname.includes(forum.domain));
          if (matchedForum) {
              console.log(`Matched hostname: ${linkHostname}`);
              const container = searchResult.closest('div, li'); // Look for the nearest container
              if (container) {
                  enhanceSearchResult(container, matchedForum);
              }
          }
      });
  } catch (error) {
      console.error('Error initializing the script:', error);
  }
}

function isSearchResultsPage() {
  const currentUrl = window.location.href;

  // Check URL patterns for search engines (Google, Bing, DuckDuckGo, etc.)
  if (currentUrl.includes('google.com/search') || currentUrl.includes('bing.com/search') || currentUrl.includes('duckduckgo.com')) {
      return true;
  }

  // Check if common search result page elements are present
  if (document.querySelector('.g') || // Google
      document.querySelector('.b_algo') || // Bing
      document.querySelector('.web-result') || // DuckDuckGo
      document.querySelector('.snippet') // Brave
  ) {
      return true;
  }

  return false; // Default to false if none of the conditions are met
}


window.onload = () => startForumSearch();

/**
* Fetches data from forums.json.
* @returns {Promise<Array>} The forums data as an array.
*/
async function fetchForumsData() {
  try {
      const response = await fetch(chrome.runtime.getURL('../data/forums.json'));
      if (!response.ok) {
          throw new Error(`Failed to fetch forums.json: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
          throw new Error('forums.json does not contain an array.');
      }
      return data;
  } catch (error) {
      console.error('Error fetching forums.json:', error);
      return []; // Return an empty array to prevent further errors
  }
}

/**
* Extracts the hostname from a given URL.
* @param {string} url - The URL to extract the hostname from.
* @returns {string} The hostname of the URL.
*/
function extractHostname(url) {
  try {
      const hostname = new URL(url).hostname;
      // Normalize hostname by removing "www." if present
      return hostname//.replace(/^www\./, '');
  } catch (error) {
      console.error('Error extracting hostname:', error);
      return '';
  }
}

/**
* Enhances a search result with a custom notice and link.
* @param {HTMLElement} container - The search result container element.
* @param {Object} forum - The matched forum object from forums.json.
*/
function enhanceSearchResult(container, forum) {
  if (!container.querySelector('.custom-enhanced-link')) {
      console.log('Enhancing search result.');

      // Create a custom container
      const customContainer = document.createElement('aside');
      customContainer.classList.add('custom-enhanced-container');

      // Add a custom link
      const customLink = document.createElement('a');
      customLink.href = forum.alternative; // Use redirectURL from forums.json
      customLink.classList.add('custom-enhanced-link');
      customLink.textContent = `View the independently owned alternative ${forum.alternative}`;
      customLink.target = '_blank';

      // Add styles to the container
      customContainer.style.cssText = `
          background-color: #eef6fc;
          padding: 10px;
          margin-top: 10px;
          border-radius: 5px;
          font-size: 14px;
          font-family: Arial, sans-serif;
      `;

      // Append link and add container to the result
      customContainer.appendChild(customLink);
      container.appendChild(customContainer);
  }
}
