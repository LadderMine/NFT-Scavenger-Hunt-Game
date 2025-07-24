# Puzzle Category Module

A standalone NestJS module for organizing puzzles into logical categories for the NFT Scavenger Hunt Game. This module provides a complete solution for managing puzzle categories and their relationships with puzzles.

## Features

- ✅ **Category Management**: Create, read, update, and delete puzzle categories
- ✅ **Puzzle Management**: Full CRUD operations for puzzles
- ✅ **Many-to-Many Relationships**: Categories can have multiple puzzles, puzzles can belong to multiple categories
- ✅ **Public API Endpoint**: `GET /puzzles-by-category` returns puzzles grouped by categories
- ✅ **Search & Filter**: Search puzzles by title/description, filter by difficulty
- ✅ **Initial Data Seeding**: Pre-configured categories for NFT Scavenger Hunt
- ✅ **Complete Validation**: Input validation using class-validator
- ✅ **Swagger Documentation**: Full API documentation
- ✅ **Unit & E2E Tests**: Comprehensive test coverage

## Module Structure

```
puzzle-category/
├── entities/
│   ├── category.entity.ts      # Category database entity
│   └── puzzle.entity.ts        # Puzzle database entity
├── dto/
│   └── puzzle-category.dto.ts  # Data Transfer Objects
├── puzzle-category.service.ts  # Business logic
├── puzzle-category.controller.ts # API endpoints
├── puzzle-category.module.ts   # Module definition
├── puzzle-category.service.spec.ts # Unit tests
└── README.md                   # This file
```

## Database Schema

### Category Entity
- `id`: Primary key
- `name`: Category name (unique)
- `description`: Category description
- `slug`: URL-friendly identifier (unique)
- `icon`: Emoji or icon representation
- `color`: Hex color code for UI
- `isActive`: Soft delete flag
- `sortOrder`: Display order
- `createdAt`/`updatedAt`: Timestamps
- `puzzles`: Many-to-many relationship with puzzles

### Puzzle Entity
- `id`: Primary key
- `title`: Puzzle title
- `description`: Puzzle description
- `difficulty`: Enum (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- `points`: Points awarded for completion
- `isActive`: Soft delete flag
- `estimatedTime`: Time to complete in minutes
- `createdAt`/`updatedAt`: Timestamps
- `categories`: Many-to-many relationship with categories

## API Endpoints

### Main Endpoint (Task Requirement)
```
GET /puzzle-categories/puzzles-by-category
```
Returns puzzles grouped by their categories. This is the main endpoint requested in the task.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Blockchain Basics",
    "description": "Learn blockchain fundamentals",
    "slug": "blockchain-basics",
    "icon": "🔗",
    "color": "#3B82F6",
    "sortOrder": 1,
    "puzzles": [
      {
        "id": 1,
        "title": "What is Blockchain?",
        "description": "Learn about blockchain technology",
        "difficulty": "BEGINNER",
        "points": 10,
        "isActive": true,
        "estimatedTime": 15
      }
    ],
    "puzzleCount": 1
  }
]
```

### Category Endpoints
```
GET    /puzzle-categories/categories              # Get all categories
GET    /puzzle-categories/categories/:id          # Get category by ID
GET    /puzzle-categories/categories/slug/:slug   # Get category by slug
POST   /puzzle-categories/categories              # Create category
PUT    /puzzle-categories/categories/:id          # Update category
DELETE /puzzle-categories/categories/:id          # Delete category (soft)
```

### Puzzle Endpoints
```
GET    /puzzle-categories/puzzles                 # Get all puzzles
GET    /puzzle-categories/puzzles/:id             # Get puzzle by ID
POST   /puzzle-categories/puzzles                 # Create puzzle
PUT    /puzzle-categories/puzzles/:id             # Update puzzle
DELETE /puzzle-categories/puzzles/:id             # Delete puzzle (soft)
```

### Utility Endpoints
```
GET    /puzzle-categories/categories/:id/puzzles  # Get puzzles by category
GET    /puzzle-categories/puzzles/difficulty/:difficulty # Filter by difficulty
GET    /puzzle-categories/puzzles/search?q=term   # Search puzzles
POST   /puzzle-categories/seed-categories         # Seed initial categories
```

## Initial Categories

The module includes 5 pre-configured categories for the NFT Scavenger Hunt:

1. **Blockchain Basics** 🔗
   - Learn blockchain fundamentals, decentralization, consensus mechanisms
   - Color: #3B82F6

2. **Smart Contracts** 📜
   - Smart contract development, security, gas optimization
   - Color: #10B981

3. **StarkNet Deep Dive** ⚡
   - Cairo programming, STARK proofs, L2 scaling
   - Color: #8B5CF6

4. **NFT Fundamentals** 🎨
   - NFT standards, metadata, IPFS, minting lifecycle
   - Color: #F59E0B

5. **DeFi Concepts** 💰
   - Liquidity pools, yield farming, AMMs, DeFi protocols
   - Color: #EF4444

## Usage Examples

### Creating a Category
```typescript
const categoryData = {
  name: 'Advanced Cryptography',
  description: 'Learn advanced cryptographic concepts',
  slug: 'advanced-cryptography',
  icon: '🔐',
  color: '#6366F1',
  sortOrder: 6
};

const category = await puzzleCategoryService.createCategory(categoryData);
```

### Creating a Puzzle with Categories
```typescript
const puzzleData = {
  title: 'Zero-Knowledge Proofs',
  description: 'Understand ZK proofs and their applications',
  difficulty: 'ADVANCED',
  points: 25,
  estimatedTime: 30,
  categoryIds: [1, 3] // Blockchain Basics + StarkNet Deep Dive
};

const puzzle = await puzzleCategoryService.createPuzzle(puzzleData);
```

### Getting Puzzles by Category
```typescript
const puzzlesByCategory = await puzzleCategoryService.getPuzzlesByCategory();
// Returns puzzles organized by categories
```

## Validation

The module uses class-validator for input validation:

- **Category**: Name and slug are required, max 100 characters
- **Puzzle**: Title and description are required, difficulty must be valid enum
- **Relationships**: Category IDs must be valid numbers

## Testing

### Unit Tests
```bash
npm run test puzzle-category.service.spec.ts
```

### E2E Tests
```bash
npm run test:e2e puzzle-category.e2e-spec.ts
```

## Integration

The module is completely standalone and can be imported into any NestJS application:

```typescript
import { PuzzleCategoryModule } from './puzzle-category/puzzle-category.module';

@Module({
  imports: [PuzzleCategoryModule],
  // ...
})
export class AppModule {}
```

## Environment Variables

No additional environment variables are required beyond the standard database configuration:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=nft_scavenger_hunt
DATABASE_SYNC=true
DATABASE_LOAD=true
```

## Swagger Documentation

Once the application is running, you can access the API documentation at:
```
http://localhost:4000/doc
```

The puzzle category endpoints are documented under the "Puzzle Categories" tag.

## Error Handling

The module includes comprehensive error handling:

- **404 Not Found**: When category or puzzle doesn't exist
- **400 Bad Request**: When validation fails
- **500 Internal Server Error**: For database or server errors

## Performance Considerations

- Uses TypeORM query builder for efficient database queries
- Implements soft deletes to maintain data integrity
- Includes proper indexing on unique fields (name, slug)
- Optimized many-to-many relationship queries

## Future Enhancements

Potential improvements for the module:

- Pagination for large datasets
- Caching layer for frequently accessed data
- Bulk operations for categories and puzzles
- Advanced search with filters
- Category hierarchy support
- Puzzle difficulty progression tracking 