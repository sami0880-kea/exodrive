import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  constructor() {
    this.fromEmail = "noreply@exodrive.com";
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured, skipping email send");
        return { success: false, message: "Email service not configured" };
      }

      const result = await resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
        text,
      });

      console.log("Email sent successfully:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }
  }

  async sendNewMessageNotification({
    recipientEmail,
    recipientName,
    senderName,
    listingTitle,
    messageContent,
    listingId,
  }) {
    const subject = `Ny besked fra ${senderName} angående ${listingTitle}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ny besked - ExoDrive</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fd; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ef4444; margin: 0; font-size: 28px;">ExoDrive</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Din bilmarkedsplads</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Hej ${recipientName}!</h2>
              
              <p>Du har modtaget en ny besked fra <strong>${senderName}</strong> angående din annonce:</p>
              
              <div style="background-color: #f8f9fd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <h3 style="margin: 0 0 10px 0; color: #333;">${listingTitle}</h3>
                <p style="margin: 0; color: #666; font-style: italic;">"${messageContent}"</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://exxdrive.dkve.dk/messages" 
                   style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Se besked
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px; margin: 0;">
                Du modtager denne email, fordi nogen har sendt dig en besked på ExoDrive. 
                <br>Hvis du ikke ønsker at modtage disse notifikationer, kan du ændre dine indstillinger i din profil.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Hej ${recipientName}!

Du har modtaget en ny besked fra ${senderName} angående din annonce: ${listingTitle}

Besked: "${messageContent}"

Se beskeden på: https://exodrive.dk/messages

---
Du modtager denne email, fordi nogen har sendt dig en besked på ExoDrive.
    `;

    return await this.sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
    });
  }

  async sendWelcomeEmail({ email, name }) {
    const subject = "Velkommen til ExoDrive!";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Velkommen til ExoDrive</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fd; padding: 30px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ef4444; margin: 0; font-size: 28px;">ExoDrive</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Din bilmarkedsplads</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Velkommen ${name}!</h2>
              
              <p>Tak fordi du har oprettet en konto på ExoDrive. Vi er glade for at have dig med!</p>
              
              <p>På ExoDrive kan du:</p>
              <ul style="color: #666;">
                <li>Sælge din bil til tusindvis af potentielle købere</li>
                <li>Browse gennem eksklusive biler</li>
                <li>Kommunikere direkte med sælgere</li>
                <li>Få adgang til detaljerede bilinformationer</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://exodrive.dk" 
                   style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Kom i gang
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px;">
                Hvis du har spørgsmål, er du altid velkommen til at kontakte os.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Velkommen ${name}!

Tak fordi du har oprettet en konto på ExoDrive. Vi er glade for at have dig med!

På ExoDrive kan du:
- Sælge din bil til tusindvis af potentielle købere
- Browse gennem eksklusive biler
- Kommunikere direkte med sælgere
- Få adgang til detaljerede bilinformationer

Besøg ExoDrive: https://exodrive.dk

Hvis du har spørgsmål, er du altid velkommen til at kontakte os.
    `;

    return await this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }
}

export default new EmailService();
