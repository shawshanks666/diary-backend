import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Adjust the import path as needed

@Entity('diaries')
export class Diary {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'entry_id',
  })
  id: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: string;

  @Column({
    type: 'bytea',
    nullable: false,
  })
  diaryEntry: Buffer;

  @Column({
    type: 'int',
    nullable: true,
  })
  mood: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  rating: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  count: number;

  @Column({ type: 'bytea' }) 
  iv: Buffer; // Use Buffer type for binary data

  @ManyToOne(() => User, (user) => user.diaries)
  user: User;
}
