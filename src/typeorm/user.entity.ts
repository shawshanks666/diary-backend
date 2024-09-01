import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Diary } from './diary.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
