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
    type: 'bytea',
    nullable: false,
  })
  diaryEntry: Buffer;

  @Column({
    type: 'text',
    nullable: true,
  })
  mood: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  rating: number;

  @Column({ type: 'bytea' }) 
  iv: Buffer; // Use Buffer type for binary data

  @ManyToOne(() => User, (user) => user.diaries)
  user: User;
}
