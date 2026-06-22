# Helping Hands Community Website

## Project Overview

Helping Hands Community Care is a non-profit website created to raise awareness, encourage donations, recruit volunteers, and share information about community projects.

The website supports food relief, education support, environmental clean-ups, awareness programmes, and community outreach.

## Website Pages

- `index.html` - Home page with hero content, impact gallery, and dynamic community updates
- `about.html` - About page with mission, vision, values, and jQuery tabs
- `projects.html` - Projects page with sortable project directory
- `donating.html` - Donation page with donation form and Unsplash images
- `volunteer.html` - Volunteer page with volunteer information and call-to-action button
- `contact.html` - Contact page with form validation, modal popup, AJAX-style processing, accordion, and Leaflet map

## Technologies Used

- HTML5
- CSS3
- JavaScript
- jQuery
- Leaflet.js
- OpenStreetMap tiles
- Unsplash images
- JSON for dynamic content
- Git and GitHub

## Key Features

- Responsive page layout for desktop, tablet, and mobile screens
- Centered page sections with consistent image sizing
- Unsplash images across the website
- Active navigation link highlighting
- Call-to-action buttons linked with JavaScript
- jQuery accordion on the contact page
- jQuery tabs on the about page
- Sortable project cards on the projects page
- Dynamic content loading from `data/community-content.json`
- Gallery lightbox for website images
- DOM manipulation for enhanced page behavior
- Contact form validation with field-level errors
- Success/error modal popup
- AJAX-style form processing using `fetch()`
- Contact messages saved locally with `localStorage`
- Leaflet map showing Gauteng, South Africa
- Scroll, hover, modal, tab, and lightbox animations
- Reduced-motion support for accessibility
- `robots.txt` and `sitemap.xml` for basic SEO support

## Folder Structure

```text
helpinghandscommunity/
|-- about.html
|-- contact.html
|-- donating.html
|-- index.html
|-- projects.html
|-- volunteer.html
|-- css/
|   `-- style.css
|-- data/
|   `-- community-content.json
|-- images/
|-- javascript/
|   `-- script.js
|-- robot.txt
|-- robots.txt
`-- sitemap.xml
```

## JavaScript Features

The main JavaScript file is `javascript/script.js`.

It includes:

- Navigation highlighting
- Button redirects
- Form validation
- Contact form processing
- Success and error modal handling
- Leaflet map initialization
- jQuery accordion
- jQuery tabs
- Project sorting
- Dynamic JSON content loading
- Gallery lightbox
- Scroll reveal animations

## Contact Form

The contact form includes:

- Full name validation
- Email validation
- Optional phone number validation
- Contact reason selection
- Subject validation
- Message validation
- Field-level error messages
- Success/error modal popup
- AJAX-style form submission

Because this is a static website, the form does not send data to a real server yet. Submitted contact messages are stored in the browser with `localStorage`.

## SEO Files

- `robots.txt` allows search engines to crawl the website.
- `sitemap.xml` lists the main website pages.
- `robot.txt` is included as a backup, but the correct standard filename is `robots.txt`.

## How to Run

Open `index.html` in a web browser.

For the best experience with dynamic JSON loading, run the project through a local web server instead of opening the files directly.

## Changelog

### Version 3.0

- Added JavaScript functionality across the website
- Added jQuery accordion, tabs, sorting, and lightbox
- Added dynamic content loading from JSON
- Added contact form validation and modal popup
- Added AJAX-style form processing
- Added Leaflet map
- Updated all images to Unsplash sources
- Improved page and image widths
- Added animations and reduced-motion support
- Added `robots.txt` and `sitemap.xml`

### Version 2.0

- Added CSS styling
- Added responsive design
- Added hover effects
- Updated colour scheme
- Improved page layout
- Added goals and objectives content

## Author

Helping Hands Community Website Project

## References

- MDN Web Docs
- W3Schools
- jQuery Documentation
- Leaflet Documentation
- OpenStreetMap
- Unsplash
