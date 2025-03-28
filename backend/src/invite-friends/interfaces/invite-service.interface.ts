import type { CreateInviteDto } from "../dto/create-invite.dto"
import type { InviteResponseDto } from "../dto/invite-response.dto"

export interface IInviteService {
  createInvite(createInviteDto: CreateInviteDto, userId: string): Promise<InviteResponseDto>
  acceptInvite(token: string): Promise<InviteResponseDto>
  getInviteByToken(token: string): Promise<InviteResponseDto>
  expireOldInvites(): Promise<void>
}

