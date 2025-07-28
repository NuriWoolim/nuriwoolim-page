package com.nuriwoolim.pagebackend.global.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[누리울림] 이메일 인증을 완료해주세요");

            String verificationUrl = "localhost:8080" + "/verify-email?token=" + token;
            String htmlContent = buildEmailContent(verificationUrl);

            helper.setText(htmlContent, true);

            log.info("Sending verification email to " + to);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("이메일 발송에 실패했습니다: " + e.getMessage());
        }
    }

    private String buildEmailContent(String verificationUrl) {
        return
            "<div style='max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;'>"
                +
                "<h2 style='color: #333;'>이메일 인증</h2>" +
                "<p>안녕하세요!</p>" +
                "<p>회원가입을 완료하기 위해 아래 링크를 클릭하여 이메일 인증을 완료해주세요.</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<a href='" + verificationUrl
                + "' style='background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;'>이메일 인증하기</a>"
                +
                "</div>" +
                "<p><small>이 링크는 24시간 후에 만료됩니다.</small></p>" +
                "</div>";
    }
}
