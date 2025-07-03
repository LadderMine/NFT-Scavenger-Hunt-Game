import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByTopic(topic: string): Promise<Content[]> {
    return this.contentRepository.find({
      where: { topic, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({ 
      where: { id, isActive: true } 
    });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async update(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOne(id);
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async remove(id: string): Promise<void> {
    const content = await this.findOne(id);
    await this.contentRepository.remove(content);
  }

  async findAllAdmin(): Promise<Content[]> {
    return this.contentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneAdmin(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({ where: { id } });
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async updateAdmin(id: string, updateContentDto: UpdateContentDto): Promise<Content> {
    const content = await this.findOneAdmin(id);
    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async removeAdmin(id: string): Promise<void> {
    const content = await this.findOneAdmin(id);
    await this.contentRepository.remove(content);
  }
} 