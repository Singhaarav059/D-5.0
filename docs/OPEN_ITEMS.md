# Open Items & Asset Inventory: MOVIQ Template vs. Demaze Technologies

This document inventories every media asset and framerusercontent.com hotlink across the site, specifying whether each asset is a MOVIQ template artifact (to replace/license) or a verified Demaze client asset.

---

## 1. MOVIQ Template Assets (To Replace / Keep if Licensed)

| Asset Name | Current Source URL | Location / Section | Status / Recommendation |
| :--- | :--- | :--- | :--- |
| **Hero Tulips Photo** | `https://framerusercontent.com/images/ARARV5Cuijn1OkIAmMU3MLyJ1w.png` | Homepage Hero (`[data-framer-name="Hero"]`) | **Replace** with dark tech mesh / AI gradient background (`assets/demaze/`) |
| **Butterfly Banner** | `https://framerusercontent.com/images/KNEZuTQ6JK9iqzZCfGUvbvOBrc.jpg` | Homepage Contact CTA (`.framer-1uf6wvw`) | **Replace / Keep if licensed**; overlaid with deep blue gradient scrim |
| **Audio Waveform** | `https://framerusercontent.com/images/mEUH0ODJikF8cY6okrEAv9CVdpg.png` | What Drives Us (Card 2) | **Replace / Remove**; hide audio waveform since Demaze is AI/SaaS, not audio |
| **Software Lifecycle Render** | `https://framerusercontent.com/images/RSLxFvRnqKN9jHkAb6zSKFx8lMI.jpg` | What Drives Us / Gallery | **Replace** with Demaze engineering graphic (`eng_ownership_graphic_1789813608834.jpg`) |
| **Analytics Chart** | `https://framerusercontent.com/images/t9WSGzDHwufHGs89A1vNyAyM00.png` | What Drives Us (Card 3) | **Replace** with Demaze AI dashboard graphic (`ai_execution_graphic_1789813451769.jpg`) |
| **Editor Mockup (Meadow)** | `https://framerusercontent.com/images/3f18N2B5y47dOaP58yW4ZfG07c.png` | Industries We Serve | **Replace** with domain-specific Demaze project screenshots |
| **Circuit / VR Headset** | `https://framerusercontent.com/images/PcPQ1jrfW1TlV4Ah8dgWjRwqTs.jpg` | Gallery / Subpages | **Replace** with Demaze cloud scale graphic (`cloud_scale_graphic_1789813631564.jpg`) |
| **Faint 3D White Spheres** | `https://framerusercontent.com/images/UoV40soWAuwc3apDIJ2CrWUKep0.png`, `ZuFdy...`, `jm0rr...` | Why Choose Us Cards | **Replace** with Lucide crisp SVG duotone capsules (`#5B4FE9` on `#F0EEFF`) |

---

## 2. Verified Demaze Client Assets (Ground Truth from demazetech.com)

| Asset Name | Source URL | Location / Section | Verification |
| :--- | :--- | :--- | :--- |
| **Demaze Technologies Logo** | `https://framerusercontent.com/images/g9sZPcgZ3bVZQgiCX8DybKWIy4.png` | Header Nav & Footer | Confirmed live on demazetech.com |
| **Favicon** | `https://framerusercontent.com/images/gtUg6e8c5ok6pYFG4fbE5TeXE.png` | Head metadata | Confirmed live on demazetech.com |
| **Founder Portrait (Krupal Chaudhary)** | `https://framerusercontent.com/images/e57nypBBfPrAXfYYyYgNJBgJBo.jpeg` | Who We Are / Founder Quote | Confirmed live on demazetech.com (resized to 72px avatar) |
| **Luxury Car Dealership Project** | `https://framerusercontent.com/images/bVi4OWXFwyZEQNbjP5qntMAjM.png` | Showcase Project 1 | Confirmed in `demaze_pages_scraped.json` (Project 1) |
| **Case Management Software** | `https://framerusercontent.com/images/jHPfuoOX9UNd8Es5s5F3M8wzzo.png` | Showcase Project 2 | Confirmed in `demaze_pages_scraped.json` (Project 2) |
| **Luxury eCommerce Platform** | `https://framerusercontent.com/images/K9H6ej2APXMnI3TZXYvyYkXZtJQ.png` | Showcase Project 3 | Confirmed in `demaze_pages_scraped.json` (Project 3) |
| **Sukoon Senior Support Platform** | `https://framerusercontent.com/images/VsL7mX1NiP3eW5xTBH6fPjjVFfw.png` | Showcase Project 4 | Confirmed in `demaze_pages_scraped.json` (Project 4) |
| **Multi-vendor eCommerce App** | `https://framerusercontent.com/images/n2k5j6C5nfmufhjsYnF8HXy5qY.png` | Projects Subpage | Confirmed in `demaze_pages_scraped.json` (Project 5) |
| **Food & Grocery Delivery App** | `https://framerusercontent.com/images/kl6BbE7vPzKmqIbeDQ2Qi0qBgrw.png` | Projects Subpage | Confirmed in `demaze_pages_scraped.json` (Project 6) |
| **Car Service ("Hello John") App** | `https://framerusercontent.com/images/d6j0sZ9K35yv7jK9Z2lJ98c0dY.png` | Projects Subpage | Confirmed in `demaze_pages_scraped.json` (Project 7) |
| **Technology Partner Logos (8 items)** | `Langchain, Python, Tensorflow, OpenAI, Hugging Face, Pinecone, Kafka, Elastic` | Tools & Technologies | All 8 verified from live demazetech.com |

---

## 3. Project Count Verification (S-2 Resolution)
The client asked to verify whether 16 project cards on `/projects` exist in the source data.
**Finding**: Verified against `demaze_pages_scraped.json` (scraped directly from `https://www.demazetech.com/projects`):
All 16 projects are genuine Demaze client projects matching the live production website. None are invented.
