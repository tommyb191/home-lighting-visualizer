import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';

export const maxDuration = 60;

const LIGHTING_PROMPT = `Transform this daytime photograph of a home into the exact same home at night, professionally illuminated by high-end landscape lighting. The scene should feel like late evening — moody, atmospheric, and elegant.

LIGHTING TO APPLY:
- WARM UPLIGHTING on the facade: place lights at the base of the house washing up the walls, highlighting architectural features, columns, stonework, and textured surfaces
- PATH LIGHTING along any visible walkways, driveways, or garden paths — small warm pools of light at regular intervals
- TREE LIGHTING: subtle uplights at the base of any trees, plus gentle "moonlighting" effect from above casting soft dappled shadows on the ground
- ACCENT LIGHTING on garden beds, shrubs, or focal landscape features

INTERIOR WINDOW GLOW — IMPORTANT:
- Only a FEW windows should show interior light — NOT every window or door
- The interior glow should be VERY SUBTLE and DIM — a faint, warm amber suggestion of light, not bright illumination
- Most windows should appear dark or very dimly lit
- Think of a home where the residents are home but only one or two rooms are in use
- Doors should NOT glow brightly — they should be dark or only very faintly lit from within
- The visual emphasis should be on the EXTERIOR landscape lighting, not on interior brightness

SKY AND ATMOSPHERE:
- DEEP NIGHT SKY: dark navy to nearly black at the top, with subtle gradient
- This is late evening / well after dusk — NOT blue hour or twilight
- Stars may be faintly visible in the sky
- The overall scene should feel rich and dark, with the landscape lighting providing the primary illumination
- Surrounding areas (driveway, lawn beyond the lit zones, trees not directly lit) should fall into atmospheric darkness
- Strong contrast between the warmly lit zones and the darker surroundings

CRITICAL CONSTRAINTS:
- Do NOT alter the home's structure, materials, paint color, roof, windows, doors, or landscaping
- Do NOT add or remove any architectural features
- Do NOT change the camera angle or composition
- Do NOT add cars, people, or new objects
- The home must be instantly recognizable as the same house — only the lighting and time of day should change
- Photorealistic quality, professional architectural photography aesthetic
- Warm color temperature (2700K-3000K) for all landscape lighting
- Tasteful, restrained, high-end residential design — NOT theatrical, NOT theme-park, NOT a Christmas display`;

export async function POST(req) {
  try {
    const { image, name, email, phone } = await req.json();

    if (!image || !name || !email || !phone) {
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

    const generatedDataUrl = `data:${generatedMimeType};base64,${generatedBase64}`;

    sendEmails({
      name,
      email,
      phone,
      originalImageBase64: imageData,
      originalMimeType: mimeType,
      generatedImageBase64: generatedBase64,
      generatedMimeType,
    }).catch((err) => console.error('Email send failed:', err));

    return NextResponse.json({ generatedImage: generatedDataUrl });
  } catch (err) {
    console.error('Generate route error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

async function sendEmails({
  name,
  email,
  phone,
  originalImageBase64,
  originalMimeType,
  generatedImageBase64,
  generatedMimeType,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping emails');
    return;
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

  await resend.emails.send({
    from: `${businessName} <${fromEmail}>`,
    to: email,
    subject: 'Your home, illuminated ✨',
    html: customerEmailHtml,
    attachments: [
      {
        filename: `your-home-illuminated.${generatedExt}`,
        content: generatedImageBase64,
      },
    ],
  });

  if (businessEmail) {
    const leadEmailHtml = `
<div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #0a1525; margin-bottom: 4px;">🏡 New Lead from the Home Lighting Preview Tool</h2>
  <p style="color: #64748b; font-size: 14px; margin-top: 0;">Submitted ${new Date().toLocaleString()}</p>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 15px;">
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; width: 100px; color: #64748b;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><strong>${escapeHtml(name)}</strong></td></tr>
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
  </table>
  <p style="font-size: 14px; color: #475569;">Both the original photo and the generated nighttime preview are attached.</p>
  <div style="margin-top: 30px; padding: 16px; background: #f1f5f9; border-radius: 6px; font-size: 14px; color: #475569;">
    <strong>Next step:</strong> Call or email within 24 hours while they're still excited about the preview.
  </div>
</div>`;

    await resend.emails.send({
      from: `Lead Bot <${fromEmail}>`,
      to: businessEmail,
      subject: `🏡 New lead: ${name} (${phone})`,
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
  }
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
