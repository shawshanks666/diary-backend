import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchemaXXXXXX implements MigrationInterface {
  name = 'InitSchemaXXXXXX';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /* ---------- ENUM ---------- */
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM ('admin', 'user');
    `);

    /* ---------- USERS TABLE ---------- */
    await queryRunner.query(`
      CREATE TABLE "users" (
        "user_id" BIGSERIAL PRIMARY KEY,
        "username" VARCHAR NOT NULL DEFAULT '',
        "email_address" VARCHAR NOT NULL DEFAULT '',
        "password" VARCHAR NOT NULL DEFAULT '',
        "salt" BYTEA NOT NULL,
        "lastEntryDate" DATE,
        "streak" INTEGER NOT NULL DEFAULT 0,
        "role" "users_role_enum" NOT NULL DEFAULT 'user'
      );
    `);

    /* ---------- DIARIES TABLE ---------- */
    await queryRunner.query(`
      CREATE TABLE "diaries" (
        "entry_id" BIGSERIAL PRIMARY KEY,
        "date" DATE NOT NULL,
        "diaryEntry" BYTEA NOT NULL,
        "mood" INTEGER,
        "rating" INTEGER,
        "count" INTEGER,
        "iv" BYTEA NOT NULL,
        "userUserId" BIGINT
      );
    `);

    /* ---------- FOREIGN KEY ---------- */
    await queryRunner.query(`
      ALTER TABLE "diaries"
      ADD CONSTRAINT "FK_diaries_user"
      FOREIGN KEY ("userUserId")
      REFERENCES "users"("user_id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "diaries" DROP CONSTRAINT "FK_diaries_user";
    `);

    await queryRunner.query(`
      DROP TABLE "diaries";
    `);

    await queryRunner.query(`
      DROP TABLE "users";
    `);

    await queryRunner.query(`
      DROP TYPE "users_role_enum";
    `);
  }
}
