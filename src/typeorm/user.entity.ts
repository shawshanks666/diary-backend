import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Diary } from './diary.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
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
  email_address: string;

  @Column({
    nullable: false,
    default: '',
  })
  password: string;

  @Column({ type: 'bytea' }) 
  salt: Buffer; // Use Buffer type for binary data

  @Column({
    type: 'date',
    nullable: true, // Last entry date
  })
  lastEntryDate: string;

  @Column({
    type: 'int',
    default: 0, // Streak count
  })
  streak: number;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
