import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Invite } from "./entities/invite.entity"
import { type CreateInviteDto, InviteMethod } from "./dto/create-invite.dto"
import { InviteResponseDto } from "./dto/invite-response.dto"
import { InviteStatus } from "./enums/invite-status.enum"
import type { IInviteService } from "./interfaces/invite-service.interface"
import { v4 as uuidv4 } from "uuid"
import type { ConfigService } from "@nestjs/config"
import * as nodemailer from "nodemailer"
import * as twilio from "twilio"

@Injectable()
export class InviteFriendsService implements IInviteService {
  private readonly twilioClient: twilio.Twilio
  private readonly emailTransporter: nodemailer.Transporter
  private readonly appUrl: string
  private readonly inviteExpirationDays: number = 7;

  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    private configService: ConfigService,
  ) {
    // Initialize Twilio client
    const twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    if (twilioAccountSid && twilioAuthToken) {
      this.twilioClient = twilio(twilioAccountSid, twilioAuthToken);
    }

    // Initialize Nodemailer transporter
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    
    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      this.emailTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }

    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  async createInvite(createInviteDto: CreateInviteDto, userId: string): Promise<InviteResponseDto> {
    const { method, email, phone } = createInviteDto

    // Validate input based on method
    if (method === InviteMethod.EMAIL && !email) {
      throw new BadRequestException("Email is required for email invitations")
    }

    if (method === InviteMethod.SMS && !phone) {
      throw new BadRequestException("Phone number is required for SMS invitations")
    }

    // Generate a unique token
    const inviteToken = this.generateInviteToken()

    // Set expiration date (7 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + this.inviteExpirationDays)

    // Create the invite entity
    const invite = this.inviteRepository.create({
      emailOrPhone: email || phone,
      inviteToken,
      status: InviteStatus.PENDING,
      expiresAt,
      invitedById: userId,
    })

    // Save to database
    const savedInvite = await this.inviteRepository.save(invite)

    // Generate shareable link
    const shareableLink = `${this.appUrl}/invite/accept/${inviteToken}`

    // Send the invitation based on the method
    await this.sendInvitation(method, email, phone, shareableLink)

    // Return the response
    return this.mapToResponseDto(savedInvite, shareableLink)
  }

  async acceptInvite(token: string): Promise<InviteResponseDto> {
    const invite = await this.inviteRepository.findOne({ where: { inviteToken: token } })

    if (!invite) {
      throw new NotFoundException("Invitation not found")
    }

    if (invite.status === InviteStatus.ACCEPTED) {
      throw new BadRequestException("Invitation has already been accepted")
    }

    if (invite.status === InviteStatus.EXPIRED || invite.expiresAt < new Date()) {
      // Update status if it's expired
      if (invite.status !== InviteStatus.EXPIRED) {
        invite.status = InviteStatus.EXPIRED
        await this.inviteRepository.save(invite)
      }
      throw new BadRequestException("Invitation has expired")
    }

    // Update the invite status
    invite.status = InviteStatus.ACCEPTED
    const updatedInvite = await this.inviteRepository.save(invite)

    // Return the response
    return this.mapToResponseDto(updatedInvite)
  }

  async getInviteByToken(token: string): Promise<InviteResponseDto> {
    const invite = await this.inviteRepository.findOne({ where: { inviteToken: token } })

    if (!invite) {
      throw new NotFoundException("Invitation not found")
    }

    // Check if expired but not marked as such
    if (invite.status !== InviteStatus.EXPIRED && invite.expiresAt < new Date()) {
      invite.status = InviteStatus.EXPIRED
      await this.inviteRepository.save(invite)
    }

    return this.mapToResponseDto(invite)
  }

  async expireOldInvites(): Promise<void> {
    const now = new Date()

    await this.inviteRepository
      .createQueryBuilder()
      .update(Invite)
      .set({ status: InviteStatus.EXPIRED })
      .where("expiresAt < :now", { now })
      .andWhere("status = :status", { status: InviteStatus.PENDING })
      .execute()
  }

  private generateInviteToken(): string {
    // Generate a UUID and take the first 12 characters
    return uuidv4().replace(/-/g, "").substring(0, 12)
  }

  private async sendInvitation(
    method: InviteMethod,
    email?: string,
    phone?: string,
    shareableLink?: string,
  ): Promise<void> {
    const inviteMessage = `You've been invited to join our platform! Click here to accept: ${shareableLink}`

    switch (method) {
      case InviteMethod.EMAIL:
        if (this.emailTransporter && email) {
          await this.sendEmail(email, "Invitation to join our platform", inviteMessage)
        }
        break
      case InviteMethod.SMS:
        if (this.twilioClient && phone) {
          await this.sendSms(phone, inviteMessage)
        }
        break
      case InviteMethod.SOCIAL:
        // For social sharing, we just generate the link and return it
        // The frontend will handle the actual sharing
        break
    }
  }

  private async sendEmail(to: string, subject: string, text: string): Promise<void> {
    if (!this.emailTransporter) {
      console.warn("Email transporter not configured. Skipping email send.")
      return
    }

    const fromEmail = this.configService.get<string>("EMAIL_FROM") || "noreply@example.com"

    await this.emailTransporter.sendMail({
      from: fromEmail,
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
    })
  }

  private async sendSms(to: string, text: string): Promise<void> {
    if (!this.twilioClient) {
      console.warn("Twilio client not configured. Skipping SMS send.")
      return
    }

    const fromPhone = this.configService.get<string>("TWILIO_PHONE_NUMBER")

    if (!fromPhone) {
      console.warn("Twilio phone number not configured. Skipping SMS send.")
      return
    }

    await this.twilioClient.messages.create({
      body: text,
      from: fromPhone,
      to,
    })
  }

  private mapToResponseDto(invite: Invite, shareableLink?: string): InviteResponseDto {
    const response = new InviteResponseDto()
    response.id = invite.id
    response.emailOrPhone = invite.emailOrPhone
    response.inviteToken = invite.inviteToken
    response.status = invite.status
    response.createdAt = invite.createdAt
    response.expiresAt = invite.expiresAt

    if (shareableLink) {
      response.shareableLink = shareableLink
    } else {
      response.shareableLink = `${this.appUrl}/invite/accept/${invite.inviteToken}`
    }

    return response
  }
}

