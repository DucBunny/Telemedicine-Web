# API Success and Error Response Structures

## 1) Success response (standard)

- HTTP status: `200` (OK), `201` (Created), `204` (No Content) as appropriate

```json
{
  "success": true,
  "data": {
    /* main resource or payload */
  },
  "meta": {
    /* optional metadata (pagination, totals, etc.) */
    "page": 1,
    "limit": 10,
    "total": 123,
    "totalPages": 13
  }
}
```

### Examples

- Fetch list (with pagination):

```json
{
  "success": true,
  "data": [
    {
      /* item */
    },
    {
      /* item */
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

- Create resource (201):

```json
{
  "success": true,
  "data": {
    "id": "64a...",
    "name": "Cafe A"
  }
}
```

## 2) Error response (standard)

- HTTP status: `400`/`401`/`403`/`404`/`422`/`500` depending on error

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE" /* machine-readable code, e.g. VALIDATION_ERROR */,
    "message": "Human readable message",
    "statusCode": 400 /* HTTP status code */,
    "details": null /* optional, e.g. validation errors or field-level info */
  }
}
```

### Examples

- Validation error (422):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "statusCode": 422,
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

- Not found (404):

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Shop not found",
    "statusCode": 404,
    "details": null
  }
}
```

## Notes

- Follow this structure consistently across controllers and error middleware.
- In development you may include `stack` or extra debug info, but avoid leaking internals in production.
- Use appropriate HTTP status codes and include `meta` only when helpful (e.g., pagination).
- In development (`NODE_ENV === 'development'`) the middleware adds a `stack` field inside `error` with the error's stack trace:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong",
    "statusCode": 500,
    "details": null,
    "stack": "Error: ...\n    at ..."
  }
}
```
