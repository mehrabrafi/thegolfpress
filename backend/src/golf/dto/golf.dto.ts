import { IsString, IsOptional, IsEnum, IsUUID, IsNumber, IsBoolean } from 'class-validator';

export class CreateNewsDto {
    @IsString()
    title: string;

    @IsString()
    excerpt: string;

    @IsString()
    content: string;

    @IsString()
    image: string;

    @IsString()
    category: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    categoryTag?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    publishedAt?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsUUID()
    subTagId?: string;

    @IsOptional()
    @IsString()
    author?: string;
}

export class UpdateNewsDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    excerpt?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    categoryTag?: string;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    publishedAt?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsUUID()
    subTagId?: string;

    @IsOptional()
    @IsString()
    author?: string;
}

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;
}

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    slug?: string;
}

export class CreateSubTagDto {
    @IsString()
    name: string;

    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsString()
    image?: string;
}

export class UpdateSubTagDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsString()
    image?: string;
}

export class UpdateUserRoleDto {
    @IsEnum(['USER', 'ADMIN', 'EDITOR'], { message: 'Role must be USER, ADMIN, or EDITOR' })
    role: string;
}

export class UpdateSettingDto {
    @IsString()
    value: string;
}


