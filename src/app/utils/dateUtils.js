/**
 * Date Utility Helper Functions (dateUtils.js)
 * --------------------------------------------
 * Helper functions for formatting dates, calculating relative time ("5m ago"), and grouping objects by date.
 * 
 * Beginners Guide:
 * 1. JavaScript Date API: Manipulates date objects (`new Date()`).
 * 2. `formatDate`: Returns friendly strings like "Today", "Yesterday", or full formatted dates.
 * 3. `getRelativeTime`: Calculates relative human-readable time strings like "Just now", "10m ago", "3h ago".
 * 4. `groupByDate`: Transforms an array of objects with timestamps into grouped date arrays.
 */

/**
 * Returns human-readable date representation: "Today", "Yesterday", or "Monday, August 14, 2026"
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

/**
 * Formats timestamp into 12-hour local time format (e.g. "02:30 PM")
 */
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculates human relative time string e.g. "Just now", "15m ago", "2h ago", "4d ago"
 */
export const getRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else {
    return formatDate(timestamp);
  }
};

/**
 * Groups an array of items by date string
 */
export const groupByDate = (items) => {
  const groups = {};
  items.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
  });
  return Object.entries(groups).map(([date, items]) => ({
    date,
    items: items.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ),
  }));
};

/**
 * Short date format e.g. "Aug 14, 2026"
 */
export const formatDateForDisplay = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Validates if given input produces a valid Date object
 */
export const isValidDate = (timestamp) => {
  const date = new Date(timestamp);
  return date instanceof Date && !isNaN(date);
};

/**
 * Generates a date range object for past X days
 */
export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return { start, end };
};