# Error Logging Module

A standalone module for capturing, storing, and querying system errors in the NestJS application.

## Features

- Store errors in PostgreSQL database with TypeORM
- Capture unhandled exceptions automatically
- Query and filter errors by level and limit
- CLI tool for retrieving recent errors
- REST API endpoints for error management

## Module Structure

```
error-logging/
├── commands/
│   └── get-recent-errors.command.ts  # CLI command for retrieving errors
├── dto/
│   ├── create-error-log.dto.ts       # DTO for creating error logs
│   └── query-error-log.dto.ts        # DTO for querying error logs
├── entities/
│   └── error-log.entity.ts           # Error log entity definition
├── interceptors/
│   └── error-logging.interceptor.ts  # Global interceptor for auto-logging
├── error-logging.controller.ts       # REST API controller
├── error-logging.module.ts           # Module definition
├── error-logging.service.ts          # Core service implementation
└── error-logging.service.spec.ts     # Unit tests
```

## Usage

### Automatic Error Logging

The module registers a global interceptor that automatically captures and logs unhandled exceptions.

### Manual Error Logging

Inject the `ErrorLoggingService` into your services:

```typescript
constructor(private errorLoggingService: ErrorLoggingService) {}

try {
  // Your code here
} catch (error) {
  this.errorLoggingService.logError({
    message: error.message,
    stackTrace: error.stack,
    context: 'YourService.methodName',
    level: ErrorLevel.ERROR,
  });
}
```

### Query Errors via API

```
GET /error-logging?limit=10&level=ERROR
```

### CLI Commands

```bash
# Run the CLI command to get recent errors
npm run error-logs get-errors --limit=10 --level=ERROR
```

## Error Levels

The module supports four error levels:

- `INFO`: Informational messages
- `WARNING`: Non-critical issues
- `ERROR`: Standard errors (default)
- `CRITICAL`: Severe errors

## Integration with Other Modules

The Error Logging Module is designed to work independently of other modules in the application. It can be imported and used anywhere in the system without dependencies on other modules.