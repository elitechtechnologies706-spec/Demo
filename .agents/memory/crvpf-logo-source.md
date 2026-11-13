---
name: CRVPF logo source mismatch
description: The specified public logo image does not visually match CRVPF branding.
---

The supplied `https://crvpf.org/wp-content/uploads/2025/02/2-2.png` URL returns an image but visually displays a TIDES mark. The CRVPF homepage HTML points to `https://crvpf.org/wp-content/uploads/2025/01/CRPVF_Final_Logo-08.png` as its logo image. On 2026-11-13, the user chose the homepage logo for the header. That official asset is white and is not visible against the demo’s white header.

**Why:** the mismatch is visible in the running preview and can make the site appear to use another organization’s branding; the user selected the actual CRVPF logo after seeing the mismatch.

**How to apply:** use the homepage logo asset for CRVPF branding; do not restore the `2-2.png` image unless the user explicitly asks. Preserve the asset colors; ask before adding a contrasting background or changing the header.
