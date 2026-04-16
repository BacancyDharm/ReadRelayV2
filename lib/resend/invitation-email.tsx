
export function invitationEmail({
  clubName,
  leaderName,
  inviteUrl,
}: {
  clubName: string
  leaderName: string
  inviteUrl: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #111;">
        
        <h2 style="margin-bottom: 8px;">You're invited to join a book club 📚</h2>
        
        <p style="color: #555; margin-bottom: 24px;">
          <strong>${leaderName}</strong> has invited you to join 
          <strong>${clubName}</strong> on ReadRelay — a structured book club platform.
        </p>

        <a 
          href="${inviteUrl}"
          style="
            display: inline-block;
            background: #2563eb;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin-bottom: 24px;
          "
        >
          Accept invitation
        </a>

        <p style="color: #888; font-size: 13px;">
          This invitation expires in 7 days. If you didn't expect this email, 
          you can safely ignore it.
        </p>

        <p style="color: #bbb; font-size: 12px;">
          Or copy this link: ${inviteUrl}
        </p>
      </body>
    </html>
  `
}