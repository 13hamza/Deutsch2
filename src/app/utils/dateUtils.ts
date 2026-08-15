/**
 * Date Utility Helper Functions (dateUtils.ts)
 * --------------------------------------------
 * Formats dates, relative times, and date groupings for Deutsch2.
 */

import { HistoryItemType, GroupedHistory } from '../types';

/**
 * Returns human-readable date representation: "Today", "Yesterday", or "Aug 15, 2026"
 */
export const formatDate = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recent';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

/**
 * Formats timestamp into 12-hour local time format (e.g. "02:30 PM")
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
 * Calculates human relative time string e.g. "Just now", "15m ago", "2h ago", "4d ago"
 */
export const getRelativeTime = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
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
 * Groups an array of history items by formatted date string
 */
export const groupByDate = (items: HistoryItemType[]): GroupedHistory[] => {
  const groups: Record<string, HistoryItemType[]> = {};

  items.forEach((item) => {
    const label = formatDate(item.timestamp);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(item);
  });

  return Object.entries(groups).map(([date, groupItems]) => ({
    date,
    items: groupItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ),
  }));
};
