import { toast } from 'react-hot-toast';

type LogLevel = 'info' | 'warn' | 'error' | 'success';

class Logger {
  private static instance: Logger;
  private logs: string[] = [];
  private progress: number = 0;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setProgress(value: number) {
    this.progress = Math.min(100, Math.max(0, value));
  }

  getProgress(): number {
    return this.progress;
  }

  log(message: string, level: LogLevel = 'info', showToast: boolean = true) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    this.logs.push(logEntry);
    console.log(logEntry);

    if (showToast) {
      switch (level) {
        case 'info':
          toast(message, {
            duration: 3000,
            position: 'bottom-center',
          });
          break;
        case 'success':
          toast.success(message, {
            duration: 3000,
            position: 'bottom-center',
          });
          break;
        case 'error':
          toast.error(message, {
            duration: 5000,
            position: 'bottom-center',
          });
          break;
        case 'warn':
          toast(message, {
            duration: 3000,
            position: 'bottom-center',
            icon: '⚠️',
          });
          break;
      }
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();