/**
 * Date Utility Helper Functions (dateUtils.ts)
 * --------------------------------------------
 * Beginner Guide:
 * JavaScript's built-in `Date` object handles dates and timestamps.
 * This module converts raw ISO date strings (like "2026-08-15T10:00:00Z") into friendly,
 * human-readable labels like "Today", "Yesterday", "5m ago", or grouped date sections.
 */

import { HistoryItemType, GroupedHistory } from '../types';

/**
 * Formats a timestamp into a friendly date header string.
 * Examples:
 * - Current date -> "Today"
 * - Previous date -> "Yesterday"
 * - Older dates -> "Aug 15, 2026"
 * 
 * @param timestamp - Raw timestamp string, number, or Date object
 * @returns Formatted human-friendly string
 */
export const formatDate = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  // Guard clause: Return 'Recent' if date parsing fails
  if (isNaN(date.getTime())) return 'Recent';

  const today = new Date();
  const yesterday = new Date(today);
  // Subtract 1 day to calculate yesterday's date
  yesterday.setDate(yesterday.getDate() - 1);

  // Compare date strings (ignoring exact hours/minutes)
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    // Format full date (e.g., "Aug 15, 2026")
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

/**
 * Formats a timestamp into 12-hour local time format (e.g. "02:30 PM").
 * 
 * @param timestamp - Raw timestamp string, number, or Date object
 * @returns 12-hour formatted time string
 */
export const formatTime = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculates human relative time duration string.
 * Examples: "Just now", "15m ago", "2h ago", "4d ago".
 * 
 * Beginner Concept:
 * Calculates the difference between current time (`Date.now()`) and item timestamp,
 * then converts milliseconds into minutes, hours, or days.
 * 
 * @param timestamp - Target timestamp string, number, or Date
 * @returns Relative time string
 */
export const getRelativeTime = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  // Calculate difference in milliseconds
  const diffMs = now.getTime() - date.getTime();
  
  // Convert milliseconds into minutes (60,000 ms), hours (3.6m ms), and days (86.4m ms)
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

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
 * Groups an array of history items by date string label ("Today", "Yesterday", etc.).
 * Used to construct section headers in FlatList components.
 * 
 * @param items - Array of HistoryItemType objects
 * @returns Array of GroupedHistory objects sorted newest first
 */
export const groupByDate = (items: HistoryItemType[]): GroupedHistory[] => {
  const groups: Record<string, HistoryItemType[]> = {};

  // Loop through all items and group by formatted date string
  items.forEach((item) => {
    const label = formatDate(item.timestamp);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  // Convert grouped object into array of objects and sort items by timestamp descending
  return Object.entries(groups).map(([date, groupItems]) => ({
    date,
    items: groupItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ),
  }));
};
