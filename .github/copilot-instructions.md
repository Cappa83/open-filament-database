# Copilot Coding Agent Instructions

## Repository Overview

This is the **Open Filament Database** by SimplyPrint - an open-source, community-driven database of 3D printing filament information. The repository contains structured filament data, validation tools, and a web-based editing interface.

**Key Information:**
- **Project Type**: Data repository with Python validation tools and SvelteKit WebUI
- **Languages**: Python 3.11+, TypeScript/JavaScript (Node.js 22+), JSON
- **Size**: ~26 brands, hundreds of filaments, thousands of variants
- **Framework**: SvelteKit for WebUI, Tailwind CSS, Playwright for testing
- **Target Runtime**: Node.js server for WebUI, Python scripts for validation

## Data Architecture & File Structure

The repository follows a strict hierarchical structure:

```
data/
├── [Brand Name]/                     # e.g., "Bambu Lab", "Prusament"
│   ├── brand.json                    # Brand metadata (required)
│   ├── [brand-logo].(png|jpg|...)    # Brand logo file
│   └── [Material]/                   # e.g., "PLA", "ABS", "PETG"
│       ├── material.json             # Material metadata (required)
│       └── [Filament]/               # e.g., "Basic", "Tough+"
│           ├── filament.json         # Filament metadata (required)
│           └── [Variant]/            # e.g., "Blue", "Red", "Transparent"
│               ├── variant.json      # Color/variant info (required)
│               └── sizes.json        # Available sizes & purchase links (required)
```

**Additional Key Directories:**
- `/schemas/` - JSON Schema files for validation
- `/webui/` - Complete SvelteKit web application
- `/stores/` - Store/retailer definitions
- `/profiles/` - Auto-generated slicer profiles
- `/.github/workflows/` - CI/CD automation

## Build, Test & Validation Commands

### Environment Setup
**Always install dependencies first:**
```bash
# Python dependencies (required for validation)
pip install -r requirements.txt

# WebUI dependencies (required for web interface)
cd webui
npm ci
cd ..
```

### Data Validation (Critical for PRs)
**Run these in order after any data changes:**
```bash
# Validate folder naming consistency
python3 data_validator.py --folder-names

# Validate JSON schema compliance  
python3 data_validator.py --json-files

# Validate store ID references
python3 data_validator.py --store-ids
```

**Platform Notes:**
- Linux/macOS: Use `python3`
- Windows: Use `python.exe`
- If `python3` command fails, try `python`

### WebUI Development & Testing
```bash
cd webui

# Start development server (http://localhost:5173)
npm run dev

# Type checking (expect ~103 TypeScript errors - this is normal)
npm run check

# Build for production (succeeds despite TypeScript errors)
npm run build

# Preview production build
npm run preview

# Run Playwright tests (may fail in CI due to browser installation)
npm run test:install  # Install browsers first
npm test
```

**Known Issues & Workarounds:**
- **TypeScript errors**: ~103 errors exist but don't prevent builds
- **Playwright CI failures**: Browser installation often fails in CI environments
- **Build warnings**: Accessibility warnings are non-blocking
- **npm vulnerabilities**: Some known vulnerabilities in dependencies (non-critical)

### Profile Management
```bash
# Update slicer profiles (automated daily via GitHub Actions)
python3 load_profiles.py
```

## GitHub Actions & CI/CD

The repository runs these validations on every PR:

1. **Data Validation** (`validate_data.yaml`):
   - Runs on changes to `data/`, `stores/`, `schemas/`, or validation scripts
   - Matrix job: folder-names, json-files, store-ids
   - **Environment**: Ubuntu 24.04, Python 3.11

2. **WebUI Tests** (`webui-tests.yml`):  
   - Runs on changes to `webui/`
   - Steps: npm ci → build → Playwright tests
   - **Environment**: Ubuntu latest, Node.js 22

3. **Profile Updates** (`update_profiles.yaml`):
   - Scheduled daily at midnight UTC
   - Downloads and processes slicer profiles

## Common Development Workflows

### Adding New Brand Data
1. Create brand folder with consistent naming (no illegal characters)
2. Add `brand.json` with required fields: brand, logo, website, origin
3. Add logo image file
4. **Always validate**: `python3 data_validator.py --folder-names --json-files`

### Modifying WebUI
1. Navigate to `webui/` directory
2. Install dependencies: `npm ci`
3. Start dev server: `npm run dev`
4. Make changes
5. Build to verify: `npm run build`
6. **Note**: TypeScript errors are expected and don't block builds

### Debugging Validation Failures
- Check folder naming matches JSON content exactly
- Verify JSON schema compliance using files in `/schemas/`
- Ensure all required JSON files exist at each hierarchy level
- Use illegal character list: `#%&{}\\<>*?/$!'":@+\`|=` (see `data_validator.py:18`)

## Critical Configuration Files

**Root Level:**
- `requirements.txt` - Python dependencies (jsonschema, Pillow, iniconfig)
- `data_validator.py` - Main validation script with schema checks
- `*.py` - Additional Python utilities for profiles and serialization

**WebUI Configuration:**
- `webui/package.json` - npm scripts and dependencies
- `webui/svelte.config.js` - SvelteKit configuration
- `webui/vite.config.js` - Vite build configuration  
- `webui/playwright.config.js` - Test configuration (baseURL: localhost:4173)
- `webui/tailwind.config.js` - Tailwind CSS configuration

**Validation Schemas:**
- `schemas/brand_schema.json` - Brand metadata validation
- `schemas/material_schema.json` - Material properties validation
- `schemas/filament_schema.json` - Filament specifications validation
- `schemas/variant_schema.json` - Color/variant data validation
- `schemas/sizes_schema.json` - Size and purchase link validation
- `schemas/store_schema.json` - Store/retailer definitions

## Time Estimates for Commands

- **Python validation**: 5-15 seconds per validation type
- **WebUI npm ci**: 15-30 seconds
- **WebUI build**: 5-10 seconds  
- **WebUI type check**: 10-20 seconds
- **Playwright test install**: 2-5 minutes (or fails in CI)
- **Profile updates**: 1-2 minutes

**Additional Documentation:**
- `/docs/` directory contains user guides for contributors:
  - `validation.md` - Detailed validation instructions
  - `webui.md` - WebUI usage guide
  - `installing-software.md` - Setup instructions for contributors
  - `forking.md`, `cloning.md`, `pull-requesting.md` - Git workflow guides

## GitHub Templates & Community

The repository includes structured templates for community contributions:

**Issue Templates** (`.github/ISSUE_TEMPLATE/`):
- `brand-request.md` - For requesting new brand additions
- `filament-request.md` - For requesting new filament additions  
- `store-request.md` - For requesting new store/retailer additions

**Pull Request Templates** (`.github/PULL_REQUEST_TEMPLATE/`):
- `data-addition.md` - For data contribution PRs
- `webui-changes.md` - For WebUI/code changes

## Trust These Instructions

These instructions are comprehensive and tested. Only search the codebase if:
- You encounter errors not mentioned in the "Known Issues" sections
- You need to understand specific business logic beyond data validation/WebUI development
- The information here appears outdated or incorrect
- You're implementing entirely new functionality not covered above

For routine data validation, WebUI development, or build processes, follow these instructions directly without additional exploration.