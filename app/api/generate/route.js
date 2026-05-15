import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Resend } from 'resend';
 
export const maxDuration = 60;
 
const LIGHTING_PROMPT = `Transform this daytime photograph of a home into the exact same home at night, professionally illuminated by high-end exterior landscape lighting. The aesthetic should match a high-end real estate twilight photograph — moody, atmospheric, elegant, restrained.
 
EXTERIOR LANDSCAPE LIGHTING — apply across the ENTIRE width of the home:
- WARM UPLIGHTING along the FULL facade: place uplights at the base of the house at regular, evenly-spaced intervals from far left to far right. Every section of the facade receives uplighting — including between every set of windows, at every corner, and along every wall.
- BETWEEN-WINDOW UPLIGHTING: place uplights in every gap between windows on both floors so the surface glows softly in those spaces.
- PATH LIGHTING: small warm pools of light at regular intervals along walkways, driveways, garden paths.
- TREE LIGHTING: subtle warm uplights at the base of any trees, gentle moonlighting from above with soft dappled shadows.
- SHRUB AND PLANTING ACCENT LIGHTS: warm spots highlighting the foundation plantings and garden beds.
 
LIGHTING INTENSITY — VERY IMPORTANT, FOLLOW STRICTLY:
- The uplighting must be SOFT, RESTRAINED, and SUBTLE — NEVER bright, blown-out, or harsh
- DO NOT create bright white hotspots on the facade — the lit surfaces should show a gentle WARM AMBER GLOW (around 2700K), never overexposed white
- The light should look NATURAL and ATMOSPHERIC, as if photographed at proper exposure — NOT as if the lights are too powerful for the surfaces
- Think of well-designed residential lighting, not stage lighting or commercial spotlights
- The brightest parts of the lit facade should still show the home's actual material color (brick, paint, stone) — never pure white
- Light pools on surfaces should fade GRADUALLY into shadow, with no harsh edges
- A professional architectural photographer would use careful exposure to render the lighting beautifully — match that aesthetic
- If in doubt, err on the side of LESS bright
 
WINDOWS, DOORS, AND INTERIOR:
- Nearly all windows should be DARK or nearly dark
- ONLY 1-2 windows total should show a faint, dim warm glow — and even those should be muted, subtle, barely noticeable
- The front DOOR must be DARK — no light spilling from the doorway
- DOOR SIDELIGHTS and TRANSOM WINDOWS must be DARK
- Both sides of the home must have EQUALLY balanced (low) interior light
- The home's visual presence comes from EXTERIOR landscape lighting hitting the facade SOFTLY — NOT from interior light bleeding out
 
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
 
    // Try to send emails and capture any errors so we can see them
    let emailDebug = { attempted: false, customerSent: false, businessSent: false, error: null };
    try {
      emailDebug = await sendEmails({
        name,
        email,
        phone,
        originalImageBase64: imageData,
        originalMimeType: mimeType,
        generatedImageBase64: generatedBase64,
        generatedMimeType,
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
  phone,
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
    <tr><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
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
