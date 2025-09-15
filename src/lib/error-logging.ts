/**
 * Enhanced error logging system for CMS settings
 * Provides structured logging with different severity levels and context
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogContext {
  component?: string;
  function?: string;
  field?: string;
  value?: any;
  fallbackUsed?: boolean;
  validationErrors?: string[];
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class SettingsLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 log entries

  private createLogEntry(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output to console based on level
    const contextStr = entry.context ? ` [Context: ${JSON.stringify(entry.context)}]` : '';
    const errorStr = entry.error ? ` [Error: ${entry.error.message}]` : '';
    const fullMessage = `[Settings] ${entry.message}${contextStr}${errorStr}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(fullMessage, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(fullMessage);
        break;
      case LogLevel.INFO:
        console.info(fullMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(fullMessage);
        break;
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.addLog(this.createLogEntry(LogLevel.ERROR, message, context, error));
  }

  warn(message: string, context?: LogContext): void {
    this.addLog(this.createLogEntry(LogLevel.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    this.addLog(this.createLogEntry(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: LogContext): void {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, message, context));
  }

  // Specific logging methods for common scenarios
  cmsLoadFailure(error: Error, filePath?: string): void {
    this.error('Failed to load CMS settings file', {
      component: 'SettingsLoader',
      function: 'getGeneralSettings',
      field: 'settingsFile',
      value: filePath
    }, error);
  }

  yamlParseFailure(error: Error, content?: string): void {
    this.error('Failed to parse YAML content', {
      component: 'SettingsLoader',
      function: 'parseYAML',
      value: content ? `${content.substring(0, 100)}...` : undefined
    }, error);
  }

  validationFailure(field: string, value: any, validationError: string): void {
    this.warn('Field validation failed', {
      component: 'SettingsValidator',
      function: 'validateField',
      field,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      validationErrors: [validationError]
    });
  }

  fallbackUsed(field: string, originalValue: any, fallbackValue: any, reason?: string): void {
    this.warn('Using fallback value for field', {
      component: 'SettingsLoader',
      function: 'validateAndEnhanceSettings',
      field,
      value: `original: ${originalValue}, fallback: ${fallbackValue}`,
      fallbackUsed: true,
      validationErrors: reason ? [reason] : undefined
    });
  }

  completeFallbackUsed(reason: string): void {
    this.warn('Using complete fallback settings', {
      component: 'SettingsLoader',
      function: 'getFallbackSettings',
      fallbackUsed: true,
      validationErrors: [reason]
    });
  }

  settingsLoaded(source: 'cms' | 'fallback', validationIssues?: number): void {
    this.info(`Settings loaded successfully from ${source}`, {
      component: 'SettingsLoader',
      function: 'getGeneralSettings',
      validationErrors: validationIssues ? [`${validationIssues} validation issues found`] : undefined
    });
  }

  cacheCleared(): void {
    this.debug('Settings cache cleared', {
      component: 'SettingsLoader',
      function: 'clearSettingsCache'
    });
  }

  // Get logs for debugging/monitoring
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = level ? this.logs.filter(log => log.level === level) : this.logs;
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  // Get error summary for monitoring
  getErrorSummary(since?: Date): { totalErrors: number; totalWarnings: number; recentErrors: LogEntry[] } {
    const sinceTime = since ? since.getTime() : 0;
    const recentLogs = this.logs.filter(log => new Date(log.timestamp).getTime() >= sinceTime);
    
    return {
      totalErrors: recentLogs.filter(log => log.level === LogLevel.ERROR).length,
      totalWarnings: recentLogs.filter(log => log.level === LogLevel.WARN).length,
      recentErrors: recentLogs.filter(log => log.level === LogLevel.ERROR).slice(-10)
    };
  }

  // Clear logs (useful for testing)
  clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const settingsLogger = new SettingsLogger();

// Convenience functions for backward compatibility
export function logError(message: string, error?: Error, context?: LogContext): void {
  settingsLogger.error(message, context, error);
}

export function logWarning(message: string, context?: LogContext): void {
  settingsLogger.warn(message, context);
}

export function logInfo(message: string, context?: LogContext): void {
  settingsLogger.info(message, context);
}

export function logDebug(message: string, context?: LogContext): void {
  settingsLogger.debug(message, context);
}