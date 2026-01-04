# Contributing to Astro Diary

Thank you for your interest in contributing to Astro Diary! This educational full-stack project demonstrates data collection, analysis, and ethical considerations in personal diary applications.

## Project Overview

Astro Diary is a web application where users:
- Enter their birthday to receive zodiac sign information
- Answer personalized diary questions in free text
- Have their entries analyzed for sentiment, emotions, topics, and entities
- Generate behavioral analytics through user tracking
- Access data through an admin dashboard for filtering and visualization

This project serves as an educational tool for understanding:
- Data collection and privacy
- Sentiment analysis and natural language processing
- User behavior tracking and analytics
- Ethical considerations in data-driven applications

## How to Contribute

We welcome contributions from students, educators, and developers interested in learning about full-stack development and data ethics. Whether you're fixing bugs, adding features, improving documentation, or sharing insights, your contributions are valuable.

### Ways to Contribute

- 🐛 Report and fix bugs
- ✨ Add new features
- 📚 Improve documentation
- 🎨 Enhance user interface
- 🔍 Improve data analysis algorithms
- 🛡️ Strengthen privacy and security measures
- 📖 Share educational insights about data ethics

## Development Setup

### Prerequisites

- Docker
- Docker Compose
- Git
- Modern web browser

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/EHB-MCT/wdm-RinaZeqiri-star.git
   cd wdm-RinaZeqiri-star/DEV5
   ```

2. **Environment setup**
   ```bash
   cp backend/.env.template backend/.env
   ```

3. **Start the development environment**
   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - User Frontend: http://localhost:5173
   - Admin Dashboard: http://localhost:5174
   - Backend API: http://localhost:3000
   - Database UI: http://localhost:8081

5. **Stop the environment**
   ```bash
   docker compose down
   ```

## Contribution Guidelines

### General Principles

- **Learning First**: Prioritize educational value over perfection
- **Ethical Responsibility**: Consider privacy implications of all changes
- **Transparency**: Document data collection and analysis methods
- **Collaboration**: Work openly and communicate clearly
- **Respect**: Value diverse perspectives and skill levels

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following our code standards
4. **Test** thoroughly in the Docker environment
5. **Commit** using conventional commit messages
6. **Push** to your fork
7. **Create** a pull request with clear description

## Code Standards

### Backend (Node.js/Express)

- Use ES6+ features consistently
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for asynchronous operations
- Include JSDoc comments for complex functions
- Validate all user inputs
- Implement proper logging

### Frontend (React/Vite)

- Use functional components with hooks
- Follow React best practices and patterns
- Implement proper state management
- Use semantic HTML5 elements
- Ensure accessibility (ARIA labels, keyboard navigation)
- Include loading states and error boundaries
- Use responsive design principles

### Database (MongoDB/Mongoose)

- Define clear schemas with validation
- Use appropriate indexes for performance
- Implement proper data relationships
- Handle database errors gracefully
- Use meaningful field names

### Docker/DevOps

- Keep Dockerfiles optimized and secure
- Use multi-stage builds when appropriate
- Define proper health checks
- Document container purposes

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for consistent and meaningful commit history.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no functional changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security-related changes

### Examples

```bash
feat(diary): add sentiment analysis for diary entries
fix(auth): resolve user session timeout issue
docs(readme): update setup instructions for Docker
refactor(analysis): optimize text processing algorithm
test(diary): add unit tests for entry validation
```

## Submitting Changes

### Pull Request Process

1. **Title**: Use conventional commit format
2. **Description**: Explain what and why, not just how
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Include UI changes if applicable
5. **Documentation**: Update relevant documentation
6. **Review**: Respond to review feedback promptly

### Quality Checklist

Before submitting, ensure:

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors in browser
- [ ] No security vulnerabilities introduced
- [ ] Privacy considerations addressed
- [ ] Docker environment works correctly

## Documentation Contributions

### Types of Documentation

- **API Documentation**: Endpoint descriptions and examples
- **User Guides**: Step-by-step instructions
- **Technical Documentation**: Architecture and design decisions
- **Educational Content**: Explanations of concepts and ethics
- **Code Comments**: Complex logic explanations

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep documentation up-to-date
- Consider different audience knowledge levels

## Bug Reports

### Reporting Bugs

1. **Use descriptive titles**: "Crash when saving diary entry after analysis"
2. **Provide context**: What you were trying to do
3. **Include steps to reproduce**: Exact sequence of actions
4. **Show expected vs actual behavior**: What should happen vs what happened
5. **Include environment details**: Browser, OS, Docker version
6. **Add screenshots/videos**: For UI issues

### Bug Fix Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should have happened

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 108]
- Docker version: [e.g., 20.10.17]

## Additional Context
Any other relevant information
```

## Feature Requests

### Proposing Features

1. **Check existing issues**: Avoid duplicates
2. **Use descriptive titles**: "Add export functionality for diary entries"
3. **Explain the problem**: What need does this address?
4. **Describe the solution**: How should it work?
5. **Consider alternatives**: Other approaches you considered
6. **Address privacy implications**: Data collection and usage

### Feature Request Template

```markdown
## Feature Description
Brief description of the proposed feature

## Problem Statement
What problem does this solve for users?

## Proposed Solution
How should this feature work?

## Privacy & Ethics Considerations
What data will be collected? How will it be used?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## Educational Contributions

Astro Diary is primarily an educational project. We particularly welcome contributions that:

- **Explain data ethics**: Discuss privacy implications and responsible data handling
- **Document algorithms**: Clarify how sentiment analysis and topic extraction work
- **Share learning experiences**: Document challenges and solutions discovered
- **Create tutorials**: Help others understand the project's architecture
- **Propose improvements**: Suggest ways to make the project more educational

### Educational Contribution Areas

- Data visualization techniques
- Natural language processing explanations
- Privacy by design principles
- User experience considerations for sensitive data
- Ethical frameworks for data collection
- Comparative analysis of different algorithms

## Data Ethics and Privacy

### Our Commitment

- **Transparency**: Clearly document what data we collect and why
- **Minimization**: Collect only necessary data
- **Security**: Protect user data appropriately
- **Control**: Give users control over their data
- **Education**: Help users understand data implications

### Contribution Guidelines

When working with user data:

- Always consider privacy implications
- Implement proper data anonymization
- Provide clear consent mechanisms
- Include data export/deletion options
- Document data processing purposes
- Follow GDPR principles where applicable

## Contact Information

For questions about contributing:

- **Maintainer**: Rina Zeqiri
- **Email**: rina.zeqiri@student.ehb.be
- **Project Repository**: https://github.com/EHB-MCT/wdm-RinaZeqiri-star

## Getting Help

- **Documentation**: Check existing docs first
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainer for private concerns

## Recognition

Contributors will be acknowledged in:
- Project README
- Release notes
- Special thanks section in documentation

---

Last Updated: January 2026
Project: Astro Diary – Educational Full-Stack Application