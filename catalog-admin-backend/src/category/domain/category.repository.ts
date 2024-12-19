import type { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import type { Category } from './category.entity';
import type { IRespository } from '../../shared/domain/repository/repository-interface';


export interface ICategoryRepository extends IRespository<Category, Uuid> {}
