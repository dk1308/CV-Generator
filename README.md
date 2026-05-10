# update-cv

Static CV generator built with Astro. Each YAML file in `src/content/cv/` becomes a CV page at `/cv/<id>/`, and can also be exported to PDF with Paged.js.

## Requirements

- Node.js 22.12.0 or newer
- npm

## Install

```bash
npm install
```

## Run locally

Start the Astro dev server:

```bash
npm run dev
```

Open the local URL shown in the terminal, then visit:

- `/` for the homepage
- `/cv/sample/` for the sample CV
- `/cv/<id>/` for any other CV file

## How CV files work

CV data is stored as YAML files in `src/content/cv/`.

Examples:

- `src/content/cv/sample.yaml` -> `/cv/sample/`
- `src/content/cv/my_sample.yaml` -> `/cv/my_sample/`

The YAML content is validated by the Astro content schema in `src/content.config.ts`, then rendered by the dynamic route in `src/pages/cv/[id].astro`.

## Create or update a CV

1. Add a new YAML file in `src/content/cv/`
2. Use the file name as the CV id
3. Fill in fields such as:
	 - `name`
	 - `function`
	 - `email`
	 - `summary`
	 - `skills`
	 - `recent_projects`
	 - `additional_projects`
	 - `certificates`
	 - `courses`

Example:

```yaml
name: "Jane Doe"
function: "Software Engineer"
email: "jane.doe@example.com"

summary: |
	Engineer with experience in web development and cloud systems.

skills:
	- { name: "React", level: 2 }
	- { name: "Node.js", level: 2 }

recent_projects:
	- period: "2025 - Present"
		customer: "Internal Project"
		function: "Frontend Developer"
		description: "Built internal tools for operations."
		activities:
			- "Implemented dashboard UI"
			- "Integrated REST APIs"
		technologies: ["React", "TypeScript"]
```

After saving the file, open `/cv/<id>/` in the browser.

## Build the site

Generate the static site into `dist/`:

```bash
npm run build
```

Preview the built output:

```bash
npm run preview
```

## Export a PDF

Generate a PDF for one CV by id:

```bash
npm run pdf -- sample
```

This script will:

1. Build the Astro site
2. Serve the generated `dist/` folder
3. Render `/cv/<id>/` with `pagedjs-cli`
4. Save the PDF to `dist/pdf/<id>.pdf`

Example output:

- `dist/pdf/sample.pdf`

## Project structure

- `src/content/cv/` - CV YAML files
- `src/content.config.ts` - schema for validating CV content
- `src/pages/cv/[id].astro` - dynamic CV route
- `src/layouts/cv-layout.astro` - page layout
- `src/components/` - reusable CV sections
- `src/styles/` - screen and print styles
- `scripts/build-pdf.mjs` - PDF export script
- `public/` - static assets and Paged.js helpers

## Notes

- URLs use trailing slashes, for example `/cv/sample/`
- PDF export depends on the built static output
- Only committed sample files should be kept in git if personal CV data is sensitive

Static CV generator built with Astro. Each YAML file in `src/content/cv/` becomes a CV page at `/cv/<id>/`, and can also be exported to PDF with Paged.js.

## Requirements

- Node.js 22.12.0 or newer
- npm

## Install

```bash
npm install