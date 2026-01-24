import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SetRoutePolicy } from 'src/common/decorators/set-route-policy.decorator';
import { DefaultMessageResponseDto } from 'src/common/dtos/DefaultMessageResponse.dto';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import type { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { MessageIdParm } from 'src/common/swagger/decorators/message-id-param.decorator';
import {
  SwaggerBadRequest,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RoutePolicies } from '../auth/enums/route-policies.enum';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { MessageResponseDto } from './dtos/MessageResponse.dto';
import { UpdateMessageDto } from './dtos/UpdateMessage.dto';
import { MessageResponseMapper } from './mappers/message-response.mapper';
import { MessageService } from './message.service';

@Controller('messages')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all messages' })
  @SwaggerUnauthorized('Missing authentication token')
  @SwaggerForbidden('Forbidden resource')
  @SwaggerInternalServerError()
  @SetRoutePolicy(RoutePolicies.MESSAGE_FIND_ALL)
  @UseGuards(PoliciesGuard)
  public async findAll(): Promise<MessageResponseDto[]> {
    const messageEntities = await this.messageService.findAll();
    return MessageResponseMapper.toResponseMany(messageEntities);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific message' })
  @MessageIdParm()
  @SwaggerBadRequest('Inavlid identifier')
  @SwaggerUnauthorized('Missing authentication token')
  @SwaggerNotFound('Message not found')
  @SwaggerInternalServerError()
  public async findOne(@Param('id') id: number): Promise<MessageResponseDto> {
    const messageEntity = await this.messageService.findOne(id);
    return MessageResponseMapper.toResponseOne(messageEntity);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @SwaggerUnauthorized('Missing authentication token')
  @SwaggerNotFound('User not found')
  @SwaggerInternalServerError()
  public async create(
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultResponseDto> {
    const message = await this.messageService.create(dto, user);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      message.id,
      'Message created successfully',
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific message' })
  @MessageIdParm()
  @SwaggerBadRequest('Inavlid identifier')
  @SwaggerUnauthorized('Missing authentication token')
  @SwaggerForbidden('You cannot perform this action')
  @SwaggerNotFound('Message not found')
  @SwaggerInternalServerError()
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateMessageDto,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultMessageResponseDto> {
    await this.messageService.update(id, dto, user);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Message updated successfully',
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific message' })
  @MessageIdParm()
  @SwaggerBadRequest('Inavlid identifier')
  @SwaggerUnauthorized('Missing authentication token')
  @SwaggerForbidden('You cannot perform this action')
  @SwaggerNotFound('Message not found')
  @SwaggerInternalServerError()
  public async delete(
    @Param('id') id: number,
    @CurrentUser() user: UserInterface,
  ): Promise<DefaultMessageResponseDto> {
    await this.messageService.delete(id, user);
    return ResponseMapper.toResponse(
      DefaultMessageResponseDto,
      'Message deleted successfully',
    );
  }
}
