import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryEntity as CourseCategoryEntity } from 'src/categories/entities/category.entity';

@ApiTags('Course Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // * homepage에 접속했을 때 category는 다 보여야 하므로 인증자체가 필요없다.
  @Get('')
  @ApiOperation({ summary: '모든 강의 카테고리 조회' })
  @ApiOkResponse({
    description: '카테고리 목록 조회 성공',
    isArray: true,
    type: CourseCategoryEntity,
  })
  findAll() {
    return this.categoriesService.findAll();
  }
}
