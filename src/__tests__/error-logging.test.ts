/**
 * Tests for error logging system
 */

import { settingsLogger, LogLevel } from '../lib/error-logging';

describe('Settings Logger', () => {
  beforeEach(() => {
    // Clear logs before each test
    settingsLogger.clearLogs();
    // Mock console methods to avoid noise in test output
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('logs error messages correctly', () => {
    const error = new Error('Test error');
    settingsLogger.error('Test error message', { field: 'testField' }, error);

    const logs = settingsLogger.getLogs(LogLevel.ERROR);
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.ERROR);
    expect(logs[0].message).toBe('Test error message');
    expect(logs[0].context?.field).toBe('testField');
    expect(logs[0].error).toBe(error);
  });

  test('logs warning messages correctly', () => {
    settingsLogger.warn('Test warning', { component: 'TestComponent' });

    const logs = settingsLogger.getLogs(LogLevel.WARN);
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.WARN);
    expect(logs[0].message).toBe('Test warning');
    expect(logs[0].context?.component).toBe('TestComponent');
  });

  test('logs CMS load failures with proper context', () => {
    const error = new Error('File not found');
    settingsLogger.cmsLoadFailure(error, '/path/to/settings.yml');

    const logs = settingsLogger.getLogs(LogLevel.ERROR);
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Failed to load CMS settings file');
    expect(logs[0].context?.component).toBe('SettingsLoader');
    expect(logs[0].context?.value).toBe('/path/to/settings.yml');
  });

  test('logs validation failures with field context', () => {
    settingsLogger.validationFailure('email', 'invalid-email', 'Invalid email format');

    const logs = settingsLogger.getLogs(LogLevel.WARN);
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Field validation failed');
    expect(logs[0].context?.field).toBe('email');
    expect(logs[0].context?.value).toBe('invalid-email');
    expect(logs[0].context?.validationErrors).toContain('Invalid email format');
  });

  test('logs fallback usage with proper context', () => {
    settingsLogger.fallbackUsed('companyName', undefined, 'Default Company', 'Missing value');

    const logs = settingsLogger.getLogs(LogLevel.WARN);
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Using fallback value for field');
    expect(logs[0].context?.field).toBe('companyName');
    expect(logs[0].context?.fallbackUsed).toBe(true);
  });

  test('tracks error summary correctly', () => {
    settingsLogger.error('Error 1');
    settingsLogger.error('Error 2');
    settingsLogger.warn('Warning 1');
    settingsLogger.warn('Warning 2');
    settingsLogger.warn('Warning 3');

    const summary = settingsLogger.getErrorSummary();
    expect(summary.totalErrors).toBe(2);
    expect(summary.totalWarnings).toBe(3);
    expect(summary.recentErrors).toHaveLength(2);
  });

  test('limits log storage to prevent memory issues', () => {
    // Add more logs than the limit (1000)
    for (let i = 0; i < 1100; i++) {
      settingsLogger.info(`Log message ${i}`);
    }

    const allLogs = settingsLogger.getLogs();
    expect(allLogs.length).toBeLessThanOrEqual(1000);
    
    // Should keep the most recent logs
    const lastLog = allLogs[allLogs.length - 1];
    expect(lastLog.message).toBe('Log message 1099');
  });

  test('filters logs by level correctly', () => {
    settingsLogger.error('Error message');
    settingsLogger.warn('Warning message');
    settingsLogger.info('Info message');
    settingsLogger.debug('Debug message');

    expect(settingsLogger.getLogs(LogLevel.ERROR)).toHaveLength(1);
    expect(settingsLogger.getLogs(LogLevel.WARN)).toHaveLength(1);
    expect(settingsLogger.getLogs(LogLevel.INFO)).toHaveLength(1);
    expect(settingsLogger.getLogs(LogLevel.DEBUG)).toHaveLength(1);
  });

  test('limits returned logs when specified', () => {
    for (let i = 0; i < 10; i++) {
      settingsLogger.info(`Message ${i}`);
    }

    const limitedLogs = settingsLogger.getLogs(LogLevel.INFO, 5);
    expect(limitedLogs).toHaveLength(5);
  });

  test('clears logs correctly', () => {
    settingsLogger.error('Test error');
    settingsLogger.warn('Test warning');
    
    expect(settingsLogger.getLogs()).toHaveLength(2);
    
    settingsLogger.clearLogs();
    
    expect(settingsLogger.getLogs()).toHaveLength(0);
  });

  test('handles error summary with time filter', () => {
    // Log an error that should be filtered out
    settingsLogger.error('Old error');
    
    // Create a time filter that excludes the error we just logged
    const futureTime = new Date(Date.now() + 1000); // 1 second in the future
    const summary = settingsLogger.getErrorSummary(futureTime);
    
    // Should not include any errors since they're all before the filter time
    expect(summary.totalErrors).toBe(0);
  });
});