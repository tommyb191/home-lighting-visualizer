import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';

export const maxDuration = 60;

const LIGHTING_PROMPT = `Transform this daytime photograph of a home into the exact same home at night with ONLY ground-based landscape lighting installed by a professional landscape lighting company. The HOUSE ITSELF is dark — no interior lights, no porch lights, no coach lights, no sconces — only the landscape lighting in the yard is operating. The aesthetic should match a high-end real estate twilight photograph showcasing landscape lighting design — moody, atmospheric, elegant, restrained.

CRITICAL OVERALL CONSTRAINT — THE HOUSE IS DARK, ONLY THE YARD IS LIT:
- The home itself appears as if its electrical power is off
- ALL light comes from ground-based landscape fixtures aimed UP at the facade and plantings
- ZERO light comes from any fixture mounted on the home itself (no coach lights, no sconces, no porch lights, no interior lights through windows)
- If you find yourself rendering a glowing porch light or coach light, you are violating this constraint — replace it with a dark unlit fixture

EXTERIOR GROUND-BASED LANDSCAPE LIGHTING — apply across the ENTIRE width of the home:
- WARM UPLIGHTING along the FULL facade: place uplights AT GROUND LEVEL at the base of the house at regular, evenly-spaced intervals from far left to far right. The light source is in the ground, aimed UPWARD onto the wall. Every section of the facade receives this ground-based uplighting — including between every set of windows, at every corner, and along every wall.
- TWO-STORY HOMES — REACHING THE SECOND FLOOR: if the home has two stories, the SAME ground-based uplights at the base of the wall should be aimed steeply UPWARD so their cone of light reaches the second-floor facade. Where a single-story roof section sits in front of a two-story section (above garages, porches, sunrooms, first-floor extensions), additional uplights may be placed ON THE GROUND just behind that roof section, hidden from view, aimed UP at the second floor — but they must still be GROUND-BASED, aimed UP, not mounted on the building. The goal: the second floor receives the same warm wash as the first floor, with the light cone visibly traveling UPWARD from below. NO part of the upper facade should remain in shadow.

★ DOWNWARD-FACING LIGHT IS FORBIDDEN ★
The light cone on the facade must always be widest at the top and narrowest at the bottom — this is the signature of an UPLIGHT (light from below aiming up).
- DO NOT place any fixture in the soffit, eaves, fascia, or any high mounted location aimed DOWNWARD
- DO NOT create downward cones of light on the facade (these look like inverted triangles: bright at top, fading down)
- DO NOT add recessed downlights, soffit lights, wash lights, sconce-style downlights, or anything that mounts on the home and aims down at the wall or ground
- The visual signature you must AVOID: a tight bright spot HIGH on the facade with light fading DOWNWARD below it (this is a soffit downlight — WRONG)
- The visual signature you must PRODUCE: a wider warm wash on the facade that is brightest at the BOTTOM of the wall and gradually fades UPWARD (this is a ground uplight — CORRECT)
- BETWEEN-WINDOW UPLIGHTING: place ground uplights in every gap between windows on both floors so the surface glows softly in those spaces — light source is on the GROUND, aimed UP. Never on the gutter, never in the soffit, never aimed down.
- PATH LIGHTING: small warm pools of light at regular intervals along walkways, driveways, garden paths — small fixtures at ground level casting light downward and outward.
- TREE LIGHTING: subtle warm uplights at the base of any trees aimed up into the canopy, gentle moonlighting from above with soft dappled shadows.
- SHRUB AND PLANTING ACCENT LIGHTS: warm spots highlighting the foundation plantings and garden beds — light source low and aimed at the plant.
- ENTRY AREA UPLIGHTING: place two ground uplights flanking the front door area on the ground, aimed UP at the entry facade — this replaces what coach lights would normally do. The entry area should be lit BUT only from ground-based uplights, never from wall-mounted coach lights.

LIGHTING INTENSITY — VERY IMPORTANT, FOLLOW STRICTLY:
- The uplighting must be SOFT, RESTRAINED, and SUBTLE — NEVER bright, blown-out, or harsh
- DO NOT create bright white hotspots on the facade — the lit surfaces should show a gentle WARM AMBER GLOW (around 2700K), never overexposed white
- The light should look NATURAL and ATMOSPHERIC, as if photographed at proper exposure — NOT as if the lights are too powerful for the surfaces
- Think of well-designed residential lighting, not stage lighting or commercial spotlights
- The brightest parts of the lit facade should still show the home's actual material color (brick, paint, stone) — never pure white
- Light pools on surfaces should fade GRADUALLY into shadow, with no harsh edges
- A professional architectural photographer would use careful exposure to render the lighting beautifully — match that aesthetic
- If in doubt, err on the side of LESS bright

WINDOWS, DOORS, AND COACH LIGHTS — ALL DARK / OFF:

CRITICAL FRAMING — READ THIS FIRST:
Imagine the HOUSE ITSELF has its power turned OFF, but a separate landscape lighting circuit is operating in the yard. The home is asleep. The homeowner has gone to bed. NO interior lights are on, NO porch lights are on, NO sconces are on, NO coach lights are on. The ONLY light source on the entire property is professional landscape lighting installed in the ground and aimed at the home and plantings.

The dark zones below are non-negotiable and must remain pitch black:

ALL WINDOWS:
- Every single window on the home must be DARK — completely unlit, showing no interior glow whatsoever
- Windows should look like dark, slightly reflective glass — as if the rooms behind them are empty and unlit
- This includes upstairs windows, downstairs windows, dormer windows, transom windows, sidelights, garage windows, and basement windows
- DO NOT add any warm light, amber tint, or yellow glow inside or behind ANY window

THE FRONT DOOR AND ENTIRE ENTRY AREA:
- The front door must be DARK — no light spilling from inside, no glow from above, no glow from the sides
- DOOR SIDELIGHTS (the vertical narrow windows beside the door) must be COMPLETELY DARK
- TRANSOM WINDOWS (the horizontal window above the door) must be COMPLETELY DARK
- The wall area immediately around the front door must be DARK — no warm wash, no spotlight, no glow
- The ceiling/overhang above the door must be DARK

WALL-MOUNTED FIXTURES (this is where you keep making mistakes — read carefully):
- DO NOT illuminate any wall-mounted fixture on the home
- This includes: coach lights, lanterns, sconces, pendant lights, porch lights, wall-mounted lamps, gooseneck lights, barn lights, dome lights — ANY light attached to the exterior wall of the home
- Coach lights are the lantern-style fixtures typically mounted on either side of the front door, beside garage doors, and sometimes between garage doors. THESE MUST BE DARK.
- If the daytime photo shows a coach light, render it in the same position but UNLIT — like a lamp that is turned off
- DO NOT add coach lights, sconces, or porch lights that were not in the daytime photo
- DO NOT add a glow, halo, or light spill emanating from any fixture mounted on the home's walls
- The bulbs inside these fixtures should appear DARK GRAY or BLACK, not yellow or warm

★ MOST COMMON ERROR — FRONT DOOR COACH LIGHTS ★
The AI consistently makes the mistake of placing a small glowing point of light at the position where coach lights / lanterns sit on either side of the front door. THIS MUST STOP. Follow these rules absolutely:

- The two positions on either side of the front door — where coach lights typically hang — must contain NO LIGHT-EMITTING OBJECT in the final image. No glow. No bulb. No bright spot. No yellow point.
- If you see a coach light fixture in the daytime photo, render that fixture as a dark silhouette — solid black or very dark gray glass with NO internal light. It must look like a switched-off lamp on a porch — a dark inert object.
- DO NOT render any small bright point of light at coach-light height on either side of the front door, EVER, under any circumstances.
- The two specific pixel regions to your left and right of the front door at approximately head-height must be DARK in the final image — darker than the surrounding wall.
- The wall behind these positions can be softly lit (from ground uplights below) but the coach light fixture itself, and the air directly around it, must be completely dark.
- Self-check before finalizing: scan the area immediately beside the front door at head height. If you see ANY small bright spot, yellow glow, or warm point of light there — REMOVE IT. That spot must be black or near-black.

The same rule applies to:
- Coach lights beside garage doors (the bulb position must contain no glow)
- Coach lights between garage doors
- Sconces anywhere on the home's exterior walls
- Pendant lights under porch ceilings
- Any lantern, lamp, or fixture mounted on the exterior wall of the home

CORRECT rendering of an entry with coach lights:
- Wall is softly warm from ground uplights below
- Coach light fixtures are visible but appear DARK (off)
- No glow emanates from the bulb area of any wall-mounted fixture
- The lighting pattern shows light traveling UPWARD from the ground onto the wall, with NO point sources at fixture height

GARAGE AREA:
- Garage doors must be DARK
- Any coach lights or sconces beside or above garage doors must be DARK / OFF
- DO NOT add wash light or glow above the garage doors from house-mounted fixtures
- Garage windows must be DARK

EQUALITY ACROSS THE HOME:
- Left side and right side of the home must be equally dark in terms of house-mounted lighting
- No section of the facade should appear lit by anything other than ground-based landscape lighting

ONLY ALLOWED LIGHT SOURCES:
- Uplights placed in the ground, at the base of the home, aimed UPWARD onto the facade (creates wash of light on brick/siding from below)
- Uplights at the base of trees aimed up into the canopy
- Path lights along walkways and driveways at ground level
- Small accent spots aimed at shrubs and plantings from ground level
- Moonlighting from above in trees (downward soft dappled light)

THAT'S IT. NO OTHER LIGHT SOURCES. If you find yourself adding glow to a wall-mounted fixture, STOP and replace that glow with a ground-based uplight at the base of the wall instead.

REMEMBER: the home is dark. The yard is lit. The bulbs in any house-mounted fixtures are OFF.

BALANCE AND SYMMETRY:
- Left side and right side receive EQUAL exterior landscape lighting
- No section of the facade should be noticeably brighter than another
- Cohesive, professional, intentional — like a single designer planned every fixture

SKY AND ATMOSPHERE:
- DEEP NIGHT SKY: dark navy fading to nearly black, with a subtle gradient
- Late evening — well after dusk, not twilight or blue hour
- A few faint stars may be visible
- Areas not directly hit by landscape lighting fall into rich, atmospheric darkness
- Strong but tasteful contrast between the warmly lit zones and the darker surroundings

CRITICAL CONSTRAINTS:
- Do NOT alter the home's structure, materials, paint color, brick, siding, roof, windows, doors, or landscaping
- Do NOT add or remove any architectural features, signs, or text
- Do NOT change the camera angle or composition
- Do NOT add cars, people, or new objects
- The home must be instantly recognizable as the same building — only the lighting and time of day should change
- Photorealistic, professional architectural photography aesthetic
- Warm color temperature (2700K-3000K) for all landscape lighting
- Restrained, tasteful, high-end — NEVER theatrical, theme-park, Las Vegas, Christmas-display, or commercial-floodlight aesthetic`;

// ============================================================
// POST-PROCESSING: Coach Light Hotspot Removal
// ============================================================
// The Gemini model frequently fails to keep coach lights dark, especially
// the lanterns flanking the front door. This function detects small bright
// warm hotspots in the typical coach-light positions on the home and dims
// them to blend with the surrounding wall.
//
// Approach:
// 1. Decode the generated image into raw pixels
// 2. Compute a "hotspot" mask: pixels that are saturated warm yellow/orange
//    AND surrounded by darker pixels (i.e., isolated bright points, not
//    large washes of light)
// 3. Restrict the mask to vertical bands where coach lights typically sit
//    (middle horizontal third + extreme left/right thirds for garage areas)
// 4. For each masked pixel, blend toward the average color of nearby
//    non-hotspot pixels — effectively painting over the hotspot with the
//    surrounding dark wall color
// 5. Re-encode and return

async function dimCoachLightHotspots(imageBuffer) {
  // Lazy import sharp; if it fails for any reason, just return the original
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.warn('Sharp not available — skipping coach light post-processing', err.message);
    return imageBuffer;
  }

  try {
    const img = sharp(imageBuffer);
    const metadata = await img.metadata();
    const { width, height } = metadata;
    if (!width || !height) return imageBuffer;

    // Extract raw RGB pixels
    const { data, info } = await img
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = info.channels; // 4 (RGBA)
    const pixels = new Uint8ClampedArray(data); // mutable copy

    // ===== Build hotspot mask =====
    // A pixel is a "hotspot candidate" if:
    //   - It is bright (luminance > 200)
    //   - It is warm (R > G > B with R-B difference significant)
    //   - It is NOT inside a large wash (we'll filter that next)

    const isHotspotCandidate = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const warm = r > g && g > b && (r - b) > 30;
        if (lum > 200 && warm) {
          isHotspotCandidate[y * width + x] = 1;
        }
      }
    }

    // ===== Region restriction =====
    // Coach lights live in predictable vertical zones:
    //   - Front door: roughly the middle 50% of the image width
    //     at vertical positions between 30% and 70% from the top
    //   - Garage: outer 30% of the width on either side, between
    //     35% and 70% from the top
    // We only process candidates in these zones.
    //
    // We also EXCLUDE the bottom 25% of the image (plantings/ground
    // are allowed to have warm uplight glow) and the top 15% (sky).

    const zoneMask = new Uint8Array(width * height);
    const yMin = Math.floor(height * 0.25);
    const yMax = Math.floor(height * 0.75);
    for (let y = yMin; y < yMax; y++) {
      for (let x = 0; x < width; x++) {
        // Allow processing across the full width (covers door + garages)
        zoneMask[y * width + x] = 1;
      }
    }

    // ===== Isolated-spot filter =====
    // A real ground-uplight wash covers many pixels in a broad area.
    // A coach light glow is a small, isolated cluster of bright pixels
    // surrounded by darker wall. We use a simple test: for each
    // candidate pixel, sample pixels in a ring at radius ~40px. If
    // most of those ring pixels are DARK (lum < 130), this is an
    // isolated hotspot. If many are bright, it's part of a larger
    // wash and we leave it alone.

    const RING_RADIUS = Math.max(20, Math.floor(Math.min(width, height) * 0.025));
    const ringOffsets = [];
    const samples = 16;
    for (let i = 0; i < samples; i++) {
      const angle = (i / samples) * 2 * Math.PI;
      const dx = Math.round(Math.cos(angle) * RING_RADIUS);
      const dy = Math.round(Math.sin(angle) * RING_RADIUS);
      ringOffsets.push({ dx, dy });
    }

    const finalMask = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (!isHotspotCandidate[i] || !zoneMask[i]) continue;

        // Sample ring
        let darkCount = 0;
        let totalCount = 0;
        for (const { dx, dy } of ringOffsets) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nIdx = (ny * width + nx) * channels;
          const r = pixels[nIdx];
          const g = pixels[nIdx + 1];
          const b = pixels[nIdx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 130) darkCount++;
          totalCount++;
        }
        // If at least 50% of the ring is dark, this is an isolated
        // hotspot — flag it for dimming
        if (totalCount > 0 && darkCount / totalCount >= 0.5) {
          finalMask[i] = 1;
        }
      }
    }

    // ===== Dilate the mask =====
    // Grow the mask by a few pixels so we cover the full hotspot
    // including its bloom/halo, not just the brightest core.
    const DILATION = Math.max(15, Math.floor(Math.min(width, height) * 0.02));
    const dilated = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!finalMask[y * width + x]) continue;
        // Mark a square around this pixel
        const x0 = Math.max(0, x - DILATION);
        const x1 = Math.min(width - 1, x + DILATION);
        const y0 = Math.max(0, y - DILATION);
        const y1 = Math.min(height - 1, y + DILATION);
        for (let yy = y0; yy <= y1; yy++) {
          for (let xx = x0; xx <= x1; xx++) {
            // Use circular distance for a soft round mask
            const dx = xx - x;
            const dy = yy - y;
            if (dx * dx + dy * dy <= DILATION * DILATION) {
              dilated[yy * width + xx] = 1;
            }
          }
        }
      }
    }

    // ===== Compute replacement color =====
    // For each masked pixel, we want to replace it with the average
    // color of nearby NON-masked, non-bright pixels — i.e., the dark
    // wall surrounding the hotspot. Sample at a larger radius outside
    // the dilated mask.
    const SAMPLE_RADIUS = DILATION + 30;
    let totalSampleR = 0;
    let totalSampleG = 0;
    let totalSampleB = 0;
    let sampleCount = 0;

    // Sample a thin ring just outside each masked region for a local
    // average. To keep this O(N) we just sample ~500 random pixels
    // OUTSIDE the dilated mask but in the zone.
    for (let attempt = 0; attempt < 2000 && sampleCount < 500; attempt++) {
      const x = Math.floor(Math.random() * width);
      const y = yMin + Math.floor(Math.random() * (yMax - yMin));
      const i = y * width + x;
      if (dilated[i]) continue; // skip masked
      const idx = i * channels;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 140) continue; // skip bright areas (wall washes)
      totalSampleR += r;
      totalSampleG += g;
      totalSampleB += b;
      sampleCount++;
    }

    let replR = 30, replG = 22, replB = 18; // dark warm fallback
    if (sampleCount >= 50) {
      replR = Math.round(totalSampleR / sampleCount);
      replG = Math.round(totalSampleG / sampleCount);
      replB = Math.round(totalSampleB / sampleCount);
    }

    // ===== Apply mask =====
    // For each masked pixel, blend toward the replacement color.
    // Use a soft falloff so the edges of the dimmed area aren't
    // sharply visible.
    let pixelsDimmed = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (!dilated[i]) continue;
        const idx = i * channels;

        // Compute blend strength based on original luminance — brighter
        // pixels get fully replaced; dimmer pixels at the mask edge get
        // partial replacement.
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const strength = Math.max(0.5, Math.min(1.0, (lum - 120) / 130));

        pixels[idx]     = Math.round(r * (1 - strength) + replR * strength);
        pixels[idx + 1] = Math.round(g * (1 - strength) + replG * strength);
        pixels[idx + 2] = Math.round(b * (1 - strength) + replB * strength);
        pixelsDimmed++;
      }
    }

    console.log(`Coach light post-processing: dimmed ${pixelsDimmed} pixels (${((pixelsDimmed / (width * height)) * 100).toFixed(2)}% of image)`);

    // Re-encode as JPEG (smaller for email) at high quality
    const output = await sharp(Buffer.from(pixels), {
      raw: { width, height, channels }
    })
      .jpeg({ quality: 90 })
      .toBuffer();

    return output;
  } catch (err) {
    console.error('Post-processing error, returning original:', err);
    return imageBuffer;
  }
}

export async function POST(req) {
  try {
    const { image, name, email } = await req.json();

    if (!image || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const base64Match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!base64Match) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }
    const mimeType = base64Match[1];
    const imageData = base64Match[2];

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data: imageData } },
            { text: LIGHTING_PROMPT },
          ],
        },
      ],
    });

    let generatedBase64 = null;
    let generatedMimeType = 'image/png';
    const parts = response?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        generatedBase64 = part.inlineData.data;
        generatedMimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!generatedBase64) {
      console.error('No image returned from Gemini', JSON.stringify(response, null, 2));
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }

    // === Post-process: dim coach light hotspots ===
    // Gemini frequently fails to keep coach lights dark. This step
    // detects bright isolated hotspots in typical coach-light positions
    // and blends them into the surrounding dark wall.
    let processedBase64 = generatedBase64;
    let processedMimeType = generatedMimeType;
    try {
      const inputBuf = Buffer.from(generatedBase64, 'base64');
      const cleanedBuf = await dimCoachLightHotspots(inputBuf);
      processedBase64 = cleanedBuf.toString('base64');
      processedMimeType = 'image/jpeg';
    } catch (err) {
      console.error('Post-processing failed, using original Gemini output:', err);
    }

    const generatedDataUrl = `data:${processedMimeType};base64,${processedBase64}`;

    // Try to send emails and capture any errors so we can see them
    let emailDebug = { attempted: false, customerSent: false, businessSent: false, error: null };
    try {
      emailDebug = await sendEmails({
        name,
        email,
        originalImageBase64: imageData,
        originalMimeType: mimeType,
        generatedImageBase64: processedBase64,
        generatedMimeType: processedMimeType,
      });
    } catch (err) {
      console.error('EMAIL ERROR:', err);
      emailDebug.error = err.message || String(err);
    }
    console.log('EMAIL DEBUG:', JSON.stringify(emailDebug));

    return NextResponse.json({ generatedImage: generatedDataUrl, emailDebug });
  } catch (err) {
    console.error('Generate route error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

async function sendEmails({
  name,
  email,
  originalImageBase64,
  originalMimeType,
  generatedImageBase64,
  generatedMimeType,
}) {
  const debug = {
    attempted: true,
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 6) : 'MISSING',
    fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    businessEmail: process.env.BUSINESS_EMAIL || 'MISSING',
    customerSent: false,
    customerResult: null,
    businessSent: false,
    businessResult: null,
    error: null,
  };

  if (!process.env.RESEND_API_KEY) {
    debug.error = 'RESEND_API_KEY environment variable is not set in Vercel';
    console.warn(debug.error);
    return debug;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const businessEmail = process.env.BUSINESS_EMAIL;
  const businessName = process.env.BUSINESS_NAME || 'Phantom';
  const businessWebsite = process.env.BUSINESS_WEBSITE || 'https://phantomsound.com/start-a-project/';

  const originalExt = originalMimeType.split('/')[1] || 'jpg';
  const generatedExt = generatedMimeType.split('/')[1] || 'png';

  const customerEmailHtml = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #050a14; color: #ffffff; padding: 40px 30px;">
  <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 8px 0; color: #ffffff;">
    Your home, <em style="color: #f4d27a;">illuminated</em>
  </h1>
  <p style="color: #94a3b8; font-family: 'Helvetica Neue', sans-serif; font-size: 15px; margin: 0 0 30px 0;">
    Hi ${escapeHtml(name)}, here's your AI preview from Phantom.
  </p>
  <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
    Your nighttime preview is attached to this email. This is what your home could look like with professional landscape lighting — warm facade uplighting, path lights, tree accents, and tasteful architectural illumination.
  </p>
  <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
    Want to see what this would actually look like at your home? We'd love to come out, walk the property with you, and put together a real design and quote — no obligation.
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${businessWebsite}" style="display: inline-block; background: linear-gradient(135deg, #f4d27a, #c9933a); color: #050a14; padding: 14px 32px; text-decoration: none; font-family: 'Helvetica Neue', sans-serif; font-weight: 500; letter-spacing: 0.05em; border-radius: 2px;">
      Start a Project With Phantom
    </a>
  </div>
  <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 13px; color: #64748b; margin-top: 40px;">
    Or just reply to this email — we'd love to hear from you.
  </p>
  <hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;" />
  <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; color: #475569; line-height: 1.5;">
    This is an AI-generated preview. Real lighting design will be customized to your home's architecture, landscape, and your personal preferences.
  </p>
</div>`;

  try {
    const customerResult = await resend.emails.send({
      from: `${businessName} <${fromEmail}>`,
      to: email,
      replyTo: businessEmail || fromEmail,
      subject: 'Your home, illuminated ✨',
      html: customerEmailHtml,
      attachments: [
        {
          filename: `your-home-illuminated.${generatedExt}`,
          content: generatedImageBase64,
        },
      ],
    });
    debug.customerSent = !customerResult.error;
    debug.customerResult = customerResult.error ? JSON.stringify(customerResult.error) : 'success: ' + (customerResult.data?.id || 'no id');
    console.log('CUSTOMER EMAIL RESULT:', JSON.stringify(customerResult));
  } catch (err) {
    debug.customerResult = 'EXCEPTION: ' + (err.message || String(err));
    console.error('CUSTOMER EMAIL EXCEPTION:', err);
  }

  if (businessEmail) {
    const leadEmailHtml = `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #0a1525; margin-bottom: 4px;">🏡 New Lead from the Home Lighting Preview Tool</h2>
  <p style="color: #64748b; font-size: 14px; margin-top: 0;">Submitted ${new Date().toLocaleString()}</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 15px;">
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; width: 100px; color: #64748b;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${escapeHtml(name)}</strong></td></tr>
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  </table>
  <p style="font-size: 14px; color: #475569;">Both the original photo and the generated nighttime preview are attached.</p>
  <div style="margin-top: 30px; padding: 16px; background: #f1f5f9; border-radius: 6px; font-size: 14px; color: #475569;">
    <strong>Next step:</strong> Call or email within 24 hours while they're still excited about the preview.
  </div>
</div>`;

    try {
      const businessResult = await resend.emails.send({
        from: `Lead Bot <${fromEmail}>`,
        to: businessEmail,
        replyTo: email,
        subject: `🏡 New lead: ${name}`,
        html: leadEmailHtml,
        attachments: [
          {
            filename: `original.${originalExt}`,
            content: originalImageBase64,
          },
          {
            filename: `generated.${generatedExt}`,
            content: generatedImageBase64,
          },
        ],
      });
      debug.businessSent = !businessResult.error;
      debug.businessResult = businessResult.error ? JSON.stringify(businessResult.error) : 'success: ' + (businessResult.data?.id || 'no id');
      console.log('BUSINESS EMAIL RESULT:', JSON.stringify(businessResult));
    } catch (err) {
      debug.businessResult = 'EXCEPTION: ' + (err.message || String(err));
      console.error('BUSINESS EMAIL EXCEPTION:', err);
    }
  }

  return debug;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}
