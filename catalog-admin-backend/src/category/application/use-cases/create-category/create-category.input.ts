import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export type CreateCategoryInputConstructorProps = {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export class CreateCategoryInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  constructor(props: CreateCategoryInputConstructorProps) {
    this.name = props.name;
    this.description = props.description;
    this.is_active = props.is_active;
  }
}
