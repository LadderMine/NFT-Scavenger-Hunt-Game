// email-change.service.ts
import { EmailService } from '../email/email.service';

@Injectable()
export class EmailChangeService {
  constructor(
    private readonly emailService: EmailService,
    // ...
  ) {}

  async requestEmailChange(userId: string, newEmail: string) {
    // ...
    const verificationUrl = `https://yourfrontend.com/email-change/verify?token=${token}`;
    await this.emailService.sendEmail(
      newEmail,
      'Verify Your New Email',
      `<p>Click the link to verify your new email: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    );
    // ...
  }
}
