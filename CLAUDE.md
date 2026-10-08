# CLAUDE.md

## Project Overview

This is a production Python application built with:

* Python 3.12
* FastAPI
* SQLAlchemy 2.x
* MariaDB
* uv for dependency and environment management
* Ruff for formatting and linting
* mypy for static type checking
* pytest for testing
* ReactJs for UI
* eslint for linting
* playwright for e2e tests

The goal is production-quality code that is readable, maintainable, testable, secure, observable, and easy to extend.

---

# 1. Core Engineering Principles

Always prioritize:

1. Correctness
2. Simplicity
3. Readability
4. Maintainability
5. Testability
6. Security
7. Performance where it matters
8. Consistency with the existing architecture

Follow established Python conventions and project patterns before introducing new ones.

Use:

* PEP 8
* PEP 257 where applicable
* SOLID principles
* DRY
* proven library functions over hand-rolled equivalents
* separation of concerns
* composition over inheritance
* dependency inversion where useful
* explicit over implicit behavior

Do not apply principles mechanically.

For example, do not introduce interfaces, factories, abstractions, or additional layers unless they provide a concrete benefit.

Prefer straightforward Python over unnecessarily complex design patterns, and prefer a well-established library's implementation over reinventing one yourself.

When a well-maintained library already solves a self-contained problem, use it
instead of writing your own — for example text splitting, parsing, HTTP,
retry/backoff, date/time, hashing, serialization, or schema validation.

Reach first for the standard library and for dependencies the project already
has. Adding a new, appropriately scoped dependency is also acceptable when it
replaces error-prone or non-trivial bespoke code (see section 18).

Write a custom implementation only when no suitable library exists, the chosen
library is unmaintained or far larger than the need, its behavior does not fit,
or the logic is genuinely project-specific.

This applies to new code and to code you are already changing for another
reason. Do not rewrite working, tested code solely to swap in a library without
explicit justification (see section 25).

---

# 2. Before Changing Code

Before implementing a change:

1. Inspect the relevant project structure.
2. Read existing implementations related to the requested change.
3. Identify existing architectural patterns.
4. Check existing tests.
5. Check existing configuration.
6. Reuse existing utilities, services, dependencies, and abstractions when appropriate.
7. Understand database models and relationships before changing persistence code.

Do not immediately start writing code.

First understand how the existing application works.

Do not introduce a new architectural pattern when an established project pattern already exists.

---

# 3. Python Code Style

Use modern Python 3.12 syntax.

Prefer:

```python
def get_user(user_id: int) -> User | None: ...
```

over older typing syntax such as:

```python
from typing import Optional


def get_user(user_id: int) -> Optional[User]: ...
```

Use type hints consistently.

All public functions, methods, classes, and module-level APIs should have appropriate type annotations.

Avoid `Any`.

If `Any` is genuinely necessary, understand why and keep its scope as small as possible.

Prefer precise types over:

```python
dict[str, Any]
```

when a typed model, dataclass, TypedDict, or domain object is more appropriate.

Avoid deeply nested conditionals.

Prefer early returns when they improve readability.

Keep functions focused and reasonably small.

A function should generally have one clear responsibility.

Do not create excessively large classes.

---

# 4. FastAPI

Follow FastAPI conventions.

Routes should primarily handle:

* HTTP concerns
* request validation
* response serialization
* dependency injection
* authentication/authorization concerns

Business logic should not live directly inside route handlers.

Avoid:

```python
@router.post("/users")
async def create_user(...):
    # 100 lines of business logic
    ...
```

Prefer separation such as:

```text
API/router
    ↓
Service/use-case
    ↓
Repository/data access
    ↓
SQLAlchemy
    ↓
MariaDB
```

Do not introduce unnecessary layers for trivial functionality.

Use FastAPI dependency injection appropriately.

Keep dependencies composable and testable.

Use Pydantic models for API input/output validation.

Do not expose SQLAlchemy ORM models directly as API contracts unless there is a deliberate reason to do so.

Define explicit response schemas.

Use appropriate HTTP status codes.

Raise appropriate `HTTPException`s at the API boundary when necessary.

Do not leak internal exceptions, database errors, stack traces, SQL statements, or sensitive implementation details to API clients.

---

# 5. SQLAlchemy

Use SQLAlchemy 2.x style APIs.

Prefer:

```python
stmt = select(User).where(User.id == user_id)
result = await session.execute(stmt)
user = result.scalar_one_or_none()
```

over legacy query APIs.

Keep database access separate from HTTP/API concerns.

Repositories or data-access components should contain database-specific logic where the project architecture uses repositories.

Do not put raw SQLAlchemy queries throughout route handlers.

Use explicit transactions.

Understand transaction boundaries before changing database code.

Avoid unnecessary database queries.

Watch for:

* N+1 queries
* accidental lazy loading
* unnecessary joins
* loading entire tables
* missing indexes
* inefficient pagination
* repeated queries inside loops

Use eager loading deliberately when appropriate.

Do not blindly add eager loading everywhere.

When modifying relationships, consider:

* cascade behavior
* foreign keys
* nullable constraints
* uniqueness
* indexes
* deletion behavior
* transaction semantics

---

# 6. MariaDB

Treat MariaDB as a production database.

Do not assume database behavior from SQLite.

Tests using SQLite must not be considered equivalent to MariaDB integration tests.

For database behavior involving:

* transactions
* constraints
* indexes
* MariaDB-specific types
* JSON
* concurrency
* locking
* migrations

prefer MariaDB-backed integration tests.

Never silently swallow database errors.

Do not expose database exceptions directly through the API.

Use parameterized queries.

Never construct SQL using string interpolation with user input.

---

# 7. Database Migrations

If the project uses Alembic:

* Every schema change must have an appropriate migration.
* Never manually modify an existing migration that may already have been applied.
* Keep migrations small and understandable.
* Review generated migrations before committing them.
* Ensure migrations are reversible where practical.
* Consider production data when changing columns, constraints, indexes, or types.

After changing database models, verify whether a migration is required.

Do not assume model changes automatically update MariaDB.

---

# 8. Pydantic / API Schemas

Keep API schemas separate from database models.

Use schemas to define:

* request bodies
* response bodies
* query parameters where appropriate
* public API contracts

Do not expose fields accidentally.

Be especially careful with:

* passwords
* password hashes
* tokens
* internal IDs
* permissions
* administrative fields
* internal metadata

Validate external input.

Prefer explicit schemas over accepting arbitrary dictionaries.

---

# 9. Async Code

Use async consistently where the application architecture requires it.

Do not call blocking operations from async request handlers.

Be careful with:

* synchronous database calls
* blocking filesystem operations
* blocking HTTP clients
* CPU-heavy operations

Use async-compatible libraries where appropriate.

Do not add `async` to functions that do not perform asynchronous work simply for consistency.

Understand whether SQLAlchemy sessions are synchronous or asynchronous before modifying database code.

---

# 10. Error Handling

Handle errors intentionally.

Do not use:

```python
try:
    ...
except Exception:
    pass
```

Never silently swallow exceptions.

Avoid broad exception handling unless there is a specific reason.

Catch the narrowest appropriate exception.

Separate:

* expected business errors
* validation errors
* authentication/authorization errors
* infrastructure errors
* unexpected programming errors

Do not use exceptions as normal control flow when a simpler approach exists.

API error responses should be stable and intentional.

Internal implementation details must not leak to clients.

---

# 11. Logging

Use Python's `logging` infrastructure or the project's established logging framework.

Do not use `print()` for application logging.

Prefer module-level loggers.

Example:

```python
import logging

logger = logging.getLogger(__name__)
```

Use appropriate levels:

* `DEBUG` — diagnostic information
* `INFO` — important normal application events
* `WARNING` — unexpected but recoverable situations
* `ERROR` — failed operations requiring attention
* `CRITICAL` — severe application/system failures

Log useful context.

For example:

```python
logger.info("User created", extra={"user_id": user.id})
```

Do not log:

* passwords
* access tokens
* refresh tokens
* API keys
* secrets
* database credentials
* sensitive personal data

Do not add excessive logging.

Do not log the same exception repeatedly at multiple layers unless each log provides meaningful additional context.

---

# 12. Testing

Use pytest.

Every behavior change should have appropriate tests.

When adding functionality:

1. Add unit tests for business logic.
2. Add API tests where HTTP behavior changes.
3. Add integration tests where database behavior changes.
4. Add regression tests for bug fixes.

Test:

* happy paths
* validation failures
* expected business errors
* authorization failures
* edge cases
* important database constraints
* failure scenarios

Do not write tests solely to increase coverage.

Tests should verify meaningful behavior.

Prefer deterministic tests.

Avoid tests that depend on:

* real external services
* network availability
* system time
* random state
* execution order

unless they are explicitly integration/end-to-end tests.

---

# 13. Test Structure

Keep tests organized similarly to the application structure.

Prefer clear test names:

```python
def test_create_user_rejects_duplicate_email(): ...
```

over:

```python
def test_user(): ...
```

Arrange tests using a clear:

```text
Arrange
Act
Assert
```

structure.

Avoid excessive mocking.

Mock boundaries such as:

* external HTTP services
* third-party APIs
* expensive infrastructure
* external systems

Do not mock everything.

Prefer testing real application behavior when practical.

---

# 14. Fixtures

Use pytest fixtures for shared setup.

Keep fixtures understandable.

Avoid giant fixtures that create unrelated application state.

Prefer small composable fixtures.

Database fixtures must properly isolate tests.

Tests must not depend on state left by another test.

---

# 15. Unit vs Integration Tests

Do not treat all tests as unit tests.

Use unit tests for isolated business logic.

Use integration tests for:

* SQLAlchemy behavior
* MariaDB behavior
* repository/database operations
* transaction behavior
* database constraints

Use API/integration tests for important FastAPI behavior.

When MariaDB-specific behavior matters, test against MariaDB.

---

# 16. Linting and Formatting

Ruff is the source of truth for formatting and linting.

Do not manually format code in ways that conflict with Ruff.

Before considering a change complete, run the project's configured Ruff checks.

Typical commands:

```bash
uv run ruff check .
uv run ruff format --check .
```

If formatting is required:

```bash
uv run ruff format .
```

Fix lint violations properly.

Do not disable Ruff rules merely to make CI pass.

If a rule genuinely needs to be ignored, keep the exception narrow and explain why.

---

# 17. Mypy

Use mypy for static type checking.

Typical command:

```bash
uv run mypy .
```

Do not silence type errors with:

```python
# type: ignore
```

unless there is a documented and justified reason.

Prefer fixing the underlying type problem.

Keep type boundaries explicit.

Be particularly careful around:

* SQLAlchemy models
* dependency injection
* Pydantic models
* third-party libraries
* optional values
* async code

---

# 18. uv

Use `uv` for Python environment and dependency management.

Do not use:

```bash
pip install ...
```

for project dependencies.

Prefer:

```bash
uv add <package>
```

and:

```bash
uv add --dev <package>
```

Keep `pyproject.toml` and `uv.lock` consistent.

Do not manually edit dependency lock files.

Do not add dependencies when the standard library or an existing dependency is sufficient.

Here "sufficient" means the standard library or an existing dependency actually
does the job cleanly — not that the remaining gap could be closed with custom
code. A well-maintained, appropriately scoped library is preferable to a
hand-rolled implementation of the same non-trivial behavior (see section 1).

Before introducing a dependency, consider:

1. Can the standard library solve it?
2. Does the project already have a dependency providing this?
3. Is the dependency actively maintained?
4. Does it introduce unnecessary security or maintenance risk?
5. Would writing it ourselves mean re-implementing non-trivial, well-solved behavior (parsing, text processing, protocol handling, algorithms)?

---

# 19. Security

Treat all external input as untrusted.

Never:

* hard-code secrets
* commit credentials
* log secrets
* expose environment variables through APIs
* construct SQL from untrusted strings
* trust client-provided authorization information
* return internal exceptions to clients

Pay attention to:

* authentication
* authorization
* SQL injection
* SSRF
* path traversal
* insecure deserialization
* mass assignment
* sensitive data exposure
* rate limiting
* CORS
* CSRF where applicable

When changing authentication or authorization, add regression tests.

---

# 20. Configuration

Configuration should come from environment/configuration mechanisms rather than hard-coded values.

Do not hard-code:

* database URLs
* API keys
* credentials
* service URLs that differ by environment
* secrets

Validate configuration at application startup where practical.

Fail clearly when required configuration is missing.

---

# 21. Dependency Injection

Use FastAPI dependency injection for application concerns where appropriate.

Dependencies should remain:

* small
* composable
* testable
* explicit

Do not create a dependency solely to wrap a single trivial expression.

Avoid hidden global state.

Prefer explicit dependencies over service locators and global mutable objects.

---

# 22. Architecture

Keep responsibilities separated.

A typical structure may look like:

```text
app/
├── api/
│   ├── routes/
│   └── dependencies.py
├── core/
│   ├── config.py
│   └── logging.py
├── db/
│   ├── models/
│   ├── session.py
│   └── repositories/
├── schemas/
├── services/
├── domain/
└── main.py

tests/
├── unit/
├── integration/
└── api/
```

This is guidance, not a requirement.

Follow the existing project structure if it differs.

Do not reorganize the entire project just because another structure looks cleaner.

---

# 23. SOLID

Apply SOLID principles pragmatically.

### Single Responsibility

Classes and functions should have one coherent responsibility.

### Open/Closed

Design extension points where the application genuinely needs them.

Do not over-engineer speculative extensibility.

### Liskov Substitution

Subtypes must preserve the expected behavior of their abstractions.

### Interface Segregation

Prefer small focused interfaces/protocols over large interfaces.

### Dependency Inversion

High-level business logic should not unnecessarily depend directly on infrastructure details.

Use dependency injection where it provides real value.

Do not create interfaces for every class.

Python's duck typing and protocols can often provide sufficient abstraction.

---

# 24. DRY

Avoid duplicated business logic.

However, do not prematurely abstract similar-looking code.

Two pieces of code that happen to look similar may represent different concepts.

Prefer duplication over a bad abstraction.

Only extract shared functionality when the behavior is genuinely shared.

---

# 25. Refactoring

When fixing or extending existing code:

* make the smallest reasonable change
* preserve existing behavior unless change is intentional
* avoid unrelated refactoring
* avoid unnecessary file movement
* avoid renaming public APIs without reason
* update tests alongside the implementation

If a refactor is necessary, keep it understandable and separately identifiable.

Do not rewrite large portions of the codebase without explicit justification.

---

# 26. Performance

Do not prematurely optimize.

First make the code correct and maintainable.

When performance matters, identify the actual bottleneck.

For database-heavy code pay attention to:

* query count
* query plans
* indexes
* pagination
* unnecessary serialization
* N+1 queries
* large result sets

Do not optimize based solely on assumptions.

---

# 27. API Compatibility

Treat API contracts as important.

Before changing:

* endpoint paths
* HTTP methods
* request schemas
* response schemas
* status codes
* error formats

check whether existing clients/tests depend on them.

Avoid breaking changes unless explicitly requested.

---

# 28. Documentation

Document non-obvious behavior.

Do not add comments that simply restate the code.

Prefer explaining:

* why something is implemented a certain way
* important business rules
* non-obvious constraints
* workarounds
* architectural decisions

Keep documentation synchronized with behavior.

---

# 29. Git and Changes

Keep changes focused.

Do not modify unrelated files.

Do not introduce generated files unless required.

Do not revert user changes.

Before modifying a file, understand whether there are already uncommitted changes.

Never overwrite or discard work that was not created by you.

---

# 30. Mandatory Validation After Changes

After making a code change, run the smallest relevant validation immediately.

For example:

```bash
uv run pytest path/to/relevant/tests
```

Then run:

```bash
uv run ruff check .
uv run ruff format --check .
uv run mypy .
```

Before declaring the task complete, run the complete test suite:

```bash
uv run pytest
```

If the project has a single CI command or Makefile target, prefer using that as the final validation command.

For example:

```bash
make check
```

or:

```bash
uv run pytest && uv run ruff check . && uv run ruff format --check . && uv run mypy .
```

Never claim that tests or checks passed unless you actually ran them.

If a check cannot be run, explicitly state that it was not run and why.

---

# 31. Change Workflow

For every implementation task, follow this workflow:

### Step 1 — Understand

Inspect:

* relevant source files
* tests
* configuration
* database models
* existing patterns

### Step 2 — Plan

Determine:

* what needs to change
* what tests are required
* whether database migrations are required
* whether API contracts change
* whether dependencies are required

Keep the plan proportional to the task.

### Step 3 — Implement

Make the smallest clean implementation.

Follow existing architecture.

### Step 4 — Test

Add or update tests.

Run the relevant tests immediately.

### Step 5 — Lint and Type Check

Run:

```bash
uv run ruff check .
uv run ruff format --check .
uv run mypy .
```

Fix issues rather than suppressing them.

### Step 6 — Full Validation

Run:

```bash
uv run pytest
```

and the project's complete validation/CI command if one exists.

### Step 7 — Review

Before finishing, check:

* Is the implementation correct?
* Are edge cases covered?
* Are tests meaningful?
* Is logging appropriate?
* Are errors handled correctly?
* Is the code typed?
* Is the API contract safe?
* Is the database behavior correct?
* Is a migration required?
* Were unnecessary dependencies avoided?
* Did I accidentally modify unrelated code?
* Did I run all required checks?

---

# 32. Definition of Done

A task is complete only when:

* The requested functionality is implemented.
* Existing behavior is preserved unless intentionally changed.
* Tests are added or updated.
* Relevant tests pass.
* The full test suite passes.
* Ruff linting passes.
* Ruff formatting passes.
* mypy passes.
* Required database migrations exist.
* Logging is appropriate.
* Errors are handled intentionally.
* No secrets are exposed.
* No unnecessary dependencies were added.
* The implementation follows the existing architecture.
* No unrelated changes were introduced.

At the end of the task, report:

1. What changed.
2. What tests were added/updated.
3. What validation commands were run.
4. Whether they passed.
5. Any remaining limitations or concerns.

Never hide failing tests, lint errors, type errors, or known limitations.

# 33. Javascript code style
ESLint for enforcing rules
Prettier for formatting
Airbnb style as the baseline
eslint-plugin-react / eslint-plugin-react-hooks for React-specific rules
2 spaces for indentation
Single quotes
Semicolons
const by default; let when reassignment is needed
Avoid var
Prefer === over ==
Prefer named, descriptive variables/functions
Keep components focused and relatively small
Use PascalCase for React components
Use camelCase for variables/functions
Use UPPER_SNAKE_CASE for true constants
