# Content Module

The Content Module provides a comprehensive system for managing and serving educational articles and videos through a public API. This module allows administrators to create, update, and manage content while providing learners with easy access to educational materials filtered by topics.

## Features

- **CRUD Operations**: Full Create, Read, Update, Delete functionality for content management
- **Topic Filtering**: Filter content by specific topics for targeted learning
- **Public API**: Public endpoints for content consumption
- **Admin Interface**: Protected admin endpoints for content management
- **Validation**: Comprehensive input validation and error handling
- **Testing**: Complete test coverage including unit and e2e tests

## Entity Structure

The `Content` entity includes the following fields:

- `id` (UUID): Auto-generated unique identifier
- `title` (string, max 255 chars): Content title
- `body` (text): Content body/description
- `topic` (string, max 100 chars): Topic category
- `isActive` (boolean): Content visibility status
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

## API Endpoints

### Public Endpoints

#### GET /content
Retrieve all active content, optionally filtered by topic.

**Query Parameters:**
- `topic` (optional): Filter content by specific topic

**Example:**
```bash
# Get all active content
GET /content

# Get content filtered by topic
GET /content?topic=blockchain
```

#### GET /content/:id
Retrieve specific content by ID.

**Example:**
```bash
GET /content/123e4567-e89b-12d3-a456-426614174000
```

### Admin Endpoints

#### POST /admin/content
Create new content (requires admin authentication).

**Request Body:**
```json
{
  "title": "Introduction to Blockchain",
  "body": "Blockchain is a distributed ledger technology...",
  "topic": "blockchain",
  "isActive": true
}
```

#### GET /admin/content
Retrieve all content including inactive items.

#### GET /admin/content/:id
Retrieve specific content by ID (including inactive).

#### PATCH /admin/content/:id
Update existing content.

**Request Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated content body",
  "topic": "updated-topic",
  "isActive": false
}
```

#### DELETE /admin/content/:id
Delete content permanently.

## Usage Examples

### Creating Content
```typescript
// Admin creates new educational content
const newContent = await contentService.create({
  title: "Web3 Fundamentals",
  body: "Learn the basics of Web3 technology...",
  topic: "web3",
  isActive: true
});
```

### Retrieving Content
```typescript
// Get all active content
const allContent = await contentService.findAll();

// Get content filtered by topic
const blockchainContent = await contentService.findAllByTopic('blockchain');

// Get specific content
const content = await contentService.findOne('content-id');
```

### Updating Content
```typescript
// Update content
const updatedContent = await contentService.update('content-id', {
  title: "Updated Web3 Fundamentals",
  body: "Updated content with new information..."
});
```

## Database Schema

The module creates a `contents` table with the following structure:

```sql
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  topic VARCHAR(100) NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IDX_CONTENTS_TOPIC ON contents (topic);
CREATE INDEX IDX_CONTENTS_IS_ACTIVE ON contents (isActive);
```

## Testing

The module includes comprehensive testing:

### Unit Tests
- `content.service.spec.ts`: Tests for all service methods
- `content.controller.spec.ts`: Tests for all controller endpoints

### E2E Tests
- `content.e2e-spec.ts`: End-to-end API testing

Run tests with:
```bash
# Unit tests
npm run test src/content

# E2E tests
npm run test:e2e content.e2e-spec.ts
```

## Error Handling

The module includes proper error handling:

- **404 Not Found**: When content doesn't exist
- **400 Bad Request**: When validation fails
- **401 Unauthorized**: When admin authentication is required (placeholder)
- **500 Internal Server Error**: For unexpected server errors

## Validation

Input validation is handled using class-validator decorators:

- `@IsString()`: Ensures string values
- `@IsNotEmpty()`: Prevents empty values
- `@MaxLength()`: Enforces maximum length constraints
- `@IsOptional()`: Makes fields optional

## Security Considerations

- Admin endpoints are protected with authentication (placeholder implementation)
- Input validation prevents malicious data
- SQL injection protection through TypeORM
- Proper error messages without sensitive information exposure

## Performance Optimizations

- Database indexes on frequently queried fields (topic, isActive)
- Efficient query patterns with proper WHERE clauses
- Pagination support can be easily added for large datasets

## Future Enhancements

Potential improvements for the Content Module:

1. **Pagination**: Add pagination for large content lists
2. **Search**: Implement full-text search functionality
3. **Media Support**: Add support for video URLs and media files
4. **Categories**: Implement hierarchical topic categories
5. **Analytics**: Track content views and engagement
6. **Caching**: Implement Redis caching for frequently accessed content
7. **SEO**: Add meta tags and SEO-friendly URLs
8. **Versioning**: Content versioning and history tracking 