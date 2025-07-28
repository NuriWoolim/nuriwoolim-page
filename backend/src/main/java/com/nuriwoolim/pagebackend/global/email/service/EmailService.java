package com.nuriwoolim.pagebackend.global.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[누리울림] 이메일 인증을 완료해주세요");

            String verificationUrl = "http://localhost:8080" + "/auth/verify-email?token=" + token;
            String htmlContent = buildEmailContent(verificationUrl);

            helper.setText(htmlContent, true);

            log.info("Sending verification email to " + to);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("이메일 발송에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildEmailContent(String verificationUrl) {
        return String.format(
            "<!DOCTYPE html>" +
                "<html lang='ko'>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<title>누리울림 이메일 인증</title>" +
                "</head>" +
                "<body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif; background: linear-gradient(135deg, #fff3cd 0%%, #ffe5a3 100%%); min-height: 100vh;'>"
                +

                "<div style='max-width: 600px; margin: 0 auto; padding: 40px 20px;'>" +

                "<!-- Header -->" +
                "<div style='text-align: center; margin-bottom: 40px;'>" +
                "<div style='background: white; display: inline-block; padding: 20px 30px; border-radius: 50px; box-shadow: 0 10px 30px rgba(255, 193, 77, 0.2);'>"
                +
                "<h1 style='margin: 0; color: #f4a261; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;'>🎵 누리울림</h1>"
                +
                "</div>" +
                "</div>" +

                "<!-- Main Content -->" +
                "<div style='background: white; border-radius: 20px; padding: 50px 40px; box-shadow: 0 20px 60px rgba(244, 162, 97, 0.15); margin-bottom: 30px; border: 2px solid #fff8e1;'>"
                +

                "<!-- Icon -->" +
                "<div style='text-align: center; margin-bottom: 30px;'>" +
                "<div style='width: 80px; height: 80px; background: linear-gradient(135deg, #ffd54f 0%%, #f4a261 100%%); border-radius: 50%%; margin: 0 auto; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(255, 213, 79, 0.4);'>"
                +
                "<span style='color: white; font-size: 36px;'>🎶</span>" +
                "</div>" +
                "</div>" +

                "<!-- Title -->" +
                "<h2 style='text-align: center; color: #e76f51; font-size: 32px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.3;'>이메일 인증</h2>"
                +

                "<!-- Subtitle -->" +
                "<p style='text-align: center; color: #8d5524; font-size: 18px; margin: 0 0 40px 0; line-height: 1.6;'>누리울림 밴드 동아리 가입을 완료하기 위해<br>이메일 인증을 진행해주세요</p>"
                +

                "<!-- Content -->" +
                "<div style='background: #fffbf0; border-radius: 15px; padding: 30px; margin-bottom: 40px; border-left: 4px solid #ffd54f;'>"
                +
                "<p style='color: #6f4e37; font-size: 16px; line-height: 1.7; margin: 0;'>안녕하세요! 🎸<br><br>"
                +
                "누리울림 밴드 동아리에 가입해주셔서 감사합니다!<br>" +
                "아래 버튼을 클릭하여 이메일 인증을 완료하시면 함께 음악을 만들어갈 수 있습니다.</p>" +
                "</div>" +

                "<!-- CTA Button -->" +
                "<div style='text-align: center; margin: 40px 0;'>" +
                "<a href='%s' style='display: inline-block; background: linear-gradient(135deg, #ffd54f 0%%, #f4a261 100%%); color: white; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-size: 18px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 10px 30px rgba(255, 213, 79, 0.5); transition: all 0.3s ease; text-shadow: 0 1px 2px rgba(0,0,0,0.1);'>"
                +
                "🎵 이메일 인증하기" +
                "</a>" +
                "</div>" +

                "<!-- Alternative Link -->" +
                "<div style='background: #fef7e0; border-radius: 10px; padding: 20px; margin-top: 30px; border: 1px solid #fff4c4;'>"
                +
                "<p style='color: #8d5524; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;'>버튼이 작동하지 않나요?</p>"
                +
                "<p style='color: #a0673b; font-size: 13px; margin: 0; word-break: break-all; line-height: 1.5;'>아래 링크를 복사하여 브라우저에 직접 붙여넣어 주세요:<br>"
                +
                "<span style='color: #f4a261; font-family: monospace;'>%s</span></p>" +
                "</div>" +

                "</div>" +

                "<!-- Footer -->" +
                "<div style='text-align: center; color: #8d5524; font-size: 14px;'>" +
                "<div style='background: rgba(255, 255, 255, 0.7); border-radius: 15px; padding: 25px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 213, 79, 0.3);'>"
                +
                "<p style='margin: 0 0 10px 0;'>⏰ <strong>이 링크는 10분 후에 만료됩니다</strong></p>" +
                "<p style='margin: 0; font-size: 13px; opacity: 0.8;'>🎼 함께 만들어갈 음악이 기대됩니다! 문의사항이 있으시면 고객센터로 연락해주세요.</p>"
                +
                "</div>" +
                "</div>" +

                "</div>" +
                "</body>" +
                "</html>",
            verificationUrl, verificationUrl
        );
    }
}
