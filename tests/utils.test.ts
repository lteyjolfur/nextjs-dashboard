import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
} from '../app/lib/utils.ts';

test('formatCurrency converts cents to USD', () => {
  assert.equal(formatCurrency(123456), '$1,234.56');
});

test('formatCurrency handles zero', () => {
  assert.equal(formatCurrency(0), '$0.00');
});

test('formatDateToLocal formats with the en-US default locale', () => {
  // Local-time noon avoids timezone-dependent day shifts.
  assert.equal(formatDateToLocal('2023-12-25T12:00:00'), 'Dec 25, 2023');
});

test('formatDateToLocal respects an explicit locale', () => {
  assert.equal(formatDateToLocal('2023-12-25T12:00:00', 'en-GB'), '25 Dec 2023');
});

test('generateYAxis rounds the top label up to the next thousand', () => {
  const { yAxisLabels, topLabel } = generateYAxis([
    { month: 'Jan', revenue: 2500 },
    { month: 'Feb', revenue: 1200 },
  ]);
  assert.equal(topLabel, 3000);
  assert.deepEqual(yAxisLabels, ['$3K', '$2K', '$1K', '$0K']);
});

test('generateYAxis keeps an exact thousand as the top label', () => {
  const { topLabel, yAxisLabels } = generateYAxis([{ month: 'Jan', revenue: 2000 }]);
  assert.equal(topLabel, 2000);
  assert.deepEqual(yAxisLabels, ['$2K', '$1K', '$0K']);
});

test('generatePagination lists every page when there are 7 or fewer', () => {
  assert.deepEqual(generatePagination(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(generatePagination(4, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test('generatePagination near the start', () => {
  assert.deepEqual(generatePagination(2, 10), [1, 2, 3, '...', 9, 10]);
});

test('generatePagination near the end', () => {
  assert.deepEqual(generatePagination(9, 10), [1, 2, '...', 8, 9, 10]);
});

test('generatePagination in the middle', () => {
  assert.deepEqual(generatePagination(5, 10), [1, '...', 4, 5, 6, '...', 10]);
});
