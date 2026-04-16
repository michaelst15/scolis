package com.mybing.backend.otp;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {
  private final JavaMailSender mailSender;
  private final String from;
  private final String fromName;

  public MailService(
    JavaMailSender mailSender,
    @Value("${MAIL_FROM:no-reply@mybing.ai}") String from,
    @Value("${MAIL_FROM_NAME:MyBing.ai}") String fromName
  ) {
    this.mailSender = mailSender;
    this.from = from;
    this.fromName = fromName;
  }

  public void sendOtp(String to, String code, long ttlMinutes) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
      if (fromName != null && !fromName.isBlank()) {
        helper.setFrom(new InternetAddress(from, fromName));
      } else {
        helper.setFrom(from);
      }
      helper.setTo(to);
      helper.setSubject("Kode OTP MyBing.ai");
      String plain =
        "Kode OTP MyBing.ai\n\n" +
        "Kode OTP kamu: " +
        code +
        "\n\n" +
        "Berlaku " +
        ttlMinutes +
        " menit. Jangan bagikan kode ini.\n";

      String html =
        "<!doctype html>" +
        "<html lang=\"id\">" +
        "<head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"/></head>" +
        "<body style=\"margin:0;padding:0;background:#0a0f26;color:#ffffff;font-family:Inter,Arial,sans-serif;\">" +
        "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background:#0a0f26;padding:24px 12px;\">" +
        "<tr><td align=\"center\">" +
        "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:560px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:22px;overflow:hidden;\">" +
        "<tr><td style=\"padding:0\">" +
        "<div style=\"height:3px;background:linear-gradient(90deg,#F59E0B,#FBBF24,#FDE68A);\"></div>" +
        "</td></tr>" +
        "<tr><td style=\"padding:22px 22px 10px 22px;\">" +
        "<div style=\"font-family:Oswald,Arial,sans-serif;font-size:22px;letter-spacing:-0.2px;line-height:1.2\">" +
        "<span style=\"color:#ffffff\">MyBing</span><span style=\"color:#FBBF24\">.ai</span>" +
        "</div>" +
        "<div style=\"margin-top:6px;color:rgba(255,255,255,0.78);font-size:13px;line-height:1.6\">" +
        "Gunakan kode berikut untuk verifikasi email dan melanjutkan pendaftaran." +
        "</div>" +
        "</td></tr>" +
        "<tr><td style=\"padding:14px 22px 0 22px;\">" +
        "<div style=\"background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:18px;padding:18px;\">" +
        "<div style=\"color:rgba(255,255,255,0.70);font-size:12px;letter-spacing:0.6px;text-transform:uppercase;\">Kode OTP</div>" +
        "<div style=\"margin-top:10px;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:30px;letter-spacing:6px;color:#FBBF24;\">" +
        code +
        "</div>" +
        "<div style=\"margin-top:10px;color:rgba(255,255,255,0.72);font-size:12px;line-height:1.6\">" +
        "Berlaku <b style=\"color:#ffffff;\">" +
        ttlMinutes +
        " menit</b>. Jangan bagikan kode ini kepada siapa pun." +
        "</div>" +
        "</div>" +
        "</td></tr>" +
        "<tr><td style=\"padding:14px 22px 20px 22px;\">" +
        "<div style=\"color:rgba(255,255,255,0.58);font-size:12px;line-height:1.6\">" +
        "Jika kamu tidak merasa meminta OTP, abaikan email ini." +
        "</div>" +
        "</td></tr>" +
        "<tr><td style=\"padding:16px 22px;background:rgba(0,0,0,0.18);border-top:1px solid rgba(255,255,255,0.08);\">" +
        "<div style=\"color:rgba(255,255,255,0.55);font-size:11px;line-height:1.6\">" +
        "Email otomatis dari MyBing.ai. Mohon tidak membalas email ini." +
        "</div>" +
        "</td></tr>" +
        "</table>" +
        "</td></tr>" +
        "</table>" +
        "</body></html>";

      helper.setText(plain, html);
      mailSender.send(message);
    } catch (Exception ex) {
      throw new IllegalStateException("Gagal mengirim OTP email: " + ex.getMessage(), ex);
    }
  }
}
