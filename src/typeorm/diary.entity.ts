import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Adjust the import path as needed

@Entity()
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
    type: 'text',
    nullable: false,
  })
  diaryEntry: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  mood: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  rating: number;

  @ManyToOne(() => User, (user) => user.diaries)
  user: User;
}
